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
  city: string;
  state: string;
  zip_code: string;
  service_type: string; // Field in the services table
  latitude: number;
  longitude: number;
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
