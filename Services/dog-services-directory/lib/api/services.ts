import { supabase } from '../supabase';
import { Service } from '../types';

export interface SearchParams {
  serviceType: string;
  state: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
  radiusMiles?: number;
  page: number;
  perPage: number;
}

export interface SearchResponse {
  services: Service[];
  totalPages: number;
  total: number;
}

export const servicesApi = {
  search: async ({
    serviceType,
    state,
    zipCode,
    latitude,
    longitude,
    radiusMiles,
    page,
    perPage,
  }: SearchParams): Promise<SearchResponse> => {
    let query = supabase
      .from('services')
      .select('*', { count: 'exact' });

    // If lat/lon provided call RPC and return all rows (no count)
    if (latitude !== undefined && longitude !== undefined) {
      const { data, error } = await supabase.rpc('services_within_radius', {
        p_lat: latitude,
        p_lon: longitude,
        p_radius_miles: radiusMiles ?? 25,
      });
      if (error) throw error;
      return {
        services: data || [],
        totalPages: 1,
        total: data?.length || 0,
      };
    }

    // Apply filters
    if (serviceType) {
      query = query.eq('service_type', serviceType);
    }
    
    if (state) {
      query = query.eq('state', state);
    }
    
    if (zipCode) {
      query = query.eq('zip_code', zipCode);
    }

    // Add pagination
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;
    query = query.range(from, to);

    // Sort alphabetically by name
    query = query.order('name');

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      services: data || [],
      totalPages: count ? Math.ceil(count / perPage) : 0,
      total: count || 0
    };
  },
}; 