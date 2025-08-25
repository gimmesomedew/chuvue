import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { geocodeAddress } from '@/lib/geocoding';

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

    // Build the database query for services
    let servicesQuery = supabase
      .from('services')
      .select('*');

    // Debug: Log the base query
    console.log('🔍 Base Services Query: SELECT * FROM services (no filters)');

    // Apply service type filter if specified
    if (searchPattern.serviceType) {
      servicesQuery = servicesQuery.eq('service_type', searchPattern.serviceType);
      console.log('🏷️ Filtering services by service type:', searchPattern.serviceType);
    } else {
      console.log('⚠️ NO service type filter applied - will return ALL services!');
    }

    // Build the database query for products
    let productsQuery = supabase
      .from('products')
      .select(`
        *,
        categories:product_category_mappings(
          category:product_categories(*)
        )
      `);

    // Check if query might be product-related (legacy - will be replaced by intelligent logic)
    const isProductQuery = isProductSearchQuery(query);
    console.log('🛍️ Is product query (legacy):', isProductQuery);

    // Initialize result variables early for enhanced ZIP search
    let servicesResult: any = { data: [], error: null };
    let productsResult: any = { data: [], error: null };
    let enhancedSearchPerformed = false; // Flag to track if enhanced search was used

    // Apply location filters based on search pattern
    if (searchPattern.locationType === 'state') {
      // State-based search (e.g., "in Indiana")
      servicesQuery = servicesQuery.eq('state', searchPattern.locationValue);
      productsQuery = productsQuery.eq('state', searchPattern.locationValue);
      console.log('🗺️ Filtering by state:', searchPattern.locationValue);
    } else if (searchPattern.locationType === 'zip_code') {
      // Enhanced ZIP code search: exact match + 25-mile radius
      const targetZipCode = searchPattern.locationValue;
      console.log('📮 Enhanced ZIP code search for:', targetZipCode);
      
      // First, get coordinates for the target ZIP code
      let targetCoordinates: { lat: number; lng: number } | null = null;
      
      try {
        // Try to get coordinates from a service in that ZIP code first
        const { data: zipService } = await supabase
          .from('services')
          .select('latitude, longitude')
          .eq('zip_code', targetZipCode)
          .not('latitude', 'is', null)
          .not('longitude', 'is', null)
          .limit(1);
        
        if (zipService && zipService.length > 0) {
          targetCoordinates = {
            lat: zipService[0].latitude,
            lng: zipService[0].longitude
          };
          console.log('📍 Found coordinates from existing service in ZIP:', targetZipCode, targetCoordinates);
        } else {
          // Fallback: geocode the ZIP code
          const geocodeResult = await geocodeAddress(`${targetZipCode}, IN`);
          if (geocodeResult.success && geocodeResult.latitude && geocodeResult.longitude) {
            targetCoordinates = {
              lat: geocodeResult.latitude,
              lng: geocodeResult.longitude
            };
            console.log('📍 Geocoded ZIP coordinates:', targetZipCode, targetCoordinates);
          }
        }
      } catch (error) {
        console.error('❌ Error getting ZIP coordinates:', error);
      }
      
      if (targetCoordinates) {
        // Enhanced search: exact ZIP + 25-mile radius
        console.log('🔍 Performing enhanced ZIP search: exact match + 25-mile radius');
        
        // Get exact ZIP matches first
        const exactZipServicesQuery = supabase
          .from('services')
          .select('*')
          .eq('zip_code', targetZipCode);
        
        // Apply service type filter if specified
        if (searchPattern.serviceType) {
          exactZipServicesQuery.eq('service_type', searchPattern.serviceType);
        }
        
        const { data: exactZipServices, error: exactError } = await exactZipServicesQuery;
        
        if (exactError) {
          console.error('❌ Exact ZIP services query error:', exactError);
        }
        
        // Mark exact matches with distance 0
        const exactServices = (exactZipServices || []).map((service: any) => ({
          ...service,
          distance: 0,
          isExactMatch: true
        }));
        
        console.log('📍 Exact ZIP matches found:', exactServices.length);
        
        // Get services within 25-mile radius using RPC function
        const { data: radiusResults, error: radiusError } = await supabase.rpc('services_within_radius', {
          p_lat: targetCoordinates.lat,
          p_lon: targetCoordinates.lng,
          p_radius_miles: 25
        });
        
        if (radiusError) {
          console.error('❌ Radius search error:', radiusError);
        }
        
        // Filter radius results by service type if specified
        let radiusServices = radiusResults || [];
        if (searchPattern.serviceType) {
          radiusServices = radiusServices.filter((service: any) => 
            service.service_type === searchPattern.serviceType
          );
        }
        
        // Remove exact ZIP matches from radius results to avoid duplicates
        radiusServices = radiusServices.filter((service: any) => 
          service.zip_code !== targetZipCode
        );
        
        // Calculate distances for radius results
        radiusServices.forEach((service: any) => {
          if (service.latitude && service.longitude) {
            service.distance = calculateDistance(
              targetCoordinates.lat,
              targetCoordinates.lng,
              service.latitude,
              service.longitude
            );
          } else {
            service.distance = Infinity;
          }
          service.isExactMatch = false;
        });
        
        console.log('📍 RPC radius search found', radiusServices.length, 'services within 25 miles');
        
        // Combine exact matches and radius results
        const allServices = [...exactServices, ...radiusServices];
        
        // Sort by: exact matches first, then by distance
        console.log('📍 Before sorting - first 5 results:');
        allServices.slice(0, 5).forEach((service: any, index: number) => {
          console.log(`  ${index + 1}. ${service.name}: ${service.distance} miles (${service.zip_code})`);
        });
        
        allServices.sort((a: any, b: any) => {
          // Exact matches come first
          if (a.isExactMatch && !b.isExactMatch) return -1;
          if (!a.isExactMatch && b.isExactMatch) return 1;
          
          // If both are exact matches, sort by name
          if (a.isExactMatch && b.isExactMatch) {
            return a.name?.localeCompare(b.name) || 0;
          }
          
          // Otherwise sort by distance (closest first)
          if (a.distance !== Infinity && b.distance !== Infinity) {
            const result = a.distance - b.distance;
            console.log(`  Comparing ${a.name} (${a.distance}) vs ${b.name} (${b.distance}) = ${result}`);
            return result;
          }
          
          // Handle cases where distance is unknown
          if (a.distance === Infinity && b.distance === Infinity) {
            return a.name?.localeCompare(b.name) || 0;
          }
          return a.distance === Infinity ? 1 : -1;
        });
        
        // Debug: Log the first few results after sorting
        console.log('📍 After sorting - first 5 results:');
        allServices.slice(0, 5).forEach((service: any, index: number) => {
          console.log(`  ${index + 1}. ${service.name}: ${service.distance} miles (${service.zip_code})`);
        });
        
        console.log('📍 Enhanced ZIP search results:', {
          exactMatches: exactServices.length,
          radiusResults: radiusServices.length,
          totalServices: allServices.length
        });
        
        // Set the services result to our enhanced search
        servicesResult = { data: allServices, error: null };
        
        // For products, also do enhanced ZIP search
        const exactZipProductsQuery = supabase
          .from('products')
          .select(`
            *,
            categories:product_category_mappings(
              category:product_categories(*)
            )
          `)
          .eq('zip_code', targetZipCode);
        
        const { data: exactZipProducts, error: exactProductsError } = await exactZipProductsQuery;
        
        if (exactProductsError) {
          console.error('❌ Exact ZIP products query error:', exactProductsError);
        }
        
        // Mark exact product matches
        const exactProducts = (exactZipProducts || []).map((product: any) => ({
          ...product,
          distance: 0,
          isExactMatch: true,
          type: 'product'
        }));
        
        // Get products within radius (if they have coordinates)
        let radiusProducts: any[] = [];
        const hasProductCategories = await checkProductCategoryMatch(query);
        if (hasProductCategories) {
          const { data: allProducts, error: allProductsError } = await supabase
            .from('products')
            .select(`
              *,
              categories:product_category_mappings(
                category:product_categories(*)
              )
            `);
          
          if (!allProductsError && allProducts) {
            radiusProducts = allProducts.filter((product: any) => {
              if (product.latitude && product.longitude && product.zip_code !== targetZipCode) {
                const distance = calculateDistance(
                  targetCoordinates.lat,
                  targetCoordinates.lng,
                  product.latitude,
                  product.longitude
                );
                if (distance <= 25) {
                  product.distance = distance;
                  product.isExactMatch = false;
                  product.type = 'product';
                  return true;
                }
              }
              return false;
            });
          }
        }
        
        // Combine and sort products
        const allProducts = [...exactProducts, ...radiusProducts];
        allProducts.sort((a: any, b: any) => {
          if (a.isExactMatch && !b.isExactMatch) return -1;
          if (!a.isExactMatch && b.isExactMatch) return 1;
          if (a.isExactMatch && b.isExactMatch) {
            return a.name?.localeCompare(b.name) || 0;
          }
          if (a.distance !== Infinity && b.distance !== Infinity) {
            return a.distance - b.distance;
          }
          if (a.distance === Infinity && b.distance === Infinity) {
            return a.name?.localeCompare(b.name) || 0;
          }
          return a.distance === Infinity ? 1 : -1;
        });
        
        // Set the products result
        productsResult = { data: allProducts, error: null };
        
        console.log('📍 Enhanced ZIP search completed for services and products');
        enhancedSearchPerformed = true;
        
      } else {
        // Fallback to original exact ZIP search if we can't get coordinates
        console.log('⚠️ Could not get coordinates for ZIP, falling back to exact match only');
        servicesQuery = servicesQuery.eq('zip_code', targetZipCode);
        productsQuery = productsQuery.eq('zip_code', targetZipCode);
      }
      
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
      
      // For radius search, we need to handle both services and products
      // Since the RPC function only works with services, we'll search products separately
      
      // Get products within radius (if they have coordinates and match product categories)
      let productsInRadius: any[] = [];
      const hasProductCategories = await checkProductCategoryMatch(query);
      if (hasProductCategories) {
        const { data: productsData, error: productsError } = await productsQuery;
        if (!productsError && productsData) {
          productsInRadius = productsData.filter((product: any) => {
            if (product.latitude && product.longitude) {
              const distance = calculateDistance(
                userLocation.lat,
                userLocation.lng,
                product.latitude,
                product.longitude
              );
              product.distance = distance;
              return distance <= radiusMiles;
            }
            return false;
          });
        }
      }
      
      // Filter radius results by service type if specified
      let filteredServices = radiusResults || [];
      if (searchPattern.serviceType) {
        filteredServices = filteredServices.filter((service: any) => service.service_type === searchPattern.serviceType);
        console.log('🏷️ Filtered services by service type:', searchPattern.serviceType, '- Found', filteredServices.length, 'matching results');
      }
      
      // Calculate distances for services
      filteredServices.forEach((service: any) => {
        if (service.latitude && service.longitude) {
          service.distance = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            service.latitude,
            service.longitude
          );
        } else {
          service.distance = Infinity;
        }
      });
      
      // Combine and sort all results by distance
      const allResults = [...filteredServices, ...productsInRadius];
      allResults.sort((a: any, b: any) => {
        if (a.distance !== Infinity && b.distance !== Infinity) {
          return a.distance - b.distance; // Sort by distance (closest first)
        }
        if (a.distance === Infinity && b.distance === Infinity) {
          return a.name?.localeCompare(b.name) || 0; // Both have no distance, sort by name
        }
        return a.distance === Infinity ? 1 : -1; // Items with distance come first
      });
      
      console.log('📍 Combined results - Services:', filteredServices.length, 'Products:', productsInRadius.length);
      console.log('📍 Sorted all results by distance (closest first)');
      
      // Limit results to prevent overwhelming output
      const limitedResults = allResults.slice(0, 100);
      
      // Return filtered radius results
      return NextResponse.json({
        success: true,
        results: limitedResults,
        metadata: {
          originalQuery: query,
          parsedPattern: searchPattern,
          resultCount: limitedResults.length,
          totalInRadius: allResults.length,
          searchType: 'simple_radius',
          filters: {
            serviceType: searchPattern.serviceType,
            locationType: 'near_me',
            radius: radiusMiles
          },
          breakdown: {
            services: filteredServices.length,
            products: productsInRadius.length
          }
        }
      });
    }

    // INTELLIGENT SEARCH LOGIC: Only search when we have specific matches
    let servicesLimit = 0; // Default: NO services (only search if service type detected)
    let productsLimit = 0; // Default: NO products (only search if product category detected)
    
    // Normalize query for intelligent filtering
    const normalizedQuery = query.toLowerCase().trim();
    
    // Check if query explicitly mentions "product" or "products"
    const isExplicitProductQuery = normalizedQuery.includes('product') || normalizedQuery.includes('products');
    
    // Check if we have a specific service type to search for
    if (searchPattern.serviceType) {
      servicesLimit = 100; // Search for services of this specific type
      console.log('🏷️ Service type detected:', searchPattern.serviceType, '- will search services');
    }
    
    // Check if we have specific product categories to search for
    const hasProductCategories = await checkProductCategoryMatch(query);
    if (hasProductCategories || isExplicitProductQuery) {
      productsLimit = 100; // Search for products in these categories
      console.log('🛍️ Product categories detected or explicit product query - will search products');
    }
    
    // If no specific search criteria, return nothing
    if (servicesLimit === 0 && productsLimit === 0) {
      console.log('⚠️ No specific search criteria detected - returning empty results');
      return NextResponse.json({
        success: true,
        results: [],
        metadata: {
          originalQuery: query,
          parsedPattern: searchPattern,
          resultCount: 0,
          searchType: 'simple',
          filters: {
            serviceType: searchPattern.serviceType,
            locationType: searchPattern.locationType,
            locationValue: searchPattern.locationValue,
            radius: searchPattern.radius
          },
          breakdown: {
            services: 0,
            products: 0
          },
          message: 'No specific search criteria found. Try searching for a service type (e.g., "groomer", "vet") or product category (e.g., "supplements", "toys").'
        }
      });
    }
    
    // Debug: Log the actual query objects being sent
    console.log('🔍 Services Query Object:', {
      table: 'services',
      filters: {
        serviceType: searchPattern.serviceType,
        locationType: searchPattern.locationType,
        locationValue: searchPattern.locationValue
      },
      limit: servicesLimit,
      queryBuilder: servicesQuery
    });
    
    console.log('🔍 Products Query Object:', {
      table: 'products',
      filters: {
        locationType: searchPattern.locationType,
        locationValue: searchPattern.locationValue
      },
      limit: productsLimit,
      queryBuilder: productsQuery
    });
    
    // Debug: Show what the query would look like if we could see the SQL
    if (searchPattern.serviceType) {
      console.log('🔍 Services SQL would be: SELECT * FROM services WHERE service_type = ? LIMIT ' + servicesLimit);
    } else {
      console.log('🔍 Services SQL would be: SELECT * FROM services LIMIT ' + servicesLimit);
    }
    
    console.log('🔍 Products SQL would be: SELECT *, categories:product_category_mappings(category:product_categories(*)) FROM products LIMIT ' + productsLimit);
    
    // Apply limits to prevent overwhelming results
    if (servicesLimit > 0) {
      servicesQuery = servicesQuery.limit(servicesLimit);
    }
    productsQuery = productsQuery.limit(productsLimit);
    
    // Execute queries based on limits
    if (enhancedSearchPerformed) {
      console.log('🔍 Enhanced search already performed, skipping regular queries');
    } else if (servicesLimit > 0) {
      [servicesResult, productsResult] = await Promise.all([
        servicesQuery,
        productsQuery
      ]);
    } else {
      // Only query products when servicesLimit is 0
      productsResult = await productsQuery;
    }

    if (servicesResult.error) {
      console.error('❌ Services query error:', servicesResult.error);
    }
    
    if (productsResult.error) {
      console.error('❌ Products query error:', productsResult.error);
    }
    
    // Debug: Log raw results before transformation
    console.log('🔍 Raw Services Result Count:', servicesResult.data?.length || 0);
    console.log('🔍 Raw Products Result Count:', productsResult.data?.length || 0);
    
    // Debug: Show sample of first few results
    if (servicesResult.data && servicesResult.data.length > 0) {
      console.log('🔍 Sample Services (first 3):', servicesResult.data.slice(0, 3).map((s: any) => ({ id: s.id, name: s.name, service_type: s.service_type })));
    }
    
    if (productsResult.data && productsResult.data.length > 0) {
      console.log('🔍 Sample Products (first 3):', productsResult.data.slice(0, 3).map((p: any) => ({ id: p.id, name: p.name, categories: p.categories?.length || 0 })));
    }

    // Transform products to flatten categories
    const transformedProducts = productsResult.data?.map((product: any) => ({
      ...product,
      categories: product.categories?.map((mapping: any) => mapping.category).filter(Boolean) || [],
      type: 'product' // Mark as product for frontend
    })) || [];

    // For product queries, filter products by relevance to the search query
    if (productsLimit > 0 && transformedProducts.length > 0) {
      const queryWords = normalizedQuery.split(/\s+/).filter(word => word.length > 2);
      
      // Score products based on relevance to query
      const scoredProducts = transformedProducts.map((product: any) => {
        let score = 0;
        const productText = `${product.name} ${product.description || ''} ${product.categories?.map((c: any) => c.name || '').join(' ') || ''}`.toLowerCase();
        
        // Check for exact matches in product name
        if (product.name.toLowerCase().includes(normalizedQuery)) {
          score += 100;
        }
        
        // Check for word matches
        for (const word of queryWords) {
          if (productText.includes(word)) {
            score += 10;
          }
        }
        
        // Check for category relevance
        if (product.categories) {
          for (const category of product.categories) {
            const categoryName = category.name?.toLowerCase() || '';
            for (const word of queryWords) {
              if (categoryName.includes(word)) {
                score += 15;
              }
            }
          }
        }
        
        return { ...product, relevanceScore: score };
      });
      
      // Filter out products with very low relevance (score < 5)
      const relevantProducts = scoredProducts.filter((product: any) => product.relevanceScore >= 5);
      
      // Sort by relevance score (highest first)
      relevantProducts.sort((a: any, b: any) => b.relevanceScore - a.relevanceScore);
      
      console.log('🔍 Product relevance filtering:');
      console.log('🔍 Original products:', transformedProducts.length);
      console.log('🔍 Relevant products:', relevantProducts.length);
      console.log('🔍 Product scores:', relevantProducts.map((p: any) => ({ name: p.name, score: p.relevanceScore })));
      
      // Update transformedProducts with filtered data
      transformedProducts.length = 0;
      transformedProducts.push(...relevantProducts);
    }

    // Mark services for frontend
    const transformedServices = (servicesLimit > 0 && servicesResult.data) ? (servicesResult.data || []).map((service: any) => ({
      ...service,
      type: 'service' // Mark as service for frontend
    })) : [];

    // Combine results
    const allResults = [...transformedServices, ...transformedProducts];
    
    console.log('✅ Search completed. Found', allResults.length, 'total results');
    console.log('📊 Breakdown - Services:', transformedServices.length, 'Products:', transformedProducts.length);
    
    // Debug: Check if we're returning too many results
    if (allResults.length > 100) {
      console.warn('⚠️ WARNING: Returning', allResults.length, 'results - this might be too many!');
      console.warn('⚠️ Consider adding more specific filters or implementing pagination');
    }
    
    // Debug: Show what filters were actually applied
    console.log('🔍 Final Filters Applied:', {
      serviceType: searchPattern.serviceType || 'NONE (no service search)',
      locationType: searchPattern.locationType || 'NONE',
      locationValue: searchPattern.locationValue || 'NONE',
      servicesLimit: servicesLimit,
      productsLimit: productsLimit,
      query: query
    });
    
    // Sort by name for non-location searches
    if (allResults.length > 0) {
      allResults.sort((a: any, b: any) => a.name?.localeCompare(b.name) || 0);
      console.log('📝 Sorted results by name (alphabetical)');
    }

    // Return results with metadata
    return NextResponse.json({
      success: true,
      results: allResults,
      metadata: {
        originalQuery: query,
        parsedPattern: searchPattern,
        resultCount: allResults.length,
        searchType: 'simple',
        filters: {
          serviceType: searchPattern.serviceType,
          locationType: searchPattern.locationType,
          locationValue: searchPattern.locationValue,
          radius: searchPattern.radius
        },
        breakdown: {
          services: transformedServices.length,
          products: transformedProducts.length
        },
        // Enhanced metadata for ZIP code searches
        enhancedSearch: enhancedSearchPerformed ? {
          targetZipCode: searchPattern.locationValue,
          searchRadius: 25, // 25-mile radius
          hasExactMatches: allResults.some((result: any) => result.isExactMatch),
          exactMatchCount: allResults.filter((result: any) => result.isExactMatch).length,
          radiusResultsCount: allResults.filter((result: any) => !result.isExactMatch).length,
          searchDescription: `Found ${allResults.length} results: ${allResults.filter((result: any) => result.isExactMatch).length} in ${searchPattern.locationValue} and ${allResults.filter((result: any) => !result.isExactMatch).length} within 25 miles`
        } : undefined
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
    // Check for ZIP codes FIRST (before state references)
    const zipCodeMatch = extractZipCode(normalizedQuery);
    if (zipCodeMatch) {
      result.locationType = 'zip_code';
      result.locationValue = zipCodeMatch;
      result.radius = 25; // Default 25 mile radius for zip code searches
      console.log('📮 ZIP code detected:', zipCodeMatch);
    } else {
      // Only check for state references if no ZIP code was found
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
    }
  }

  return result;
}

/**
 * Check if query matches any product categories in the database
 */
async function checkProductCategoryMatch(query: string): Promise<boolean> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    // Get all product categories
    const { data: categories, error } = await supabase
      .from('product_categories')
      .select('name, description');
    
    if (error || !categories) {
      console.warn('⚠️ Could not fetch product categories:', error);
      return false;
    }
    
    const normalizedQuery = query.toLowerCase().trim();
    
    // Check if query matches any category name or description
    for (const category of categories) {
      const categoryName = category.name?.toLowerCase() || '';
      const categoryDesc = category.description?.toLowerCase() || '';
      
      if (normalizedQuery.includes(categoryName) || categoryName.includes(normalizedQuery) ||
          normalizedQuery.includes(categoryDesc) || categoryDesc.includes(normalizedQuery)) {
        console.log('🎯 Product category match found:', category.name);
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('❌ Error checking product categories:', error);
    return false;
  }
}

/**
 * Check if query is likely for products rather than services
 * @deprecated This function is too broad and catches generic terms. Use checkProductCategoryMatch instead.
 */
function isProductSearchQuery(query: string): boolean {
  const normalizedQuery = query.toLowerCase().trim();
  
  // FIRST: Check if query explicitly mentions "product" or "products" - this is the strongest indicator
  if (normalizedQuery.includes('product') || normalizedQuery.includes('products')) {
    return true;
  }
  
  // SECOND: Check for product-related keywords
  const productKeywords = [
    // Food and nutrition
    'food', 'treat', 'supplement', 'vitamin', 'nutrition', 'kibble', 'raw food', 'wet food',
    'probiotic', 'omega', 'fish oil', 'joint', 'hip', 'arthritis', 'senior', 'puppy',
    
    // Health and wellness
    'calming', 'calm', 'anxiety', 'stress', 'relax', 'sleep', 'immune', 'allergy', 'itch', 'skin',
    'wound', 'healing', 'dental', 'teeth', 'breath', 'gum', 'anti-inflammatory', 'pain',
    
    // Equipment and gear
    'collar', 'leash', 'harness', 'bed', 'crate', 'toy', 'ball', 'chew', 'bone', 'treat',
    'bowl', 'feeder', 'water', 'fountain', 'grooming', 'brush', 'shampoo', 'conditioner',
    
    // Therapy and special care
    'red light', 'therapy', 'massage', 'acupuncture', 'holistic', 'natural', 'organic',
    'cbd', 'essential oil', 'aromatherapy', 'homeopathic', 'herbal'
  ];
  
  // Check if query contains product-related keywords
  for (const keyword of productKeywords) {
    if (normalizedQuery.includes(keyword)) {
      return true;
    }
  }
  
  // THIRD: Check for specific product categories
  const productCategories = [
    'supplement', 'vitamin', 'treat', 'food', 'gear', 'equipment', 'therapy'
  ];
  
  for (const category of productCategories) {
    if (normalizedQuery.includes(category)) {
      return true;
    }
  }
  
  return false;
}
