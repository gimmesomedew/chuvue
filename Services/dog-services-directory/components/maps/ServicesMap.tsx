import { useMemo, useState, useEffect } from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import { Service } from '@/lib/types';

interface ServicesMapProps {
  services: Service[];
  /** Optional override for map height */
  height?: string | number;
}

/**
 * Displays a Google Map with markers for each service in the list.
 * Requires the environment variable NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to be set.
 */
export function ServicesMap({ services, height = 400 }: ServicesMapProps) {
  // All hooks must be called at the top level, before any conditional returns
  const { isLoaded } = useGoogleMaps();
  
  // State for currently selected marker
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Filter out services that do not have valid coordinates
  const validServices = useMemo(
    () => services.filter((s) => typeof s.latitude === 'number' && typeof s.longitude === 'number'),
    [services]
  );

  // Compute a reasonable center – use the first service as default
  const center = useMemo(() => {
    if (validServices.length === 0) return null;
    const { latitude, longitude } = validServices[0];
    return { lat: latitude as number, lng: longitude as number };
  }, [validServices]);

  // Map container style
  const containerStyle = useMemo(() => ({ width: '100%', height }), [height]);

  // Reset selection if the services array changes and no longer contains the previously selected service
  useEffect(() => {
    if (selectedService && !validServices.find((s) => s.id === selectedService.id)) {
      setSelectedService(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [services]);

  // Early-return if no coordinates to show
  if (validServices.length === 0) {
    return null;
  }

  if (!isLoaded) {
    return (
      <div className="w-full flex justify-center items-center py-8">
        <p className="text-gray-500">Loading map…</p>
      </div>
    );
  }

  // Early-return if no center coordinates
  if (!center) {
    return null;
  }

  return (
    <div className="my-6 rounded-lg overflow-hidden shadow-lg border border-gray-200">
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10} options={{ fullscreenControl: false }}>
        {validServices.map((s) => (
          <Marker
            key={s.id}
            position={{ lat: s.latitude as number, lng: s.longitude as number }}
            title={s.name}
            onClick={() => setSelectedService(s)}
          />
        ))}

        {selectedService && (
          <InfoWindow
            position={{ lat: selectedService.latitude as number, lng: selectedService.longitude as number }}
            onCloseClick={() => setSelectedService(null)}
          >
            <div className="max-w-xs space-y-1">
              <h3 className="font-semibold text-sm text-emerald-700">{selectedService.name}</h3>
              <p className="text-xs text-gray-600">
                {selectedService.address}
              </p>
              <p className="text-xs text-gray-600">
                {selectedService.city}, {selectedService.state} {selectedService.zip_code}
              </p>
              {selectedService.website_url && (
                <a
                  href={selectedService.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 underline"
                >
                  Visit Website
                </a>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
} 