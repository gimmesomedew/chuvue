'use client';

import { Heart, Globe, MapPin, Star, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { User } from '@supabase/supabase-js';
import { Analytics } from '@/lib/analytics';
import { Service } from '@/lib/types';
import { ServiceAction } from '@/types/service';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
    <TooltipProvider>
      <div className="flex items-center gap-4 justify-center">
        {service.website_url && (
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.a
                href={service.website_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onAction({ type: 'website', serviceId: service.id })}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                <Globe className="h-5 w-5" />
              </motion.a>
            </TooltipTrigger>
            <TooltipContent>
              <p>Visit Website</p>
            </TooltipContent>
          </Tooltip>
        )}

        {service.address && (
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  service.address
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onAction({ type: 'map', serviceId: service.id })}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                <MapPin className="h-5 w-5" />
              </motion.a>
            </TooltipTrigger>
            <TooltipContent>
              <p>View on Map</p>
            </TooltipContent>
          </Tooltip>
        )}

        {user && (
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                onClick={handleFavorite}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`${
                  isFavorited ? 'text-red-500' : 'text-gray-500 hover:text-gray-700'
                } cursor-pointer`}
              >
                <Heart className={isFavorited ? 'fill-current' : ''} />
              </motion.button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}</p>
            </TooltipContent>
          </Tooltip>
        )}

        {isAdminOrReviewer && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  onClick={() => onAction({ type: 'feature', serviceId: service.id })}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`${
                    featured === 'Y' ? 'text-yellow-500' : 'text-gray-500 hover:text-gray-700'
                  } cursor-pointer`}
                >
                  <Star className={featured === 'Y' ? 'fill-current' : ''} />
                </motion.button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{featured === 'Y' ? 'Remove from Featured' : 'Mark as Featured'}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  onClick={() => onAction({ type: 'delete', serviceId: service.id })}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-gray-500 hover:text-red-600 cursor-pointer"
                >
                  <Trash2 className="h-5 w-5" />
                </motion.button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete Service</p>
              </TooltipContent>
            </Tooltip>
          </>
        )}
      </div>
    </TooltipProvider>
  );
} 