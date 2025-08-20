/**
 * useLocationResolver Hook
 * 
 * Centralizes all location detection and resolution logic.
 * Handles query parsing, geolocation, geocoding, and state mapping.
 */

import { useState, useCallback } from 'react';
import { 
  STATE_COORDINATES, 
  getLocationFromKeyword, 
  DEFAULT_SEARCH_RADIUS,
  DEFAULT_NEAR_ME_RADIUS,
  DEFAULT_LOCATION_RADIUS,
  GEOLOCATION_TIMEOUT,
  type StateLocation 
} from '@/lib/constants/locations';
import { geocodeAddress, reverseGeocode } from '@/lib/geocoding';

export interface LocationResult {
  lat: number;
  lng: number;
  city: string;
  state: string;
  zip: string;
  radius: number;
  source: 'query' | 'geolocation' | 'zip' | 'default';
  isNearMe: boolean;
  confidence: number;
}

export interface LocationError {
  type: 'geolocation' | 'geocoding' | 'timeout' | 'unknown';
  message: string;
}

export interface UseLocationResolverReturn {
  // Main resolver functions
  resolveLocationFromQuery: (query: string) => LocationResult | null;
  resolveLocationFromGeolocation: () => Promise<LocationResult>;
  resolveLocationFromZip: (zipCode: string) => Promise<LocationResult>;
  
  // State
  isResolving: boolean;
  error: LocationError | null;
  
  // Utilities
  clearError: () => void;
  getDefaultLocation: () => LocationResult;
}

export function useLocationResolver(): UseLocationResolverReturn {
  const [isResolving, setIsResolving] = useState(false);
  const [error, setError] = useState<LocationError | null>(null);

  /**
   * Clear any existing error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Get the default location (Fishers, IN)
   */
  const getDefaultLocation = useCallback((): LocationResult => {
    const defaultState = STATE_COORDINATES.IN;
    return {
      lat: defaultState.lat,
      lng: defaultState.lng,
      city: defaultState.city,
      state: defaultState.abbreviation,
      zip: defaultState.zip,
      radius: DEFAULT_LOCATION_RADIUS,
      source: 'default',
      isNearMe: false,
      confidence: 0.5
    };
  }, []);

  /**
   * Resolve location from search query keywords
   * Looks for state names like "illinois", "ohio", etc.
   */
  const resolveLocationFromQuery = useCallback((query: string): LocationResult | null => {
    if (!query || typeof query !== 'string') {
      return null;
    }

    // Split query into words and check each for state keywords
    const words = query.toLowerCase().split(/\s+/);
    
    for (const word of words) {
      // Check if word matches any state
      const stateLocation = getLocationFromKeyword(word);
      if (stateLocation) {
        return {
          lat: stateLocation.lat,
          lng: stateLocation.lng,
          city: stateLocation.city,
          state: stateLocation.abbreviation,
          zip: stateLocation.zip,
          radius: DEFAULT_SEARCH_RADIUS,
          source: 'query',
          isNearMe: false,
          confidence: 0.9
        };
      }
    }

    // Check for "near me" keywords
    if (query.toLowerCase().includes('near me')) {
      // Return null so caller can handle geolocation
      return null;
    }

    return null;
  }, []);

  /**
   * Resolve location using browser geolocation API
   */
  const resolveLocationFromGeolocation = useCallback(async (): Promise<LocationResult> => {
    setIsResolving(true);
    setError(null);

    try {
      // Check if geolocation is supported
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by this browser');
      }

      // Get current position with timeout
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: GEOLOCATION_TIMEOUT,
            maximumAge: 300000 // 5 minutes
          }
        );
      });

      const { latitude, longitude } = position.coords;

      // Reverse geocode to get address information
      const geocodeResult = await reverseGeocode(latitude, longitude);
      
      const result: LocationResult = {
        lat: latitude,
        lng: longitude,
        city: geocodeResult?.city || 'Unknown',
        state: geocodeResult?.state || 'Unknown',
        zip: geocodeResult?.zipCode || '',
        radius: DEFAULT_NEAR_ME_RADIUS,
        source: 'geolocation',
        isNearMe: true,
        confidence: 0.95
      };

      setIsResolving(false);
      return result;

    } catch (err) {
      setIsResolving(false);
      
      let errorType: LocationError['type'] = 'unknown';
      let errorMessage = 'Failed to get location';

      if (err instanceof GeolocationPositionError) {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorType = 'geolocation';
            errorMessage = 'Location permission denied';
            break;
          case err.POSITION_UNAVAILABLE:
            errorType = 'geolocation';
            errorMessage = 'Location information unavailable';
            break;
          case err.TIMEOUT:
            errorType = 'timeout';
            errorMessage = 'Location request timed out';
            break;
        }
      }

      const locationError: LocationError = { type: errorType, message: errorMessage };
      setError(locationError);
      
      // Return default location as fallback
      return getDefaultLocation();
    }
  }, [getDefaultLocation]);

  /**
   * Resolve location from ZIP code using geocoding
   */
  const resolveLocationFromZip = useCallback(async (zipCode: string): Promise<LocationResult> => {
    if (!zipCode || !/^\d{5}$/.test(zipCode.trim())) {
      const locationError: LocationError = {
        type: 'geocoding',
        message: 'Invalid ZIP code format'
      };
      setError(locationError);
      return getDefaultLocation();
    }

    setIsResolving(true);
    setError(null);

    try {
      const geocodeResult = await geocodeAddress(zipCode.trim());
      
      if (!geocodeResult || !geocodeResult.latitude || !geocodeResult.longitude) {
        throw new Error('Could not geocode ZIP code');
      }

      const result: LocationResult = {
        lat: geocodeResult.latitude,
        lng: geocodeResult.longitude,
        city: geocodeResult.city || 'Unknown',
        state: geocodeResult.state || 'Unknown',
        zip: zipCode.trim(),
        radius: DEFAULT_LOCATION_RADIUS,
        source: 'zip',
        isNearMe: false,
        confidence: 0.8
      };

      setIsResolving(false);
      return result;

    } catch (err) {
      setIsResolving(false);
      
      const locationError: LocationError = {
        type: 'geocoding',
        message: 'Failed to geocode ZIP code'
      };
      setError(locationError);
      
      // Return default location as fallback
      return getDefaultLocation();
    }
  }, [getDefaultLocation]);

  return {
    // Main resolver functions
    resolveLocationFromQuery,
    resolveLocationFromGeolocation,
    resolveLocationFromZip,
    
    // State
    isResolving,
    error,
    
    // Utilities
    clearError,
    getDefaultLocation
  };
}
