'use client';

import { Service, ServiceDefinition } from '@/lib/types';
import { USState } from '@/lib/states';
import { ServicesList } from './ServicesList';
import { Pagination } from './Pagination';
import { SearchSkeleton } from './SearchSkeleton';
import { SearchHeader } from './SearchHeader';
import { ServicesMap } from '@/components/maps/ServicesMap';
import { useState } from 'react';
import { LayoutGrid, Map as MapIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

  // Toggle between card and map views
  const [view, setView] = useState<'cards' | 'map'>('cards');

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

      {/* View Toggle */}
      <div className="flex justify-end gap-2">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Card view"
          onClick={() => setView('cards')}
          className={view === 'cards' ? 'bg-emerald-50 text-emerald-600' : ''}
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Map view"
          onClick={() => setView('map')}
          className={view === 'map' ? 'bg-emerald-50 text-emerald-600' : ''}
        >
          <MapIcon className="h-4 w-4" />
        </Button>
      </div>

      {view === 'map' ? (
        <ServicesMap services={searchResults} />
      ) : (
        <ServicesList services={searchResults} />
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onPageHover={handlePageHover}
      />
    </div>
  );
} 