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
  address_line_2?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  latitude?: number;
  longitude?: number;
  is_verified_gentle_care: boolean;
  image_url?: string;
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
