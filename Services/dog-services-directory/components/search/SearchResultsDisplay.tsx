'use client';

import { Service, ServiceDefinition } from '@/lib/types';
import { USState } from '@/lib/states';
import { ServicesList } from './ServicesList';
import { Pagination } from './Pagination';
import { SearchSkeleton } from './SearchSkeleton';
import { SearchHeader } from './SearchHeader';

interface SearchResultsDisplayProps {
  searchResults: Service[];
  isSearching: boolean;
  totalResults: number;
  currentPage: number;
  totalPages: number;
  selectedServiceType: string;
  selectedState: string;
  serviceDefinitions: ServiceDefinition[];
  states: USState[];
  handlePageChange: (newPage: number) => void;
  resetSearch: () => void;
}

export function SearchResultsDisplay({
  searchResults,
  isSearching,
  totalResults,
  currentPage,
  totalPages,
  selectedServiceType,
  selectedState,
  serviceDefinitions,
  states,
  handlePageChange,
  resetSearch,
}: SearchResultsDisplayProps) {
  // Prefetch next page on hover
  const handlePageHover = (pageNumber: number) => {
    // This is a placeholder for now since we don't have access to prefetchNextPage
    // We can add it later if needed
  };

  if (isSearching) {
    return <SearchSkeleton />;
  }

  return (
    <div className="space-y-6">
      <SearchHeader
        isSearching={isSearching}
        totalResults={totalResults}
        selectedServiceType={selectedServiceType}
        selectedState={selectedState}
        zipCode=""
        serviceDefinitions={serviceDefinitions}
        states={states}
        sortByDistance={false}
        setSortByDistance={() => {}}
        isLoadingLocation={false}
        locationError={null}
      />
      <ServicesList services={searchResults} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onPageHover={handlePageHover}
      />
    </div>
  );
} 