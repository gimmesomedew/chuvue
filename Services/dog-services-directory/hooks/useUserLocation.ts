import { useState, useCallback } from 'react';

// Define the return type for the hook
interface UseUserLocationReturn {
  location: GeolocationCoordinates | null;
  isLoading: boolean;
  error: string | null;
  getLocation: () => Promise<GeolocationCoordinates | null>;
  clearLocation: () => void;
}

/**
 * Custom hook for getting and managing the user's location
 * Includes logging for analytics and debugging purposes
 */
export function useUserLocation(): UseUserLocationReturn {
  const [location, setLocation] = useState<GeolocationCoordinates | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to get the user's location
  const getLocation = useCallback(async (): Promise<GeolocationCoordinates | null> => {
    // Reset state
    setIsLoading(true);
    setError(null);

    try {
      // Check if geolocation is supported
      if (!navigator.geolocation) {
        const errorMessage = 'Geolocation is not supported by your browser';
        setError(errorMessage);
        setIsLoading(false);
        
        // Log the error for analytics
        console.error('Geolocation error:', errorMessage);
        logLocationError('UNSUPPORTED_BROWSER', errorMessage);
        
        return null;
      }

      // Get the user's location
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const coords = position.coords;
            setLocation(coords);
            setIsLoading(false);
            
            // Log success for analytics
            console.log('Location obtained successfully', {
              accuracy: coords.accuracy,
              timestamp: new Date().toISOString()
            });
            
            resolve(coords);
          },
          (error) => {
            let errorMessage = 'Unknown error occurred while getting location';
            
            // Map error codes to user-friendly messages
            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage = 'Location permission denied';
                logLocationError('PERMISSION_DENIED', errorMessage);
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage = 'Location information is unavailable';
                logLocationError('POSITION_UNAVAILABLE', errorMessage);
                break;
              case error.TIMEOUT:
                errorMessage = 'Location request timed out';
                logLocationError('TIMEOUT', errorMessage);
                break;
              default:
                logLocationError('UNKNOWN', errorMessage);
                break;
            }
            
            setError(errorMessage);
            setIsLoading(false);
            console.error('Geolocation error:', error.code, errorMessage);
            
            reject(new Error(errorMessage));
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      setIsLoading(false);
      
      // Log the error for analytics
      console.error('Unexpected geolocation error:', err);
      logLocationError('UNEXPECTED', errorMessage);
      
      return null;
    }
  }, []);

  // Function to clear the location
  const clearLocation = useCallback(() => {
    setLocation(null);
    setError(null);
  }, []);

  // Helper function to log location errors for analytics
  function logLocationError(errorType: string, errorMessage: string) {
    // In a real app, this would send the error to an analytics service
    // For now, we'll just log to console with additional metadata
    console.warn('Location Error Log:', {
      errorType,
      errorMessage,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      // Add any other relevant metadata
    });
    
    // TODO: In the future, implement actual logging to a database table
    // as mentioned in the requirements
  }

  return {
    location,
    isLoading,
    error,
    getLocation,
    clearLocation
  };
}
