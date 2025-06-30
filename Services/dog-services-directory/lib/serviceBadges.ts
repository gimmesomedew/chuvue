import { MapPin, User, PawPrint, Home, GraduationCap, HelpCircle, ShoppingBag } from 'lucide-react';
import { ServiceDefinition } from './types';

export interface ServiceBadgeConfig {
  label: string;
  bgColor: string;
  hoverColor: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Default icon mapping - updated to match database service_type
const iconMapping: Record<string, React.ComponentType<{ className?: string }>> = {
  dog_park: MapPin,
  veterinarian: User,
  grooming: PawPrint,
  boarding: Home,
  training: GraduationCap,
  daycare: Home,
  walking: MapPin,
  sitting: Home,
  rescue: PawPrint,
  supplies: ShoppingBag,
  photography: HelpCircle,
  transport: MapPin,
  other: HelpCircle,
};

const fallbackBadge: ServiceBadgeConfig = {
  label: 'Other',
  bgColor: 'bg-cyan-500',
  hoverColor: 'hover:bg-cyan-600',
  icon: HelpCircle,
};

// Cache for service definitions
let serviceDefinitionsCache: ServiceDefinition[] | null = null;
let badgeConfigsCache: Record<string, ServiceBadgeConfig> | null = null;

export async function getServiceDefinitions(): Promise<ServiceDefinition[]> {
  if (serviceDefinitionsCache) {
    return serviceDefinitionsCache;
  }

  try {
    const { supabase } = await import('./supabase');
    const { data, error } = await supabase
      .from('service_definitions')
      .select('*')
      .order('service_name');
    
    if (error) {
      return [];
    }
    
    serviceDefinitionsCache = data as ServiceDefinition[];
    return serviceDefinitionsCache;
  } catch (error) {
    return [];
  }
}

export function generateBadgeConfigs(serviceDefinitions: ServiceDefinition[]): Record<string, ServiceBadgeConfig> {
  const configs: Record<string, ServiceBadgeConfig> = {};
  
  serviceDefinitions.forEach((def) => {
    const serviceType = def.service_type.toLowerCase();
    configs[serviceType] = {
      label: def.service_name,
      bgColor: `bg-${def.badge_color}-500`,
      hoverColor: `hover:bg-${def.badge_color}-600`,
      icon: iconMapping[serviceType] || HelpCircle,
    };
  });
  
  return configs;
}

export async function getServiceBadgeConfig(serviceType: string): Promise<ServiceBadgeConfig> {
  if (!serviceType) {
    return fallbackBadge;
  }
  
  // Initialize cache if needed
  if (!badgeConfigsCache) {
    const serviceDefinitions = await getServiceDefinitions();
    badgeConfigsCache = generateBadgeConfigs(serviceDefinitions);
  }
  
  // Normalize the service type
  const normalized = serviceType.trim().toLowerCase();
  
  // Try to find in cache first
  if (badgeConfigsCache[normalized]) {
    return badgeConfigsCache[normalized];
  }
  
  // Fallback for unknown types
  return {
    ...fallbackBadge,
    label: serviceType
      .split(/[-_\s]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
  };
}

export function formatServiceType(serviceType: string): string {
  // Convert snake_case to Title Case
  return serviceType
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Function to clear cache (useful for testing or when data changes)
export function clearBadgeCache(): void {
  serviceDefinitionsCache = null;
  badgeConfigsCache = null;
} 