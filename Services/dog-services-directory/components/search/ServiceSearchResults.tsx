'use client';

import { useState, useEffect } from 'react';
import { useServicesQuery, SearchState } from '@/hooks/useServicesQuery';
import { SearchForm } from './SearchForm';
import { ServicesList } from './ServicesList';
import { Pagination } from './Pagination';
import { SearchSkeleton } from './SearchSkeleton';
import { SearchFormSkeleton } from './SearchFormSkeleton';
import { ErrorMessage } from '../ui/ErrorMessage';
import { SearchHeader } from './SearchHeader';
import { FilterTagBar } from './FilterTagBar';
import { SEARCH_CONSTANTS } from '@/lib/constants';
import { useServiceDefinitions } from '@/hooks/useServiceDefinitions';
import { US_STATES } from '@/lib/states';
import { Service } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import { servicesApi } from '@/lib/api/services';

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
  const [clientFilteredServices, setClientFilteredServices] = useState<Service[]>([]);
  const [isClientFiltered, setIsClientFiltered] = useState(false);
  const [activeClientFilter, setActiveClientFilter] = useState<string | null>(null);
  const [allSearchResults, setAllSearchResults] = useState<Service[]>([]);

  const { data: serviceDefinitions, isLoading: isLoadingDefinitions, error: definitionsError } = useServiceDefinitions();

  const {
    data,
    isLoading,
    isError,
    error,
    prefetchNextPage,
  } = useServicesQuery(searchState);

  // Fetch all results for client-side filtering
  const { data: allResultsData } = useQuery({
    queryKey: ['allServices', searchState.selectedServiceType, searchState.selectedState, searchState.zipCode],
    queryFn: () => servicesApi.searchAll({
      serviceType: searchState.selectedServiceType,
      state: searchState.selectedState,
      zipCode: searchState.zipCode,
      latitude: searchState.latitude,
      longitude: searchState.longitude,
      radiusMiles: searchState.radiusMiles,
    }),
    enabled: Boolean(searchState.selectedServiceType || searchState.selectedState || searchState.zipCode),
  });

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

  // Filter removal handlers
  const handleRemoveServiceType = () => {
    setSearchState(prev => ({
      ...prev,
      selectedServiceType: '',
      page: 1,
    }));
    setIsClientFiltered(false);
    setClientFilteredServices([]);
    setActiveClientFilter(null);
  };

  const handleRemoveState = () => {
    setSearchState(prev => ({
      ...prev,
      selectedState: '',
      page: 1,
    }));
  };

  const handleRemoveZipCode = () => {
    setSearchState(prev => ({
      ...prev,
      zipCode: '',
      page: 1,
    }));
  };

  const handleClearAll = () => {
    setSearchState(prev => ({
      ...prev,
      selectedServiceType: '',
      selectedState: '',
      zipCode: '',
      page: 1,
    }));
    setIsClientFiltered(false);
    setClientFilteredServices([]);
    setActiveClientFilter(null);
  };

  const handleClientFilter = (serviceType: string) => {
    if (allSearchResults.length > 0) {
      const filtered = allSearchResults
        .filter(service => service.service_type === serviceType)
        .sort((a, b) => a.name.localeCompare(b.name));
      setClientFilteredServices(filtered);
      setIsClientFiltered(true);
      setActiveClientFilter(serviceType);
    }
  };

  const handleClearClientFilter = () => {
    setIsClientFiltered(false);
    setClientFilteredServices([]);
    setActiveClientFilter(null);
  };

  // Update allSearchResults when allResultsData changes
  useEffect(() => {
    if (allResultsData?.services) {
      setAllSearchResults(allResultsData.services);
    }
  }, [allResultsData]);

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

  // Determine which services to display
  const displayServices = isClientFiltered ? clientFilteredServices : (data?.services || []);
  const displayTotal = isClientFiltered ? clientFilteredServices.length : (data?.total || 0);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {isLoadingDefinitions ? (
        <SearchFormSkeleton />
      ) : (
        <SearchForm onSearch={handleSearch} />
      )}
      
      {/* Only show skeleton when loading and we don't have any results to display */}
      {isLoading && !data && allSearchResults.length === 0 && (
        <SearchSkeleton />
      )}
      
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
            totalResults={displayTotal}
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
          <FilterTagBar
            selectedServiceType={searchState.selectedServiceType}
            selectedState={searchState.selectedState}
            zipCode={searchState.zipCode}
            serviceDefinitions={serviceDefinitions || []}
            states={US_STATES}
            searchResults={data.services}
            allSearchResults={allSearchResults}
            isClientFiltered={isClientFiltered}
            activeClientFilter={activeClientFilter}
            onRemoveServiceType={handleRemoveServiceType}
            onRemoveState={handleRemoveState}
            onRemoveZipCode={handleRemoveZipCode}
            onClearAll={handleClearAll}
            onClientFilter={handleClientFilter}
            onClearClientFilter={handleClearClientFilter}
          />
          <ServicesList services={displayServices} />
          {/* Only show pagination when not client-filtered */}
          {!isClientFiltered && (
            <Pagination
              currentPage={searchState.page}
              totalPages={data.totalPages}
              onPageChange={handlePageChange}
              onPageHover={handlePageHover}
            />
          )}
        </>
      )}
    </div>
  );
} 