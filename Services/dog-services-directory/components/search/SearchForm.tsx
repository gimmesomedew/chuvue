'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ServiceDefinition } from '@/lib/types';
import { USState } from '@/lib/states';

type LocationType = 'state' | 'zip';

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

interface LocationToggleProps {
  locationType: LocationType;
  onTypeChange: (type: LocationType) => void;
  disabled?: boolean;
}

const LocationToggle: React.FC<LocationToggleProps> = ({ locationType, onTypeChange, disabled }) => (
  <div className="flex rounded-md overflow-hidden border border-gray-200">
    <button
      type="button"
      onClick={() => onTypeChange('state')}
      disabled={disabled}
      className={`px-4 py-2 text-sm font-medium transition-colors ${
        locationType === 'state'
          ? 'bg-emerald-500 text-white'
          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
      }`}
    >
      State
    </button>
    <button
      type="button"
      onClick={() => onTypeChange('zip')}
      disabled={disabled}
      className={`px-4 py-2 text-sm font-medium transition-colors ${
        locationType === 'zip'
          ? 'bg-emerald-500 text-white'
          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
      }`}
    >
      Zip Code
    </button>
  </div>
);

interface LocationInputProps {
  type: LocationType;
  state: {
    value: string;
    options: USState[];
  };
  zip: {
    value: string;
    maxLength: number;
  };
  isSearching: boolean;
  onLocationInput: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const LocationInput: React.FC<LocationInputProps> = ({
  type,
  state,
  zip,
  isSearching,
  onLocationInput,
  onKeyDown
}) => {
  if (type === 'state') {
    return (
      <select 
        className="w-full p-3 border rounded-md appearance-none bg-gray-50 text-gray-700 pr-10 transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
        value={state.value}
        onChange={(e) => onLocationInput(e.target.value)}
        disabled={isSearching}
      >
        <option value="">Select a state</option>
        {state.options.map((state) => (
          <option key={state.abbreviation} value={state.abbreviation}>
            {state.name}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input 
      type="text"
      inputMode="numeric"
      placeholder="Enter zip code"
      className="w-full p-3 border rounded-md bg-gray-50 text-gray-700 transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
      value={zip.value}
      onChange={(e) => onLocationInput(e.target.value)}
      onKeyDown={onKeyDown}
      disabled={isSearching}
      maxLength={zip.maxLength}
    />
  );
};

interface ServiceSelectProps {
  value: string;
  isLoading: boolean;
  isSearching: boolean;
  options: ServiceDefinition[];
  onChange: (value: string) => void;
}

const ServiceSelect: React.FC<ServiceSelectProps> = ({
  value,
  isLoading,
  isSearching,
  options,
  onChange
}) => (
  <div className="relative">
    <select 
      className="w-full p-3 border rounded-md appearance-none bg-gray-50 text-gray-700 pr-10 transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
      disabled={isLoading || isSearching}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">All Categories</option>
      {options.map((definition) => (
        <option key={definition.id} value={definition.service_type}>
          {definition.service_name}
        </option>
      ))}
    </select>
    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </div>
  </div>
);

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

  const handleLocationTypeChange = useCallback((type: LocationType) => {
    setLocationType(type);
    if (type === 'state') {
      setZipCode('');
    } else {
      setSelectedState('');
    }
  }, [setZipCode, setSelectedState]);

  const handleLocationInput = useCallback((value: string) => {
    if (locationType === 'state') {
      setSelectedState(value);
    } else {
      const numericValue = value.replace(/[^0-9]/g, '').slice(0, 5);
      setZipCode(numericValue);
    }
  }, [locationType, setSelectedState, setZipCode]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isSearching) {
      e.preventDefault();
      handleSearch();
    }
  }, [handleSearch, isSearching]);

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg">
      <form onSubmit={(e) => {
        e.preventDefault();
        handleSearch();
      }}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Service Type Field */}
          <div className="md:col-span-4">
            <div className="flex items-center mb-2">
              {isLoading ? (
                <Search className="h-5 w-5 text-emerald-500 mr-2 animate-spin" />
              ) : (
                <Search className="h-5 w-5 text-emerald-500 mr-2" />
              )}
              <span className="font-medium">What services?</span>
              {isLoading && (
                <span className="ml-2 text-xs text-emerald-500">Loading...</span>
              )}
            </div>
            <ServiceSelect
              value={selectedServiceType}
              isLoading={isLoading}
              isSearching={isSearching}
              options={serviceDefinitions}
              onChange={setSelectedServiceType}
            />
          </div>

          {/* Location Field */}
          <div className="md:col-span-6">
            <div className="flex items-center mb-2">
              <MapPin className="h-5 w-5 text-emerald-500 mr-2" />
              <span className="font-medium">What Location?</span>
            </div>
            <div className="flex items-center space-x-2">
              <LocationToggle
                locationType={locationType}
                onTypeChange={handleLocationTypeChange}
                disabled={isSearching}
              />
              <div className="flex-1">
                <LocationInput
                  type={locationType}
                  state={{ value: selectedState, options: states }}
                  zip={{ value: zipCode, maxLength: 5 }}
                  isSearching={isSearching}
                  onLocationInput={handleLocationInput}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div className="md:col-span-2 flex items-end">
            <Button 
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 h-12 text-white transition-colors"
              disabled={isSearching}
            >
              {isSearching ? (
                <>
                  <Search className="h-5 w-5 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>
        </div>
        
        <div className="mt-4">
          <button 
            type="button"
            className={`text-emerald-500 text-sm hover:underline transition-opacity ${
              isSearching || (!hasSearched && !selectedState && !selectedServiceType)
                ? 'opacity-50 cursor-not-allowed'
                : 'opacity-100'
            }`}
            onClick={resetSearch}
            disabled={isSearching || (!hasSearched && !selectedState && !selectedServiceType)}
          >
            Reset Search
          </button>
        </div>
      </form>
    </div>
  );
}
