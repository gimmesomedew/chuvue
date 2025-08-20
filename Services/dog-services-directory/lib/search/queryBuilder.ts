import { ProcessedQuery } from './queryProcessor';

export interface DatabaseQuery {
  where: any;
  orderBy: any[];
  take: number;
  skip: number;
  include: any;
}

export interface SearchFilters {
  serviceType?: string[];
  productType?: string[];
  location?: {
    lat: number;
    lng: number;
    radius: number;
  };
  filters?: Record<string, any>;
  rating?: number;
  price?: {
    min?: number;
    max?: number;
  };
  availability?: string;
  mobile?: boolean;
  organic?: boolean;
  emergency?: boolean;
}

/**
 * Main function to build database query from processed search query
 * @param processedQuery - Processed and structured search query
 * @returns Database query object for Prisma
 */
export function buildSearchQuery(processedQuery: ProcessedQuery): DatabaseQuery {
  const baseQuery: DatabaseQuery = {
    where: {},
    orderBy: [],
    take: 1000, // Return up to 1000 results (all results)
    skip: 0,
    include: {
      reviews: {
        take: 5,
        orderBy: { createdAt: 'desc' }
      },
      tags: true
    }
  };

  // Build where clause based on search type
  if (processedQuery.searchType === 'service' || processedQuery.searchType === 'mixed') {
    baseQuery.where = buildServiceWhereClause(processedQuery);
  } else if (processedQuery.searchType === 'product') {
    baseQuery.where = buildProductWhereClause(processedQuery);
  }

  // Add location-based filtering ONLY if location data exists
  if (processedQuery.location && processedQuery.location !== null) {
    addLocationFilter(baseQuery.where, processedQuery.location);
  }

  // Add rating filters
  if (processedQuery.filters.rating) {
    addRatingFilter(baseQuery.where, processedQuery.filters.rating);
  }

  // Add availability filters
  if (processedQuery.filters.availability) {
    addAvailabilityFilter(baseQuery.where, processedQuery.filters.availability);
  }

  // Add special filters
  addSpecialFilters(baseQuery.where, processedQuery.filters);

  // Set ordering
  setQueryOrdering(baseQuery, processedQuery);

  return baseQuery;
}

/**
 * Build where clause for service searches
 */
function buildServiceWhereClause(processedQuery: ProcessedQuery): any {
  const whereClause: any = {
    isActive: true,
    OR: []
  };

  // Service type filtering
  if (processedQuery.entities.services.length > 0) {
    const serviceTypes = processedQuery.entities.services.map(service => ({
      service_type: {
        equals: service,
        mode: 'insensitive'
      }
    }));
    
    whereClause.OR.push(...serviceTypes);
  }

  // If no specific service types, include all active services
  if (processedQuery.entities.services.length === 0) {
    whereClause.OR.push({
      isActive: true // Include all active services
    });
  }

  // Add text search if available
  if (processedQuery.normalizedQuery) {
    whereClause.OR.push(
      {
        name: {
          contains: processedQuery.normalizedQuery,
          mode: 'insensitive'
        }
      },
      {
        description: {
          contains: processedQuery.normalizedQuery,
          mode: 'insensitive'
        }
      },
      {
        tags: {
          some: {
            name: {
              contains: processedQuery.normalizedQuery,
              mode: 'insensitive'
            }
          }
        }
      }
    );
  }

  return whereClause;
}

/**
 * Build where clause for product searches
 */
function buildProductWhereClause(processedQuery: ProcessedQuery): any {
  const whereClause: any = {
    inStock: true,
    OR: []
  };

  // Product type filtering
  if (processedQuery.entities.products.length > 0) {
    const productTypes = processedQuery.entities.products.map(product => ({
      category: {
        contains: product,
        mode: 'insensitive'
      }
    }));
    
    whereClause.OR.push(...productTypes);
  }

  // Text search
  if (processedQuery.normalizedQuery) {
    whereClause.OR.push(
      {
        name: {
          contains: processedQuery.normalizedQuery,
          mode: 'insensitive'
        }
      },
      {
        description: {
          contains: processedQuery.normalizedQuery,
          mode: 'insensitive'
        }
      },
      {
        brand: {
          contains: processedQuery.normalizedQuery,
          mode: 'insensitive'
        }
      }
    );
  }

  return whereClause;
}

/**
 * Add location-based filtering to where clause
 */
function addLocationFilter(whereClause: any, location: any): void {
  // Early return if location is null or undefined
  if (!location || location === null) {
    return;
  }

  if (location.lat && location.lng && location.radius) {
    // Use the services_within_radius function from your database
    whereClause.location = {
      AND: [
        {
          lat: {
            gte: location.lat - (location.radius / 69), // Approximate degrees per mile
            lte: location.lat + (location.radius / 69)
          }
        },
        {
          lng: {
            gte: location.lng - (location.radius / 69),
            lte: location.lng + (location.radius / 69)
          }
        }
      ]
    };
  }

  // Add city/state/ZIP filtering
  if (location.city) {
    whereClause.city = {
      contains: location.city,
      mode: 'insensitive'
    };
  }

  if (location.state) {
    whereClause.state = {
      contains: location.state,
      mode: 'insensitive'
    };
  }

  if (location.zipCode) {
    whereClause.zipCode = location.zipCode;
  }
}

/**
 * Add rating filter to where clause
 */
function addRatingFilter(whereClause: any, minRating: number): void {
  whereClause.rating = {
    gte: minRating
  };
}

/**
 * Add availability filter to where clause
 */
function addAvailabilityFilter(whereClause: any, availability: string): void {
  if (availability === '24_7') {
    whereClause.businessHours = {
      some: {
        is24Hours: true
      }
    };
  } else if (availability === 'emergency') {
    whereClause.OR = whereClause.OR || [];
    whereClause.OR.push(
      { isEmergency: true },
      { isUrgent: true },
      { availability: { contains: 'emergency', mode: 'insensitive' } }
    );
  }
}

/**
 * Add special filters to where clause
 */
function addSpecialFilters(whereClause: any, filters: any): void {
  // Mobile service filter
  if (filters.mobile) {
    whereClause.isMobile = true;
  }

  // Organic filter
  if (filters.organic) {
    whereClause.OR = whereClause.OR || [];
    whereClause.OR.push(
      { tags: { some: { name: { contains: 'organic', mode: 'insensitive' } } } },
      { description: { contains: 'organic', mode: 'insensitive' } }
    );
  }

  // Emergency filter
  if (filters.emergency) {
    whereClause.isEmergency = true;
  }

  // Size filter for services
  if (filters.size && filters.size !== 'any') {
    whereClause.OR = whereClause.OR || [];
    whereClause.OR.push(
      { tags: { some: { name: { contains: filters.size, mode: 'insensitive' } } } },
      { description: { contains: filters.size, mode: 'insensitive' } }
    );
  }
}

/**
 * Set query ordering based on search context
 */
function setQueryOrdering(query: DatabaseQuery, processedQuery: ProcessedQuery): void {
  // Default ordering: rating (desc), then distance if location-based
  query.orderBy = [
    { rating: 'desc' },
    { reviewCount: 'desc' }
  ];

  // If location-based search, prioritize by distance
  if (processedQuery.location && processedQuery.location.lat && processedQuery.location.lng) {
    // Note: Distance calculation would need to be done in the database
    // or post-processing for accurate results
    query.orderBy.unshift({ id: 'asc' }); // Placeholder for distance-based ordering
  }

  // If premium/quality filter, prioritize by rating
  if (processedQuery.filters.quality === 'premium') {
    query.orderBy = [
      { rating: 'desc' },
      { reviewCount: 'desc' },
      { price: 'desc' } // Premium services often cost more
    ];
  }

  // If budget filter, prioritize by price
  if (processedQuery.filters.quality === 'budget') {
    query.orderBy = [
      { price: 'asc' },
      { rating: 'desc' }
    ];
  }
}

/**
 * Build fallback query if no results found
 */
export function buildFallbackQuery(
  originalQuery: DatabaseQuery, 
  processedQuery: ProcessedQuery
): DatabaseQuery {
  const fallbackQuery = { ...originalQuery };
  
  // Expand search radius
  if (processedQuery.location) {
    processedQuery.location.radius = Math.min(
      processedQuery.location.radius * 2, 
      100
    );
  }

  // Remove some restrictive filters
  if (fallbackQuery.where.rating) {
    delete fallbackQuery.where.rating;
  }

  // Add more general text search
  if (processedQuery.normalizedQuery) {
    const words = processedQuery.normalizedQuery.split(' ').filter(word => word.length > 2);
    if (words.length > 1) {
      // Try with fewer words
      const partialQuery = words.slice(0, Math.ceil(words.length / 2)).join(' ');
      fallbackQuery.where.OR.push(
        {
          name: {
            contains: partialQuery,
            mode: 'insensitive'
          }
        }
      );
    }
  }

  return fallbackQuery;
}

/**
 * Build query for search suggestions
 */
export function buildSuggestionQuery(query: string): DatabaseQuery {
  return {
    where: {
      OR: [
        {
          name: {
            contains: query,
            mode: 'insensitive'
          }
        },
        {
          description: {
            contains: query,
            mode: 'insensitive'
          }
        },
        {
          tags: {
            some: {
              name: {
                contains: query,
                mode: 'insensitive'
              }
            }
          }
        }
      ]
    },
    orderBy: [
      { rating: 'desc' },
      { reviewCount: 'desc' }
    ],
    take: 10,
    skip: 0,
    include: {
      tags: true
    }
  };
}
