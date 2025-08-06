import { useJsApiLoader } from '@react-google-maps/api';

// Shared Google Maps loader configuration
const GOOGLE_MAPS_CONFIG = {
  id: 'google-maps-script',
  googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  libraries: ['places'],
};

export function useGoogleMaps() {
  return useJsApiLoader(GOOGLE_MAPS_CONFIG);
} 