'use client';

import { X } from 'lucide-react';
import { ServiceDefinition, Service } from '@/lib/types';
import { USState } from '@/lib/states';
import { Map } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FilterTagBarProps {
  selectedServiceType: string;
  selectedState: string;
  zipCode: string;
  serviceDefinitions: ServiceDefinition[];
  states: USState[];
  searchResults: Service[];
  allSearchResults: Service[];
  isClientFiltered: boolean;
  activeClientFilter: string | null;
  onRemoveServiceType: () => void;
  onRemoveState: () => void;
  onRemoveZipCode: () => void;
  onClearAll: () => void;
  onClientFilter: (serviceType: string) => void;
  onClearClientFilter: () => void;
}

export function FilterTagBar({
  selectedServiceType,
  selectedState,
  zipCode,
  serviceDefinitions,
  states,
  searchResults,
  allSearchResults,
  isClientFiltered,
  activeClientFilter,
  onRemoveServiceType,
  onRemoveState,
  onRemoveZipCode,
  onClearAll,
  onClientFilter,
  onClearClientFilter,
}: FilterTagBarProps) {
  // Get unique service types from all search results (the actual results for this location)
  const serviceTypesInResults = Array.from(new Set(allSearchResults.map(service => service.service_type)));
  
  // Check if we have any filters
  const hasFilters = selectedServiceType || selectedState || zipCode || isClientFiltered;

  if (!hasFilters) {
    return null;
  }

  const getServiceTypeColor = (serviceType: string) => {
    const definition = serviceDefinitions.find(d => d.service_type === serviceType);
    if (!definition) return 'bg-gray-100 text-gray-800';
    
    const colorMap: Record<string, string> = {
      emerald: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200',
      blue: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      purple: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
      amber: 'bg-amber-100 text-amber-800 hover:bg-amber-200',
      indigo: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200',
      pink: 'bg-pink-100 text-pink-800 hover:bg-pink-200',
      green: 'bg-green-100 text-green-800 hover:bg-green-200',
      orange: 'bg-orange-100 text-orange-800 hover:bg-orange-200',
      red: 'bg-red-100 text-red-800 hover:bg-red-200',
      cyan: 'bg-cyan-100 text-cyan-800 hover:bg-cyan-200',
      violet: 'bg-violet-100 text-violet-800 hover:bg-violet-200',
      teal: 'bg-teal-100 text-teal-800 hover:bg-teal-200',
      gray: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    };
    
    return colorMap[definition.badge_color] || 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col gap-3">
        {/* Service type filters - allow multiple rows */}
        {serviceTypesInResults.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {/* Show service types that are actually present in the search results */}
            {serviceTypesInResults.map((serviceType) => {
              const definition = serviceDefinitions.find(d => d.service_type === serviceType);
              const isSelected = selectedServiceType === serviceType;
              const isClientFilterActive = isClientFiltered && activeClientFilter === serviceType;
              
              return (
                <button
                  key={serviceType}
                  onClick={() => {
                    if (isSelected) {
                      onClearAll(); // Changed from onRemoveServiceType() to onClearAll()
                    } else if (isClientFilterActive) {
                      onClearAll(); // Changed from onClearClientFilter() to onClearAll()
                    } else {
                      onClientFilter(serviceType);
                    }
                  }}
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    isSelected || isClientFilterActive
                      ? getServiceTypeColor(serviceType) 
                      : `${getServiceTypeColor(serviceType).replace('hover:bg-', 'hover:bg-').replace('bg-', 'bg-opacity-50 bg-')}`
                  }`}
                >
                  <span>
                    {definition?.service_name || serviceType}
                  </span>
                  {(isSelected || isClientFilterActive) && <X className="h-3 w-3" />}
                </button>
              );
            })}
          </div>
        )}

        {/* Location filters and clear all button */}
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {selectedState && (
              <button
                onClick={onClearAll} // Changed from onRemoveState to onClearAll
                className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 hover:bg-blue-200 px-3 py-1 rounded-full text-sm font-medium transition-colors"
              >
                <Map className="h-3 w-3" />
                <span>
                  {states.find(s => s.abbreviation === selectedState)?.name || selectedState}
                </span>
                <X className="h-3 w-3" />
              </button>
            )}
            
            {zipCode && (
              <button
                onClick={onClearAll} // Changed from onRemoveZipCode to onClearAll
                className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 hover:bg-blue-200 px-3 py-1 rounded-full text-sm font-medium transition-colors"
              >
                <Map className="h-3 w-3" />
                <span>ZIP: {zipCode}</span>
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
          
          {hasFilters && (
            <button
              onClick={onClearAll}
              className="text-sm text-gray-500 hover:text-gray-700 underline transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 