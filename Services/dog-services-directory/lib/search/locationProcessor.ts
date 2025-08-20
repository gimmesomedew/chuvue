import { geocodeAddress } from '@/lib/geocoding';
import { STATE_COORDINATES, DEFAULT_SEARCH_RADIUS, STATE_KEYWORDS, getLocationFromKeyword } from '@/lib/constants/locations';

export interface ResolvedLocation {
  lat: number;
  lng: number;
  radius: number;
  city?: string;
  state?: string;
  zipCode?: string;
  isNearMe: boolean;
  confidence: number;
}

export interface UserLocation {
  lat: number;
  lng: number;
  zip?: string;
  city?: string;
  state?: string;
}

/**
 * Streamlined location resolution using centralized constants
 * @param locationEntities - Array of location strings from entity extraction
 * @param userLocation - User's current location coordinates
 * @returns Resolved location with coordinates and radius
 */
export async function resolveLocationStreamlined(
  locationEntities: string[], 
  userLocation: UserLocation
): Promise<ResolvedLocation> {
  // If no location entities, default to user's location
  if (locationEntities.length === 0) {
    return {
      lat: userLocation.lat,
      lng: userLocation.lng,
      radius: DEFAULT_SEARCH_RADIUS,
      city: userLocation.city,
      state: userLocation.state,
      zipCode: userLocation.zip,
      isNearMe: false,
      confidence: 0.8
    };
  }

  // Check for "near me" queries
  if (locationEntities.includes('near_me')) {
    return {
      lat: userLocation.lat,
      lng: userLocation.lng,
      radius: 10, // 10 mile radius for "near me"
      city: userLocation.city,
      state: userLocation.state,
      zipCode: userLocation.zip,
      isNearMe: true,
      confidence: 0.9
    };
  }

  // Check for state keywords using centralized logic
  for (const entity of locationEntities) {
    const stateLocation = getLocationFromKeyword(entity);
    if (stateLocation) {
      return {
        lat: stateLocation.lat,
        lng: stateLocation.lng,
        radius: DEFAULT_SEARCH_RADIUS,
        city: stateLocation.city,
        state: stateLocation.abbreviation,
        zipCode: stateLocation.zip,
        isNearMe: false,
        confidence: 0.9
      };
    }
  }

  // Process other location types (zip codes, cities, etc.)
  return await processSpecificLocation(locationEntities, userLocation);
}

/**
 * Main function to resolve location information from query entities
 * @param locationEntities - Array of location strings from entity extraction
 * @param userLocation - User's current location coordinates
 * @returns Resolved location with coordinates and radius
 */
export async function resolveLocation(
  locationEntities: string[], 
  userLocation: UserLocation
): Promise<ResolvedLocation | null> {
  try {
    // If no location entities, return null to indicate no location filtering should be applied
    if (locationEntities.length === 0) {
      return null;
    }

    // Check for "near me" queries
    if (locationEntities.includes('near_me')) {
      return {
        lat: userLocation.lat,
        lng: userLocation.lng,
        radius: 10, // 10 mile radius for "near me"
        city: userLocation.city,
        state: userLocation.state,
        zipCode: userLocation.zip,
        isNearMe: true,
        confidence: 0.9
      };
    }

    // Process specific locations
    const resolvedLocation = await processSpecificLocation(locationEntities, userLocation);
    
    return resolvedLocation;

  } catch (error) {
    console.error('Error resolving location:', error);
    
    // Fallback to user location
    return {
      lat: userLocation.lat,
      lng: userLocation.lng,
      radius: 10,
      city: userLocation.city,
      state: userLocation.state,
      zipCode: userLocation.zip,
      isNearMe: false,
      confidence: 0.5
    };
  }
}

/**
 * Process specific location entities (cities, ZIP codes, etc.)
 */
async function processSpecificLocation(
  locationEntities: string[], 
  userLocation: UserLocation
): Promise<ResolvedLocation> {
  let bestLocation: ResolvedLocation | null = null;
  let highestConfidence = 0;

  for (const entity of locationEntities) {
    const location = await resolveSingleLocation(entity, userLocation);
    
    if (location.confidence > highestConfidence) {
      bestLocation = location;
      highestConfidence = location.confidence;
    }
  }

  if (bestLocation) {
    return bestLocation;
  }

  // Fallback to user location
  return {
    lat: userLocation.lat,
    lng: userLocation.lng,
    radius: 10,
    city: userLocation.city,
    state: userLocation.state,
    zipCode: userLocation.zip,
    isNearMe: false,
    confidence: 0.3
  };
}

/**
 * Resolve a single location entity
 */
async function resolveSingleLocation(
  entity: string, 
  userLocation: UserLocation
): Promise<ResolvedLocation> {
  // Handle ZIP codes
  if (/^\d{5}$/.test(entity)) {
    return await resolveZipCode(entity, userLocation);
  }

  // Handle city names
  if (isCityName(entity)) {
    return await resolveCityName(entity, userLocation);
  }

  // Handle state references
  if (isStateReference(entity)) {
    return await resolveStateReference(entity, userLocation);
  }

  // Unknown entity type
  return {
    lat: userLocation.lat,
    lng: userLocation.lng,
    radius: 10,
    city: userLocation.city,
    state: userLocation.state,
    zipCode: userLocation.zip,
    isNearMe: false,
    confidence: 0.1
  };
}

/**
 * Resolve ZIP code to coordinates
 */
async function resolveZipCode(
  zipCode: string, 
  userLocation: UserLocation
): Promise<ResolvedLocation> {
  try {
    // Try to geocode the ZIP code
    const geocodeResult = await geocodeAddress(`${zipCode}, IN`);
    
    if (geocodeResult && geocodeResult.latitude && geocodeResult.longitude) {
      return {
        lat: geocodeResult.latitude,
        lng: geocodeResult.longitude,
        radius: 10,
        zipCode: zipCode,
        state: 'IN',
        isNearMe: false,
        confidence: 0.9
      };
    }
  } catch (error) {
    console.error(`Error geocoding ZIP code ${zipCode}:`, error);
  }

  // Fallback: use user location but expand radius
  return {
    lat: userLocation.lat,
    lng: userLocation.lng,
    radius: 25, // Larger radius since we couldn't resolve the ZIP
    zipCode: zipCode,
    state: 'IN',
    isNearMe: false,
    confidence: 0.6
  };
}

/**
 * Resolve city name to coordinates
 */
async function resolveCityName(
  cityName: string, 
  userLocation: UserLocation
): Promise<ResolvedLocation> {
  try {
    // Try to geocode the city
    const geocodeResult = await geocodeAddress(`${cityName}, IN`);
    
    if (geocodeResult && geocodeResult.latitude && geocodeResult.longitude) {
      // Calculate distance from user location
      const distance = calculateDistance(
        userLocation.lat, 
        userLocation.lng, 
        geocodeResult.latitude, 
        geocodeResult.longitude
      );

      // Adjust radius based on distance
      let radius = 10;
      if (distance > 50) {
        radius = 25; // Larger radius for distant cities
      } else if (distance > 20) {
        radius = 15; // Medium radius for moderate distances
      }

      return {
        lat: geocodeResult.latitude,
        lng: geocodeResult.longitude,
        radius,
        city: cityName,
        state: 'IN',
        isNearMe: false,
        confidence: 0.85
      };
    }
  } catch (error) {
    console.error(`Error geocoding city ${cityName}:`, error);
  }

  // Fallback: use user location with expanded radius
  return {
    lat: userLocation.lat,
    lng: userLocation.lng,
    radius: 20,
    city: cityName,
    state: 'IN',
    isNearMe: false,
    confidence: 0.5
  };
}

/**
 * Resolve state reference
 */
async function resolveStateReference(
  stateRef: string, 
  userLocation: UserLocation
): Promise<ResolvedLocation> {
  // Normalize state reference
  const normalizedStateRef = stateRef.toLowerCase().trim();
  
  // Check if we have coordinates for this state using centralized constants
  for (const [abbreviation, location] of Object.entries(STATE_COORDINATES)) {
    if (location.name.toLowerCase() === normalizedStateRef || 
        location.abbreviation.toLowerCase() === normalizedStateRef ||
        abbreviation.toLowerCase() === normalizedStateRef) {
      return {
        lat: location.lat,
        lng: location.lng,
        radius: DEFAULT_SEARCH_RADIUS, // Large radius for state-wide search
        state: location.abbreviation,
        city: location.city,
        zipCode: location.zip,
        isNearMe: false,
        confidence: 0.7
      };
    }
  }
  
  // Unknown state - fallback to user location with expanded radius
  return {
    lat: userLocation.lat,
    lng: userLocation.lng,
    radius: DEFAULT_SEARCH_RADIUS,
    state: userLocation.state,
    city: userLocation.city,
    zipCode: userLocation.zip,
    isNearMe: false,
    confidence: 0.3
  };
}

/**
 * Check if entity is a city name
 */
function isCityName(entity: string): boolean {
  const indianaCities = [
    'indianapolis', 'indy', 'fishers', 'carmel', 'noblesville', 'westfield',
    'greenwood', 'avon', 'plainfield', 'zionsville', 'brownsburg', 'danville',
    'pittsboro', 'lizton', 'coatesville', 'clayton', 'amity', 'bainbridge'
  ];

  return indianaCities.includes(entity.toLowerCase());
}

/**
 * Check if entity is a state reference using centralized constants
 */
function isStateReference(entity: string): boolean {
  const normalizedEntity = entity.toLowerCase().trim();
  
  // Check against all state keywords from constants
  for (const keywords of Object.values(STATE_KEYWORDS)) {
    if (keywords.includes(normalizedEntity)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Calculate distance between two coordinates using Haversine formula
 */
function calculateDistance(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Expand search radius if no results found
 */
export function expandSearchRadius(
  currentLocation: ResolvedLocation, 
  expansionFactor: number = 2
): ResolvedLocation {
  return {
    ...currentLocation,
    radius: Math.min(currentLocation.radius * expansionFactor, 100), // Cap at 100 miles
    confidence: Math.max(currentLocation.confidence - 0.1, 0.1) // Slightly reduce confidence
  };
}

/**
 * Get nearby cities within a radius
 */
export function getNearbyCities(
  centerLat: number, 
  centerLng: number, 
  radius: number
): Array<{ name: string; lat: number; lng: number; distance: number }> {
  const indianaCities = [
    { name: 'Indianapolis', lat: 39.7684, lng: -86.1581 },
    { name: 'Fishers', lat: 39.9568, lng: -86.0075 },
    { name: 'Carmel', lat: 39.9784, lng: -86.1180 },
    { name: 'Noblesville', lat: 40.0456, lng: -86.0086 },
    { name: 'Westfield', lat: 40.0428, lng: -86.1275 },
    { name: 'Greenwood', lat: 39.6137, lng: -86.1067 },
    { name: 'Avon', lat: 39.7628, lng: -86.3997 },
    { name: 'Plainfield', lat: 39.7042, lng: -86.3994 },
    { name: 'Zionsville', lat: 39.9509, lng: -86.2619 },
    { name: 'Brownsburg', lat: 39.8434, lng: -86.3978 }
  ];

  return indianaCities
    .map(city => ({
      ...city,
      distance: calculateDistance(centerLat, centerLng, city.lat, city.lng)
    }))
    .filter(city => city.distance <= radius)
    .sort((a, b) => a.distance - b.distance);
}
