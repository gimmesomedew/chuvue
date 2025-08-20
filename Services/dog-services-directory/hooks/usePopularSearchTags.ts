import { useState, useEffect } from 'react';

interface PopularSearchTag {
  config_key: string;
  config_value: string;
}

export function usePopularSearchTags() {
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/admin/site-config');
        if (!response.ok) {
          throw new Error('Failed to fetch popular search tags');
        }
        
        const data = await response.json();
        
        // Filter for popular search tags and sort them by key
        const popularTags = data.configs
          .filter((config: any) => config.config_key.startsWith('popular_search_tag_'))
          .sort((a: any, b: any) => {
            const aNum = parseInt(a.config_key.split('_').pop());
            const bNum = parseInt(b.config_key.split('_').pop());
            return aNum - bNum;
          })
          .map((config: any) => config.config_value);
        
        setTags(popularTags);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        // Fallback to default tags if API fails
        setTags([
          'Dog Parks close to me',
          'Dog Parks in Indiana',
          'Groomers in Indianapolis',
          'Veterinarians in Indiana',
          'Dog Trainers near me',
          'Boarding & Daycare'
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  return { tags, loading, error };
}
