'use client';

import { motion } from 'framer-motion';
import { Search, Navigation } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { ServiceDefinition } from '@/lib/types';
import { USState } from '@/lib/states';

interface SearchHeaderProps {
  isSearching: boolean;
  totalResults: number;
  selectedServiceType: string;
  selectedState: string;
  serviceDefinitions: ServiceDefinition[];
  states: USState[];
  sortByDistance: boolean;
  setSortByDistance: (value: boolean) => void;
  isLoadingLocation: boolean;
  locationError: string | null;
}

export function SearchHeader({
  isSearching,
  totalResults,
  selectedServiceType,
  selectedState,
  serviceDefinitions,
  states,
  sortByDistance,
  setSortByDistance,
  isLoadingLocation,
  locationError
}: SearchHeaderProps) {
  return (
    <div className="flex flex-col space-y-4 mb-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {isSearching ? (
            <span className="flex items-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="mr-2"
              >
                <Search className="h-5 w-5 text-emerald-500" />
              </motion.div>
              Searching...
            </span>
          ) : totalResults > 0 ? (
            `Found ${totalResults} service${totalResults !== 1 ? 's' : ''}`
          ) : (
            'No services found'
          )}
        </h2>
        
        {/* Filter summary */}
        <div className="text-sm text-gray-600">
          {selectedServiceType && serviceDefinitions.find(d => d.service_value === selectedServiceType) && (
            <span className="inline-block bg-emerald-100 text-emerald-800 rounded-full px-3 py-1 mr-2 mb-2">
              {serviceDefinitions.find(d => d.service_value === selectedServiceType)?.service_name}
            </span>
          )}
          {selectedState && (
            <span className="inline-block bg-blue-100 text-blue-800 rounded-full px-3 py-1 mb-2">
              {states.find(s => s.abbreviation === selectedState)?.name}
            </span>
          )}
        </div>
      </div>
      
      {/* Sort by distance toggle */}
      {totalResults > 0 && (
        <div className="flex items-center justify-end space-x-2">
          <div className="flex items-center space-x-2">
            <label htmlFor="sort-by-distance" className="text-sm font-medium text-gray-700 flex items-center">
              <Navigation className="h-4 w-4 mr-1 text-emerald-500" />
              Sort by distance
            </label>
            <Switch
              id="sort-by-distance"
              checked={sortByDistance}
              onCheckedChange={(checked) => setSortByDistance(checked)}
              disabled={isLoadingLocation}
              aria-label="Sort by distance"
            />
          </div>
          
          {isLoadingLocation && (
            <span className="text-xs text-gray-500 animate-pulse">
              Getting your location...
            </span>
          )}
          
          {locationError && (
            <span className="text-xs text-red-500">
              {locationError}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
