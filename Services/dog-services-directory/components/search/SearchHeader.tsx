'use client';

import { motion } from 'framer-motion';
import { Search, X, Map } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { ServiceDefinition } from '@/lib/types';
import { USState } from '@/lib/states';

interface SearchHeaderProps {
  isSearching: boolean;
  totalResults: number;
  selectedServiceType: string;
  selectedState: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
  cityState?: string;
  serviceDefinitions: ServiceDefinition[];
  states: USState[];
  sortByDistance: boolean;
  setSortByDistance: (value: boolean) => void;
  isLoadingLocation: boolean;
  locationError: string | null;
  onClearAll?: () => void;
  onToggleSearchForm?: () => void;
  resetSearch?: () => void;
}

export function SearchHeader({
  isSearching,
  totalResults,
  selectedServiceType,
  selectedState,
  zipCode,
  latitude,
  longitude,
  cityState,
  serviceDefinitions,
  states,
  sortByDistance,
  setSortByDistance,
  isLoadingLocation,
  locationError,
  onClearAll,
  onToggleSearchForm,
  resetSearch
}: SearchHeaderProps) {
  return (
    <div className="flex flex-col space-y-4 mb-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
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
          
          {/* Location tag - show for state, zip code, or My Location */}
          {(selectedState || zipCode || (latitude && longitude)) && (
            <button
              onClick={() => {
                resetSearch?.();
                onToggleSearchForm?.();
              }}
              className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 hover:bg-blue-200 px-3 py-1 rounded-full text-sm font-medium transition-colors"
            >
              <Map className="h-3 w-3" />
              <span>
                {selectedState 
                  ? states.find(s => s.abbreviation === selectedState)?.name || selectedState
                  : zipCode
                  ? `ZIP: ${zipCode}`
                  : cityState || 'My Location'
                }
              </span>
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
        
        {/* Filter summary removed - now handled by FilterTagBar component */}
      </div>
      
      {/* Distance toggle removed per requirement */}
    </div>
  );
}
