'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Analytics } from '@/lib/analytics';
import { showToast } from '@/lib/toast';

export function useFavoriteStatus(userId: string | null, serviceId: string) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId || !serviceId) {
      setIsFavorited(false);
      setIsLoading(false);
      return;
    }

    const checkFavoriteStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('favorites')
          .select('id')
          .eq('user_id', userId)
          .eq('service_id', serviceId)
          .single();

        if (error) throw error;
        setIsFavorited(!!data);
      } catch (error) {
        console.error('Error checking favorite status:', error);
        setIsFavorited(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkFavoriteStatus();
  }, [userId, serviceId]);

  const toggleFavorite = async () => {
    if (!userId) {
      showToast.error('Please sign in to favorite services');
      return;
    }

    setIsLoading(true);

    try {
      if (isFavorited) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('service_id', serviceId);

        if (error) throw error;
        setIsFavorited(false);
        showToast.success('Removed from favorites');
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert([{ user_id: userId, service_id: serviceId }]);

        if (error) throw error;
        setIsFavorited(true);
        showToast.success('Added to favorites');
      }

      // Track the favorite action
      Analytics.trackUserInteraction({
        interaction_type: 'favorite',
        target_id: serviceId,
        target_type: 'service'
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      showToast.error('Failed to update favorite status');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isFavorited,
    isLoading,
    toggleFavorite
  };
} 