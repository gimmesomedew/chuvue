import { getSynonyms } from './synonyms';

export interface ExtractedEntities {
  services: string[];
  products: string[];
  locations: string[];
  filters: Record<string, any>;
  modifiers: string[];
}

/**
 * Main function to extract entities from natural language queries
 * @param query - Normalized search query
 * @returns Object containing all extracted entities
 */
export function extractEntities(query: string): ExtractedEntities {
  const normalizedQuery = query.toLowerCase().trim();
  
  const entities = {
    services: extractServiceTypes(normalizedQuery),
    products: extractProductTypes(normalizedQuery),
    locations: extractLocations(normalizedQuery),
    filters: extractFilters(normalizedQuery),
    modifiers: extractModifiers(normalizedQuery)
  };
  
  console.log('=== ENTITY EXTRACTION DEBUG ===');
  console.log('Input query:', query);
  console.log('Normalized query:', normalizedQuery);
  console.log('Extracted entities:', entities);
  
  return entities;
}

/**
 * Extract service types from the query
 */
function extractServiceTypes(query: string): string[] {
  const servicePatterns = {
    groomer: /(grooming?|groomer|salon|spa|wash|bath|trim|cut|style|groom)/gi,
    dog_trainer: /(training?|trainer|obedience|behavior|puppy|agility|dog training|dog trainer)/gi,
    veterinarian: /(veterinary|vet|veterinarian|clinic|hospital|emergency|urgent|surgery|health|holistic|holistic vet|holistic veterinarian)/gi,
    boarding_daycare: /(daycare|day care|day-care|boarding|kennel|pet sitting|pet-sitting|sitter|overnight|pet care)/gi,
    dog_park: /(dog park|dog parks|park|parks|playground|play area|off leash|off-leash|fenced|outdoor)/gi,
    pet_products: /(products|supplies|food|toys|beds|collars|leashes|treats|accessories|pet store|pet shop)/gi,
    apartments: /(apartment|apartments|rental|rentals|housing|residence|residential|pet friendly|pet-friendly)/gi,
    landscape_contractors: /(landscaping|landscape|yard|garden|outdoor|maintenance|contractor|contractors)/gi
  };

  const foundServices: string[] = [];
  
  for (const [serviceType, pattern] of Object.entries(servicePatterns)) {
    if (pattern.test(query)) {
      foundServices.push(serviceType);
    }
  }

  // Check for synonyms
  const synonymServices = findServiceSynonyms(query);
  foundServices.push(...synonymServices);

  return Array.from(new Set(foundServices)); // Remove duplicates
}

/**
 * Extract product types from the query
 */
function extractProductTypes(query: string): string[] {
  const productPatterns = {
    food: /(food|kibble|wet food|canned|dry food|raw|fresh|homemade|organic|grain-free|grain free)/gi,
    toys: /(toy|toys|chew toy|chew-toy|ball|frisbee|rope|tug|interactive|puzzle)/gi,
    beds: /(bed|beds|bedding|crate|mat|cushion|pillow|nest)/gi,
    collars: /(collar|collars|harness|leash|leashes|tag|tags|identification)/gi,
    treats: /(treat|treats|snack|snacks|biscuit|biscuits|reward|rewards)/gi,
    supplements: /(supplement|supplements|vitamin|vitamins|probiotic|probiotics|oil|oils)/gi,
    accessories: /(bowl|bowls|feeder|water|clothing|costume|jacket|sweater|boots|shoes)/gi
  };

  const foundProducts: string[] = [];
  
  for (const [productType, pattern] of Object.entries(productPatterns)) {
    if (pattern.test(query)) {
      foundProducts.push(productType);
    }
  }

  // Check for synonyms
  const synonymProducts = findProductSynonyms(query);
  foundProducts.push(...synonymProducts);

  return Array.from(new Set(foundProducts)); // Remove duplicates
}

/**
 * Extract location information from the query
 */
function extractLocations(query: string): string[] {
  const locations: string[] = [];
  
  // Indiana cities
  const indianaCities = [
    'indianapolis', 'indy', 'fishers', 'carmel', 'noblesville', 'westfield',
    'greenwood', 'avon', 'plainfield', 'zionsville', 'brownsburg', 'danville',
    'pittsboro', 'lizton', 'coatesville', 'clayton', 'amity', 'bainbridge'
  ];

  // Check for Indiana cities
  for (const city of indianaCities) {
    if (query.includes(city)) {
      locations.push(city);
    }
  }

  // Check for "near me" or similar location indicators
  const nearMePatterns = [
    /near me/gi,
    /close to me/gi,
    /nearby/gi,
    /local/gi,
    /in my area/gi,
    /around here/gi
  ];

  for (const pattern of nearMePatterns) {
    if (pattern.test(query)) {
      locations.push('near_me');
    }
  }

  // Check for ZIP codes (5 digits)
  const zipCodePattern = /\b\d{5}\b/g;
  const zipMatches = query.match(zipCodePattern);
  if (zipMatches) {
    locations.push(...zipMatches);
  }

  // Check for state abbreviations
  const statePattern = /\b(in|indiana)\b/gi;
  if (statePattern.test(query)) {
    locations.push('IN');
  }

  return Array.from(new Set(locations));
}

/**
 * Extract filters and special requirements from the query
 */
function extractFilters(query: string): Record<string, any> {
  const filters: Record<string, any> = {};

  // Availability filters
  if (/(24\/7|24-7|24 hours|24hr|24 hr|all day|all night|overnight)/gi.test(query)) {
    filters.availability = '24_7';
  } else if (/(emergency|urgent|immediate|asap|right now|now)/gi.test(query)) {
    filters.availability = 'emergency';
  }

  // Service type filters
  if (/(mobile|house call|house-call|come to me|at home|in home)/gi.test(query)) {
    filters.mobile = true;
  }

  // Quality filters
  if (/(premium|luxury|high-end|high end|best|top rated|top-rated|excellent|quality)/gi.test(query)) {
    filters.quality = 'premium';
  } else if (/(cheap|budget|affordable|inexpensive|low cost|low-cost)/gi.test(query)) {
    filters.quality = 'budget';
  }

  // Special requirements
  if (/(organic|natural|holistic|homeopathic|alternative)/gi.test(query)) {
    filters.organic = true;
  }

  if (/(senior|elderly|old|aging|geriatric)/gi.test(query)) {
    filters.senior = true;
  }

  if (/(puppy|young|baby|newborn)/gi.test(query)) {
    filters.puppy = true;
  }

  if (/(large|big|giant|small|tiny|toy|mini)/gi.test(query)) {
    filters.size = extractSizeFilter(query);
  }

  // Rating filters
  const ratingMatch = query.match(/(\d+)\+?\s*(star|stars|rating|rated)/gi);
  if (ratingMatch) {
    const rating = ratingMatch[0].match(/\d+/);
    if (rating) {
      filters.minRating = parseInt(rating[0]);
    }
  }

  return filters;
}

/**
 * Extract modifiers and descriptive terms
 */
function extractModifiers(query: string): string[] {
  const modifiers: string[] = [];
  
  const modifierPatterns = [
    /(best|top|excellent|amazing|outstanding|superior)/gi,
    /(cheap|affordable|budget|inexpensive|reasonable)/gi,
    /(fast|quick|rapid|swift|immediate)/gi,
    /(friendly|kind|caring|gentle|patient)/gi,
    /(experienced|professional|certified|licensed|qualified)/gi,
    /(convenient|accessible|easy|simple|straightforward)/gi
  ];

  for (const pattern of modifierPatterns) {
    const matches = query.match(pattern);
    if (matches) {
      modifiers.push(...matches.map(m => m.toLowerCase()));
    }
  }

  return Array.from(new Set(modifiers));
}

/**
 * Extract size-related filters
 */
function extractSizeFilter(query: string): string {
  if (/(large|big|giant|huge)/gi.test(query)) return 'large';
  if (/(medium|average|standard)/gi.test(query)) return 'medium';
  if (/(small|tiny|toy|mini|miniature)/gi.test(query)) return 'small';
  return 'any';
}

/**
 * Find service synonyms
 */
function findServiceSynonyms(query: string): string[] {
  const synonyms = getSynonyms();
  const foundServices: string[] = [];
  
  for (const [canonical, variations] of Object.entries(synonyms.services)) {
    for (const variation of variations) {
      if (query.includes(variation.toLowerCase())) {
        foundServices.push(canonical);
        break;
      }
    }
  }
  
  return foundServices;
}

/**
 * Find product synonyms
 */
function findProductSynonyms(query: string): string[] {
  const synonyms = getSynonyms();
  const foundProducts: string[] = [];
  
  for (const [canonical, variations] of Object.entries(synonyms.products)) {
    for (const variation of variations) {
      if (query.includes(variation.toLowerCase())) {
        foundProducts.push(canonical);
        break;
      }
    }
  }
  
  return foundProducts;
}

/**
 * Extract business hours or time-related filters
 */
export function extractTimeFilters(query: string): Record<string, any> {
  const timeFilters: Record<string, any> = {};
  
  // Business hours
  if (/(early morning|morning|afternoon|evening|night|late night)/gi.test(query)) {
    timeFilters.timeOfDay = query.match(/(early morning|morning|afternoon|evening|night|late night)/gi)?.[0];
  }
  
  // Days of week
  if (/(monday|tuesday|wednesday|thursday|friday|saturday|sunday|weekend|weekday)/gi.test(query)) {
    timeFilters.days = query.match(/(monday|tuesday|wednesday|thursday|friday|saturday|sunday|weekend|weekday)/gi);
  }
  
  return timeFilters;
}
