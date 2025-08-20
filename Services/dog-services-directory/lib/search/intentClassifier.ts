import { ExtractedEntities } from './entityExtractor';

export interface SearchIntent {
  description: string;
  confidence: number;
  category: 'service' | 'product' | 'location' | 'mixed';
}

/**
 * Classify search intent based on extracted entities
 */
export function classifySearchIntent(
  entities: ExtractedEntities, 
  query: string
): SearchIntent {
  let confidence = 0.5;
  let category: 'service' | 'product' | 'location' | 'mixed' = 'mixed';
  let description = '';

  // Determine primary category
  if (entities.services.length > 0 && entities.products.length === 0) {
    category = 'service';
    confidence += 0.3;
    description = `Looking for ${entities.services.join(', ')} services`;
  } else if (entities.products.length > 0 && entities.services.length === 0) {
    category = 'product';
    confidence += 0.3;
    description = `Looking for ${entities.products.join(', ')} products`;
  } else if (entities.services.length > 0 && entities.products.length > 0) {
    category = 'mixed';
    confidence += 0.2;
    description = `Looking for services and products`;
  } else if (entities.locations.length > 0) {
    category = 'location';
    confidence += 0.2;
    description = `Location-based search`;
  }

  // Boost confidence based on entity count
  if (entities.services.length > 0) confidence += 0.1;
  if (entities.products.length > 0) confidence += 0.1;
  if (entities.locations.length > 0) confidence += 0.1;

  return { description, confidence: Math.min(confidence, 1.0), category };
}
