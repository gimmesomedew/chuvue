'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ServiceDefinition } from '@/lib/types';
import { USState } from '@/lib/states';

interface SearchFormProps {
  serviceDefinitions: ServiceDefinition[];
  states: USState[];
  isLoading: boolean;
  isSearching: boolean;
  selectedServiceType: string;
  selectedState: string;
  zipCode: string;
  setSelectedServiceType: (value: string) => void;
  setSelectedState: (value: string) => void;
  setZipCode: (value: string) => void;
  handleSearch: () => void;
  resetSearch: () => void;
  hasSearched: boolean;
}

type LocationType = 'state' | 'zip';

export function SearchForm({
  serviceDefinitions,
  states,
  isLoading,
  isSearching,
  selectedServiceType,
  selectedState,
  zipCode,
  setSelectedServiceType,
  setSelectedState,
  setZipCode,
  handleSearch,
  resetSearch,
  hasSearched
}: SearchFormProps) {
  const [locationType, setLocationType] = useState<LocationType>('state');

  // Handle location type change
  const handleLocationTypeChange = (type: LocationType) => {
    setLocationType(type);
    // Clear the other search parameter when switching types
    if (type === 'state') {
      setZipCode('');
    } else {
      setSelectedState('');
    }
  };

  const handleLocationInput = (value: string) => {
    if (locationType === 'state') {
      setSelectedState(value);
    } else {
      setZipCode(value);
    }
  };

  const getLocationInputValue = () => {
    return locationType === 'state' ? selectedState : zipCode;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="md:col-span-4"
        >
          <div className="flex items-center mb-2">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: isLoading ? [0, 360] : 360 }}
              transition={{ 
                duration: 1, 
                delay: 0.5,
                repeat: isLoading ? Infinity : 0,
                repeatDelay: 0.5
              }}
            >
              <Search className="h-5 w-5 text-emerald-500 mr-2" />
            </motion.div>
            <span className="font-medium">What services?</span>
            {isLoading && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="ml-2 text-xs text-emerald-500"
              >
                Loading...
              </motion.span>
            )}
          </div>
          <div className="relative">
            <motion.select 
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="w-full p-3 border rounded-md appearance-none bg-gray-50 text-gray-700 pr-10"
              disabled={isLoading || isSearching}
              value={selectedServiceType}
              onChange={(e) => setSelectedServiceType(e.target.value)}
            >
              <option value="">All Categories</option>
              {isLoading ? (
                <option disabled>Loading categories...</option>
              ) : serviceDefinitions.length > 0 ? (
                serviceDefinitions.map((definition) => (
                  <option key={definition.id} value={definition.service_value}>
                    {definition.service_name}
                  </option>
                ))
              ) : (
                <option disabled>No categories found</option>
              )}
            </motion.select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="md:col-span-6"
        >
          <div className="flex items-center mb-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, delay: 0.6 }}
            >
              <MapPin className="h-5 w-5 text-emerald-500 mr-2" />
            </motion.div>
            <span className="font-medium">What Location?</span>
          </div>
          <div className="flex items-center space-x-2">
            {/* Segmented Control */}
            <div className="flex rounded-md overflow-hidden border border-gray-200">
              <button
                onClick={() => handleLocationTypeChange('state')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  locationType === 'state'
                    ? 'bg-[#22cc88] text-white'
                    : 'bg-[#f0f0f0] text-gray-600 hover:bg-gray-100'
                }`}
              >
                State
              </button>
              <button
                onClick={() => handleLocationTypeChange('zip')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  locationType === 'zip'
                    ? 'bg-[#22cc88] text-white'
                    : 'bg-[#f0f0f0] text-gray-600 hover:bg-gray-100'
                }`}
              >
                Zip Code
              </button>
            </div>

            {/* Dynamic Input Field */}
            <div className="flex-1">
              {locationType === 'state' ? (
                <motion.select 
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="w-full p-3 border rounded-md appearance-none bg-gray-50 text-gray-700 pr-10"
                  value={selectedState}
                  onChange={(e) => handleLocationInput(e.target.value)}
                >
                  <option value="">Select a state</option>
                  {states.map((state) => (
                    <option key={state.abbreviation} value={state.abbreviation}>
                      {state.name}
                    </option>
                  ))}
                </motion.select>
              ) : (
                <motion.input 
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  type="text"
                  placeholder="Enter zip code"
                  className="w-full p-3 border rounded-md bg-gray-50 text-gray-700"
                  maxLength={5}
                  pattern="[0-9]*"
                  value={zipCode}
                  onChange={(e) => handleLocationInput(e.target.value)}
                />
              )}
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="md:col-span-2 flex items-end"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full"
          >
            <Button 
              className="w-full bg-emerald-500 hover:bg-emerald-600 h-12 text-white"
              onClick={handleSearch}
              disabled={isSearching}
            >
              {isSearching ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="mr-2"
                  >
                    <Search className="h-5 w-5" />
                  </motion.div>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </>
              )}
            </Button>
          </motion.div>
        </motion.div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="mt-4"
      >
        <motion.button 
          whileHover={{ scale: 1.05 }}
          className="text-emerald-500 text-sm hover:underline"
          onClick={resetSearch}
          disabled={isSearching || (!hasSearched && !selectedState && !selectedServiceType)}
        >
          Reset Search
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
