import { DatabaseQuery } from './queryBuilder';
import { ProcessedQuery } from './queryProcessor';
import { createClient } from '@supabase/supabase-js';

// Function to get Supabase client
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
  }
  
  return createClient(supabaseUrl, supabaseKey);
}

export interface SearchResult {
  id: string;
  name: string;
  type: 'service' | 'product';
  description?: string;
  rating: number;
  reviewCount: number;
  distance?: number;
  location?: {
    lat: number;
    lng: number;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  tags: string[];
  price?: number;
  availability?: string;
  isMobile?: boolean;
  isEmergency?: boolean;
  isOrganic?: boolean;
  businessHours?: any[];
  images?: string[];
  contact?: {
    phone?: string;
    website?: string;
    email?: string;
  };
}

export interface SearchResponse {
  results: any[]; // Services in proper format for ServiceCard
  totalCount: number;
  hasMore: boolean;
  searchMetadata: {
    query: string;
    filters: any;
    location: any;
    searchType: string;
    totalCount?: number;
  };
}

/**
 * Main function to perform database search
 * @param searchQuery - Structured database query
 * @returns Search results with metadata
 */
export async function performDatabaseSearch(
  searchQuery: DatabaseQuery
): Promise<SearchResponse> {
  try {
    console.log('=== DATABASE SEARCH DEBUG ===');
    console.log('Raw search query input:', JSON.stringify(searchQuery, null, 2));
    console.log('Where clause structure:', {
      OR: searchQuery.where?.OR,
      state: searchQuery.where?.state,
      city: searchQuery.where?.city,
      zipCode: searchQuery.where?.zipCode,
      location: searchQuery.where?.location
    });
    
    // Get Supabase client
    const supabase = getSupabaseClient();
    console.log('Supabase client created successfully');
    
    // Build Supabase query - start simple
    let query = supabase
      .from('services')
      .select('*');
    
    console.log('Base query built');

    // Apply filters if they exist
    if (searchQuery.where?.OR && Array.isArray(searchQuery.where.OR)) {
      console.log('Processing OR filters:', searchQuery.where.OR);
      
      // Handle service type filtering
      const serviceTypes = searchQuery.where.OR
        .filter((item: any) => item.service_type)
        .map((item: any) => item.service_type.equals || item.service_type.contains)
        .filter(Boolean); // Remove undefined values
      
      console.log('Extracted service types:', serviceTypes);
      
      if (serviceTypes.length > 0) {
        query = query.in('service_type', serviceTypes);
        console.log('Applied service type filter:', serviceTypes);
      }
    }

    // Note: Removed is_active filter since that column doesn't exist in your schema

    console.log('Query after service type filters:', query);

    // Apply location filtering ONLY if location data exists (not null)
    if (searchQuery.where?.location && searchQuery.where.location !== null) {
      console.log('Applying location filter:', searchQuery.where.location);
      
      // Filter by state if specified
      if (searchQuery.where.location.state) {
        query = query.eq('state', searchQuery.where.location.state);
        console.log('Applied state filter:', searchQuery.where.location.state);
      }
      
      // Filter by city if specified
      if (searchQuery.where.location.city) {
        query = query.eq('city', searchQuery.where.location.city);
        console.log('Applied city filter:', searchQuery.where.location.city);
      }
      
      // Filter by zip code if specified
      if (searchQuery.where.location.zipCode) {
        query = query.eq('zip_code', searchQuery.where.location.zipCode);
        console.log('Applied zip code filter:', searchQuery.where.location.zipCode);
      }
    } else {
      console.log('No location filtering applied - location data is null or undefined');
    }

    // Also check for location filters at the top level of where clause
    if (searchQuery.where?.state) {
      console.log('Applying top-level state filter:', searchQuery.where.state);
      if (searchQuery.where.state.contains) {
        query = query.ilike('state', `%${searchQuery.where.state.contains}%`);
        console.log('Applied ILIKE state filter for:', searchQuery.where.state.contains);
      } else {
        query = query.eq('state', searchQuery.where.state);
        console.log('Applied exact state filter for:', searchQuery.where.state);
      }
    }
    
    if (searchQuery.where?.city) {
      console.log('Applying top-level city filter:', searchQuery.where.city);
      if (searchQuery.where.city.contains) {
        query = query.ilike('city', `%${searchQuery.where.city.contains}%`);
        console.log('Applied ILIKE city filter for:', searchQuery.where.city.contains);
      } else {
        query = query.eq('city', searchQuery.where.city);
        console.log('Applied exact city filter for:', searchQuery.where.city);
      }
    }
    
    if (searchQuery.where?.zipCode) {
      console.log('Applying top-level zip code filter:', searchQuery.where.zipCode);
      query = query.eq('zip_code', searchQuery.where.zipCode);
      console.log('Applied zip code filter for:', searchQuery.where.zipCode);
    }

    console.log('Query after location filters:', query);

    // Apply limit (get all matching results up to 1000)
    if (searchQuery.take) {
      query = query.limit(searchQuery.take);
      console.log('Applied limit:', searchQuery.take);
    }

    // Get total count with same filters but no pagination
    console.log('Getting total count with same filters...');
    let countQuery = supabase
      .from('services')
      .select('*', { count: 'exact', head: true });
    
    // Apply the same filters to count query
    if (searchQuery.where?.OR && Array.isArray(searchQuery.where.OR)) {
      const serviceTypes = searchQuery.where.OR
        .filter((item: any) => item.service_type)
        .map((item: any) => item.service_type.equals || item.service_type.contains)
        .filter(Boolean);
      
      if (serviceTypes.length > 0) {
        countQuery = countQuery.in('service_type', serviceTypes);
        console.log('Applied service type filter to count query:', serviceTypes);
      }
    }
    
    // Apply location filters to count query ONLY if location data exists
    if (searchQuery.where?.location && searchQuery.where.location !== null) {
      if (searchQuery.where.location.state) {
        countQuery = countQuery.eq('state', searchQuery.where.location.state);
        console.log('Applied state filter to count query:', searchQuery.where.location.state);
      }
      
      if (searchQuery.where.location.city) {
        countQuery = countQuery.eq('city', searchQuery.where.location.city);
        console.log('Applied city filter to count query:', searchQuery.where.location.city);
      }
      
      if (searchQuery.where.location.zipCode) {
        countQuery = countQuery.eq('zip_code', searchQuery.where.location.zipCode);
        console.log('Applied zip code filter to count query:', searchQuery.where.location.zipCode);
      }
    } else {
      console.log('No location filters applied to count query - location data is null or undefined');
    }
    
    if (searchQuery.where?.location) {
      if (searchQuery.where.location.state) {
        countQuery = countQuery.eq('state', searchQuery.where.location.state);
        console.log('Applied location state filter to count query:', searchQuery.where.location.state);
      }
      if (searchQuery.where.location.city) {
        countQuery = countQuery.eq('city', searchQuery.where.location.city);
        console.log('Applied location city filter to count query:', searchQuery.where.location.city);
      }
      if (searchQuery.where.location.zipCode) {
        countQuery = countQuery.eq('zip_code', searchQuery.where.location.zipCode);
        console.log('Applied location zip code filter to count query:', searchQuery.where.location.zipCode);
      }
    }
    
        console.log('Executing count query...');
    const { count: totalCountResult, error: countError } = await countQuery;
    console.log('Count query result:', { totalCount: totalCountResult, countError });
    
    if (countError) {
      console.error('Count query failed:', countError);
    }
    
    // Log the final query structure before execution
    console.log('=== FINAL QUERY DEBUG ===');
    console.log('Query object:', query);
    console.log('Query filters applied:', {
      serviceTypes: searchQuery.where?.OR?.filter((item: any) => item.service_type)?.map((item: any) => item.service_type.equals || item.service_type.contains)?.filter(Boolean) || [],
      state: searchQuery.where?.state || searchQuery.where?.location?.state,
      city: searchQuery.where?.city || searchQuery.where?.location?.city,
      zipCode: searchQuery.where?.zipCode || searchQuery.where?.location?.zipCode
    });

    console.log('Executing query...');
    
    // Log the final query structure for debugging
    console.log('Final Supabase query structure:', {
      table: 'services',
      filters: {
        serviceTypes: searchQuery.where?.OR?.filter((item: any) => item.service_type)?.map((item: any) => item.service_type.equals || item.service_type.contains)?.filter(Boolean) || [],
        state: searchQuery.where?.state || searchQuery.where?.location?.state,
        city: searchQuery.where?.city || searchQuery.where?.location?.city,
        zipCode: searchQuery.where?.zipCode || searchQuery.where?.location?.zipCode
      },
      pagination: searchQuery.take ? `0 to ${searchQuery.take - 1}` : 'none'
    });
    
    // Execute query
    const { data: results, error } = await query;
    console.log('Query executed. Results count:', results?.length || 0, 'Error:', error);
    
    // Use the count from our separate count query
    const totalCount = totalCountResult || 0;
    
    // Log sample results to see what's actually being returned
    if (results && results.length > 0) {
      console.log('=== SAMPLE RESULTS DEBUG ===');
      console.log('First 3 results service types:', results.slice(0, 3).map((r: any) => ({
        id: r.id,
        business_name: r.business_name,
        service_type: r.service_type,
        state: r.state,
        city: r.city
      })));
    }

    if (error) {
      console.error('Supabase query error:', error);
      throw error;
    }

    // Transform results to standard format
    const transformedResults = await transformSearchResults(results || []);
    console.log('Results transformed. Count:', transformedResults.length);

    return {
      results: transformedResults,
      totalCount: totalCount,
      hasMore: totalCount > (searchQuery.take || 25),
      searchMetadata: {
        query: JSON.stringify(searchQuery.where),
        filters: extractFiltersFromQuery(searchQuery.where),
        location: extractLocationFromQuery(searchQuery.where),
        searchType: 'service',
        totalCount: totalCount
      }
    };

  } catch (error) {
    console.error('Database search error:', error);
    throw new Error(`Database search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Perform progressive search with fallback strategies
 */
export async function performProgressiveSearch(
  processedQuery: ProcessedQuery,
  userLocation: any
): Promise<SearchResponse> {
  let searchResponse: SearchResponse | null = null;
  let attempt = 0;
  const maxAttempts = 3;

  while (attempt < maxAttempts && !searchResponse?.results.length) {
    try {
      // Build query for this attempt
      const searchQuery = buildQueryForAttempt(processedQuery, attempt);
      
      // Perform search
      searchResponse = await performDatabaseSearch(searchQuery);
      
      // If we got results, break
      if (searchResponse.results.length > 0) {
        break;
      }

      // If no results and we can try again, expand search
      if (attempt < maxAttempts - 1) {
        processedQuery = expandSearchCriteria(processedQuery);
      }

    } catch (error) {
      console.error(`Search attempt ${attempt + 1} failed:`, error);
    }

    attempt++;
  }

  // If still no results, return empty response
  if (!searchResponse || searchResponse.results.length === 0) {
    return {
      results: [],
      totalCount: 0,
      hasMore: false,
      searchMetadata: {
        query: processedQuery.originalQuery,
        filters: processedQuery.filters,
        location: processedQuery.location,
        searchType: processedQuery.searchType
      }
    };
  }

  return searchResponse;
}

/**
 * Build query for specific search attempt
 */
function buildQueryForAttempt(processedQuery: ProcessedQuery, attempt: number): DatabaseQuery {
  const baseQuery: DatabaseQuery = {
    where: {},
    orderBy: [],
    take: 20, // 20 items per page for pagination
    skip: 0,
    include: {
      reviews: {
        take: 5,
        orderBy: { createdAt: 'desc' }
      },
      tags: true,
      businessHours: true
    }
  };

  // First attempt: exact match
  if (attempt === 0) {
    baseQuery.where = buildExactMatchWhere(processedQuery);
  }
  // Second attempt: fuzzy match
  else if (attempt === 1) {
    baseQuery.where = buildFuzzyMatchWhere(processedQuery);
  }
  // Third attempt: broad match
  else {
    baseQuery.where = buildBroadMatchWhere(processedQuery);
  }

  // Add location filtering
  if (processedQuery.location) {
    addLocationFilter(baseQuery.where, processedQuery.location);
  }

  // Set ordering
  baseQuery.orderBy = [
    { rating: 'desc' },
    { reviewCount: 'desc' }
  ];

  return baseQuery;
}

/**
 * Build exact match where clause
 */
function buildExactMatchWhere(processedQuery: ProcessedQuery): any {
  const whereClause: any = {
    OR: []
  };

  // Service type exact match
  if (processedQuery.entities.services.length > 0) {
    const serviceTypes = processedQuery.entities.services.map(service => ({
      service_type: {
        equals: service,
        mode: 'insensitive'
      }
    }));
    whereClause.OR.push(...serviceTypes);
  }

  // Text exact match
  if (processedQuery.normalizedQuery) {
    whereClause.OR.push(
      {
        name: {
          contains: processedQuery.normalizedQuery,
          mode: 'insensitive'
        }
      }
    );
  }

  return whereClause;
}

/**
 * Build fuzzy match where clause
 */
function buildFuzzyMatchWhere(processedQuery: ProcessedQuery): any {
  const whereClause: any = {
    OR: []
  };

  // Service type partial match
  if (processedQuery.entities.services.length > 0) {
    const serviceTypes = processedQuery.entities.services.map(service => ({
      service_type: {
        equals: service,
        mode: 'insensitive'
      }
    }));
    whereClause.OR.push(...serviceTypes);
  }

  // Text partial match with individual words
  if (processedQuery.normalizedQuery) {
    const words = processedQuery.normalizedQuery.split(' ').filter(word => word.length > 2);
    words.forEach(word => {
      whereClause.OR.push(
        {
          name: {
            contains: word,
            mode: 'insensitive'
          }
        },
        {
          description: {
            contains: word,
            mode: 'insensitive'
          }
        }
      );
    });
  }

  return whereClause;
}

/**
 * Build broad match where clause
 */
function buildBroadMatchWhere(processedQuery: ProcessedQuery): any {
  const whereClause: any = {
    isActive: true,
    OR: []
  };

  // Very broad service type matching
  if (processedQuery.entities.services.length > 0) {
    const serviceTypes = processedQuery.entities.services.map(service => ({
      OR: [
        {
          service_type: {
            equals: service,
            mode: 'insensitive'
          }
        },
        {
          tags: {
            some: {
              name: {
                contains: service,
                mode: 'insensitive'
              }
            }
          }
        }
      ]
    }));
    whereClause.OR.push(...serviceTypes);
  }

  // Broad text matching
  if (processedQuery.normalizedQuery) {
    const words = processedQuery.normalizedQuery.split(' ').filter(word => word.length > 2);
    if (words.length > 0) {
      // Use only the first few words for broader matching
      const broadWords = words.slice(0, Math.min(2, words.length));
      broadWords.forEach(word => {
        whereClause.OR.push(
          {
            name: {
              contains: word,
              mode: 'insensitive'
            }
          },
          {
            description: {
              contains: word,
              mode: 'insensitive'
            }
          },
          {
            tags: {
              some: {
                name: {
                  contains: word,
                  mode: 'insensitive'
                }
              }
            }
          }
        );
      });
    }
  }

  return whereClause;
}

/**
 * Add location filter to where clause
 */
function addLocationFilter(whereClause: any, location: any): void {
  if (location.lat && location.lng && location.radius) {
    // Approximate bounding box for performance
    const latDelta = location.radius / 69; // Approximate degrees per mile
    const lngDelta = location.radius / (69 * Math.cos(location.lat * Math.PI / 180));

    whereClause.lat = {
      gte: location.lat - latDelta,
      lte: location.lat + latDelta
    };

    whereClause.lng = {
      gte: location.lng - lngDelta,
      lte: location.lng + lngDelta
    };
  }
}

/**
 * Expand search criteria for progressive search
 */
function expandSearchCriteria(processedQuery: ProcessedQuery): ProcessedQuery {
  const expandedQuery = { ...processedQuery };

  // Expand location radius
  if (expandedQuery.location) {
    expandedQuery.location.radius = Math.min(
      expandedQuery.location.radius * 1.5,
      100
    );
  }

  // Remove some restrictive filters
  if (expandedQuery.filters.rating) {
    delete expandedQuery.filters.rating;
  }

  if (expandedQuery.filters.organic) {
    delete expandedQuery.filters.organic;
  }

  return expandedQuery;
}

/**
 * Transform database results to Service format (expected by ServiceCard)
 */
async function transformSearchResults(results: any[]): Promise<any[]> {
  try {
    console.log('Transforming results:', results?.length || 0, 'items');
    console.log('Sample raw result:', results?.[0]);
    
    if (!Array.isArray(results)) {
      console.warn('Results is not an array:', results);
      return [];
    }
    
    return results.map((result, index) => {
      try {
        const transformed = {
          id: result.id || `temp-${index}`,
          name: result.name || result.business_name || 'Unknown Service',
          description: result.description || '',
          address: result.address || '',
          address_line_2: result.address_line_2 || null,
          city: result.city || '',
          state: result.state || '',
          zip_code: result.zip_code || '',
          service_type: result.service_type || '',
          latitude: Number(result.latitude) || Number(result.lat) || 0,
          longitude: Number(result.longitude) || Number(result.lng) || 0,
          needs_geocoding_review: result.needs_geocoding_review || false,
          image_url: result.image_url || null,
          email: result.email || null,
          website_url: result.website_url || null,
          facebook_url: result.facebook_url || null,
          instagram_url: result.instagram_url || null,
          twitter_url: result.twitter_url || null,
          service_url: result.service_url || null,
          searchPage_url: result.searchPage_url || null,
          gMapsID: result.gMapsID || null,
          rating: Number(result.rating) || 0,
          review_count: Number(result.review_count) || 0,
          is_verified: result.is_verified || false,
          featured: result.featured || 'N',
          created_at: result.created_at || null,
          updated_at: result.updated_at || null
        };
        
        console.log(`Transformed result ${index}:`, {
          id: transformed.id,
          name: transformed.name,
          service_type: transformed.service_type,
          address: transformed.address,
          city: transformed.city,
          state: transformed.state
        });
        
        return transformed;
      } catch (itemError) {
        console.error(`Error transforming result item ${index}:`, itemError, result);
        return {
          id: `error-${index}`,
          name: 'Error Loading Service',
          description: 'Unable to load service details',
          address: '',
          city: '',
          state: '',
          zip_code: '',
          service_type: '',
          latitude: 0,
          longitude: 0,
          rating: 0,
          review_count: 0,
          featured: 'N'
        };
      }
    });
  } catch (error) {
    console.error('Error in transformSearchResults:', error);
    return [];
  }
}

/**
 * Extract filters from query where clause
 */
function extractFiltersFromQuery(whereClause: any): any {
  const filters: any = {};

  if (whereClause.service_type) {
    filters.serviceType = whereClause.service_type;
  }

  if (whereClause.rating) {
    filters.rating = whereClause.rating;
  }

  if (whereClause.is_mobile) {
    filters.mobile = whereClause.is_mobile;
  }

  if (whereClause.is_emergency) {
    filters.emergency = whereClause.is_emergency;
  }

  return filters;
}

/**
 * Extract location from query where clause
 */
function extractLocationFromQuery(whereClause: any): any {
  const location: any = {};

  if (whereClause.lat) {
    location.lat = whereClause.lat;
  }

  if (whereClause.lng) {
    location.lng = whereClause.lng;
  }

  if (whereClause.city) {
    location.city = whereClause.city;
  }

  if (whereClause.state) {
    location.state = whereClause.state;
  }

  if (whereClause.zip_code) {
    location.zipCode = whereClause.zip_code;
  }

  return location;
}

/**
 * Get search suggestions based on partial query
 */
export async function getSearchSuggestions(query: string): Promise<string[]> {
  try {
    const supabase = getSupabaseClient();
    
    const { data: suggestions, error } = await supabase
      .from('services')
      .select('business_name, service_type')
      .or(`business_name.ilike.%${query}%,service_type.ilike.%${query}%`)
      .limit(10);

    if (error) {
      throw error;
    }

    const suggestionSet = new Set<string>();
    
    (suggestions || []).forEach(suggestion => {
      if (suggestion.business_name) {
        suggestionSet.add(suggestion.business_name);
      }
      if (suggestion.service_type) {
        suggestionSet.add(suggestion.service_type);
      }
    });

    return Array.from(suggestionSet).slice(0, 10);
  } catch (error) {
    console.error('Error getting search suggestions:', error);
    return [];
  }
}

/**
 * Get popular searches for analytics
 */
export async function getPopularSearches(limit: number = 10): Promise<Array<{ query: string; count: number }>> {
  try {
    // This would typically come from a search analytics table
    // For now, return some common searches
    return [
      { query: 'dog grooming', count: 150 },
      { query: 'veterinarian care', count: 120 },
      { query: 'dog training', count: 80 },
      { query: 'dog parks', count: 75 },
      { query: 'pet products', count: 65 },
      { query: 'boarding daycare', count: 60 },
      { query: 'emergency vet', count: 45 },
      { query: 'mobile grooming', count: 40 },
      { query: 'apartments with dog parks', count: 35 },
      { query: 'landscaping', count: 30 }
    ].slice(0, limit);
  } catch (error) {
    console.error('Error getting popular searches:', error);
    return [];
  }
}
