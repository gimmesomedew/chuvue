'use client';

import { SearchSection } from '@/components/search/SearchSection';
import { SearchResultsDisplay } from '@/components/search/SearchResultsDisplay';
import { FeaturedCarousel } from '@/components/services/FeaturedCarousel';
import { SignUpCallout } from '@/components/search/SignUpCallout';
import { useSearchServices } from '@/hooks/useSearchServices';
import { getSortedStates } from '@/lib/states';
import { SearchState } from '@/hooks/useServicesQuery';
import { useToast } from '@/components/ui/use-toast';

export function HomeContent() {
  const {
    serviceDefinitions,
    isLoadingDefinitions,
    searchState,
    setSearchState,
    searchResults,
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

  const { toast } = useToast();
  const states = getSortedStates();

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
  };

  return (
    <>
      <SearchSection 
        isLoading={isLoadingDefinitions}
        isSearching={isSearching}
        hasSearched={hasSearched}
        onSearch={handleSearchSubmit}
        resetSearch={resetSearch}
      />
      
      {/* Search Results Section */}
      {hasSearched && (
        <section ref={searchResultsRef} className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            {searchResults.length > 0 && <SignUpCallout />}
            <SearchResultsDisplay 
              searchResults={searchResults}
              isSearching={isSearching}
              totalResults={totalResults}
              currentPage={currentPage}
              totalPages={totalPages}
              selectedServiceType={searchState.selectedServiceType}
              selectedState={searchState.selectedState}
              serviceDefinitions={serviceDefinitions}
              states={states}
              handlePageChange={handlePageChange}
              resetSearch={resetSearch}
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