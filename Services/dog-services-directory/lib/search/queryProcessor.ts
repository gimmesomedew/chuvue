import { extractEntities } from './entityExtractor';
import { resolveLocation } from './locationProcessor';
import { normalizeQuery } from './queryNormalizer';
import { classifySearchIntent } from './intentClassifier';

export interface ProcessedQuery {
  originalQuery: string;
  normalizedQuery: string;
  searchType: 'service' | 'product' | 'mixed' | 'location';
  entities: {
    services: string[];
    products: string[];
    locations: string[];
    filters: Record<string, any>;
    modifiers: string[];
  };
  location: {
    lat: number;
    lng: number;
    radius: number;
    city?: string;
    state?: string;
    zipCode?: string;
    isNearMe: boolean;
  } | null;
  filters: Record<string, any>;
  intent: string;
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
 * Main function to process natural language search queries
 * @param query - Raw user input query
 * @param userLocation - User's current location coordinates
 * @returns Processed and structured search query
 */
export async function processSearchQuery(
  query: string, 
  userLocation: UserLocation
): Promise<ProcessedQuery> {
  try {
    // Step 1: Normalize the query
    const normalizedQuery = normalizeQuery(query);
    
    // Step 2: Extract entities from the query
    const entities = extractEntities(normalizedQuery);
    
    // Step 3: Classify search intent
    const intent = classifySearchIntent(entities, normalizedQuery);
    
    // Step 4: Process location information
    const location = await resolveLocation(entities.locations, userLocation);
    
    // Step 5: Determine search type
    const searchType = determineSearchType(entities, intent);
    
    // Step 6: Build filters object
    const filters = buildFilters(entities, location);
    
    // Step 7: Calculate confidence score
    const confidence = calculateConfidence(entities, location, intent);
    
    return {
      originalQuery: query,
      normalizedQuery,
      searchType,
      entities,
      location,
      filters,
      intent: intent.description,
      confidence
    };
    
  } catch (error) {
    console.error('Error processing search query:', error);
    throw new Error(`Failed to process search query: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Determine the type of search based on entities and intent
 */
function determineSearchType(
  entities: any, 
  intent: any
): 'service' | 'product' | 'mixed' | 'location' {
  const hasServices = entities.services.length > 0;
  const hasProducts = entities.products.length > 0;
  
  if (hasServices && hasProducts) return 'mixed';
  if (hasServices) return 'service';
  if (hasProducts) return 'product';
  
  // Default to service search if no specific type detected
  return 'service';
}

/**
 * Build comprehensive filters object from entities and location
 */
function buildFilters(entities: any, location: any): Record<string, any> {
  const filters: Record<string, any> = {};
  
  // Service-specific filters
  if (entities.filters.service) {
    filters.service = entities.filters.service;
  }
  
  // Product-specific filters
  if (entities.filters.product) {
    filters.product = entities.filters.product;
  }
  
  // Location filters - only if location data exists
  if (location && location !== null) {
    if (location.city) filters.city = location.city;
    if (location.state) filters.state = location.state;
    if (location.zipCode) filters.zipCode = location.zipCode;
  }
  
  // General filters
  if (entities.filters.availability) filters.availability = entities.filters.availability;
  if (entities.filters.rating) filters.rating = entities.filters.rating;
  if (entities.filters.price) filters.price = entities.filters.price;
  
  // Special filters
  if (entities.filters.emergency) filters.emergency = true;
  if (entities.filters.mobile) filters.mobile = true;
  if (entities.filters.organic) filters.organic = true;
  if (entities.filters.premium) filters.premium = true;
  
  return filters;
}

/**
 * Calculate confidence score for the search interpretation
 */
function calculateConfidence(
  entities: any, 
  location: any, 
  intent: any
): number {
  let confidence = 0.5; // Base confidence
  
  // Entity confidence
  if (entities.services.length > 0) confidence += 0.2;
  if (entities.products.length > 0) confidence += 0.2;
  if (entities.locations.length > 0) confidence += 0.15;
  
  // Location confidence - only if location data exists
  if (location && location !== null) {
    if (location.city || location.zipCode) confidence += 0.1;
    if (location.lat && location.lng) confidence += 0.05;
  }
  
  // Intent confidence
  if (intent.confidence) confidence += intent.confidence * 0.1;
  
  // Cap at 1.0
  return Math.min(confidence, 1.0);
}

/**
 * Process multiple queries and return the best match
 */
export async function processMultipleQueries(
  queries: string[], 
  userLocation: UserLocation
): Promise<ProcessedQuery[]> {
  const processedQueries = await Promise.all(
    queries.map(query => processSearchQuery(query, userLocation))
  );
  
  // Sort by confidence score
  return processedQueries.sort((a, b) => b.confidence - a.confidence);
}

/**
 * Validate processed query before proceeding
 */
export function validateProcessedQuery(query: ProcessedQuery): boolean {
  // Must have at least one searchable entity
  if (query.entities.services.length === 0 && 
      query.entities.products.length === 0) {
    return false;
  }
  
  // Location validation - only required if location data exists
  if (query.location && query.location !== null) {
    // Must have valid coordinates
    if (!query.location.lat || !query.location.lng) {
      return false;
    }
    
    // Must have reasonable radius
    if (query.location.radius < 1 || query.location.radius > 100) {
      return false;
    }
  }
  
  return true;
}
