'use client';

import { useState } from 'react';
import { useServicesQuery, SearchState } from '@/hooks/useServicesQuery';
import { SearchForm } from './SearchForm';
import { ServicesList } from './ServicesList';
import { Pagination } from './Pagination';
import { SearchSkeleton } from './SearchSkeleton';
import { SearchFormSkeleton } from './SearchFormSkeleton';
import { ErrorMessage } from '../ui/ErrorMessage';
import { SearchHeader } from './SearchHeader';
import { SEARCH_CONSTANTS } from '@/lib/constants';
import { useServiceDefinitions } from '@/hooks/useServiceDefinitions';
import { US_STATES } from '@/lib/states';

export function ServiceSearchResults() {
  const [searchState, setSearchState] = useState<SearchState>({
    selectedServiceType: '',
    selectedState: '',
    zipCode: '',
    page: 1,
  });

  const [sortByDistance, setSortByDistance] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const { data: serviceDefinitions, isLoading: isLoadingDefinitions, error: definitionsError } = useServiceDefinitions();

  const {
    data,
    isLoading,
    isError,
    error,
    prefetchNextPage,
  } = useServicesQuery(searchState);

  const handleSearch = (newParams: Partial<SearchState>) => {
    setSearchState(prev => ({
      ...prev,
      ...newParams,
      page: 1, // Reset to first page on new search
    }));
  };

  const handlePageChange = (newPage: number) => {
    setSearchState(prev => ({
      ...prev,
      page: newPage,
    }));
  };

  // Prefetch next page on hover
  const handlePageHover = (pageNumber: number) => {
    if (pageNumber === searchState.page + 1) {
      prefetchNextPage();
    }
  };

  // Show error if service definitions failed to load
  if (definitionsError) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <ErrorMessage 
          message="Failed to load service types. Please refresh the page to try again." 
          error={definitionsError} 
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {isLoadingDefinitions ? (
        <SearchFormSkeleton />
      ) : (
        <SearchForm onSearch={handleSearch} />
      )}
      
      {isLoading && <SearchSkeleton />}
      
      {isError && (
        <ErrorMessage 
          message="Failed to load services. Please try again." 
          error={error} 
        />
      )}
      
      {data && !isLoadingDefinitions && (
        <>
          <SearchHeader
            isSearching={isLoading}
            totalResults={data.total}
            selectedServiceType={searchState.selectedServiceType}
            selectedState={searchState.selectedState}
            zipCode={searchState.zipCode}
            serviceDefinitions={serviceDefinitions || []}
            states={US_STATES}
            sortByDistance={sortByDistance}
            setSortByDistance={setSortByDistance}
            isLoadingLocation={isLoadingLocation}
            locationError={locationError}
          />
          <ServicesList services={data.services} />
          <Pagination
            currentPage={searchState.page}
            totalPages={data.totalPages}
            onPageChange={handlePageChange}
            onPageHover={handlePageHover}
          />
        </>
      )}
    </div>
  );
} 