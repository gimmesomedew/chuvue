// Default coordinates for Indiana (can be expanded for other states)
const DEFAULT_COORDINATES = {
  latitude: 39.8282,  // Indianapolis center
  longitude: -86.1384,
};

// State-specific default coordinates (expandable)
const STATE_DEFAULTS: Record<string, { latitude: number; longitude: number }> = {
  'IN': { latitude: 39.8282, longitude: -86.1384 }, // Indiana
  'IL': { latitude: 40.6331, longitude: -89.3985 }, // Illinois
  'OH': { latitude: 40.3888, longitude: -82.7649 }, // Ohio
  'MI': { latitude: 44.3148, longitude: -85.6024 }, // Michigan
  'KY': { latitude: 37.6681, longitude: -84.6701 }, // Kentucky
  'CA': { latitude: 36.7783, longitude: -119.4179 }, // California
};

export interface GeocodingResult {
  success: boolean;
  latitude?: number;
  longitude?: number;
  needsReview?: boolean;
}

/**
 * Attempts to geocode an address using Nominatim
 */
export async function attemptGeocoding(
  address: string, 
  city: string, 
  state: string, 
  zipCode: string
): Promise<GeocodingResult> {
  const queries = [
    `${address}, ${city}, ${state} ${zipCode}`,
    `${city}, ${state} ${zipCode}`,
    `${address}, ${city}, ${state}`,
    `${city}, ${state}`
  ];
  
  for (let i = 0; i < queries.length; i++) {
    const query = queries[i];
    
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
      const res = await fetch(url, { 
        headers: { 'User-Agent': 'DogServicesDirectory/1.0' } 
      });
      
      if (res.ok) {
        const data = await res.json();
        
        if (data && data.length > 0) {
          return {
            success: true,
            latitude: parseFloat(data[0].lat),
            longitude: parseFloat(data[0].lon),
            needsReview: i > 0 // Mark as needing review if we used a fallback query
          };
        }
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
    
    // Add a small delay between attempts to respect rate limits
    if (i < queries.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return { success: false, needsReview: true };
}

/**
 * Gets default coordinates for a state, or falls back to Indiana
 */
export function getDefaultCoordinates(state?: string): { latitude: number; longitude: number } {
  if (state && STATE_DEFAULTS[state]) {
    return STATE_DEFAULTS[state];
  }
  return DEFAULT_COORDINATES;
}

/**
 * Determines if coordinates need review
 */
export function needsGeocodingReview(latitude: number | string, longitude: number | string): boolean {
  // Check if coordinates are valid numbers
  const lat = typeof latitude === 'string' ? parseFloat(latitude) : latitude;
  const lng = typeof longitude === 'string' ? parseFloat(longitude) : longitude;
  
  return isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0;
}

/**
 * Simple geocoding function for address strings
 */
export async function geocodeAddress(address: string): Promise<{
  success: boolean;
  latitude?: number;
  longitude?: number;
  city?: string;
  state?: string;
  zipCode?: string;
}> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
    const res = await fetch(url, { 
      headers: { 'User-Agent': 'DogServicesDirectory/1.0' } 
    });
    
    if (res.ok) {
      const data = await res.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        return {
          success: true,
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
          city: result.address?.city || result.address?.town,
          state: result.address?.state,
          zipCode: result.address?.postcode
        };
      }
    }
    
    return { success: false };
  } catch (error) {
    console.error('Geocoding error:', error);
    return { success: false };
  }
}

/**
 * Reverse geocoding function for coordinates to address
 */
export async function reverseGeocode(latitude: number, longitude: number): Promise<{
  success: boolean;
  city?: string;
  state?: string;
  zipCode?: string;
}> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`;
    const res = await fetch(url, { 
      headers: { 'User-Agent': 'DogServicesDirectory/1.0' } 
    });
    
    if (res.ok) {
      const data = await res.json();
      
      if (data && data.address) {
        return {
          success: true,
          city: data.address.city || data.address.town || data.address.village,
          state: data.address.state,
          zipCode: data.address.postcode
        };
      }
    }
    
    return { success: false };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return { success: false };
  }
} 