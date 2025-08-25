'use client';

import { Service, ServiceDefinition, Product } from '@/lib/types';
import { USState } from '@/lib/states';
import { ServicesList } from './ServicesList';
import { UnifiedResultsList } from './UnifiedResultsList';
import { Pagination } from './Pagination';
import { SearchSkeleton } from './SearchSkeleton';
import { ServicesMap } from '@/components/maps/ServicesMap';
import { useState } from 'react';
import { LayoutGrid, Map as MapIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface SearchResultsDisplayProps {
  searchResults: Array<Service | Product>;
  allSearchResults: Array<Service | Product>;
  isSearching: boolean;
  totalResults: number;
  currentPage: number;
  totalPages: number;
  selectedServiceType: string;
  selectedState: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
  cityState?: string;
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
  onToggleSearchForm?: () => void;
  onProductFavorite?: (productId: number) => void;
  favoritedProducts?: number[];
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
  latitude,
  longitude,
  cityState,
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
  onToggleSearchForm,
  onProductFavorite,
  favoritedProducts = [],
}: SearchResultsDisplayProps) {
  // Client-side filtering state
  const [clientFilteredResults, setClientFilteredResults] = useState<Array<Service | Product>>([]);
  const [isClientFiltered, setIsClientFiltered] = useState(false);
  const [activeClientFilter, setActiveClientFilter] = useState<string | null>(null);

  // Toggle between card and map views
  const [view, setView] = useState<'cards' | 'map'>('cards');

  // Prefetch next page on hover
  const handlePageHover = (pageNumber: number) => {
    // This is a placeholder for now since we don't have access to prefetchNextPage
    // We can add it later if needed
  };

  // Client-side filtering handlers
  const handleClientFilter = (serviceType: string) => {
    const filtered = allSearchResults
      .filter(result => 'service_type' in result && result.service_type === serviceType)
      .sort((a, b) => a.name.localeCompare(b.name));
    setClientFilteredResults(filtered);
    setIsClientFiltered(true);
    setActiveClientFilter(serviceType);
  };

  const handleClearClientFilter = () => {
    setIsClientFiltered(false);
    setClientFilteredResults([]);
    setActiveClientFilter(null);
  };

  // Determine which results to display
  let displayResults: Array<Service | Product>;
  let displayTotal: number;

  if (isClientFiltered) {
    displayResults = clientFilteredResults;
    displayTotal = clientFilteredResults.length;
  } else {
    displayResults = searchResults;
    displayTotal = totalResults;
  }

  // Only show skeleton when searching and we don't have any results to display
  if (isSearching && searchResults.length === 0 && allSearchResults.length === 0) {
    return <SearchSkeleton />;
  }

  const hasServices = displayResults.some(result => 'service_type' in result || 'serviceType' in result);
  const hasProducts = displayResults.some(result => 'product_type' in result || 'productType' in result || 'price' in result || 'sku' in result);

  return (
    <div className="space-y-6">
      {/* FilterTagBar removed - filter tags are now in the header */}

      {/* Services Count and View Toggle - Now on same row */}
      <div className="flex items-center justify-between">
        {/* Services Count Label */}
        <div className="text-lg font-medium text-gray-900">
          {displayResults.length > 0 && (
            <>
              {hasServices && hasProducts ? 'All Results' : 
               hasServices ? `Services (${displayResults.filter(result => 
                 'service_type' in result || 
                 'serviceType' in result
               ).length})` :
               hasProducts ? `Products (${displayResults.filter(result => 
                 'product_type' in result || 
                 'productType' in result ||
                 'price' in result ||
                 'sku' in result
               ).length})` : 'Results'
              }
            </>
          )}
        </div>

        {/* View Toggle */}
        <div className="flex gap-2">
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
      </div>

      {view === 'map' ? (
        <ServicesMap services={displayResults.filter((result): result is Service => 'service_type' in result)} />
      ) : (
        <UnifiedResultsList 
          results={displayResults}
          onProductFavorite={onProductFavorite}
          favoritedProducts={favoritedProducts}
        />
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