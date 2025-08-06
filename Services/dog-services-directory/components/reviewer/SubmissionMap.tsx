'use client';

import { useMemo } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import { MapPin } from 'lucide-react';

interface SubmissionMapProps {
  latitude?: string;
  longitude?: string;
  address?: string;
  name?: string;
}

export function SubmissionMap({ latitude, longitude, address, name }: SubmissionMapProps) {
  const { isLoaded } = useGoogleMaps();

  // Parse coordinates
  const coordinates = useMemo(() => {
    if (!latitude || !longitude) return null;
    
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    
    if (isNaN(lat) || isNaN(lng)) return null;
    
    return { lat, lng };
  }, [latitude, longitude]);

  // Map container style
  const containerStyle = useMemo(() => ({
    width: '100%',
    height: '256px', // h-64
  }), []);

  // Map options
  const mapOptions = useMemo(() => ({
    fullscreenControl: false,
    streetViewControl: false,
    mapTypeControl: false,
    zoomControl: true,
    scrollwheel: true,
  }), []);

  if (!isLoaded) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg h-64 flex items-center justify-center">
        <div className="text-gray-500 text-center">
          <MapPin className="h-12 w-12 mx-auto mb-2 text-gray-300" />
          <p>Loading map...</p>
        </div>
      </div>
    );
  }

  if (!coordinates) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg h-64 flex items-center justify-center">
        <div className="text-gray-500 text-center">
          <MapPin className="h-12 w-12 mx-auto mb-2 text-gray-300" />
          <p>No coordinates available</p>
          <p className="text-sm text-gray-400 mt-1">Use "Update Coordinates" to get location</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={coordinates}
        zoom={15}
        options={mapOptions}
      >
        <Marker
          position={coordinates}
          title={name || 'Service Location'}
        />
      </GoogleMap>
    </div>
  );
} 