import { useState, useEffect, useRef } from 'react';
import { ServiceDefinition, Service } from '@/lib/types';
import { getServiceDefinitions, searchServices } from '@/lib/services';
import { SEARCH_CONSTANTS } from '@/lib/constants';
import { handleSearchError, handleNetworkError, isNetworkError } from '@/lib/errorHandling';
import { retryApiCall } from '@/lib/retry';
import { Analytics } from '@/lib/analytics';

interface SearchState {
  selectedServiceType: string;
  selectedState: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
  radiusMiles?: number;
}

interface SearchResults {
  services: Service[];
  totalPages: number;
  total: number;
}

interface UseSearchServicesReturn {
  // Service definitions
  serviceDefinitions: ServiceDefinition[];
  isLoadingDefinitions: boolean;
  
  // Search state
  searchState: SearchState;
  setSearchState: (state: Partial<SearchState>) => void;
  
  // Search results
  searchResults: Service[];
  isSearching: boolean;
  hasSearched: boolean;
  currentPage: number;
  totalPages: number;
  totalResults: number;
  
  // Actions
  handleSearch: (params?: Partial<SearchState>) => Promise<void>;
  handlePageChange: (newPage: number) => Promise<void>;
  resetSearch: () => void;
  
  // Scroll functionality
  searchResultsRef: React.RefObject<HTMLElement>;
}

export function useSearchServices(): UseSearchServicesReturn {
  // Service definitions state
  const [serviceDefinitions, setServiceDefinitions] = useState<ServiceDefinition[]>([]);
  const [isLoadingDefinitions, setIsLoadingDefinitions] = useState(true);
  
  // Search form state
  const [searchState, setSearchStateInternal] = useState<SearchState>({
    selectedServiceType: '',
    selectedState: '',
    zipCode: '',
    latitude: undefined,
    longitude: undefined,
    radiusMiles: undefined,
  });
  
  // Search results state
  const [searchResults, setSearchResults] = useState<Service[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  
  // Ref for search results section
  const searchResultsRef = useRef<HTMLElement>(null);
  
  // Load service definitions on mount
  useEffect(() => {
    async function loadServiceDefinitions() {
      setIsLoadingDefinitions(true);
      
      const result = await retryApiCall(
        () => getServiceDefinitions(),
        { maxAttempts: 3 }
      );
      
      if (result.success && result.data) {
        setServiceDefinitions(result.data);
      } else {
        if (isNetworkError(result.error)) {
          handleNetworkError(result.error);
        } else {
          handleSearchError(result.error, 'loading service definitions');
        }
      }
      
      setIsLoadingDefinitions(false);
    }
    
    loadServiceDefinitions();
  }, []);
  
  // Update search state
  const setSearchState = (newState: Partial<SearchState>) => {
    setSearchStateInternal(prev => ({ ...prev, ...newState }));
  };
  
  // Handle search form submission
  const handleSearch = async (params?: Partial<SearchState>) => {
    setIsSearching(true);
    setHasSearched(true);
    setCurrentPage(1);
    
    // If params are provided, update the search state first
    if (params) {
      setSearchStateInternal(prev => ({ ...prev, ...params }));
    }
    
    // Use the updated search state or params for the search
    const searchParams = params || searchState;
    
    try {
      const result = await retryApiCall(
        () => searchServices(
          searchParams.selectedServiceType || '',
          searchParams.selectedState || '',
          searchParams.zipCode || '',
          searchParams.latitude,
          searchParams.longitude,
          searchParams.radiusMiles,
          1,
          SEARCH_CONSTANTS.RESULTS_PER_PAGE
        ),
        { maxAttempts: 3 }
      );
      
      if (result.success && result.data) {
        const results = result.data;
        setSearchResults(results.services);
        setTotalPages(results.totalPages);
        setTotalResults(results.total);
        
        // Track search analytics
        Analytics.trackSearchEvent(
          `${searchParams.selectedServiceType || 'all'} ${searchParams.selectedState || searchParams.zipCode || 'all locations'}`,
          searchParams.selectedServiceType,
          searchParams.selectedState,
          searchParams.zipCode,
          results.total,
          1
        );
        
        // Scroll to search results
        setTimeout(() => {
          if (searchResultsRef.current) {
            searchResultsRef.current.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start' 
            });
          }
        }, SEARCH_CONSTANTS.SCROLL_DELAY);
      } else {
        if (isNetworkError(result.error)) {
          handleNetworkError(result.error);
        } else {
          handleSearchError(result.error, 'searching services');
        }
      }
    } catch (error) {
      if (isNetworkError(error)) {
        handleNetworkError(error);
      } else {
        handleSearchError(error, 'searching services');
      }
    } finally {
      setIsSearching(false);
    }
  };
  
  // Handle pagination
  const handlePageChange = async (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
    
    setIsSearching(true);
    setCurrentPage(newPage);
    
    try {
      const result = await retryApiCall(
        () => searchServices(
          searchState.selectedServiceType,
          searchState.selectedState,
          searchState.zipCode,
          searchState.latitude,
          searchState.longitude,
          searchState.radiusMiles,
          newPage,
          SEARCH_CONSTANTS.RESULTS_PER_PAGE
        ),
        { maxAttempts: 2 }
      );
      
      if (result.success && result.data) {
        setSearchResults(result.data.services);
        
        // Track pagination analytics
        Analytics.trackSearchEvent(
          `${searchState.selectedServiceType || 'all'} ${searchState.selectedState || searchState.zipCode || 'all locations'}`,
          searchState.selectedServiceType,
          searchState.selectedState,
          searchState.zipCode,
          result.data.total,
          newPage
        );
      } else {
        if (isNetworkError(result.error)) {
          handleNetworkError(result.error);
        } else {
          handleSearchError(result.error, 'fetching page');
        }
      }
    } catch (error) {
      if (isNetworkError(error)) {
        handleNetworkError(error);
      } else {
        handleSearchError(error, 'fetching page');
      }
    } finally {
      setIsSearching(false);
    }
  };
  
  const resetSearch = () => {
    setSearchStateInternal({
      selectedServiceType: '',
      selectedState: '',
      zipCode: '',
      latitude: undefined,
      longitude: undefined,
      radiusMiles: undefined,
    });
    setSearchResults([]);
    setHasSearched(false);
    setCurrentPage(1);
    setTotalPages(0);
    setTotalResults(0);
  };
  
  return {
    serviceDefinitions,
    isLoadingDefinitions,
    searchState,
    setSearchState,
    searchResults,
    isSearching,
    hasSearched,
    currentPage,
    totalPages,
    totalResults,
    handleSearch,
    handlePageChange,
    resetSearch,
    searchResultsRef
  };
} 