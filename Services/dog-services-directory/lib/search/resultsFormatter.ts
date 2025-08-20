import { SearchResult } from './databaseSearch';
import { ProcessedQuery } from './queryProcessor';

export interface FormattedResults {
  results: SearchResult[];
  metadata: {
    totalResults: number;
    searchRadius: number | null;
    queryInterpretation: string;
    filtersApplied: any;
  };
}

/**
 * Format search results for frontend consumption
 */
export async function formatSearchResults(
  searchResults: any, 
  userLocation: any, 
  processedQuery: ProcessedQuery
): Promise<FormattedResults> {
  // Calculate distances and format results ONLY if location data exists
  const formattedResults = searchResults.results.map((result: SearchResult) => {
    const baseResult = { ...result };
    
    // Only calculate distance if we have location data
    if (processedQuery.location && processedQuery.location !== null) {
      baseResult.distance = calculateDistance(
        userLocation.lat, 
        userLocation.lng, 
        result.location?.lat || 0, 
        result.location?.lng || 0
      );
    } else {
      baseResult.distance = undefined; // No distance calculation for non-location searches
    }
    
    return baseResult;
  });

  // Sort by distance if location-based search
  if (processedQuery.location && processedQuery.location !== null) {
    formattedResults.sort((a: any, b: any) => (a.distance || 0) - (b.distance || 0));
  }

  return {
    results: formattedResults,
    metadata: {
      totalResults: searchResults.totalCount,
      searchRadius: processedQuery.location?.radius || null,
      queryInterpretation: processedQuery.intent,
      filtersApplied: processedQuery.filters
    }
  };
}

/**
 * Calculate distance between two coordinates
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // Round to 1 decimal place
}
