'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { SearchForm } from './SearchForm';
import { ServiceDefinition } from '@/lib/types';
import { USState } from '@/lib/states';
import { ANIMATION_CONSTANTS } from '@/lib/constants';
import { SearchState } from '@/hooks/useServicesQuery';

interface SearchSectionProps {
  isLoading: boolean;
  isSearching: boolean;
  hasSearched: boolean;
  onSearch: (params: Partial<SearchState>) => void;
  resetSearch: () => void;
  initialSelectedServiceType?: string;
  isCollapsed?: boolean;
  onToggleSearchForm?: () => void;
}

const SearchSectionSkeleton = () => (
  <div className="bg-gradient-to-b from-[#f3f9f4]/40 to-white py-16">
    <div className="container mx-auto px-4">
      <div className="flex flex-col items-center space-y-4 mb-10">
        <div className="h-10 w-3/4 md:w-1/2 bg-gray-200 rounded-lg animate-pulse" />
        <div className="h-6 w-2/3 md:w-1/3 bg-gray-200 rounded-lg animate-pulse" />
      </div>
      
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4">
            <div className="h-6 w-32 bg-gray-200 rounded mb-2 animate-pulse" />
            <div className="h-12 bg-gray-200 rounded animate-pulse" />
          </div>
          
          <div className="md:col-span-6">
            <div className="h-6 w-32 bg-gray-200 rounded mb-2 animate-pulse" />
            <div className="flex space-x-2">
              <div className="w-32 h-10 bg-gray-200 rounded animate-pulse" />
              <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
          
          <div className="md:col-span-2">
            <div className="h-12 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export function SearchSection({
  isLoading,
  isSearching,
  hasSearched,
  onSearch,
  resetSearch,
  initialSelectedServiceType = '',
  isCollapsed: externalCollapsed,
  onToggleSearchForm
}: SearchSectionProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  
  // Use external collapsed state if provided, otherwise use internal state
  const isCollapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;
  const setIsCollapsed = externalCollapsed !== undefined ? (() => {}) : setInternalCollapsed;

  useEffect(() => {
    if (hasSearched) {
      setIsCollapsed(true);
    }
  }, [hasSearched]);

  const toggleCollapse = () => {
    if (externalCollapsed !== undefined) {
      // If we have external state, only call the callback
      onToggleSearchForm?.();
    } else {
      // If we're using internal state, toggle it
      setInternalCollapsed(!internalCollapsed);
    }
  };

  if (isLoading) {
    return <SearchSectionSkeleton />;
  }

  return (
    <motion.section 
      initial={false}
      animate={{ 
        paddingTop: hasSearched ? '0.25rem' : '4rem',
        paddingBottom: hasSearched ? '0.5rem' : '4rem'
      }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="bg-gradient-to-b from-[#f3f9f4]/40 to-white relative"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={false}
          animate={{ 
            scale: hasSearched ? 0.8 : 1,
            marginBottom: hasSearched ? '0.125rem' : '2rem'
          }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          style={{ transformOrigin: 'top center' }}
        >
          {/* Only show header when search form is not collapsed */}
          {!isCollapsed && (
            <>
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: ANIMATION_CONSTANTS.PAGE_TRANSITION_DURATION }}
                className="text-3xl md:text-4xl font-bold text-center mb-3"
              >
                Explore All Available Dog Services
              </motion.h1>
              <AnimatePresence>
                {!hasSearched && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      duration: ANIMATION_CONSTANTS.PAGE_TRANSITION_DURATION, 
                      delay: 0.2 
                    }}
                    className="text-[#11055F] text-center mb-4"
                  >
                    Find the perfect services for your furry friend across various locations and categories
                  </motion.p>
                )}
              </AnimatePresence>
            </>
          )}
        </motion.div>

        <div className="relative">
          <motion.div
            initial={false}
            animate={{ 
              height: isCollapsed ? '0' : 'auto',
              opacity: isCollapsed ? 0 : 1,
              marginBottom: isCollapsed ? '0' : '2rem'
            }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-4 md:p-8">
              <SearchForm 
                onSearch={onSearch}
                initialSelectedServiceType={initialSelectedServiceType}
              />

              {/* Reset search link */}
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => {
                    resetSearch();
                    // Force clear any cached location data
                    if (typeof window !== 'undefined') {
                      localStorage.removeItem('userCoordsCache');
                    }
                  }}
                  className="text-primary text-sm hover:underline"
                >
                  Reset Search
                </button>
              </div>
            </div>
          </motion.div>

          {hasSearched && (
            <div className="flex justify-center mt-1 mb-2">
              <button
                onClick={toggleCollapse}
                className="inline-flex items-center gap-2 bg-secondary text-white rounded-full px-4 py-2 shadow-sm hover:bg-third hover:text-white transition-all"
              >
                <span className="text-sm font-medium">
                  {isCollapsed ? 'Show search form' : 'Hide search form'}
                </span>
                {isCollapsed ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronUp className="h-5 w-5" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
} 