'use client';

import { Service, ServiceDefinition } from '@/lib/types';
import { USState } from '@/lib/states';
import { ServicesList } from './ServicesList';
import { Pagination } from './Pagination';
import { SearchSkeleton } from './SearchSkeleton';
import { SearchHeader } from './SearchHeader';
import { FilterTagBar } from './FilterTagBar';
import { ServicesMap } from '@/components/maps/ServicesMap';
import { useState } from 'react';
import { LayoutGrid, Map as MapIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface SearchResultsDisplayProps {
  searchResults: Service[];
  allSearchResults: Service[];
  isSearching: boolean;
  totalResults: number;
  currentPage: number;
  totalPages: number;
  selectedServiceType: string;
  selectedState: string;
  zipCode?: string;
  serviceDefinitions: ServiceDefinition[];
  states: USState[];
  handlePageChange: (newPage: number) => void;
  resetSearch: () => void;
  onRemoveServiceType?: () => void;
  onRemoveState?: () => void;
  onRemoveZipCode?: () => void;
  onClearAll?: () => void;
  onFilterByServiceType?: (serviceType: string) => void;
  onClientFilter?: (serviceType: string) => void;
  onClearClientFilter?: () => void;
}

export function SearchResultsDisplay({
  searchResults,
  allSearchResults,
  isSearching,
  totalResults,
  currentPage,
  totalPages,
  selectedServiceType,
  selectedState,
  zipCode = '',
  serviceDefinitions,
  states,
  handlePageChange,
  resetSearch,
  onRemoveServiceType,
  onRemoveState,
  onRemoveZipCode,
  onClearAll,
  onFilterByServiceType,
  onClientFilter,
  onClearClientFilter,
}: SearchResultsDisplayProps) {
  // Client-side filtering state
  const [clientFilteredServices, setClientFilteredServices] = useState<Service[]>([]);
  const [isClientFiltered, setIsClientFiltered] = useState(false);
  const [activeClientFilter, setActiveClientFilter] = useState<string | null>(null);

  // Prefetch next page on hover
  const handlePageHover = (pageNumber: number) => {
    // This is a placeholder for now since we don't have access to prefetchNextPage
    // We can add it later if needed
  };

  // Toggle between card and map views
  const [view, setView] = useState<'cards' | 'map'>('cards');

  // Client-side filtering handlers
  const handleClientFilter = (serviceType: string) => {
    const filtered = allSearchResults
      .filter(service => service.service_type === serviceType)
      .sort((a, b) => a.name.localeCompare(b.name));
    setClientFilteredServices(filtered);
    setIsClientFiltered(true);
    setActiveClientFilter(serviceType);
  };

  const handleClearClientFilter = () => {
    setIsClientFiltered(false);
    setClientFilteredServices([]);
    setActiveClientFilter(null);
  };

  // Determine which services to display
  const displayServices = isClientFiltered ? clientFilteredServices : searchResults;
  const displayTotal = isClientFiltered ? clientFilteredServices.length : totalResults;

  // Only show skeleton when searching and we don't have any results to display
  if (isSearching && searchResults.length === 0 && allSearchResults.length === 0) {
    return <SearchSkeleton />;
  }

  return (
    <div className="space-y-6">
      <SearchHeader
        isSearching={isSearching}
        totalResults={displayTotal}
        selectedServiceType={selectedServiceType}
        selectedState={selectedState}
        zipCode={zipCode}
        serviceDefinitions={serviceDefinitions}
        states={states}
        sortByDistance={false}
        setSortByDistance={() => {}}
        isLoadingLocation={false}
        locationError={null}
      />
      
      <FilterTagBar
        selectedServiceType={selectedServiceType}
        selectedState={selectedState}
        zipCode={zipCode}
        serviceDefinitions={serviceDefinitions}
        states={states}
        searchResults={searchResults}
        allSearchResults={allSearchResults}
        isClientFiltered={isClientFiltered}
        activeClientFilter={activeClientFilter}
        onRemoveServiceType={onRemoveServiceType || (() => {})}
        onRemoveState={onRemoveState || (() => {})}
        onRemoveZipCode={onRemoveZipCode || (() => {})}
        onClearAll={onClearAll || (() => {})}
        onClientFilter={handleClientFilter}
        onClearClientFilter={handleClearClientFilter}
      />

      {/* View Toggle */}
      <TooltipProvider>
        <div className="flex justify-end gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Card view"
                onClick={() => setView('cards')}
                className={view === 'cards' ? 'bg-secondary text-white' : ''}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Grid View</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Map view"
                onClick={() => setView('map')}
                className={view === 'map' ? 'bg-secondary text-white' : ''}
              >
                <MapIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Map View</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      {view === 'map' ? (
        <ServicesMap services={displayServices} />
      ) : (
        <ServicesList services={displayServices} />
      )}

      {/* Only show pagination when not client-filtered */}
      {!isClientFiltered && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onPageHover={handlePageHover}
        />
      )}
    </div>
  );
} 