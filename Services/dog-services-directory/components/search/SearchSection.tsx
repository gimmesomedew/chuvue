'use client';

import { motion } from 'framer-motion';
import { SearchForm } from './SearchForm';
import { ServiceDefinition } from '@/lib/types';
import { USState } from '@/lib/states';
import { ANIMATION_CONSTANTS } from '@/lib/constants';

interface SearchSectionProps {
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

export function SearchSection({
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
}: SearchSectionProps) {
  return (
    <section className="bg-gradient-to-b from-[#f3f9f4]/40 to-white py-16">
      <div className="container mx-auto px-4">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: ANIMATION_CONSTANTS.PAGE_TRANSITION_DURATION }}
          className="text-3xl md:text-4xl font-bold text-center mb-3"
        >
          Explore All Available Dog Services
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ 
            duration: ANIMATION_CONSTANTS.PAGE_TRANSITION_DURATION, 
            delay: 0.2 
          }}
          className="text-gray-600 text-center mb-10"
        >
          Find the perfect services for your furry friend across various locations and categories
        </motion.p>
        
        <SearchForm 
          serviceDefinitions={serviceDefinitions}
          states={states}
          isLoading={isLoading}
          isSearching={isSearching}
          selectedServiceType={selectedServiceType}
          selectedState={selectedState}
          zipCode={zipCode}
          setSelectedServiceType={setSelectedServiceType}
          setSelectedState={setSelectedState}
          setZipCode={setZipCode}
          handleSearch={handleSearch}
          resetSearch={resetSearch}
          hasSearched={hasSearched}
        />
      </div>
    </section>
  );
} 