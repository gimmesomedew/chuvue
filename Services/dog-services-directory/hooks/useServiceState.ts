'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { showToast } from '@/lib/toast';
import { Analytics } from '@/lib/analytics';

interface Service {
  id: string;
  name: string;
  featured?: boolean;
  [key: string]: any;
}

export function useServiceState(initialService: Service) {
  const [service, setService] = useState(initialService);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', service.id);

      if (error) throw error;

      setIsDeleted(true);
      setIsDeleteDialogOpen(false);
      showToast.success('Service deleted successfully');

      Analytics.trackUserInteraction({
        interaction_type: 'click',
        target_id: service.id,
        target_type: 'service'
      });
    } catch (error) {
      console.error('Error deleting service:', error);
      showToast.error('Failed to delete service');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleFeatured = async () => {
    try {
      const newFeaturedState = !service.featured;
      const { error } = await supabase
        .from('services')
        .update({ featured: newFeaturedState })
        .eq('id', service.id);

      if (error) throw error;

      setService(prev => ({ ...prev, featured: newFeaturedState }));
      showToast.success(
        newFeaturedState ? 'Service marked as featured' : 'Service removed from featured'
      );

      Analytics.trackUserInteraction({
        interaction_type: 'click',
        target_id: service.id,
        target_type: 'service'
      });
    } catch (error) {
      console.error('Error toggling featured status:', error);
      showToast.error('Failed to update featured status');
    }
  };

  return {
    service,
    isDeleting,
    isDeleted,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleDelete,
    handleToggleFeatured,
    setService
  };
} 