import { supabase } from './supabase';
import { ServiceDefinition, Service } from './types';
import { logServiceError } from './errorLogging';

/**
 * Interface for service definition with count
 */
export interface ServiceDefinitionWithCount {
  service_definition_id: number;
  service_name: string;
  service_type: string;
  services_count: number;
}

/**
 * Converts a display service type to database format
 * e.g., "Dog Parks" -> "dog_park"
 */
function normalizeServiceType(serviceType: string): string {
  return serviceType
    .toLowerCase()
    .replace(/\s+/g, '_');
}

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
 * Fetches service definitions with their service counts using the database function
 * @returns Array of service definitions with counts
 */
export async function getServiceDefinitionsWithCounts(): Promise<ServiceDefinitionWithCount[]> {
  try {
    // fetch definitions
    const { data: defs, error: defErr } = await supabase
      .from('service_definitions')
      .select('id, service_name, service_type')
      .order('service_name');

    if (defErr) {
      console.error('Error fetching definitions:', defErr);
      return [];
    }

    // fetch counts grouped by service_type
    const { data: svc, error: svcErr } = await supabase
      .from('services')
      .select('service_type');

    if (svcErr) {
      console.error('Error fetching services for counts:', svcErr);
    }

    const countMap: Record<string, number> = {};
    (svc || []).forEach((s: any) => {
      countMap[s.service_type] = (countMap[s.service_type] || 0) + 1;
    });

    return (defs || []).map((d: any) => ({
      service_definition_id: d.id,
      service_name: d.service_name,
      service_type: d.service_type,
      services_count: countMap[d.service_type] || 0,
    }));
  } catch (error) {
    console.error('Error in getServiceDefinitionsWithCounts:', error);
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
 * @param slug Service definition slug (e.g. 'Dog Parks' would match service_type 'dog_park')
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
      .eq('service_type', formattedSlug);
    
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
 * Fetches featured services (where featured = 'Y')
 */
export async function getFeaturedServices(limit: number = 10): Promise<Service[]> {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('featured', 'Y')
      .order('name')
      .limit(limit);
    
    if (error) {
      console.error('Error fetching featured services:', error);
      return [];
    }
    
    return data as Service[];
  } catch (error) {
    console.error('Error in getFeaturedServices:', error);
    return [];
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
/**
 * Toggle the featured status of a service
 * @param serviceId The ID of the service to toggle
 * @returns The updated service or null if there was an error
 */
/**
 * Delete a service and its related data from the database
 * @param serviceId The ID of the service to delete
 * @returns True if the service was deleted successfully, false otherwise
 */
export async function deleteService(serviceId: string): Promise<boolean> {
  try {
    // Start a transaction by deleting related data first
    
    // Delete favorites
    const { error: favoritesError } = await supabase
      .from('favorites')
      .delete()
      .eq('service_id', serviceId);
    
    if (favoritesError) {
      console.error(`Error deleting favorites for service ${serviceId}:`, favoritesError);
      await logServiceError(favoritesError, 'delete_service_favorites', serviceId);
      return false;
    }

    // Delete user interaction analytics using RPC
    const { error: interactionError } = await supabase
      .rpc('delete_service_analytics', { service_id: serviceId });
    
    if (interactionError) {
      console.error(`Error deleting user interactions for service ${serviceId}:`, interactionError);
      await logServiceError(interactionError, 'delete_service_interactions', serviceId);
      return false;
    }

    // Finally, delete the service itself
    const { error: serviceError } = await supabase
      .from('services')
      .delete()
      .eq('id', serviceId);
    
    if (serviceError) {
      console.error(`Error deleting service with ID ${serviceId}:`, serviceError);
      await logServiceError(serviceError, 'delete_service', serviceId);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Error in deleteService for service ${serviceId}:`, error);
    await logServiceError(error as Error, 'delete_service_unexpected', serviceId);
    return false;
  }
}

/**
 * Toggle the featured status of a service
 * @param serviceId The ID of the service to toggle
 * @returns The updated service or null if there was an error
 */
export async function toggleServiceFeatured(serviceId: string): Promise<Service | null> {
  try {
    // First, get the current featured status
    const { data: service, error: getError } = await supabase
      .from('services')
      .select('featured')
      .eq('id', serviceId)
      .single();
    
    if (getError) {
      console.error(`Error fetching service with ID ${serviceId}:`, getError);
      return null;
    }
    
    // Toggle the featured status (if it's null, undefined, or not 'Y', set to 'Y', otherwise set to 'N')
    const newFeaturedStatus = service?.featured === 'Y' ? 'N' : 'Y';
    
    // Update the service
    const { data: updatedService, error: updateError } = await supabase
      .from('services')
      .update({ featured: newFeaturedStatus })
      .eq('id', serviceId)
      .select()
      .single();
    
    if (updateError) {
      console.error(`Error updating featured status for service ${serviceId}:`, updateError);
      return null;
    }
    
    return updatedService as Service;
  } catch (error) {
    console.error(`Error in toggleServiceFeatured for service ${serviceId}:`, error);
    return null;
  }
}

export async function searchServices(
  serviceType: string,
  state: string,
  zipCode: string,
  latitude?: number,
  longitude?: number,
  radiusMiles: number = 25,
  page: number = 1,
  perPage: number = 15
): Promise<{ services: Service[]; totalPages: number; total: number }> {
  try {
    // If lat/lon provided, use RPC
    if (latitude !== undefined && longitude !== undefined) {
      const { data, error } = await supabase
        .rpc('services_within_radius', {
          p_lat: latitude,
          p_lon: longitude,
          p_radius_miles: radiusMiles
        });

      if (error) throw error;

      let rows = data || [];
      if (serviceType) {
        const normType = normalizeServiceType(serviceType);
        rows = rows.filter((s: any) => s.service_type === normType);
      }

      const total = rows.length;
      const totalPages = Math.ceil(total / perPage);

      const startIdx = (page - 1) * perPage;
      const paged = rows.slice(startIdx, startIdx + perPage);

      return { services: paged as Service[], totalPages, total };
    }

    let query = supabase
      .from('services')
      .select('*', { count: 'exact' });

    // Apply filters
    if (serviceType) {
      const normalizedType = normalizeServiceType(serviceType);
      query = query.eq('service_type', normalizedType);
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

    if (error) {
      throw error;
    }

    const totalPages = count ? Math.ceil(count / perPage) : 0;

    return {
      services: data || [],
      totalPages,
      total: count || 0
    };
  } catch (error) {
    throw error;
  }
}

export async function toggleFavorite(userId: string, serviceId: string): Promise<boolean> {
  try {
    // First check if the favorite already exists
    const { data: existingFavorite } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('service_id', serviceId)
      .single();

    if (existingFavorite) {
      // If it exists, remove it
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', existingFavorite.id);
      
      if (error) throw error;
      return false; // Return false to indicate it's now unfavorited
    } else {
      // If it doesn't exist, add it
      const { error } = await supabase
        .from('favorites')
        .insert([
          {
            user_id: userId,
            service_id: serviceId
          }
        ]);
      
      if (error) throw error;
      return true; // Return true to indicate it's now favorited
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw error;
  }
}

export async function getFavoriteCount(serviceId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('favorites')
      .select('*', { count: 'exact', head: true })
      .eq('service_id', serviceId);

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Error getting favorite count:', error);
    return 0;
  }
}

export async function isServiceFavorited(userId: string, serviceId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('service_id', serviceId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  } catch (error) {
    console.error('Error checking if service is favorited:', error);
    return false;
  }
}
