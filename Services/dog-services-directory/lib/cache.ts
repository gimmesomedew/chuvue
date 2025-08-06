import { Service } from './types';

// Cache configuration
const CACHE_CONFIG = {
  TTL: 300, // 5 minutes in seconds
  MAX_SIZE: 1000, // Maximum number of cached items
  CLEANUP_INTERVAL: 60000, // Cleanup every minute
} as const;

// Cache entry interface
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

// Memory cache implementation
class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Start cleanup interval
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, CACHE_CONFIG.CLEANUP_INTERVAL);
  }

  /**
   * Generate a cache key from search parameters
   */
  generateKey(serviceType: string, state: string, zipCode: string, page: number, perPage: number): string {
    const params = [serviceType, state, zipCode, page.toString(), perPage.toString()].filter(Boolean);
    return `search:${params.join(':')}`;
  }

  /**
   * Generate a cache key for all results (no pagination)
   */
  generateAllResultsKey(serviceType: string, state: string, zipCode: string): string {
    const params = [serviceType, state, zipCode].filter(Boolean);
    return `search:all:${params.join(':')}`;
  }

  /**
   * Set a value in the cache
   */
  set<T>(key: string, data: T, ttl: number = CACHE_CONFIG.TTL): void {
    // Remove oldest entries if cache is full
    if (this.cache.size >= CACHE_CONFIG.MAX_SIZE) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl * 1000, // Convert to milliseconds
    });
  }

  /**
   * Get a value from the cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if entry has expired
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Delete a value from the cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get all cache keys for invalidation
   */
  getKeys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; maxSize: number; hitRate: number } {
    return {
      size: this.cache.size,
      maxSize: CACHE_CONFIG.MAX_SIZE,
      hitRate: 0, // TODO: Implement hit rate tracking
    };
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];
    
    this.cache.forEach((entry, key) => {
      if (now - entry.timestamp > entry.ttl) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * Destroy the cache and cleanup interval
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.cache.clear();
  }
}

// Create singleton cache instance
const cache = new MemoryCache();

/**
 * Search result cache interface
 */
export interface SearchCache {
  // Paginated search results
  getSearchResults(serviceType: string, state: string, zipCode: string, page: number, perPage: number): Promise<{ services: Service[]; totalPages: number; total: number } | null>;
  setSearchResults(serviceType: string, state: string, zipCode: string, page: number, perPage: number, data: { services: Service[]; totalPages: number; total: number }): Promise<void>;
  
  // All search results (for filtering)
  getAllSearchResults(serviceType: string, state: string, zipCode: string): Promise<{ services: Service[]; total: number } | null>;
  setAllSearchResults(serviceType: string, state: string, zipCode: string, data: { services: Service[]; total: number }): Promise<void>;
  
  // Cache management
  invalidateSearchResults(serviceType?: string, state?: string, zipCode?: string): Promise<void>;
  getStats(): Promise<{ size: number; maxSize: number; hitRate: number }>;
  clear(): Promise<void>;
}

/**
 * Memory-based search cache implementation
 */
class MemorySearchCache implements SearchCache {
  async getSearchResults(
    serviceType: string, 
    state: string, 
    zipCode: string, 
    page: number, 
    perPage: number
  ): Promise<{ services: Service[]; totalPages: number; total: number } | null> {
    const key = cache.generateKey(serviceType, state, zipCode, page, perPage);
    return cache.get(key);
  }

  async setSearchResults(
    serviceType: string, 
    state: string, 
    zipCode: string, 
    page: number, 
    perPage: number, 
    data: { services: Service[]; totalPages: number; total: number }
  ): Promise<void> {
    const key = cache.generateKey(serviceType, state, zipCode, page, perPage);
    cache.set(key, data);
  }

  async getAllSearchResults(
    serviceType: string, 
    state: string, 
    zipCode: string
  ): Promise<{ services: Service[]; total: number } | null> {
    const key = cache.generateAllResultsKey(serviceType, state, zipCode);
    return cache.get(key);
  }

  async setAllSearchResults(
    serviceType: string, 
    state: string, 
    zipCode: string, 
    data: { services: Service[]; total: number }
  ): Promise<void> {
    const key = cache.generateAllResultsKey(serviceType, state, zipCode);
    cache.set(key, data);
  }

  async invalidateSearchResults(serviceType?: string, state?: string, zipCode?: string): Promise<void> {
    // Clear all cache entries that match the provided parameters
    const keysToDelete: string[] = [];
    
    cache.getKeys().forEach(key => {
      if (key.startsWith('search:')) {
        const parts = key.split(':');
        
        // Check if this entry matches our invalidation criteria
        let shouldInvalidate = true;
        
        if (serviceType && parts[1] !== serviceType) shouldInvalidate = false;
        if (state && parts[2] !== state) shouldInvalidate = false;
        if (zipCode && parts[3] !== zipCode) shouldInvalidate = false;
        
        if (shouldInvalidate) {
          keysToDelete.push(key);
        }
      }
    });
    
    // Delete the keys outside of the iteration to avoid modification during iteration
    keysToDelete.forEach(key => cache.delete(key));
  }

  async getStats(): Promise<{ size: number; maxSize: number; hitRate: number }> {
    return cache.getStats();
  }

  async clear(): Promise<void> {
    cache.clear();
  }
}

// Export singleton instance
export const searchCache = new MemorySearchCache();

// Export cache configuration for external use
export { CACHE_CONFIG }; 