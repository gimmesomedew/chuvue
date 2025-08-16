'use client';

import { useState, useEffect } from 'react';
import { SearchSection } from '@/components/search/SearchSection';
import { SearchResultsDisplay } from '@/components/search/SearchResultsDisplay';
import { FeaturedCarousel } from '@/components/services/FeaturedCarousel';
import { SignUpCallout } from '@/components/search/SignUpCallout';
import { useSearchServices } from '@/hooks/useSearchServices';
import { useSearchParams } from 'next/navigation';
import { getSortedStates } from '@/lib/states';
import { SearchState } from '@/hooks/useServicesQuery';
import { useToast } from '@/components/ui/use-toast';

export function HomeContent() {
  const [isSearchFormCollapsed, setIsSearchFormCollapsed] = useState(false);
  
  const {
    serviceDefinitions,
    isLoadingDefinitions,
    searchState,
    setSearchState,
    searchResults,
    allSearchResults,
    isSearching,
    hasSearched,
    currentPage,
    totalPages,
    totalResults,
    handleSearch,
    handlePageChange,
    resetSearch,
    searchResultsRef
  } = useSearchServices();

  // Get initial service type from query string
  const searchParams = useSearchParams();
  const initialServiceType = searchParams?.get('type') ?? '';

  const { toast } = useToast();
  const states = getSortedStates();

  // Auto-scroll to search results when they appear
  useEffect(() => {
    if (hasSearched && searchResultsRef.current) {
      // Smooth scroll to the search results section
      searchResultsRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }, [hasSearched]);

  const handleSearchSubmit = async (params: Partial<SearchState>) => {
    // Check if at least one search parameter is provided
    if (!params.selectedServiceType && !params.selectedState && !params.zipCode && params.latitude === undefined) {
      toast({
        title: "Search Parameters Required",
        description: "Please select a service type, state, or enter a ZIP code to search.",
        variant: "destructive"
      });
      return;
    }

    // If both state and zip code are provided, prioritize zip code
    if (params.selectedState && params.zipCode) {
      params.selectedState = '';
    }

    setSearchState(params);
    await handleSearch(params);
    
    // Hide the search form after performing a search
    setIsSearchFormCollapsed(true);
  };

  // Filter removal handlers
  const handleRemoveServiceType = () => {
    setSearchState({
      selectedServiceType: '',
      latitude: undefined,
      longitude: undefined,
      radiusMiles: undefined,
    });
  };

  const handleRemoveState = () => {
    setSearchState({
      selectedState: '',
      latitude: undefined,
      longitude: undefined,
      radiusMiles: undefined,
    });
  };

  const handleRemoveZipCode = () => {
    setSearchState({
      zipCode: '',
      latitude: undefined,
      longitude: undefined,
      radiusMiles: undefined,
    });
  };

  const handleClearAll = () => {
    setSearchState({
      selectedServiceType: '',
      selectedState: '',
      zipCode: '',
      latitude: undefined,
      longitude: undefined,
      radiusMiles: undefined,
    });
    // Show the search form when clearing filters
    setIsSearchFormCollapsed(false);
  };

  const handleClientFilter = (serviceType: string) => {
    // This will be handled by the SearchResultsDisplay component
    // We don't need to do anything here for client-side filtering
  };

  return (
    <>
      <SearchSection 
        isLoading={isLoadingDefinitions}
        isSearching={isSearching}
        hasSearched={hasSearched}
        onSearch={handleSearchSubmit}
        resetSearch={resetSearch}
        initialSelectedServiceType={initialServiceType}
        onToggleSearchForm={() => {
          setIsSearchFormCollapsed(!isSearchFormCollapsed);
        }}
        isCollapsed={isSearchFormCollapsed}
      />
      
      {/* Search Results Section */}
      {hasSearched && (
        <section ref={searchResultsRef} className={`${searchResults.length > 0 ? 'pt-8 pb-16' : 'py-8'} bg-gray-50`}>
          <div className="container mx-auto px-4">
            {searchResults.length > 0 && <SignUpCallout />}
            <SearchResultsDisplay 
              searchResults={searchResults}
              allSearchResults={allSearchResults}
              isSearching={isSearching}
              totalResults={totalResults}
              currentPage={currentPage}
              totalPages={totalPages}
              selectedServiceType={searchState.selectedServiceType}
              selectedState={searchState.selectedState}
              zipCode={searchState.zipCode}
              latitude={searchState.latitude}
              longitude={searchState.longitude}
              cityState={searchState.cityState}
              serviceDefinitions={serviceDefinitions}
              states={states}
              handlePageChange={handlePageChange}
              resetSearch={resetSearch}
              onRemoveServiceType={handleRemoveServiceType}
              onRemoveState={handleRemoveState}
              onRemoveZipCode={handleRemoveZipCode}
              onClearAll={handleClearAll}
              onClientFilter={handleClientFilter}
              onToggleSearchForm={() => {
                setIsSearchFormCollapsed(!isSearchFormCollapsed);
              }}
            />
          </div>
        </section>
      )}
      
      {/* Featured Service Providers Carousel - Disabled */}
      {false && !hasSearched && (
        <section className="py-16">
          <div className="container mx-auto px-4" data-component-name="Home">
            <FeaturedCarousel />
          </div>
        </section>
      )}
    </>
  );
} 