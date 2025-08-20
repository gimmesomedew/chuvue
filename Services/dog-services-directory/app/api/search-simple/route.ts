import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Calculate distance between two points using Haversine formula
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, userLocation } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    console.log('🔍 Simple Search Request:', { query, userLocation });

    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Get all available service types from the database
    const { data: serviceDefinitions, error: serviceError } = await supabase
      .from('service_definitions')
      .select('service_type, service_name');
    
    if (serviceError) {
      console.warn('⚠️ Could not fetch service definitions, using fallback detection:', serviceError);
    }

    // Parse the search query using dynamic service types
    const searchPattern = parseSearchQuery(query, serviceDefinitions || []);
    console.log('📋 Parsed Search Pattern:', searchPattern);

    // Build the database query
    let supabaseQuery = supabase
      .from('services')
      .select('*');

    // Apply service type filter if specified
    if (searchPattern.serviceType) {
      supabaseQuery = supabaseQuery.eq('service_type', searchPattern.serviceType);
      console.log('🏷️ Filtering by service type:', searchPattern.serviceType);
    }

    // Apply location filters based on search pattern
    if (searchPattern.locationType === 'state') {
      // State-based search (e.g., "in Indiana")
      supabaseQuery = supabaseQuery.eq('state', searchPattern.locationValue);
      console.log('🗺️ Filtering by state:', searchPattern.locationValue);
    } else if (searchPattern.locationType === 'zip_code') {
      // Zip code-based search (e.g., "near 46240")
      supabaseQuery = supabaseQuery.eq('zip_code', searchPattern.locationValue);
      console.log('📮 Filtering by zip code:', searchPattern.locationValue);
    } else if (searchPattern.locationType === 'near_me' && userLocation) {
      // Location-based search (e.g., "near me")
      const radiusMiles = searchPattern.radius || 10;
      const radiusMeters = radiusMiles * 1609.34; // Convert miles to meters
      
      // Use Supabase RPC for radius search with result limiting
      const { data: radiusResults, error: radiusError } = await supabase.rpc('services_within_radius', {
        p_lat: userLocation.lat,
        p_lon: userLocation.lng,
        p_radius_miles: radiusMiles
      });
      
      if (radiusError) {
        console.error('❌ Radius search error:', radiusError);
        return NextResponse.json(
          { error: 'Radius search failed', details: radiusError.message },
          { status: 500 }
        );
      }
      
      console.log('📍 Radius search completed. Found', radiusResults?.length || 0, 'results within', radiusMiles, 'miles');
      
      // Filter radius results by service type if specified
      let filteredResults = radiusResults || [];
      if (searchPattern.serviceType) {
        filteredResults = filteredResults.filter((service: any) => service.service_type === searchPattern.serviceType);
        console.log('🏷️ Filtered by service type:', searchPattern.serviceType, '- Found', filteredResults.length, 'matching results');
      }
      
      // Calculate distances for each result
      filteredResults.forEach((service: any) => {
        if (service.latitude && service.longitude) {
          service.distance = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            service.latitude,
            service.longitude
          );
        } else {
          service.distance = Infinity; // Put services without coordinates at the end
        }
      });
      console.log('📍 Calculated distances for', filteredResults.length, 'results');
      
      // Sort by distance for location-based searches
      filteredResults.sort((a: any, b: any) => {
        if (a.distance !== Infinity && b.distance !== Infinity) {
          return a.distance - b.distance; // Sort by distance (closest first)
        }
        if (a.distance === Infinity && b.distance === Infinity) {
          return a.name?.localeCompare(b.name) || 0; // Both have no distance, sort by name
        }
        return a.distance === Infinity ? 1 : -1; // Services with distance come first
      });
      console.log('📍 Sorted results by distance (closest first)');
      
      // Limit results to prevent overwhelming output
      const limitedResults = filteredResults.slice(0, 100);
      
      // Return filtered radius results
      return NextResponse.json({
        success: true,
        results: limitedResults,
        metadata: {
          originalQuery: query,
          parsedPattern: searchPattern,
          resultCount: limitedResults.length,
          totalInRadius: filteredResults.length,
          searchType: 'simple_radius',
          filters: {
            serviceType: searchPattern.serviceType,
            locationType: 'near_me',
            radius: radiusMiles
          }
        }
      });
    }

    // Execute the query
    console.log('🚀 Executing Supabase query...');
    const { data: results, error } = await supabaseQuery;

    if (error) {
      console.error('❌ Supabase query error:', error);
      return NextResponse.json(
        { error: 'Database query failed', details: error.message },
        { status: 500 }
      );
    }

    console.log('✅ Search completed. Found', results?.length || 0, 'results');
    
    // Sort by name for non-location searches
    if (results && results.length > 0) {
      results.sort((a: any, b: any) => a.name?.localeCompare(b.name) || 0);
      console.log('📝 Sorted results by name (alphabetical)');
    }

    // Return results with metadata
    return NextResponse.json({
      success: true,
      results: results || [],
      metadata: {
        originalQuery: query,
        parsedPattern: searchPattern,
        resultCount: results?.length || 0,
        searchType: 'simple',
        filters: {
          serviceType: searchPattern.serviceType,
          locationType: searchPattern.locationType,
          locationValue: searchPattern.locationValue,
          radius: searchPattern.radius
        }
      }
    });

  } catch (error) {
    console.error('❌ Simple Search API Error:', error);
    return NextResponse.json(
      { error: 'Search failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * Check if query indicates proximity search (near me, close, nearby, etc.)
 */
function isNearMeQuery(normalizedQuery: string): boolean {
  const proximityPatterns = [
    // Direct location references
    'near me',
    'close to me', 
    'near my location',
    'close to my location',
    'near my area',
    'in my area',
    
    // General proximity indicators
    'nearby',
    'close by',
    'around me',
    'around here',
    'in the area',
    'local',
    'locally',
    
    // Contextual proximity (when no other location specified)
    'that are close',
    'that are near',
    'that are nearby',
    'close to here',
    'near here',
    
    // Distance-based indicators
    'within driving distance',
    'not far',
    'not too far',
    'walking distance',
    'driving distance',
    
    // Convenience indicators
    'convenient',
    'accessible'
  ];
  
  // Check for exact matches first
  for (const pattern of proximityPatterns) {
    if (normalizedQuery.includes(pattern)) {
      return true;
    }
  }
  
  // Check for contextual patterns that suggest local search when no state is mentioned
  const hasStateReference = (
    normalizedQuery.includes('illinois') || normalizedQuery.includes('indiana') || 
    normalizedQuery.includes('ohio') || normalizedQuery.includes('michigan') || 
    normalizedQuery.includes('kentucky') || normalizedQuery.includes(' il ') || 
    normalizedQuery.includes(' in ') || normalizedQuery.includes(' oh ') || 
    normalizedQuery.includes(' mi ') || normalizedQuery.includes(' ky ')
  );
  
  const contextualProximityWords = ['close', 'near', 'local', 'around'];
  const hasContextualProximity = contextualProximityWords.some(word => 
    normalizedQuery.includes(word)
  );
  
  // If there's a proximity word but no state reference, treat as "near me"
  if (hasContextualProximity && !hasStateReference) {
    return true;
  }
  
  return false;
}

/**
 * Extract zip code from query string
 */
function extractZipCode(normalizedQuery: string): string | null {
  // Look for 5-digit zip codes
  const zipCodeRegex = /\b\d{5}\b/;
  const match = normalizedQuery.match(zipCodeRegex);
  
  if (match) {
    return match[0];
  }
  
  // Also check for zip codes mentioned with context words
  const zipContextWords = ['zip', 'zipcode', 'postal', 'code'];
  for (const word of zipContextWords) {
    if (normalizedQuery.includes(word)) {
      // Look for numbers near zip context words
      const numberMatch = normalizedQuery.match(/\b\d{5}\b/);
      if (numberMatch) {
        return numberMatch[0];
      }
    }
  }
  
  return null;
}

/**
 * Simple pattern parser for common search queries
 */
function parseSearchQuery(query: string, serviceDefinitions: any[] = []) {
  const normalizedQuery = query.toLowerCase().trim();
  
  // Initialize result
  const result = {
    serviceType: null as string | null,
    locationType: null as 'state' | 'near_me' | 'zip_code' | null,
    locationValue: null as string | null,
    radius: null as number | null
  };

  // 1. Extract service type - Dynamic detection using database service definitions
  if (serviceDefinitions.length > 0) {
    // Use dynamic service type detection from database
    for (const serviceDef of serviceDefinitions) {
      const serviceType = serviceDef.service_type?.toLowerCase();
      const serviceName = serviceDef.service_name?.toLowerCase();
      
      if (serviceType && serviceName) {
        // Check if query contains the service name or type
        if (normalizedQuery.includes(serviceName) || normalizedQuery.includes(serviceType.replace('_', ' '))) {
          result.serviceType = serviceDef.service_type;
          console.log('🎯 Dynamic service type match:', serviceDef.service_type, 'for query:', query);
          break;
        }
        
        // Check for common variations and synonyms
        if (serviceType.includes('park') && (normalizedQuery.includes('park') || normalizedQuery.includes('dogpark'))) {
          result.serviceType = serviceDef.service_type;
          break;
        }
        if (serviceType.includes('groomer') && (normalizedQuery.includes('groomer') || normalizedQuery.includes('grooming'))) {
          result.serviceType = serviceDef.service_type;
          break;
        }
        if (serviceType.includes('vet') && (normalizedQuery.includes('vet') || normalizedQuery.includes('veterinarian'))) {
          result.serviceType = serviceDef.service_type;
          break;
        }
        if (serviceType.includes('trainer') && (normalizedQuery.includes('trainer') || normalizedQuery.includes('training'))) {
          result.serviceType = serviceDef.service_type;
          break;
        }
        if (serviceType.includes('boarding') && (normalizedQuery.includes('boarding') || normalizedQuery.includes('daycare'))) {
          result.serviceType = serviceDef.service_type;
          break;
        }
      }
    }
  } else {
    // Fallback to hardcoded detection if service definitions are not available
    console.log('⚠️ Using fallback service type detection');
    if (normalizedQuery.includes('dog park') || normalizedQuery.includes('dogpark')) {
      result.serviceType = 'dog_park';
    } else if (normalizedQuery.includes('groomer') || normalizedQuery.includes('grooming')) {
      result.serviceType = 'groomer';
    } else if (normalizedQuery.includes('vet') || normalizedQuery.includes('veterinarian')) {
      result.serviceType = 'veterinarian';
    } else if (normalizedQuery.includes('trainer') || normalizedQuery.includes('training')) {
      result.serviceType = 'dog_trainer';
    } else if (normalizedQuery.includes('boarding') || normalizedQuery.includes('daycare')) {
      result.serviceType = 'boarding_daycare';
    }
  }

  // 2. Extract location information
  if (isNearMeQuery(normalizedQuery)) {
    result.locationType = 'near_me';
    result.radius = 25; // Default 25 mile radius
  } else {
    // Check for state references - Comprehensive US state detection
    // Check for full state names first (more specific), then abbreviations
    const stateMappings = {
      // Full state names
      'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR', 'california': 'CA',
      'colorado': 'CO', 'connecticut': 'CT', 'delaware': 'DE', 'florida': 'FL', 'georgia': 'GA',
      'hawaii': 'HI', 'idaho': 'ID', 'illinois': 'IL', 'indiana': 'IN', 'iowa': 'IA',
      'kansas': 'KS', 'kentucky': 'KY', 'louisiana': 'LA', 'maine': 'ME', 'maryland': 'MD',
      'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN', 'mississippi': 'MS', 'missouri': 'MO',
      'montana': 'MT', 'nebraska': 'NE', 'nevada': 'NV', 'new hampshire': 'NH', 'new jersey': 'NJ',
      'new mexico': 'NM', 'new york': 'NY', 'north carolina': 'NC', 'north dakota': 'ND', 'ohio': 'OH',
      'oklahoma': 'OK', 'oregon': 'OR', 'pennsylvania': 'PA', 'rhode island': 'RI', 'south carolina': 'SC',
      'south dakota': 'SD', 'tennessee': 'TN', 'texas': 'TX', 'utah': 'UT', 'vermont': 'VT',
      'virginia': 'VA', 'washington': 'WA', 'west virginia': 'WV', 'wisconsin': 'WI', 'wyoming': 'WY',
      // Territories
      'district of columbia': 'DC', 'puerto rico': 'PR', 'guam': 'GU', 'american samoa': 'AS',
      'u.s. virgin islands': 'VI', 'northern mariana islands': 'MP'
    };
    
    // Check for full state names
    let stateFound = false;
    for (const [stateName, stateCode] of Object.entries(stateMappings)) {
      if (normalizedQuery.includes(stateName)) {
        result.locationType = 'state';
        result.locationValue = stateCode;
        stateFound = true;
        break;
      }
    }
    
    // If no full state name found, check for abbreviations
    if (!stateFound) {
      const words = normalizedQuery.split(/\s+/);
      const stateAbbreviations = Object.values(stateMappings);
      for (const word of words) {
        if (stateAbbreviations.includes(word.toUpperCase())) {
          result.locationType = 'state';
          result.locationValue = word.toUpperCase();
          break;
        }
      }
    }
    
    // 3. Check for zip code references
    if (!result.locationType) {
      const zipCodeMatch = extractZipCode(normalizedQuery);
      if (zipCodeMatch) {
        result.locationType = 'zip_code';
        result.locationValue = zipCodeMatch;
        result.radius = 25; // Default 25 mile radius for zip code searches
      }
    }
  }

  return result;
}
