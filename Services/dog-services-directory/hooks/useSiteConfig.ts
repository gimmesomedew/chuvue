import { useState, useEffect } from 'react';

interface SiteConfig {
  id: number;
  config_key: string;
  config_value: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export function useSiteConfig() {
  const [configs, setConfigs] = useState<SiteConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/site-config');
      if (!response.ok) {
        throw new Error('Failed to fetch configuration');
      }
      
      const data = await response.json();
      setConfigs(data.configs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateConfigs = async (updatedConfigs: SiteConfig[]) => {
    try {
      setError(null);
      
      const response = await fetch('/api/admin/site-config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ configs: updatedConfigs }),
      });

      if (!response.ok) {
        throw new Error('Failed to update configuration');
      }

      const data = await response.json();
      setConfigs(updatedConfigs);
      return { success: true, message: data.message };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  return {
    configs,
    loading,
    error,
    fetchConfigs,
    updateConfigs,
  };
}
