import { searchServices, searchAllServices } from '../services';
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
    // Use the searchServices function from lib/services.ts which includes proper normalization
    return await searchServices(
      serviceType,
      state,
      zipCode,
      latitude,
      longitude,
      radiusMiles,
      page,
      perPage
    );
  },
  
  searchAll: async ({
    serviceType,
    state,
    zipCode,
    latitude,
    longitude,
    radiusMiles,
  }: Omit<SearchParams, 'page' | 'perPage'>): Promise<{ services: Service[]; total: number }> => {
    // Use the searchAllServices function for client-side filtering
    return await searchAllServices(
      serviceType,
      state,
      zipCode,
      latitude,
      longitude,
      radiusMiles
    );
  },
}; 