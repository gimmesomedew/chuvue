'use client';

import { useState, useEffect, useRef } from 'react';
import { SearchState } from '@/hooks/useServicesQuery';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useServiceDefinitions } from '@/hooks/useServiceDefinitions';
import { US_STATES } from '@/lib/states';
import { ServiceDefinition } from '@/lib/types';
import { Search, MapPin, Crosshair } from 'lucide-react';
import { useUserLocation } from '@/hooks/useUserLocation';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';

type LocationType = 'state' | 'zip' | 'geo';

interface LocationToggleProps {
  locationType: LocationType;
  onTypeChange: (type: LocationType) => void;
  disabled?: boolean;
}

function LocationToggle({ locationType, onTypeChange, disabled }: LocationToggleProps) {
  const options: { value: LocationType; label: string }[] = [
    { value: 'zip', label: 'Zip Code' },
    { value: 'state', label: 'State' },
    { value: 'geo', label: 'My Location' }
  ];

  return (
    <fieldset
      className="flex w-full sm:max-w-[375px] rounded-md overflow-hidden border border-secondary"
      role="radiogroup"
      aria-label="Location type selector"
    >
      {options.map((opt) => (
        <label
          key={opt.value}
          className={`flex-1 text-center cursor-pointer px-4 py-2 text-sm font-medium transition-colors ${locationType === opt.value ? 'bg-secondary text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input
            type="radio"
            name="locationType"
            value={opt.value}
            className="sr-only"
            checked={locationType === opt.value}
            onChange={() => onTypeChange(opt.value)}
            disabled={disabled}
          />
          {opt.label}
        </label>
      ))}
    </fieldset>
  );
}

interface SearchFormProps {
  onSearch: (params: Partial<SearchState>) => void;
  initialSelectedServiceType?: string;
}

// simple debounce utility
function debounce<F extends (...args: any[]) => void>(fn: F, delay: number) {
  let timer: NodeJS.Timeout;
  return (...args: Parameters<F>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function SearchForm({ onSearch, initialSelectedServiceType = '' }: SearchFormProps) {
  const [locationType, setLocationType] = useState<LocationType>('state');

  const [formState, setFormState] = useState<any>({
    selectedServiceType: initialSelectedServiceType,
    selectedState: '',
    zipCode: '',
    latitude: undefined,
    longitude: undefined,
    radiusMiles: 25,
  });

  // Update selectedServiceType if prop changes
  useEffect(() => {
    if (initialSelectedServiceType && initialSelectedServiceType !== formState.selectedServiceType) {
      setFormState((prev: any) => ({ ...prev, selectedServiceType: initialSelectedServiceType }));
    }
  }, [initialSelectedServiceType]);

  const { data: serviceDefinitions, isLoading } = useServiceDefinitions();

  // User location hook for "My Location"
  const {
    location: userLocation,
    isLoading: locating,
    error: locationError,
    getLocation,
    clearLocation,
  } = useUserLocation();

  // city/state from reverse geocode
  const [cityState, setCityState] = useState<string>('');

  // ref for ZIP input to focus on fallback
  const zipInputRef = useRef<HTMLInputElement>(null);

  // Debounced handler for zip code
  const debouncedSetZip = useRef(
    debounce((val: string) => {
      handleChange('zipCode', val);
    }, 300)
  ).current;

  // Automatically request location when user switches to geo
  useEffect(() => {
    if (locationType === 'geo' && !userLocation && !locating) {
      getLocation();
    }
    if (locationType !== 'geo') {
      clearLocation();
      setCityState('');
    }
  }, [locationType]);

  // Update form state with lat/lon and reverse geocode when userLocation available
  useEffect(() => {
    if (userLocation) {
      setFormState((prev: any) => ({
        ...prev,
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
      }));

      // reverse geocode to get city/state
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLocation.latitude}&lon=${userLocation.longitude}`,
        { headers: { 'User-Agent': 'DogServicesDirectory/1.0' } })
        .then(res => res.json())
        .then(data => {
          if (data && data.address) {
            const city = data.address.city || data.address.town || data.address.village || '';
            const state = data.address.state || '';
            setCityState(`${city}${city && state ? ', ' : ''}${state}`);
          }
        })
        .catch(err => {
          console.error('Reverse geocode error', err);
        });
    }
  }, [userLocation]);

  // Fallback: if geolocation error while in geo mode, switch to zip
  useEffect(() => {
    if (locationType === 'geo' && locationError) {
      setLocationType('zip');
      // focus zip input on next tick
      setTimeout(() => {
        zipInputRef.current?.focus();
      }, 0);
    }
  }, [locationError]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (locationType === 'state' && !formState.selectedState) {
      toast.error('Please select a state before searching.');
      return;
    }
    onSearch(formState);
  };

  const handleLocationTypeChange = (type: LocationType) => {
    setLocationType(type);
    setFormState((prev: any) => ({
      ...prev,
      selectedState: type === 'state' ? prev.selectedState : '',
      zipCode: type === 'zip' ? prev.zipCode : '',
      latitude: undefined,
      longitude: undefined,
      radiusMiles: undefined,
    }));
    
    // Clear user location when switching away from geo mode
    if (type !== 'geo') {
      clearLocation();
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormState((prev: any) => ({
      ...prev,
      [field]: value,
      // Clear geolocation data when changing location fields
      ...(field === 'selectedState' || field === 'zipCode' ? {
        latitude: undefined,
        longitude: undefined,
        radiusMiles: undefined,
      } : {}),
    }));
    
    // Clear user location when manually changing location fields
    if (field === 'selectedState' || field === 'zipCode') {
      clearLocation();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-6xl mx-auto bg-[#F8F9FA] p-4 md:p-8 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Service Type Field */}
        <div className="md:col-span-5 border border-primary rounded-md p-3">
          <div className="flex items-center mb-2">
            {isLoading ? (
              <Search className="h-5 w-5 text-secondary mr-2 animate-spin" />
            ) : (
              <Search className="h-5 w-5 text-secondary mr-2" />
            )}
            <span className="font-medium">What services?</span>
          </div>
          <Select
            disabled={isLoading}
            value={formState.selectedServiceType}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
              handleChange('selectedServiceType', e.target.value)
            }
          >
            <option value="">All Service Types</option>
            {serviceDefinitions?.map((def: ServiceDefinition) => (
              <option key={def.service_type} value={def.service_type}>
                {def.service_name}
              </option>
            ))}
          </Select>
        </div>

        {/* Location Field */}
        <div className="md:col-span-7 border border-primary rounded-md p-3">
          <div className="flex items-center mb-2">
            <MapPin className="h-5 w-5 text-secondary mr-2" />
            <span className="font-medium">What Location?</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 w-full">
            <LocationToggle
              locationType={locationType}
              onTypeChange={handleLocationTypeChange}
              disabled={isLoading}
            />
            <div className="w-full md:flex-1">
              <AnimatePresence mode="wait" initial={false}>
                {locationType === 'state' && (
                  <motion.div key="state" className="w-full md:flex-1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
                    <Select
                      value={formState.selectedState}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                        handleChange('selectedState', e.target.value)
                      }
                      disabled={isLoading}
                      className="block w-full"
                    >
                      <option value="">Select a state</option>
                      {US_STATES.map((state) => (
                        <option key={state.abbreviation} value={state.abbreviation}>
                          {state.name}
                        </option>
                      ))}
                    </Select>
                  </motion.div>
                )}

                {locationType === 'zip' && (
                  <motion.div key="zip" className="w-full md:flex-1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
                    <Input
                      ref={zipInputRef}
                      type="text"
                      placeholder="Enter ZIP Code"
                      value={formState.zipCode}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const numericValue = e.target.value.replace(/[^0-9]/g, '').slice(0, 5);
                        handleChange('zipCode', numericValue);
                      }}
                      maxLength={5}
                      disabled={isLoading}
                      className="block w-full"
                    />
                    {locationError && (
                      <p className="mt-1 text-xs text-red-600">Location permission denied — please enter your ZIP code instead.</p>
                    )}
                  </motion.div>
                )}

                {locationType === 'geo' && (
                  <motion.div key="geo" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }} className="flex items-center space-x-2 text-sm text-gray-600">
                    {locating && (<span>Detecting location...</span>)}
                    {(!locating && userLocation) && cityState && (
                       <span className="bg-emerald-50 text-emerald-800 rounded px-2 py-1">{cityState}</span>
                     )}
                    {locationError && !locating && (
                      <span className="text-red-600">{locationError}</span>
                    )}
                    {!locating && !userLocation && !locationError && (
                      <button
                        type="button"
                        onClick={() => getLocation()}
                        className="inline-flex items-center text-emerald-600 hover:underline"
                      >
                        <Crosshair className="h-4 w-4 mr-1" /> Detect My Location
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

      </div>

      {/* Search Button - full width on its own row */}
      <div className="mt-4 flex justify-center">
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full max-w-[700px] bg-secondary hover:bg-secondary/90 text-white h-12 rounded-[40px]"
        >
          {isLoading ? (
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

      {/* hidden lat/lon fields for submission */}
      {typeof formState.latitude === 'number' && <input type="hidden" name="latitude" value={formState.latitude} />}
      {typeof formState.longitude === 'number' && <input type="hidden" name="longitude" value={formState.longitude} />}
    </form>
  );
}
