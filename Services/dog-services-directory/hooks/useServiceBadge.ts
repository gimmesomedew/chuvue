import { useMemo } from 'react';

type ServiceType = 'Veterinarian' | 'Groomer' | 'Daycare' | 'Trainer' | 'Dog Park' | 'Other';

interface ServiceBadgeConfig {
  type: string;
  color: string;
}

export function useServiceBadge(serviceType: ServiceType | string): ServiceBadgeConfig {
  return useMemo(() => {
    const type = serviceType || 'Other';
    const badgeConfigs: Record<ServiceType, { color: string }> = {
      Veterinarian: { color: 'emerald' },
      Groomer: { color: 'blue' },
      Daycare: { color: 'purple' },
      Trainer: { color: 'amber' },
      'Dog Park': { color: 'rose' },
      Other: { color: 'emerald' },
    };

    return {
      type,
      color: (badgeConfigs[type as ServiceType] || badgeConfigs.Other).color,
    };
  }, [serviceType]);
} 