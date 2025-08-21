// Service Types
export interface ServiceDefinition {
  id?: string;
  service_name: string;
  service_type: string;
  service_description: string;
  badge_color: string;
  created_at?: string;
  updated_at?: string;
}

export interface ServiceLocation {
  id: number;
  name: string;
  city: string;
  state: string;
  zip_code: string;
  latitude?: number;
  longitude?: number;
}

export interface Service {
  id: string; // UUID in the database
  name: string;
  description: string;
  address: string;
  address_line_2?: string;
  city: string;
  state: string;
  zip_code: string;
  service_type: string; // Field in the services table
  latitude: number;
  longitude: number;
  needs_geocoding_review?: boolean;
  image_url?: string;
  email?: string;
  website_url?: string;
  facebook_url?: string;
  instagram_url?: string;
  twitter_url?: string;
  service_url?: string;
  searchPage_url?: string;
  gMapsID?: string;
  rating?: number;
  review_count?: number;
  is_verified?: boolean;
  featured?: string; // 'Y' for featured, 'N' for not featured
  created_at?: string;
  updated_at?: string;
}

/**
 * Extends the Service interface to include distance information
 * Used when sorting services by distance from the user's location
 */
export interface ServiceWithDistance extends Service {
  distance: number;
}

// Product Types
export interface Product {
  id: number;
  name: string;
  description?: string;
  website?: string;
  contact_number?: string;
  email?: string;
  location_address?: string;
  address_line_2?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  latitude?: number;
  longitude?: number;
  is_verified_gentle_care: boolean;
  image_url?: string;
  screenshot_url?: string;
  screenshot_updated_at?: string;
  created_at: string;
  updated_at: string;
  categories?: ProductCategory[];
}

export interface ProductCategory {
  id: number;
  name: string;
  description?: string;
  color: string;
  created_at: string;
}

export interface ProductCategoryMapping {
  product_id: number;
  category_id: number;
}

export interface ProductSearchResult {
  id: number;
  name: string;
  description?: string;
  website?: string;
  contact_number?: string;
  email?: string;
  location_address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  latitude?: number;
  longitude?: number;
  is_verified_gentle_care: boolean;
  categories: ProductCategory[];
  distance?: number; // For location-based searches
  type: 'product'; // To distinguish from services
}

export interface ProductSearchFilters {
  categories?: string[];
  verified_only?: boolean;
  has_location?: boolean;
  price_range?: {
    min?: number;
    max?: number;
  };
}

export interface ProductSearchQuery {
  query: string;
  filters?: ProductSearchFilters;
  userLocation?: {
    lat: number;
    lng: number;
    zip?: string;
    city?: string;
    state?: string;
  };
}
