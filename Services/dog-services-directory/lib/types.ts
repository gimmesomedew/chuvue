// Service Types
export interface ServiceDefinition {
  id: number;
  service_name: string;
  service_value: string; // Changed from service_slug to service_value
  service_description?: string;
  service_icon?: string;
  created_at?: string;
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
  city: string;
  state: string;
  zip_code: string;
  service_type: string; // Custom type in the database
  latitude: number;
  longitude: number;
  image_url?: string;
  email?: string;
  website_url?: string; // Changed from website to website_url per schema
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
