import { supabase } from './supabase';
import { ServiceDefinition, Service } from './types';

/**
 * Fetches all service definitions from the Supabase database
 * @returns Array of service definitions
 */
export async function getServiceDefinitions(): Promise<ServiceDefinition[]> {
  try {
    const { data, error } = await supabase
      .from('service_definitions')
      .select('*')
      .order('service_name');
    
    if (error) {
      console.error('Error fetching service definitions:', error);
      return [];
    }
    
    return data as ServiceDefinition[];
  } catch (error) {
    console.error('Error in getServiceDefinitions:', error);
    return [];
  }
}

/**
 * Fetches a single service definition by ID
 * @param id Service definition ID
 * @returns Service definition or null if not found
 */
export async function getServiceDefinitionById(id: number): Promise<ServiceDefinition | null> {
  try {
    const { data, error } = await supabase
      .from('service_definitions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching service definition with ID ${id}:`, error);
      return null;
    }
    
    return data as ServiceDefinition;
  } catch (error) {
    console.error(`Error in getServiceDefinitionById for ID ${id}:`, error);
    return null;
  }
}

/**
 * Fetches a service definition by slug
 * @param slug Service definition slug (e.g. 'Dog Parks' would match service_value 'dog_park')
 * @returns Service definition or null if not found
 */
export async function getServiceDefinitionBySlug(slug: string): Promise<ServiceDefinition | null> {
  try {
    // Convert the display name format to the database value format
    // e.g., 'Dog Parks' -> 'dog_park'
    const formattedSlug = slug.toLowerCase().replace(/\s+/g, '_');
    
    const { data, error } = await supabase
      .from('service_definitions')
      .select('*')
      .eq('service_value', formattedSlug);
    
    if (error) {
      console.error(`Error fetching service definition with slug ${slug}:`, error);
      return null;
    }
    
    if (!data || data.length === 0) {
      return null;
    }
    return data[0] as ServiceDefinition;
  } catch (error) {
    console.error(`Error in getServiceDefinitionBySlug for slug ${slug}:`, error);
    return null;
  }
}

/**
 * Get all services without any filters
 * @param page The page number for pagination (starts at 1)
 * @param pageSize The number of items per page
 * @returns Object containing services array and pagination info
 */
export async function getAllServices(
  page: number = 1,
  pageSize: number = 15
): Promise<{ services: Service[], total: number, page: number, totalPages: number }> {
  try {
    // Calculate range for pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    // Get the total count
    const { count, error: countError } = await supabase
      .from('services')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('Error counting all services:', countError);
      return { services: [], total: 0, page, totalPages: 0 };
    }
    
    console.log('Total services count:', count);
    
    const total = count || 0;
    const totalPages = Math.ceil(total / pageSize);
    
    // Get the services with pagination
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .range(from, to)
      .order('name');
    
    if (error) {
      console.error('Error fetching all services:', error);
      return { services: [], total: 0, page, totalPages: 0 };
    }
    
    console.log(`All services results count: ${data?.length || 0}`);
    if (data && data.length > 0) {
      console.log('First service:', data[0]);
    }
    
    return {
      services: data as Service[],
      total,
      page,
      totalPages
    };
  } catch (error) {
    console.error('Error in getAllServices:', error);
    return { services: [], total: 0, page, totalPages: 0 };
  }
}

/**
 * Search for services based on service type and state
 * @param serviceTypeSlug The slug of the service type to filter by (optional)
 * @param state The two-letter state code to filter by (optional)
 * @param page The page number for pagination (starts at 1)
 * @param pageSize The number of items per page
 * @returns Object containing services array and pagination info
 */
export async function searchServices(
  serviceTypeSlug?: string,
  state?: string,
  page: number = 1,
  pageSize: number = 15
): Promise<{ services: Service[], total: number, page: number, totalPages: number }> {
  try {
    // If no filters are provided, return all services
    if ((!serviceTypeSlug || serviceTypeSlug === '') && (!state || state === '')) {
      console.log('No filters provided, returning all services');
      return getAllServices(page, pageSize);
    }
    
    // Calculate range for pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    // Start building the query - use a simpler query without joins first
    let query = supabase
      .from('services')
      .select('*');
    
    // Add filters if provided
    if (serviceTypeSlug && serviceTypeSlug !== '') {
      // First, get the service type ID from the slug
      const serviceType = await getServiceDefinitionBySlug(serviceTypeSlug);
      if (serviceType) {
        // The service_type column is a custom type that stores the service_value directly
        query = query.eq('service_type', serviceType.service_value);
      }
    }
    
    if (state && state !== '') {
      // Use the state abbreviation directly since the database stores two-letter codes
      query = query.eq('state', state.toUpperCase());
    }
    
    // Use a simpler approach for counting total results
    let totalCount = 0;
    
    try {
      // Build a count query with the same filters
      let countQuery = supabase
        .from('services')
        .select('id', { count: 'exact' });
      
      // Apply the same filters
      if (serviceTypeSlug && serviceTypeSlug !== '') {
        const serviceType = await getServiceDefinitionBySlug(serviceTypeSlug);
        if (serviceType) {
          countQuery = countQuery.eq('service_type', serviceType.service_value);
        }
      }
      
      if (state && state !== '') {
        countQuery = countQuery.eq('state', state.toUpperCase());
      }
      
      // Execute the count query
      const { count, error } = await countQuery;
      
      if (error) {
        console.error('Error counting services:', error);
      } else {
        totalCount = count || 0;
        console.log('Count result:', totalCount);
      }
    } catch (countError) {
      console.error('Exception in count query:', countError);
    }
    
    // Use totalCount instead of count which is out of scope
    const total = totalCount;
    const totalPages = Math.ceil(total / pageSize);
    
    // Log the query parameters for debugging
    console.log('Search parameters:', { 
      serviceTypeSlug, 
      state, 
      page, 
      pageSize,
      from,
      to,
      total,
      totalPages
    });
    
    // Execute the query with pagination
    const { data, error } = await query
      .range(from, to)
      .order('name');
    
    if (error) {
      console.error('Error searching services:', error);
      return { services: [], total: 0, page, totalPages: 0 };
    }
    
    // Log the results for debugging
    console.log(`Search results count: ${data?.length || 0}`);
    if (data && data.length > 0) {
      console.log('First result:', data[0]);
    } else {
      console.log('No results found');
    }
    
    return { 
      services: data as Service[], 
      total, 
      page, 
      totalPages 
    };
  } catch (error) {
    console.error('Error in searchServices:', error);
    return { services: [], total: 0, page, totalPages: 0 };
  }
}
