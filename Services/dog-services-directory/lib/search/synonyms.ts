export interface SynonymMap {
  services: Record<string, string[]>;
  products: Record<string, string[]>;
  locations: Record<string, string[]>;
  businessTypes: Record<string, string[]>;
  filters: Record<string, string[]>;
}

/**
 * Get comprehensive synonym mappings for search queries
 * @returns Object containing all synonym mappings
 */
export function getSynonyms(): SynonymMap {
  return {
    services: {
      groomer: [
        'groomer', 'grooming salon', 'pet salon', 'dog spa', 'pet spa',
        'grooming service', 'pet grooming', 'dog grooming', 'cat grooming',
        'pet wash', 'dog wash', 'cat wash', 'pet bath', 'dog bath', 'cat bath',
        'pet trim', 'dog trim', 'cat trim', 'pet cut', 'dog cut', 'cat cut',
        'pet style', 'dog style', 'cat style', 'pet haircut', 'dog haircut',
        'pet nail trim', 'dog nail trim', 'cat nail trim', 'pet nail clipping',
        'pet ear cleaning', 'dog ear cleaning', 'cat ear cleaning'
      ],

      dog_trainer: [
        'dog trainer', 'pet trainer', 'dog training service', 'pet training service',
        'dog obedience', 'pet obedience', 'dog behavior', 'pet behavior',
        'puppy training', 'puppy class', 'dog class', 'pet class',
        'dog agility', 'pet agility', 'dog socialization', 'pet socialization',
        'dog manners', 'pet manners', 'dog commands', 'pet commands'
      ],
      veterinarian: [
        'vet', 'veterinarian', 'veterinary clinic', 'vet clinic',
        'veterinary hospital', 'vet hospital', 'pet hospital', 'animal hospital',
        'emergency vet', 'emergency veterinarian', 'urgent care vet',
        'urgent care veterinarian', 'pet doctor', 'animal doctor',
        'veterinary surgery', 'vet surgery', 'pet surgery', 'animal surgery',
        'holistic vet', 'holistic veterinarian', 'health practitioner'
      ],
      boarding_daycare: [
        'daycare', 'day care', 'day-care', 'boarding', 'kennel', 'pet sitting', 'pet-sitting', 'sitter',
        'pet overnight', 'dog overnight', 'cat overnight'
      ],

      dog_park: [
        'dog park', 'dog parks', 'park', 'parks', 'playground', 'play area', 'off leash', 'off-leash',
        'fenced', 'outdoor', 'recreation'
      ],
      pet_products: [
        'products', 'supplies', 'food', 'toys', 'beds', 'collars', 'leashes', 'treats', 'accessories',
        'pet store', 'pet shop', 'retail'
      ],
      apartments: [
        'apartment', 'apartments', 'rental', 'rentals', 'housing', 'residence', 'residential',
        'pet friendly', 'pet-friendly'
      ],
      landscape_contractors: [
        'landscaping', 'landscape', 'yard', 'garden', 'outdoor', 'maintenance', 'contractor', 'contractors'
      ]
    },
    products: {
      food: [
        'kibble', 'wet food', 'canned food', 'dry food', 'raw food',
        'fresh food', 'homemade food', 'organic food', 'grain-free food',
        'grain free food', 'natural food', 'premium food', 'budget food',
        'puppy food', 'adult food', 'senior food', 'large breed food',
        'small breed food', 'toy breed food', 'hypoallergenic food'
      ],
      toys: [
        'toy', 'chew toy', 'chew-toy', 'ball', 'frisbee', 'rope',
        'tug toy', 'tug-toy', 'interactive toy', 'puzzle toy',
        'plush toy', 'stuffed toy', 'squeaky toy', 'fetch toy',
        'training toy', 'agility toy', 'indoor toy', 'outdoor toy'
      ],
      beds: [
        'bed', 'bedding', 'crate', 'mat', 'cushion', 'pillow',
        'nest', 'sleeping area', 'rest area', 'comfort zone',
        'orthopedic bed', 'memory foam bed', 'heated bed', 'cooling bed',
        'elevated bed', 'donut bed', 'bolster bed', 'cave bed'
      ],
      collars: [
        'collar', 'harness', 'leash', 'tag', 'identification',
        'name tag', 'id tag', 'microchip', 'gps collar', 'smart collar',
        'training collar', 'shock collar', 'vibrating collar', 'bark collar',
        'flea collar', 'reflective collar', 'leather collar', 'nylon collar'
      ],
      treats: [
        'treat', 'snack', 'biscuit', 'reward', 'training treat',
        'dental treat', 'chew treat', 'soft treat', 'hard treat',
        'grain-free treat', 'organic treat', 'natural treat', 'low-calorie treat',
        'puppy treat', 'senior treat', 'large breed treat', 'small breed treat'
      ],
      supplements: [
        'supplement', 'vitamin', 'probiotic', 'oil', 'omega-3',
        'fish oil', 'joint supplement', 'skin supplement', 'coat supplement',
        'digestive supplement', 'immune supplement', 'calming supplement',
        'glucosamine', 'chondroitin', 'msm', 'cbd', 'hemp oil'
      ],
      accessories: [
        'bowl', 'feeder', 'water bowl', 'food bowl', 'automatic feeder',
        'slow feeder', 'puzzle feeder', 'clothing', 'costume', 'jacket',
        'sweater', 'boots', 'shoes', 'raincoat', 'winter coat',
        'life jacket', 'bandana', 'bow tie', 'hat', 'sunglasses'
      ]
    },
    locations: {
      indianapolis: ['indy', 'indianapolis in', 'indianapolis indiana'],
      fishers: ['fishers in', 'fishers indiana'],
      carmel: ['carmel in', 'carmel indiana'],
      noblesville: ['noblesville in', 'noblesville indiana'],
      westfield: ['westfield in', 'westfield indiana'],
      greenwood: ['greenwood in', 'greenwood indiana'],
      avon: ['avon in', 'avon indiana'],
      plainfield: ['plainfield in', 'plainfield indiana'],
      zionsville: ['zionsville in', 'zionsville indiana'],
      brownsburg: ['brownsburg in', 'brownsburg indiana'],
      danville: ['danville in', 'danville indiana'],
      pittsboro: ['pittsboro in', 'pittsboro indiana'],
      lizton: ['lizton in', 'lizton indiana'],
      coatesville: ['coatesville in', 'coatesville indiana'],
      clayton: ['clayton in', 'clayton indiana'],
      amity: ['amity in', 'amity indiana'],
      bainbridge: ['bainbridge in', 'bainbridge indiana']
    },
    businessTypes: {
      clinic: ['veterinary', 'vet', 'animal hospital', 'pet hospital'],
      salon: ['grooming', 'groomer', 'pet spa', 'dog spa'],
      kennel: ['boarding', 'daycare', 'day care', 'pet sitting'],
      store: ['shop', 'retail', 'pet store', 'pet shop', 'supply store'],
      mobile: ['house call', 'house-call', 'come to me', 'at home', 'in home'],
      emergency: ['urgent', '24/7', '24-7', '24 hours', 'overnight']
    },
    filters: {
      premium: ['luxury', 'high-end', 'high end', 'best', 'top rated', 'top-rated', 'excellent', 'quality'],
      budget: ['cheap', 'affordable', 'inexpensive', 'low cost', 'low-cost', 'economical'],
      organic: ['natural', 'holistic', 'homeopathic', 'alternative', 'chemical-free'],
      emergency: ['urgent', 'immediate', 'asap', 'right now', 'now', 'critical'],
      mobile: ['house call', 'house-call', 'come to me', 'at home', 'in home', 'traveling'],
      senior: ['elderly', 'old', 'aging', 'geriatric', 'mature'],
      puppy: ['young', 'baby', 'newborn', 'juvenile', 'adolescent']
    }
  };
}

/**
 * Get service synonyms for a specific service type
 * @param serviceType - The canonical service type
 * @returns Array of synonym variations
 */
export function getServiceSynonyms(serviceType: string): string[] {
  const synonyms = getSynonyms();
  return synonyms.services[serviceType] || [];
}

/**
 * Get product synonyms for a specific product type
 * @param productType - The canonical product type
 * @returns Array of synonym variations
 */
export function getProductSynonyms(productType: string): string[] {
  const synonyms = getSynonyms();
  return synonyms.products[productType] || [];
}

/**
 * Get location synonyms for a specific location
 * @param location - The canonical location name
 * @returns Array of synonym variations
 */
export function getLocationSynonyms(location: string): string[] {
  const synonyms = getSynonyms();
  return synonyms.locations[location] || [];
}

/**
 * Get business type synonyms for a specific business type
 * @param businessType - The canonical business type
 * @returns Array of synonym variations
 */
export function getBusinessTypeSynonyms(businessType: string): string[] {
  const synonyms = getSynonyms();
  return synonyms.businessTypes[businessType] || [];
}

/**
 * Get filter synonyms for a specific filter
 * @param filter - The canonical filter name
 * @returns Array of synonym variations
 */
export function getFilterSynonyms(filter: string): string[] {
  const synonyms = getSynonyms();
  return synonyms.filters[filter] || [];
}

/**
 * Find the canonical term for a given synonym
 * @param synonym - The synonym to look up
 * @returns The canonical term or null if not found
 */
export function findCanonicalTerm(synonym: string): string | null {
  const synonyms = getSynonyms();
  const normalizedSynonym = synonym.toLowerCase().trim();

  // Check services
  for (const [canonical, variations] of Object.entries(synonyms.services)) {
    if (variations.some(v => v.toLowerCase() === normalizedSynonym)) {
      return canonical;
    }
  }

  // Check products
  for (const [canonical, variations] of Object.entries(synonyms.products)) {
    if (variations.some(v => v.toLowerCase() === normalizedSynonym)) {
      return canonical;
    }
  }

  // Check locations
  for (const [canonical, variations] of Object.entries(synonyms.locations)) {
    if (variations.some(v => v.toLowerCase() === normalizedSynonym)) {
      return canonical;
    }
  }

  // Check business types
  for (const [canonical, variations] of Object.entries(synonyms.businessTypes)) {
    if (variations.some(v => v.toLowerCase() === normalizedSynonym)) {
      return canonical;
    }
  }

  // Check filters
  for (const [canonical, variations] of Object.entries(synonyms.filters)) {
    if (variations.some(v => v.toLowerCase() === normalizedSynonym)) {
      return canonical;
    }
  }

  return null;
}

/**
 * Expand a search query with synonyms for better matching
 * @param query - The original search query
 * @returns Expanded query with synonyms
 */
export function expandQueryWithSynonyms(query: string): string[] {
  const expandedQueries = [query];
  const synonyms = getSynonyms();
  const words = query.toLowerCase().split(' ');

  // For each word, try to find synonyms and create expanded queries
  words.forEach((word, index) => {
    if (word.length < 3) return; // Skip very short words

    // Check if this word is a synonym for any canonical term
    const canonical = findCanonicalTerm(word);
    if (canonical) {
      // Create expanded query with canonical term
      const expandedWords = [...words];
      expandedWords[index] = canonical;
      expandedQueries.push(expandedWords.join(' '));

      // Also add queries with additional synonyms
      const wordSynonyms = getServiceSynonyms(canonical) || 
                          getProductSynonyms(canonical) || 
                          getLocationSynonyms(canonical) || 
                          getBusinessTypeSynonyms(canonical) || 
                          getFilterSynonyms(canonical);

      wordSynonyms.slice(0, 3).forEach(synonym => {
        const synonymWords = [...words];
        synonymWords[index] = synonym;
        expandedQueries.push(synonymWords.join(' '));
      });
    }
  });

  return Array.from(new Set(expandedQueries)); // Remove duplicates
}

/**
 * Get common misspellings and variations for search terms
 * @param term - The term to get misspellings for
 * @returns Array of common misspellings and variations
 */
export function getCommonMisspellings(term: string): string[] {
  const misspellings: Record<string, string[]> = {
    'grooming': ['grooming', 'grooming', 'grooming', 'grooming'],
    'veterinary': ['veterinary', 'veterinary', 'veterinary', 'veterinary'],
    'training': ['training', 'training', 'training', 'training'],
    'walking': ['walking', 'walking', 'walking', 'walking'],
    'daycare': ['daycare', 'day care', 'day-care', 'day care'],
    'indianapolis': ['indianapolis', 'indianapolis', 'indianapolis', 'indy'],
    'fishers': ['fishers', 'fishers', 'fishers', 'fishers'],
    'carmel': ['carmel', 'carmel', 'carmel', 'carmel'],
    'noblesville': ['noblesville', 'noblesville', 'noblesville', 'noblesville']
  };

  return misspellings[term.toLowerCase()] || [];
}

/**
 * Normalize a search term using synonyms and common variations
 * @param term - The term to normalize
 * @returns Normalized term
 */
export function normalizeSearchTerm(term: string): string {
  const canonical = findCanonicalTerm(term);
  return canonical || term;
}

/**
 * Get search suggestions based on partial input
 * @param partialInput - Partial search input
 * @returns Array of search suggestions
 */
export function getSearchSuggestions(partialInput: string): string[] {
  const suggestions: string[] = [];
  const synonyms = getSynonyms();
  const normalizedInput = partialInput.toLowerCase().trim();

  // Add service suggestions
  Object.keys(synonyms.services).forEach(service => {
    if (service.includes(normalizedInput) || 
        synonyms.services[service].some(syn => syn.includes(normalizedInput))) {
      suggestions.push(service);
    }
  });

  // Add product suggestions
  Object.keys(synonyms.products).forEach(product => {
    if (product.includes(normalizedInput) || 
        synonyms.products[product].some(syn => syn.includes(normalizedInput))) {
      suggestions.push(product);
    }
  });

  // Add location suggestions
  Object.keys(synonyms.locations).forEach(location => {
    if (location.includes(normalizedInput) || 
        synonyms.locations[location].some(syn => syn.includes(normalizedInput))) {
      suggestions.push(location);
    }
  });

  return suggestions.slice(0, 10); // Limit to 10 suggestions
}
