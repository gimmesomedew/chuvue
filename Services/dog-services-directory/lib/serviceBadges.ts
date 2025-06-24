import { MapPin, User, PawPrint, Home, GraduationCap, HelpCircle, Heart, ShoppingBag, Car, Camera } from 'lucide-react';
import { ServiceDefinition } from './types';

export interface ServiceBadgeConfig {
  label: string;
  bgColor: string;
  hoverColor: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Default badge configurations for common service types
const defaultBadgeConfigs: Record<string, ServiceBadgeConfig> = {
  dog_park: {
    label: 'Dog Park',
    bgColor: 'bg-green-500',
    hoverColor: 'hover:bg-green-600',
    icon: MapPin,
  },
  veterinarian: {
    label: 'Veterinarian',
    bgColor: 'bg-blue-500',
    hoverColor: 'hover:bg-blue-600',
    icon: User,
  },
  grooming: {
    label: 'Grooming',
    bgColor: 'bg-purple-500',
    hoverColor: 'hover:bg-purple-600',
    icon: PawPrint,
  },
  boarding: {
    label: 'Boarding',
    bgColor: 'bg-orange-500',
    hoverColor: 'hover:bg-orange-600',
    icon: Home,
  },
  training: {
    label: 'Training',
    bgColor: 'bg-indigo-500',
    hoverColor: 'hover:bg-indigo-600',
    icon: GraduationCap,
  },
  daycare: {
    label: 'Daycare',
    bgColor: 'bg-pink-500',
    hoverColor: 'hover:bg-pink-600',
    icon: PawPrint,
  },
  walking: {
    label: 'Walking',
    bgColor: 'bg-teal-500',
    hoverColor: 'hover:bg-teal-600',
    icon: MapPin,
  },
  sitting: {
    label: 'Pet Sitting',
    bgColor: 'bg-amber-500',
    hoverColor: 'hover:bg-amber-600',
    icon: Home,
  },
  rescue: {
    label: 'Rescue',
    bgColor: 'bg-red-500',
    hoverColor: 'hover:bg-red-600',
    icon: PawPrint,
  },
  supplies: {
    label: 'Supplies',
    bgColor: 'bg-gray-500',
    hoverColor: 'hover:bg-gray-600',
    icon: ShoppingBag,
  },
  photography: {
    label: 'Photography',
    bgColor: 'bg-yellow-500',
    hoverColor: 'hover:bg-yellow-600',
    icon: Camera,
  },
  transport: {
    label: 'Transport',
    bgColor: 'bg-cyan-500',
    hoverColor: 'hover:bg-cyan-600',
    icon: Car,
  },
};

const fallbackBadge: ServiceBadgeConfig = {
  label: 'Other',
  bgColor: 'bg-gray-400',
  hoverColor: 'hover:bg-gray-500',
  icon: HelpCircle,
};

// Color palette for dynamic badges
const badgeColors = [
  { bg: 'bg-green-500', hover: 'hover:bg-green-600' },
  { bg: 'bg-blue-500', hover: 'hover:bg-blue-600' },
  { bg: 'bg-purple-500', hover: 'hover:bg-purple-600' },
  { bg: 'bg-orange-500', hover: 'hover:bg-orange-600' },
  { bg: 'bg-indigo-500', hover: 'hover:bg-indigo-600' },
  { bg: 'bg-pink-500', hover: 'hover:bg-pink-600' },
  { bg: 'bg-teal-500', hover: 'hover:bg-teal-600' },
  { bg: 'bg-amber-500', hover: 'hover:bg-amber-600' },
  { bg: 'bg-red-500', hover: 'hover:bg-red-600' },
  { bg: 'bg-yellow-500', hover: 'hover:bg-yellow-600' },
  { bg: 'bg-cyan-500', hover: 'hover:bg-cyan-600' },
  { bg: 'bg-emerald-500', hover: 'hover:bg-emerald-600' },
  { bg: 'bg-violet-500', hover: 'hover:bg-violet-600' },
  { bg: 'bg-rose-500', hover: 'hover:bg-rose-600' },
  { bg: 'bg-sky-500', hover: 'hover:bg-sky-600' },
];

// Icons for dynamic badges
const badgeIcons = [MapPin, User, PawPrint, Home, GraduationCap, ShoppingBag, Camera, Car, Heart];

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
      console.error('Error fetching service definitions:', error);
      return [];
    }
    
    serviceDefinitionsCache = data as ServiceDefinition[];
    return serviceDefinitionsCache;
  } catch (error) {
    console.error('Error in getServiceDefinitions:', error);
    return [];
  }
}

export function generateBadgeConfigs(serviceDefinitions: ServiceDefinition[]): Record<string, ServiceBadgeConfig> {
  const configs: Record<string, ServiceBadgeConfig> = { ...defaultBadgeConfigs };
  
  serviceDefinitions.forEach((def, index) => {
    const serviceValue = def.service_value.toLowerCase();
    
    // Skip if we already have a default config for this service type
    if (configs[serviceValue]) {
      return;
    }
    
    // Generate a dynamic badge config
    const colorIndex = index % badgeColors.length;
    const iconIndex = index % badgeIcons.length;
    const color = badgeColors[colorIndex];
    const Icon = badgeIcons[iconIndex];
    
    configs[serviceValue] = {
      label: def.service_name,
      bgColor: color.bg,
      hoverColor: color.hover,
      icon: Icon,
    };
  });
  
  return configs;
}

export async function getServiceBadgeConfig(serviceType: string): Promise<ServiceBadgeConfig> {
  if (!serviceType) return fallbackBadge;
  
  // Initialize cache if needed
  if (!badgeConfigsCache) {
    const serviceDefinitions = await getServiceDefinitions();
    badgeConfigsCache = generateBadgeConfigs(serviceDefinitions);
  }
  
  // Normalize: trim, lowercase, replace spaces/hyphens with underscores
  const normalized = serviceType.trim().toLowerCase().replace(/[-\s]+/g, '_');
  
  // Try to find in cache first
  if (badgeConfigsCache[normalized]) {
    return badgeConfigsCache[normalized];
  }
  
  // Fallback for unknown types
  return {
    ...fallbackBadge,
    label: serviceType
      .split('_')
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