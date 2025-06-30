'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Service, ServiceDefinition } from '@/lib/types';
import { USState } from '@/lib/states';
import { ServiceCard } from './ServiceCard';
import { SearchHeader } from './SearchHeader';
import { Pagination } from './Pagination';
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
  // Use the custom hook for location-based sorting
  const {
    sortByDistance,
    userLocation,
    isLoading: isLoadingLocation,
    error: locationError,
    displayResults: locationSortedResults,
    toggleSortByDistance
  } = useLocationSorting(searchResults);
  
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
      
      {/* Results grid */}
      {searchResults.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto"
          style={{ maxWidth: '1400px' }}
        >
          {locationSortedResults.map((service, index) => (
            <div key={service.id} className="max-w-[400px] w-full mx-auto">
              <ServiceCard
                service={service}
                sortByDistance={sortByDistance}
                userLocation={userLocation}
                delay={0.1 * (index % 3)}
              />
            </div>
          ))}
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
