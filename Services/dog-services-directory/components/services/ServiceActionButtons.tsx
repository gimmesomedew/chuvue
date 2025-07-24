'use client';

import { Heart, Link, MapPlus, Star, Trash2, Pencil } from 'lucide-react';
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

const IconWrapper = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-1.5 rounded-full transition-all duration-200 ${className}`}>
    {children}
  </div>
);

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
      <div className="border-t border-gray-100">
        <div className="flex items-center justify-center gap-4 py-2 px-4">
          {service.website_url && (
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.a
                  href={service.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleWebsiteClick}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-primary-500 hover:text-primary-600 cursor-pointer"
                >
                  <IconWrapper className="bg-primary-50 hover:bg-primary-100">
                    <Link className="h-5 w-5" color="#22c55e" />
                  </IconWrapper>
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
                    `${service.name} ${service.address} ${service.city} ${service.state} ${service.zip_code}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleMapClick}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-emerald-500 hover:text-emerald-600 cursor-pointer"
                >
                  <IconWrapper className="bg-emerald-50 hover:bg-emerald-100">
                    <MapPlus className="h-5 w-5 text-secondary" />
                  </IconWrapper>
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
                    isFavorited ? 'text-red-500' : 'text-red-400 hover:text-red-500'
                  } cursor-pointer`}
                >
                  <IconWrapper className={`${isFavorited ? 'bg-red-50' : 'bg-gray-50 hover:bg-red-50'}`}>
                    <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
                  </IconWrapper>
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
                    onClick={() => onAction({ type: 'edit', serviceId: service.id })}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-blue-500 hover:text-blue-600 cursor-pointer"
                  >
                    <IconWrapper className="bg-blue-50 hover:bg-blue-100">
                      <Pencil className="h-5 w-5" />
                    </IconWrapper>
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit Service</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    onClick={() => onAction({ type: 'feature', serviceId: service.id })}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`${
                      featured === 'Y' ? 'text-amber-500' : 'text-amber-400 hover:text-amber-500'
                    } cursor-pointer`}
                  >
                    <IconWrapper className={`${featured === 'Y' ? 'bg-amber-50' : 'bg-gray-50 hover:bg-amber-50'}`}>
                      <Star className={`h-5 w-5 ${featured === 'Y' ? 'fill-current' : ''}`} />
                    </IconWrapper>
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
                    className="text-red-500 hover:text-red-600 cursor-pointer"
                  >
                    <IconWrapper className="bg-red-50 hover:bg-red-100">
                      <Trash2 className="h-5 w-5" />
                    </IconWrapper>
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete Service</p>
                </TooltipContent>
              </Tooltip>
            </>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
} 