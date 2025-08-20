'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SearchFormV2 } from '@/app/homepage-v2/components/SearchFormV2';
import { SearchResultsDisplay } from '@/components/search/SearchResultsDisplay';
import { getSortedStates } from '@/lib/states';
import { useLocationResolver } from '@/hooks/useLocationResolver';

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

  // Check if we have search parameters on page load
  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      handleSearchSubmit(query);
    }
  }, [searchParams]);

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
        let requestBody: any = {
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
          
          // Client-side pagination - show first 25 results
          const itemsPerPage = 25;
          const startIndex = (currentPage - 1) * itemsPerPage;
          const endIndex = startIndex + itemsPerPage;
          const paginatedResults = allResults.slice(startIndex, endIndex);
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
    
    // Client-side pagination - slice the results
    const itemsPerPage = 25;
    const startIndex = (newPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedResults = allSearchResults.slice(startIndex, endIndex);
    
    console.log('Pagination calculation:', {
      newPage,
      startIndex,
      endIndex,
      paginatedResultsCount: paginatedResults.length
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
    
    // Clear URL parameters
    router.push('/search-results');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Section */}
      <section className="bg-white border-b border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <SearchFormV2
              onSearch={handleSearchSubmit}
              initialValue={searchParams.get('q') || ''}
              isLoading={isSearching}
              resetKey={resetKey}
            />
          </div>
        </div>
      </section>

      {/* Search Results Section */}
      {searchResults.length > 0 && (
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">

              
              <SearchResultsDisplay
                searchResults={searchResults}
                allSearchResults={allSearchResults}
                isSearching={isSearching}
                totalResults={totalResults}
                currentPage={currentPage}
                totalPages={totalPages}
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
                onClientFilter={handleClientFilter}
                onToggleSearchForm={handleToggleSearchForm}
              />
            </div>
          </div>
        </section>
      )}

      {/* No Results State */}
      {!isSearching && searchResults.length === 0 && searchParams.get('q') && (
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any services matching "{searchParams.get('q')}". Try adjusting your search terms.
              </p>
              <button
                onClick={resetSearch}
                className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors duration-200"
              >
                Try a new search
              </button>
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
