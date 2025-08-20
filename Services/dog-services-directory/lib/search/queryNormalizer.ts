/**
 * Normalize search query by cleaning and standardizing input
 */
export function normalizeQuery(query: string): string {
  return query
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/[^\w\s]/g, ' ') // Remove special characters except spaces
    .trim();
}
