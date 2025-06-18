import { useReducer, useCallback, useEffect, useMemo } from 'react';
import { calculateDistance, getUserLocation } from '@/lib/location';
import { Service, ServiceWithDistance } from '@/lib/types';
import { logLocationError } from '@/lib/errorLogging';

// Define the state type
interface LocationState {
  sortByDistance: boolean;
  userLocation: GeolocationCoordinates | null;
  isLoading: boolean;
  error: string | null;
  sortedResults: (Service | ServiceWithDistance)[];
}

// Define the action types
type LocationAction =
  | { type: 'TOGGLE_SORT'; payload: boolean }
  | { type: 'SET_LOCATION'; payload: GeolocationCoordinates }
  | { type: 'LOCATION_ERROR'; payload: string }
  | { type: 'LOADING_START' }
  | { type: 'LOADING_END' }
  | { type: 'UPDATE_SORTED_RESULTS'; payload: (Service | ServiceWithDistance)[] }
  | { type: 'RESET' };

// Initial state
const initialState: LocationState = {
  sortByDistance: false,
  userLocation: null,
  isLoading: false,
  error: null,
  sortedResults: [],
};

// Reducer function
function locationReducer(state: LocationState, action: LocationAction): LocationState {
  switch (action.type) {
    case 'TOGGLE_SORT':
      return { ...state, sortByDistance: action.payload };
    case 'SET_LOCATION':
      return { ...state, userLocation: action.payload, error: null };
    case 'LOCATION_ERROR':
      return { ...state, error: action.payload, sortByDistance: false };
    case 'LOADING_START':
      return { ...state, isLoading: true };
    case 'LOADING_END':
      return { ...state, isLoading: false };
    case 'UPDATE_SORTED_RESULTS':
      return { ...state, sortedResults: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

/**
 * Custom hook for managing location-based sorting
 * @param searchResults The original search results to sort
 * @returns State and functions for location-based sorting
 */
export function useLocationSorting(searchResults: Service[]) {
  const [state, dispatch] = useReducer(locationReducer, initialState);
  
  // Toggle sort by distance
  const toggleSortByDistance = useCallback((enabled: boolean) => {
    dispatch({ type: 'TOGGLE_SORT', payload: enabled });
  }, []);
  
  // Get user location when sort is enabled
  useEffect(() => {
    if (state.sortByDistance && !state.userLocation) {
      dispatch({ type: 'LOADING_START' });
      
      getUserLocation()
        .then(coords => {
          dispatch({ type: 'SET_LOCATION', payload: coords });
          dispatch({ type: 'LOADING_END' });
        })
        .catch(error => {
          const errorMessage = error.message || 'Unable to get your location';
          dispatch({ type: 'LOCATION_ERROR', payload: errorMessage });
          dispatch({ type: 'LOADING_END' });
          logLocationError(error, 'Failed to get user location for distance sorting');
        });
    }
  }, [state.sortByDistance, state.userLocation]);
  
  // Memoize the sorted results to avoid recalculating on every render
  const sortedResults = useMemo(() => {
    // Log location usage for debugging and analytics
    if (state.sortByDistance && state.userLocation) {
      console.log('Using location for sorting:', {
        latitude: state.userLocation.latitude,
        longitude: state.userLocation.longitude
      });
    }

    if (searchResults.length === 0) {
      return [];
    }
    
    if (state.sortByDistance && state.userLocation) {
      // Calculate distance for each service and sort
      const resultsWithDistance = searchResults.map(service => {
        const distance = calculateDistance(
          state.userLocation!.latitude,
          state.userLocation!.longitude,
          service.latitude,
          service.longitude
        );
        return { ...service, distance };
      });
      
      // Sort by distance (closest first)
      return [...resultsWithDistance].sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
    }
    
    // Sort alphabetically by name when not sorting by distance
    return [...searchResults].sort((a, b) => a.name.localeCompare(b.name));
  }, [searchResults, state.sortByDistance, state.userLocation]);
  
  // Update the state with the memoized results
  useEffect(() => {
    dispatch({ type: 'UPDATE_SORTED_RESULTS', payload: sortedResults });
  }, [sortedResults]);
  
  // Display results based on sorting preference
  const displayResults = state.sortedResults.length > 0 ? state.sortedResults : searchResults;
  
  return {
    ...state,
    displayResults,
    toggleSortByDistance,
  };
}
