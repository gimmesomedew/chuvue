'use client';

import { useState } from 'react';
import { SearchState } from '@/hooks/useServicesQuery';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useServiceDefinitions } from '@/hooks/useServiceDefinitions';
import { US_STATES } from '@/lib/states';
import { ServiceDefinition } from '@/lib/types';
import { Search, MapPin, Ruler } from 'lucide-react';

type LocationType = 'state' | 'zip';

interface LocationToggleProps {
  locationType: LocationType;
  onTypeChange: (type: LocationType) => void;
  disabled?: boolean;
}

function LocationToggle({ locationType, onTypeChange, disabled }: LocationToggleProps) {
  return (
    <div className="flex rounded-md overflow-hidden border border-gray-200">
      <button
        type="button"
        onClick={() => onTypeChange('state')}
        disabled={disabled}
        className={`px-4 py-2 text-sm font-medium transition-colors ${
          locationType === 'state'
            ? 'bg-emerald-500 text-white'
            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
        }`}
      >
        State
      </button>
      <button
        type="button"
        onClick={() => onTypeChange('zip')}
        disabled={disabled}
        className={`px-4 py-2 text-sm font-medium transition-colors ${
          locationType === 'zip'
            ? 'bg-emerald-500 text-white'
            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
        }`}
      >
        Zip Code
      </button>
    </div>
  );
}

interface SearchFormProps {
  onSearch: (params: Partial<SearchState>) => void;
}

export function SearchForm({ onSearch }: SearchFormProps) {
  const [locationType, setLocationType] = useState<LocationType>('state');
  const [formState, setFormState] = useState<any>({
    selectedServiceType: '',
    selectedState: '',
    zipCode: '',
    distanceMiles: '',
  });

  const { data: serviceDefinitions, isLoading } = useServiceDefinitions();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(formState);
  };

  const handleLocationTypeChange = (type: LocationType) => {
    setLocationType(type);
    setFormState((prev: any) => ({
      ...prev,
      selectedState: type === 'state' ? prev.selectedState : '',
      zipCode: type === 'zip' ? prev.zipCode : '',
    }));
  };

  const handleChange = (field: string, value: string) => {
    setFormState((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Service Type Field */}
        <div className="md:col-span-4">
          <div className="flex items-center mb-2">
            {isLoading ? (
              <Search className="h-5 w-5 text-emerald-500 mr-2 animate-spin" />
            ) : (
              <Search className="h-5 w-5 text-emerald-500 mr-2" />
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
        <div className="md:col-span-4">
          <div className="flex items-center mb-2">
            <MapPin className="h-5 w-5 text-emerald-500 mr-2" />
            <span className="font-medium">Where?</span>
          </div>
          <div className="flex items-center space-x-2">
            <LocationToggle
              locationType={locationType}
              onTypeChange={handleLocationTypeChange}
              disabled={isLoading}
            />
            <div className="flex-1">
              {locationType === 'state' ? (
                <Select
                  value={formState.selectedState}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                    handleChange('selectedState', e.target.value)
                  }
                  disabled={isLoading}
                >
                  <option value="">Select a state</option>
                  {US_STATES.map((state) => (
                    <option key={state.abbreviation} value={state.abbreviation}>
                      {state.name}
                    </option>
                  ))}
                </Select>
              ) : (
                <Input
                  type="text"
                  placeholder="Enter ZIP Code"
                  value={formState.zipCode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const numericValue = e.target.value.replace(/[^0-9]/g, '').slice(0, 5);
                    handleChange('zipCode', numericValue);
                  }}
                  maxLength={5}
                  disabled={isLoading}
                  className="w-full"
                />
              )}
            </div>
          </div>
        </div>

        {/* Distance Field */}
        <div className="md:col-span-2">
          <div className="flex items-center mb-2">
            <Ruler className="h-5 w-5 text-emerald-500 mr-2" />
            <span className="font-medium">Distance</span>
          </div>
          <Select
            value={formState.distanceMiles}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
              handleChange('distanceMiles' as any, e.target.value)
            }
          >
            <option value="">Any</option>
            <option value="25">25 miles</option>
            <option value="50">50 miles</option>
            <option value="100">100 miles</option>
          </Select>
        </div>

        {/* Search Button */}
        <div className="md:col-span-2 flex items-end">
          <Button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white h-[42px]"
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
      </div>
    </form>
  );
}
