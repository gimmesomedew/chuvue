'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Service, ServiceDefinition } from '@/lib/types';
import { USState } from '@/lib/states';
import { ServiceCard } from './ServiceCard';
import { SearchHeader } from './SearchHeader';
import { Pagination } from './Pagination';
import { SearchInput } from './SearchInput';
import { useLocationSorting } from '@/hooks/useLocationSorting';

interface SearchResultsProps {
  searchResults: Service[];
  isSearching: boolean;
  totalResults: number;
  currentPage: number;
  totalPages: number;
  selectedServiceType: string;
  selectedState: string;
  serviceDefinitions: ServiceDefinition[];
  states: USState[];
  handlePageChange: (page: number) => void;
  resetSearch: () => void;
}

export function SearchResults({
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
  resetSearch
}: SearchResultsProps) {
  // State for search term filtering
  const [searchTerm, setSearchTerm] = useState('');
  
  // Use the custom hook for location-based sorting
  const {
    sortByDistance,
    userLocation,
    isLoading: isLoadingLocation,
    error: locationError,
    displayResults: locationSortedResults,
    toggleSortByDistance
  } = useLocationSorting(searchResults);
  
  // Filter results based on search term
  const filteredResults = useMemo(() => {
    if (!searchTerm.trim()) {
      return locationSortedResults;
    }
    
    const normalizedSearchTerm = searchTerm.toLowerCase().trim();
    
    return locationSortedResults.filter(service => {
      // Search in name, description, address, city
      return (
        service.name.toLowerCase().includes(normalizedSearchTerm) ||
        service.description.toLowerCase().includes(normalizedSearchTerm) ||
        service.address.toLowerCase().includes(normalizedSearchTerm) ||
        service.city.toLowerCase().includes(normalizedSearchTerm)
      );
    });
  }, [locationSortedResults, searchTerm]);
  
  // Handle search term changes
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="search-results-container"
    >
      {/* Search Header with title, filters, and sort toggle */}
      <SearchHeader
        isSearching={isSearching}
        totalResults={totalResults}
        selectedServiceType={selectedServiceType}
        selectedState={selectedState}
        serviceDefinitions={serviceDefinitions}
        states={states}
        sortByDistance={sortByDistance}
        setSortByDistance={toggleSortByDistance}
        isLoadingLocation={isLoadingLocation}
        locationError={locationError}
      />
      
      {/* Search input for filtering results */}
      {searchResults.length > 0 && (
        <div className="mb-6">
          <SearchInput
            onSearch={handleSearch}
            placeholder="Search by name, description, location..."
          />
          {searchTerm && (
            <div className="mt-2 text-sm text-gray-600">
              Found {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''} containing "{searchTerm}"
              {filteredResults.length === 0 && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="ml-2 text-emerald-600 hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Results grid */}
      {searchResults.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredResults.length > 0 ? (
            filteredResults.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                sortByDistance={sortByDistance}
                userLocation={userLocation}
                delay={0.1 * (index % 3)}
              />
            ))
          ) : searchTerm ? (
            <div className="col-span-3 text-center py-16">
              <p className="text-gray-500 mb-4">No services found matching "{searchTerm}".</p>
              <Button variant="outline" onClick={() => setSearchTerm('')}>Clear Search</Button>
            </div>
          ) : null}
        </motion.div>
      ) : !isSearching && (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">No services found matching your criteria.</p>
          <Button variant="outline" onClick={resetSearch}>Reset Filters</Button>
        </div>
      )}
      
      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        isSearching={isSearching}
        handlePageChange={handlePageChange}
      />
    </motion.div>
  );
}
