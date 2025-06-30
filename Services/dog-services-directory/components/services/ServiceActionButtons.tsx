'use client';

import { Button } from '@/components/ui/button';
import { Heart, Globe, MapPin, Star, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '@supabase/supabase-js';
import { Analytics } from '@/lib/analytics';
import { Service } from '@/lib/types';
import { ServiceAction } from '@/types/service';

interface ServiceActionButtonsProps {
  service: Service;
  user: User | null;
  isAdminOrReviewer: boolean;
  isFavorited: boolean;
  featured?: string;
  onAction: (action: ServiceAction) => void;
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
      onAction({ type: 'login_required', serviceId: service.id });
      return;
    }
    onAction({ type: 'favorite', serviceId: service.id });
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
      {service.website_url && (
        <Button
          variant="outline"
          size="sm"
          className="flex-1 min-w-[120px] text-gray-700 hover:text-gray-900"
          onClick={() => onAction({ type: 'website', serviceId: service.id })}
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
          onClick={() => onAction({ type: 'map', serviceId: service.id })}
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

      {user && (
        <Button
          variant="outline"
          size="sm"
          className={`flex-1 min-w-[120px] ${
            isFavorited ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' : ''
          }`}
          onClick={handleFavorite}
        >
          <Heart
            className={`h-4 w-4 mr-2 ${
              isFavorited ? 'fill-red-500' : 'text-gray-500'
            }`}
          />
          {isFavorited ? 'Favorited' : 'Favorite'}
        </Button>
      )}

      {isAdminOrReviewer && (
        <>
          <Button
            variant="outline"
            size="sm"
            className={`flex-1 min-w-[120px] ${
              featured === 'Y' ? 'bg-yellow-50 text-yellow-600 border-yellow-200 hover:bg-yellow-100' : ''
            }`}
            onClick={() => onAction({ type: 'feature', serviceId: service.id })}
          >
            <Star
              className={`h-4 w-4 mr-2 ${
                featured === 'Y' ? 'fill-yellow-500' : 'text-gray-500'
              }`}
            />
            {featured === 'Y' ? 'Featured' : 'Feature'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="flex-1 min-w-[120px] text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => onAction({ type: 'delete', serviceId: service.id })}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </>
      )}
    </div>
  );
} 