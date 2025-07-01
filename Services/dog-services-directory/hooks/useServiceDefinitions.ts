import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { ServiceDefinition } from '@/lib/types';

export function useServiceDefinitions() {
  return useQuery<ServiceDefinition[], Error>({
    queryKey: ['serviceDefinitions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_definitions')
        .select('*')
        .order('service_name');
      
      if (error) throw error;
      return data;
    },
  });
} 