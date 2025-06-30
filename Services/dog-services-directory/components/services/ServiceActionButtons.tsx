'use client';

import { Button } from '@/components/ui/button';
import { Heart, Globe, MapPin, Star, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '@supabase/supabase-js';
import { Analytics } from '@/lib/analytics';

interface ServiceActionButtonsProps {
  service: {
    id: string;
    website_url?: string | null;
    address?: string;
  };
  user: User | null;
  isAdminOrReviewer: boolean;
  isFavorited: boolean;
  featured?: boolean;
  onAction: (action: string, serviceId: string) => void;
}

export function ServiceActionButtons({
  service,
  user,
  isAdminOrReviewer,
  isFavorited,
  featured,
  onAction
}: ServiceActionButtonsProps) {
  const handleFavorite = () => {
    if (!user) {
      onAction('login_required', service.id);
      return;
    }
    onAction('favorite', service.id);
    Analytics.trackUserInteraction({
      interaction_type: 'favorite',
      target_id: service.id,
      target_type: 'service'
    });
  };

  const handleWebsiteClick = () => {
    Analytics.trackUserInteraction({
      interaction_type: 'website_visit',
      target_id: service.id,
      target_type: 'service'
    });
  };

  const handleMapClick = () => {
    Analytics.trackUserInteraction({
      interaction_type: 'map_view',
      target_id: service.id,
      target_type: 'service'
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleFavorite}
        className="flex-1 min-w-[120px] text-gray-700 hover:text-gray-900"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isFavorited ? 'favorited' : 'unfavorited'}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center"
          >
            <Heart
              className={`h-4 w-4 mr-2 ${
                isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-500'
              }`}
            />
            {isFavorited ? 'Favorited' : 'Favorite'}
          </motion.div>
        </AnimatePresence>
      </Button>

      {service.website_url && (
        <Button
          variant="outline"
          size="sm"
          className="flex-1 min-w-[120px] text-gray-700 hover:text-gray-900"
          onClick={handleWebsiteClick}
          asChild
        >
          <a href={service.website_url} target="_blank" rel="noopener noreferrer">
            <Globe className="h-4 w-4 mr-2 text-gray-500" />
            Website
          </a>
        </Button>
      )}

      {service.address && (
        <Button
          variant="outline"
          size="sm"
          className="flex-1 min-w-[120px] text-gray-700 hover:text-gray-900"
          onClick={handleMapClick}
          asChild
        >
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              service.address
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
            Map
          </a>
        </Button>
      )}

      {isAdminOrReviewer && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAction('toggle_featured', service.id)}
            className="flex-1 min-w-[120px] text-gray-700 hover:text-gray-900"
          >
            <Star
              className={`h-4 w-4 mr-2 ${
                featured ? 'fill-yellow-500 text-yellow-500' : 'text-gray-500'
              }`}
            />
            {featured ? 'Featured' : 'Feature'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onAction('delete', service.id)}
            className="flex-1 min-w-[120px] text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </>
      )}
    </div>
  );
} 