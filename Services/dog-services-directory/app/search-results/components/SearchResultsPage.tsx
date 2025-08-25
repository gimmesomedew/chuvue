'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SearchFormV2 } from '@/app/homepage-v2/components/SearchFormV2';
import { SearchResultsDisplay } from '@/components/search/SearchResultsDisplay';
import { getSortedStates } from '@/lib/states';
import { useLocationResolver } from '@/hooks/useLocationResolver';
import { motion, AnimatePresence } from 'framer-motion';

// Helper function to detect proximity queries (matches backend logic)
function isProximityQuery(query: string): boolean {
  const normalizedQuery = query.toLowerCase().trim();
  
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
  // Comprehensive US state detection
  const stateMappings = {
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
    'district of columbia': 'DC', 'puerto rico': 'PR', 'guam': 'GU', 'american samoa': 'AS',
    'u.s. virgin islands': 'VI', 'northern mariana islands': 'MP'
  };
  
  const hasStateReference = Object.keys(stateMappings).some(stateName => 
    normalizedQuery.includes(stateName)
  ) || Object.values(stateMappings).some(stateCode => 
    normalizedQuery.includes(` ${stateCode.toLowerCase()} `)
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

// Helper function to detect zip code queries
function extractZipCode(query: string): string | null {
  const normalizedQuery = query.toLowerCase().trim();
  
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

export function SearchResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { resolveLocationFromQuery, getDefaultLocation, resolveLocationFromGeolocation } = useLocationResolver();
  
  // Search state
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [allSearchResults, setAllSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchMetadata, setSearchMetadata] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [selectedServiceType, setSelectedServiceType] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [latitude, setLatitude] = useState<number>();
  const [longitude, setLongitude] = useState<number>();
  const [cityState, setCityState] = useState('');
  const [resetKey, setResetKey] = useState(0);
  const [favoritedProducts, setFavoritedProducts] = useState<number[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'services' | 'products'>('all');
  
  // Sorting state
  const [sortMethod, setSortMethod] = useState<'distance' | 'name' | 'default'>('distance');
  const [sortedResults, setSortedResults] = useState<any[]>([]);

  // Check if we have search parameters on page load
  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      handleSearchSubmit(query);
    }
  }, [searchParams]);

  // Sorting functions
  const sortResultsByDistance = (results: any[]) => {
    return [...results].sort((a, b) => {
      // Handle cases where distance might be undefined
      if (a.distance === undefined && b.distance === undefined) return 0;
      if (a.distance === undefined) return 1;
      if (b.distance === undefined) return -1;
      
      // Sort by distance (closest first)
      return a.distance - b.distance;
    });
  };

  const sortResultsByName = (results: any[]) => {
    return [...results].sort((a, b) => {
      if (!a.name || !b.name) return 0;
      return a.name.localeCompare(b.name);
    });
  };

  const sortResults = (results: any[], method: 'distance' | 'name' | 'default') => {
    switch (method) {
      case 'distance':
        return sortResultsByDistance(results);
      case 'name':
        return sortResultsByName(results);
      default:
        return results; // Keep original order
    }
  };

  // Apply sorting whenever allSearchResults or sortMethod changes
  useEffect(() => {
    if (allSearchResults.length > 0) {
      const sorted = sortResults(allSearchResults, sortMethod);
      setSortedResults(sorted);
      
      // Update paginated results
      const itemsPerPage = 25;
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedResults = sorted.slice(startIndex, endIndex);
      setSearchResults(paginatedResults);
    }
  }, [allSearchResults, sortMethod, currentPage]);

  const handleSearchSubmit = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    
    // Update URL with search query
    const params = new URLSearchParams(searchParams.toString());
    params.set('q', searchQuery);
    router.push(`/search-results?${params.toString()}`);

    try {
              // Dynamic location resolution using centralized hook
        const locationResult = resolveLocationFromQuery(searchQuery);
        
        // Create base request body
        const requestBody: any = {
          query: searchQuery
        };
        
        if (locationResult) {
          // Location was explicitly specified (e.g., "in Illinois")
          requestBody.userLocation = {
            lat: locationResult.lat,
            lng: locationResult.lng,
            zip: locationResult.zip,
            city: locationResult.city,
            state: locationResult.state
          };
          console.log('Location specified in query, using:', requestBody.userLocation);
        } else if (extractZipCode(searchQuery)) {
          // Zip code query detected (e.g., "near 46240")
          const zipCode = extractZipCode(searchQuery);
          console.log('Zip code query detected:', zipCode);
          // For zip code searches, we don't need to send userLocation
          // The backend will handle the zip code filtering
        } else if (isProximityQuery(searchQuery)) {
          // Proximity query - get user's actual location via geolocation
          console.log('Proximity query detected, getting user location...');
          try {
            const userLocation = await resolveLocationFromGeolocation();
            requestBody.userLocation = {
              lat: userLocation.lat,
              lng: userLocation.lng,
              zip: userLocation.zip,
              city: userLocation.city,
              state: userLocation.state
            };
            console.log('Got user location for "near me":', requestBody.userLocation);
          } catch (error) {
            console.error('Failed to get user location:', error);
            // Use default location as fallback
            requestBody.userLocation = {
              lat: 39.9568,
              lng: -86.0075,
              zip: '46037',
              city: 'Fishers',
              state: 'IN'
            };
            console.log('Using default location as fallback:', requestBody.userLocation);
          }
        } else {
          // No location specified (e.g., just "Dog Parks")
          console.log('No location specified in query, searching all locations');
        }
        

        
        console.log('=== CLIENT-SIDE SEARCH DEBUG ===');
        console.log('Sending search request:', requestBody);
        
        const response = await fetch('/api/search-simple', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

              if (response.ok) {
          const data = await response.json();
          console.log('Raw API response:', data);
          console.log('Response metadata:', data.metadata);
          console.log('Response results count:', data.results?.length || 0);
          
          const allResults = data.results || [];
          setAllSearchResults(allResults);
          
          // Apply initial sorting (will trigger useEffect for sorting)
          const initialSorted = sortResults(allResults, sortMethod);
          setSortedResults(initialSorted);
          
          // Client-side pagination - show first 25 results
          const itemsPerPage = 25;
          const startIndex = (currentPage - 1) * itemsPerPage;
          const endIndex = startIndex + itemsPerPage;
          const paginatedResults = initialSorted.slice(startIndex, endIndex);
          setSearchResults(paginatedResults);
          
          // Calculate pagination based on total results
          const totalCount = allResults.length;
          console.log('Pagination Debug:', {
            totalResultsFromAPI: allResults.length,
            currentPage: currentPage,
            startIndex: startIndex,
            endIndex: endIndex,
            paginatedResultsCount: paginatedResults.length,
            totalPages: Math.ceil(totalCount / itemsPerPage)
          });
          
          setTotalResults(totalCount);
          setTotalPages(Math.ceil(totalCount / itemsPerPage));
          setCurrentPage(1); // Reset to first page for new search
          setSearchMetadata(data.metadata);
          setSelectedFilter('all'); // Reset filter to 'all' for new search

        // Set search criteria based on whether location was specified
        if (requestBody.userLocation) {
          // Location was specified in query, use it for search criteria
          setLatitude(requestBody.userLocation.lat);
          setLongitude(requestBody.userLocation.lng);
          setCityState(requestBody.userLocation.city);
          setZipCode(requestBody.userLocation.zip);
          setSelectedState(requestBody.userLocation.state);
          
          console.log('Set search criteria to match specified location:', {
            lat: requestBody.userLocation.lat,
            lng: requestBody.userLocation.lng,
            city: requestBody.userLocation.city,
            zip: requestBody.userLocation.zip,
            state: requestBody.userLocation.state
          });
        } else {
          // No location specified, clear location-based criteria
          setLatitude(undefined);
          setLongitude(undefined);
          setCityState('');
          setZipCode('');
          setSelectedState('');
          
          console.log('No location specified, cleared location-based search criteria');
        }

        // Set service type from metadata
        if (data.metadata?.parsedQuery?.entities?.services?.length > 0) {
          setSelectedServiceType(data.metadata.parsedQuery.entities.services[0]);
        } else {
          // Fallback: if no service type in metadata, try to infer from the original query
          const originalQuery = searchParams.get('q')?.toLowerCase() || '';
          if (originalQuery.includes('groomer') || originalQuery.includes('grooming')) {
            setSelectedServiceType('groomer');
          } else if (originalQuery.includes('vet') || originalQuery.includes('veterinarian')) {
            setSelectedServiceType('veterinarian');
          } else if (originalQuery.includes('dog park') || originalQuery.includes('park')) {
            setSelectedServiceType('dog_park');
          } else if (originalQuery.includes('training') || originalQuery.includes('trainer')) {
            setSelectedServiceType('dog_trainer');
          } else if (originalQuery.includes('boarding') || originalQuery.includes('daycare')) {
            setSelectedServiceType('boarding_daycare');
          }
        }

        console.log('Search API Response:', {
          results: data.results?.length || 0,
          metadata: data.metadata,
          parsedQuery: data.metadata?.parsedQuery,
          entities: data.metadata?.parsedQuery?.entities,
          location: data.metadata?.parsedQuery?.location
        });

        console.log('Final state after processing:', {
          selectedServiceType,
          selectedState,
          zipCode,
          cityState,
          searchMetadata: data.metadata
        });
      } else {
        console.error('Search failed:', response.statusText);
        setSearchResults([]);
        setAllSearchResults([]);
        setTotalResults(0);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    console.log('=== CLIENT-SIDE PAGE CHANGE ===');
    console.log('Changing to page:', newPage);
    console.log('Total results available:', allSearchResults.length);
    
    setCurrentPage(newPage);
    
    // Get the appropriate results to paginate
    const resultsToPaginate = selectedFilter === 'all' ? allSearchResults : 
      selectedFilter === 'services' ? allSearchResults.filter(result => 
        'service_type' in result || 
        'serviceType' in result || 
        result.type === 'service' ||
        result.category === 'service'
      ) :
      allSearchResults.filter(result => 
        'product_type' in result || 
        'productType' in result || 
        result.type === 'product' ||
        result.category === 'product' ||
        'price' in result ||
        'sku' in result
      );
    
    // Client-side pagination - slice the results
    const itemsPerPage = 25;
    const startIndex = (newPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedResults = resultsToPaginate.slice(startIndex, endIndex);
    
    console.log('Pagination calculation:', {
      newPage,
      startIndex,
      endIndex,
      paginatedResultsCount: paginatedResults.length,
      filter: selectedFilter,
      totalFilteredResults: resultsToPaginate.length
    });
    
    setSearchResults(paginatedResults);
  };

  const handleRemoveServiceType = () => {
    setSelectedServiceType('');
  };

  const handleRemoveState = () => {
    setSelectedState('');
  };

  const handleRemoveZipCode = () => {
    setZipCode('');
  };

  const handleClearAll = () => {
    // Clear all filters
    setSelectedServiceType('');
    setSelectedState('');
    setZipCode('');
    setLatitude(undefined);
    setLongitude(undefined);
    setCityState('');
    
    // Clear search results
    setSearchResults([]);
    setAllSearchResults([]);
    setSearchMetadata(null);
    setCurrentPage(1);
    setTotalPages(1);
    setTotalResults(0);
    
    // Increment reset key to clear search input
    setResetKey(prev => prev + 1);
    
    // Clear URL parameters and redirect to clean search results page
    router.push('/search-results');
  };

  const handleClientFilter = (serviceType: string) => {
    // This would filter results client-side if needed
  };

  const handleToggleSearchForm = () => {
    // This would toggle the search form if needed
  };

  const handleClearClientFilter = () => {
    // This would clear client-side filters if needed
  };

  const handleFilterByServiceType = (serviceType: string) => {
    // This would filter by service type if needed
  };

  const handleProductFavorite = (productId: number) => {
    // This would handle product favoriting if needed
  };

  // Determine if services and products exist in search results
  const hasServices = allSearchResults.some(result => 
    'service_type' in result || 
    'serviceType' in result || 
    result.type === 'service' ||
    result.category === 'service'
  );
  
  const hasProducts = allSearchResults.some(result => 
    'product_type' in result || 
    'productType' in result || 
    result.type === 'product' ||
    result.category === 'product' ||
    'price' in result ||
    'sku' in result
  );

  // Debug logging to understand result structure
  useEffect(() => {
    if (allSearchResults.length > 0) {
      console.log('=== RESULT STRUCTURE DEBUG ===');
      console.log('First result:', allSearchResults[0]);
      console.log('All result keys:', allSearchResults.map(r => Object.keys(r)));
      console.log('Has services:', hasServices);
      console.log('Has products:', hasProducts);
      console.log('Service results:', allSearchResults.filter(r => 'service_type' in r || 'serviceType' in r || r.type === 'service' || r.category === 'service'));
      console.log('Product results:', allSearchResults.filter(r => 'product_type' in r || 'productType' in r || r.type === 'product' || r.category === 'product' || 'price' in r || 'sku' in r));
    }
  }, [allSearchResults, hasServices, hasProducts]);

  // Filter results based on selected filter
  const getFilteredResults = () => {
    if (selectedFilter === 'all') {
      return searchResults;
    } else if (selectedFilter === 'services') {
      return searchResults.filter(result => 
        'service_type' in result || 
        'serviceType' in result || 
        result.type === 'service' ||
        result.category === 'service'
      );
    } else if (selectedFilter === 'products') {
      return searchResults.filter(result => 
        'product_type' in result || 
        'productType' in result || 
        result.type === 'product' ||
        result.category === 'product' ||
        'price' in result ||
        'sku' in result
      );
    }
    return searchResults;
  };

  // Handle filter change
  const handleFilterChange = (filter: 'all' | 'services' | 'products') => {
    setSelectedFilter(filter);
    setCurrentPage(1); // Reset to first page when changing filters
  };

  const resetSearch = () => {
    setSearchResults([]);
    setAllSearchResults([]);
    setSearchMetadata(null);
    setCurrentPage(1);
    setTotalPages(1);
    setTotalResults(0);
    setSelectedServiceType('');
    setSelectedState('');
    setZipCode('');
    setLatitude(undefined);
    setLongitude(undefined);
    setCityState('');
    setSelectedFilter('all'); // Reset filter to 'all'
    
    // Clear URL parameters
    router.push('/search-results');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Container with Clean Layout */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Top Section: Back Link, Heading, and Location Tag */}
            <div className="flex items-center justify-start space-x-6">
              {/* Back Link to Home */}
              <a
                href="/"
                className="inline-flex items-center text-secondary hover:text-pink-600 transition-colors duration-200 font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </a>
              
              {/* Results Count and Location Tag */}
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-primary">
                  {searchResults.length > 0 ? `Found ${getFilteredResults().length} result${getFilteredResults().length !== 1 ? 's' : ''}` : 'Search Results'}
                </h1>
                
                {/* Location Tag - show for state, zip code, or My Location */}
                {(selectedState || zipCode || (latitude && longitude)) && (
                  <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>
                      {selectedState 
                        ? getSortedStates().find(s => s.abbreviation === selectedState)?.name || selectedState
                        : zipCode
                        ? `ZIP: ${zipCode}`
                        : cityState || 'My Location'
                      }
                    </span>
                    <button
                      onClick={() => {
                        setSelectedState('');
                        setZipCode('');
                        setLatitude(undefined);
                        setLongitude(undefined);
                        setCityState('');
                      }}
                      className="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                )}
              </div>
            </div>

            {/* Search Form Section */}
            <div className="border-t border-gray-200 pt-6">
              <div className="max-w-4xl mx-auto transition-opacity duration-500 opacity-0">
                <form className="flex gap-4 flex-row" onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const query = formData.get('query') as string;
                  if (query) {
                    handleSearchSubmit(query);
                  }
                }}>
                  <div className="relative flex-1">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-search w-5 h-5">
                        <path d="m21 21-4.34-4.34"></path>
                        <circle cx="11" cy="11" r="8"></circle>
                      </svg>
                    </div>
                    <input 
                      type="text" 
                      name="query"
                      placeholder="Search again..." 
                      className="w-full pl-12 pr-4 py-4 text-lg border-0 rounded-xl shadow-lg focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all duration-200" 
                      defaultValue={searchParams.get('q') || ''} 
                    />
                  </div>
                  <button type="submit" className="font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap py-4 px-6 bg-secondary hover:bg-pink-600 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-search w-5 h-5">
                      <path d="m21 21-4.34-4.34"></path>
                      <circle cx="11" cy="11" r="8"></circle>
                    </svg>
                  </button>
                </form>
              </div>
              
              {/* Filter Tags */}
              {searchResults.length > 0 && (
                <div className="mt-6 flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700">Filter by:</span>
                  
                  {/* All Results Tag */}
                  <button
                    onClick={() => handleFilterChange('all')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                      selectedFilter === 'all'
                        ? 'bg-secondary text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    All ({allSearchResults.length})
                  </button>
                  
                  {/* Services Tag - only show if services exist */}
                  {hasServices && (
                    <button
                      onClick={() => handleFilterChange('services')}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                        selectedFilter === 'services'
                          ? 'bg-secondary text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Services ({allSearchResults.filter(result => 
                        'service_type' in result || 
                        'serviceType' in result || 
                        result.type === 'service' ||
                        result.category === 'service'
                      ).length})
                    </button>
                  )}
                  
                  {/* Products Tag - only show if products exist */}
                  {hasProducts && (
                    <button
                      onClick={() => handleFilterChange('products')}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                        selectedFilter === 'products'
                          ? 'bg-secondary text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Products ({allSearchResults.filter(result => 
                        'product_type' in result || 
                        'productType' in result || 
                        result.type === 'product' ||
                        result.category === 'product' ||
                        'price' in result ||
                        'sku' in result
                      ).length})
                    </button>
                  )}
                </div>
              )}
              
              {/* Sorting Controls */}
              {allSearchResults.length > 0 && (
                <motion.div 
                  className="max-w-4xl mx-auto mt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium text-gray-700">Sort by:</span>
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSortMethod('distance')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            sortMethod === 'distance'
                              ? 'bg-pink-500 text-white shadow-lg'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          Distance
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSortMethod('name')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            sortMethod === 'name'
                              ? 'bg-pink-500 text-white shadow-lg'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          Name
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSortMethod('default')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            sortMethod === 'default'
                              ? 'bg-pink-500 text-white shadow-lg'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          Default
                        </motion.button>
                      </div>
                    </div>
                    
                    {/* Sort Method Indicator */}
                    <motion.div 
                      className="text-sm text-gray-600"
                      key={sortMethod}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {sortMethod === 'distance' && '🔄 Sorting by distance (closest first)'}
                      {sortMethod === 'name' && '🔤 Sorting alphabetically by name'}
                      {sortMethod === 'default' && '📋 Showing in original order'}
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Search Results Section */}
      {searchResults.length > 0 && (
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <SearchResultsDisplay
                searchResults={getFilteredResults()}
                allSearchResults={allSearchResults}
                isSearching={isSearching}
                totalResults={getFilteredResults().length}
                currentPage={currentPage}
                totalPages={Math.ceil(getFilteredResults().length / 25)}
                selectedServiceType={selectedServiceType}
                selectedState={selectedState}
                zipCode={zipCode}
                latitude={latitude}
                longitude={longitude}
                cityState={cityState}
                serviceDefinitions={[]} // You can populate this if needed
                states={getSortedStates()}
                handlePageChange={handlePageChange}
                resetSearch={resetSearch}
                onRemoveServiceType={handleRemoveServiceType}
                onRemoveState={handleRemoveState}
                onRemoveZipCode={handleRemoveZipCode}
                onClearAll={handleClearAll}
                onFilterByServiceType={handleFilterByServiceType}
                onClientFilter={handleClientFilter}
                onClearClientFilter={handleClearClientFilter}
                onToggleSearchForm={handleToggleSearchForm}
                onProductFavorite={handleProductFavorite}
                favoritedProducts={favoritedProducts}
              />
            </div>
          </div>
        </section>
      )}

      {/* No Results State */}
      {!isSearching && searchResults.length === 0 && searchParams.get('q') && (
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600 mb-8">
                We couldn't find any services matching "{searchParams.get('q')}". Try adjusting your search terms.
              </p>
              
              {/* Popular Searches */}
              <div className="mt-8">
                <p className="text-gray-600 mb-4 font-bold">Popular Searches:</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {[
                    'Dog Parks close to me',
                    'Dog Parks in Indiana',
                    'Groomers in Indianapolis',
                    'Veterinarians in Indiana',
                    'Dog Trainers near me',
                    'Boarding & Daycare'
                  ].map((search, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        const params = new URLSearchParams(searchParams.toString());
                        params.set('q', search);
                        router.push(`/search-results?${params.toString()}`);
                      }}
                      className="px-4 py-2 bg-white text-gray-700 rounded-full border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 text-sm"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Initial State - No Search Yet */}
      {!searchParams.get('q') && searchResults.length === 0 && !isSearching && (
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to search?</h3>
              <p className="text-gray-600">
                Use the search box above to find dog services, products, and more in your area.
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
