'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Globe, Heart, ExternalLink, Map, User, PawPrint, Navigation, Star, Trash2, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Service } from '@/lib/types';
import { formatDistance } from '@/lib/location';
import { useAuth } from '@/contexts/AuthContext';
import { toggleServiceFeatured, deleteService, toggleFavorite, isServiceFavorited } from '@/lib/services';
import { showToast } from '@/lib/toast';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Analytics } from '@/lib/analytics';
import { getServiceBadgeConfig, clearBadgeCache } from '@/lib/serviceBadges';
import { EditServiceModal } from '@/components/services/EditServiceModal';
import { ServiceImage } from '@/components/services/ServiceImage';
import { ServiceTypeBadge } from '@/components/services/ServiceTypeBadge';
import { ServiceHeader } from '@/components/services/ServiceHeader';
import { ServiceContent } from '@/components/services/ServiceContent';
import { ServiceActionButtons } from '@/components/services/ServiceActionButtons';
import { ServiceModals } from '@/components/services/ServiceModals';
import { useServiceState } from '@/hooks/useServiceState';
import { useServiceBadge } from '@/hooks/useServiceBadge';
import { useFavoriteStatus } from '@/hooks/useFavoriteStatus';
import { ServiceCardProps, ServiceAction } from '@/types/service';

export function ServiceCard({ service, sortByDistance, userLocation, delay = 0, onAction }: ServiceCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Clear badge cache on mount to ensure fresh data
  useEffect(() => {
    clearBadgeCache();
  }, []);

  const { 
    service: currentService,
    isDeleted,
    isDeleting,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleDelete,
    handleToggleFeatured,
    setService
  } = useServiceState(service);

  // Get the badge config using service_type
  const badgeConfig = useServiceBadge(currentService.service_type);

  // Get the user and role from auth context
  const { user, userRole } = useAuth();
  const userId = user?.id || null;
  const isAdminOrReviewer = userRole === 'admin' || userRole === 'reviewer';

  const { isFavorited, isLoading, toggleFavorite } = useFavoriteStatus(userId, currentService.id);

  const handleImageError = () => {
    // Handle image error
  };

  const handleAction = (action: ServiceAction) => {
    if (action.type === 'favorite') {
      toggleFavorite();
    }
    onAction?.(action);
  };

  const handleUpdate = (updatedService: Service) => {
    setService(updatedService);
    setIsEditModalOpen(false);
  };

  if (isDeleted) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 20px 40px rgba(0,0,0,0.18)",
        transition: { duration: 0.2 }
      }}
      whileFocus={{ 
        scale: 1.02,
        boxShadow: "0 20px 40px rgba(0,0,0,0.18)",
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      className="rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-shadow duration-300"
    >
      <Card className="relative overflow-hidden flex flex-col w-full border-0">
        <ServiceImage 
          imageUrl={currentService.image_url || null}
          name={currentService.name}
          onError={handleImageError}
          isFavorited={isFavorited}
        />
        
        <ServiceTypeBadge 
          type={badgeConfig.type}
          color={badgeConfig.color}
        />

        <div className="p-4 flex flex-col flex-1 space-y-4">
          <ServiceHeader 
            service={currentService}
            featured={currentService.featured}
            isAdminOrReviewer={isAdminOrReviewer}
            onEdit={() => setIsEditModalOpen(true)}
          />

          <ServiceContent 
            service={currentService}
            sortByDistance={sortByDistance}
            userLocation={userLocation}
          />

          <div className="mt-auto pt-2">
            <ServiceActionButtons 
              service={currentService}
              user={user}
              isAdminOrReviewer={isAdminOrReviewer}
              isFavorited={isFavorited}
              featured={currentService.featured}
              onAction={handleAction}
            />
          </div>
        </div>

        <ServiceModals 
          isDeleteDialogOpen={isDeleteDialogOpen}
          isDeleting={isDeleting}
          onDeleteConfirm={handleDelete}
          onDeleteCancel={() => setIsDeleteDialogOpen(false)}
          serviceName={currentService.name}
        />
      </Card>
    </motion.div>
  );
}
