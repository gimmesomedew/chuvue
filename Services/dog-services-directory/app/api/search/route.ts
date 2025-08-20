import { NextRequest, NextResponse } from 'next/server';
import { processSearchQuery } from '@/lib/search/queryProcessor';
import { buildSearchQuery } from '@/lib/search/queryBuilder';
import { performDatabaseSearch, getSearchSuggestions } from '@/lib/search/databaseSearch';
import { formatSearchResults } from '@/lib/search/resultsFormatter';
import { rateLimit } from '@/lib/search/rateLimiter';

export async function POST(request: NextRequest) {
  try {
    // Quick environment check
    console.log('Environment check:', {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + '...'
    });

    // Rate limiting
    const rateLimitResult = await rateLimit(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { query, userLocation } = body;

    // Input validation
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Search query is required and must be a string' },
        { status: 400 }
      );
    }

    // UserLocation is now optional - only required for location-based searches
    // If not provided, we'll use a default location for processing (but won't apply location filters)
    let processUserLocation = userLocation;
    if (!userLocation || !userLocation.lat || !userLocation.lng) {
      console.log('No user location provided, using default for processing');
      processUserLocation = {
        lat: 39.9568, // Default Fishers, IN coordinates for processing only
        lng: -86.0075,
        zip: '46037',
        city: 'Fishers',
        state: 'IN'
      };
    }

    console.log('Step 1: Processing search query...', { query, userLocation });
    
    let processedQuery: any;
    let formattedResults: any;
    
    try {
      // Process the search query
      processedQuery = await processSearchQuery(query, processUserLocation);
      console.log('Step 1 complete. Processed query:', processedQuery);
      
      console.log('Step 2: Building database query...');
      // Build database query without pagination
      const searchQuery = buildSearchQuery(processedQuery);
      console.log('Step 2 complete. Search query:', searchQuery);
      
      console.log('Step 3: Performing database search...');
      // Perform database search
      const searchResults = await performDatabaseSearch(searchQuery);
      console.log('Step 3 complete. Search results count:', searchResults?.results?.length || 0);
      
      console.log('Step 4: Formatting results...');
      // Format results - use processUserLocation for consistent processing
      formattedResults = await formatSearchResults(
        searchResults, 
        processUserLocation, 
        processedQuery
      );
      console.log('Step 4 complete. Formatted results count:', formattedResults?.results?.length || 0);
    } catch (processingError) {
      console.error('=== SEARCH PROCESSING ERROR ===');
      console.error('Error in search processing:', processingError);
      console.error('Error message:', processingError instanceof Error ? processingError.message : 'Unknown error');
      console.error('Error stack:', processingError instanceof Error ? processingError.stack : undefined);
      console.error('Processed query so far:', processedQuery);
      
      // Fallback: try to get all services
      console.log('Trying fallback search...');
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      
      const { data: fallbackResults, error: fallbackError } = await supabase
        .from('services')
        .select('*')
        .limit(10);
      
      if (fallbackError) {
        throw new Error(`Fallback search also failed: ${fallbackError.message}`);
      }
      
      console.log('Fallback search successful, found:', fallbackResults?.length || 0, 'services');
      
      // Return fallback results with basic parsing
      const basicServiceType = query.toLowerCase().includes('groomer') || query.toLowerCase().includes('grooming') ? 'groomer' :
                               query.toLowerCase().includes('vet') || query.toLowerCase().includes('veterinarian') ? 'veterinarian' :
                               query.toLowerCase().includes('dog park') || query.toLowerCase().includes('park') ? 'dog_park' :
                               query.toLowerCase().includes('training') || query.toLowerCase().includes('trainer') ? 'dog_trainer' :
                               query.toLowerCase().includes('boarding') || query.toLowerCase().includes('daycare') ? 'boarding_daycare' : '';

      return NextResponse.json({
        success: true,
        results: fallbackResults || [],
        metadata: {
          originalQuery: query,
          parsedQuery: {
            originalQuery: query,
            normalizedQuery: query.toLowerCase(),
            searchType: 'service',
            entities: {
              services: basicServiceType ? [basicServiceType] : [],
              products: [],
              locations: [],
              filters: {},
              modifiers: []
            },
            location: {
              lat: userLocation.lat,
              lng: userLocation.lng,
              radius: 10,
              city: userLocation.city,
              state: userLocation.state,
              zipCode: userLocation.zip,
              isNearMe: false
            },
            filters: {},
            intent: 'search for services',
            confidence: 0.5
          },
          resultCount: fallbackResults?.length || 0,
          searchRadius: 10,
          searchType: 'fallback',
          filters: {},
          location: {
            lat: userLocation.lat,
            lng: userLocation.lng,
            city: userLocation.city,
            state: userLocation.state,
            zipCode: userLocation.zip
          }
        }
      });
    }

    // If we get here, the main search was successful
    // Return successful response
    return NextResponse.json({
      success: true,
      results: formattedResults.results,
      metadata: {
        originalQuery: query,
        parsedQuery: processedQuery,
        resultCount: formattedResults.results.length,
        totalCount: formattedResults.totalCount, // Add total count from database search
        searchRadius: processedQuery.location?.radius || 10,
        searchType: processedQuery.searchType,
        filters: processedQuery.filters,
        location: processedQuery.location
      }
    });

  } catch (error) {
    console.error('Search API error details:', {
      error: error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      query: 'unknown',
      userLocation: 'unknown'
    });
    
    // Return appropriate error response
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          error: 'Search failed', 
          message: error.message,
          details: error.stack,
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Internal server error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// GET endpoint for search suggestions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    // Get search suggestions based on partial query
    const suggestions = await getSearchSuggestions(query);
    
    return NextResponse.json({
      success: true,
      suggestions
    });

  } catch (error) {
    console.error('Search suggestions error:', error);
    return NextResponse.json(
      { error: 'Failed to get suggestions' },
      { status: 500 }
    );
  }
}


