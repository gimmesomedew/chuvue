/**
 * Location Constants
 * 
 * Centralized location data to eliminate duplication across the codebase.
 * Contains state coordinates, cities, zip codes, and default values.
 */

export interface StateLocation {
  lat: number;
  lng: number;
  city: string;
  zip: string;
  name: string;
  abbreviation: string;
}

export const STATE_COORDINATES: Record<string, StateLocation> = {
  IN: {
    lat: 39.9568,
    lng: -86.0075,
    city: 'Fishers',
    zip: '46037',
    name: 'Indiana',
    abbreviation: 'IN'
  },
  IL: {
    lat: 41.8781,
    lng: -87.6298,
    city: 'Chicago',
    zip: '60601',
    name: 'Illinois',
    abbreviation: 'IL'
  },
  OH: {
    lat: 39.9612,
    lng: -82.9988,
    city: 'Columbus',
    zip: '43215',
    name: 'Ohio',
    abbreviation: 'OH'
  },
  MI: {
    lat: 42.3314,
    lng: -83.0458,
    city: 'Detroit',
    zip: '48201',
    name: 'Michigan',
    abbreviation: 'MI'
  },
  KY: {
    lat: 38.2527,
    lng: -85.7585,
    city: 'Louisville',
    zip: '40202',
    name: 'Kentucky',
    abbreviation: 'KY'
  }
};

// Default values
export const DEFAULT_SEARCH_RADIUS = 50;
export const DEFAULT_NEAR_ME_RADIUS = 10;
export const DEFAULT_LOCATION_RADIUS = 5;
export const GEOLOCATION_TIMEOUT = 10000;

// State name variations for keyword matching
export const STATE_KEYWORDS: Record<string, string[]> = {
  'IN': ['indiana', 'in'],
  'IL': ['illinois', 'il'],
  'OH': ['ohio', 'oh'],
  'MI': ['michigan', 'mi'],
  'KY': ['kentucky', 'ky']
};

// Helper function to get state abbreviation from keyword
export function getStateFromKeyword(keyword: string): string | null {
  const normalizedKeyword = keyword.toLowerCase().trim();
  
  for (const [abbreviation, keywords] of Object.entries(STATE_KEYWORDS)) {
    if (keywords.includes(normalizedKeyword)) {
      return abbreviation;
    }
  }
  
  return null;
}

// Helper function to get location data from state abbreviation
export function getLocationFromState(stateAbbr: string): StateLocation | null {
  return STATE_COORDINATES[stateAbbr.toUpperCase()] || null;
}

// Helper function to get location data from keyword
export function getLocationFromKeyword(keyword: string): StateLocation | null {
  const stateAbbr = getStateFromKeyword(keyword);
  if (stateAbbr) {
    return getLocationFromState(stateAbbr);
  }
  return null;
}
