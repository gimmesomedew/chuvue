'use client';

import { useState, useEffect } from 'react';
import { getServiceBadgeConfig } from '@/lib/serviceBadges';

interface ServiceBadgeConfig {
  type: string;
  color: string;
  bgColor: string;
}

export function useServiceBadge(serviceType: string): ServiceBadgeConfig {
  const [badgeConfig, setBadgeConfig] = useState<ServiceBadgeConfig>({
    type: serviceType || 'Other',
    color: 'emerald',
    bgColor: 'bg-emerald-500'
  });

  useEffect(() => {
    async function fetchBadgeConfig() {
      const config = await getServiceBadgeConfig(serviceType);
      setBadgeConfig({
        type: config.label,
        color: config.bgColor.replace('bg-', '').replace('-500', ''),
        bgColor: config.bgColor
      });
    }

    fetchBadgeConfig();
  }, [serviceType]);

  return badgeConfig;
} 