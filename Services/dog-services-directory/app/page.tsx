'use client';

import { Header } from '@/components/Header';
import { SearchSection } from '@/components/search/SearchSection';
import { SearchResults } from '@/components/search/SearchResults';
import { FeaturedCarousel } from '@/components/services/FeaturedCarousel';
import { Footer } from '@/components/Footer';
import { SignUpCallout } from '@/components/search/SignUpCallout';
import { useSearchServices } from '@/hooks/useSearchServices';
import { getSortedStates } from '@/lib/states';

export default function Home() {
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

  const states = getSortedStates();

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      
      <SearchSection 
        serviceDefinitions={serviceDefinitions}
        states={states}
        isLoading={isLoadingDefinitions}
        isSearching={isSearching}
        selectedServiceType={searchState.selectedServiceType}
        selectedState={searchState.selectedState}
        zipCode={searchState.zipCode}
        setSelectedServiceType={(value) => setSearchState({ selectedServiceType: value })}
        setSelectedState={(value) => setSearchState({ selectedState: value })}
        setZipCode={(value) => setSearchState({ zipCode: value })}
        handleSearch={handleSearch}
        resetSearch={resetSearch}
        hasSearched={hasSearched}
      />
      
      {/* Search Results Section */}
      {hasSearched && (
        <section ref={searchResultsRef} className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            {searchResults.length > 0 && <SignUpCallout />}
            <SearchResults 
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
      
      {/* Featured Service Providers Carousel - Only show if not searched */}
      {!hasSearched && (
        <section className="py-16">
          <div className="container mx-auto px-4" data-component-name="Home">
            <FeaturedCarousel />
          </div>
        </section>
      )}
      
      <Footer />
    </main>
  );
}
