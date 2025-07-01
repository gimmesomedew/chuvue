'use client';

import * as React from 'react';
import Image from 'next/image';
import { Heart, PawPrint } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ServiceTypeBadge } from './ServiceTypeBadge';

interface ServiceImageProps {
  imageUrl: string | null;
  name: string;
  onError?: () => void;
  isFavorited?: boolean;
  serviceType?: string;
  badgeColor?: string;
}

export function ServiceImage({ imageUrl, name, onError, isFavorited, serviceType, badgeColor }: ServiceImageProps) {
  const [imgError, setImgError] = React.useState(false);

  const handleImageError = () => {
    setImgError(true);
    onError?.();
  };

  return (
    <div className="relative aspect-[16/9] bg-[#0A2E3E]/60 rounded-t-lg overflow-hidden">
      {imageUrl && !imgError ? (
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
          onError={handleImageError}
          priority
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <PawPrint className="h-16 w-16 opacity-50 text-white" />
          <span className="mt-2 text-sm font-medium">No Image Available</span>
        </div>
      )}

      {/* Service Type Badge */}
      {serviceType && (
        <div className="absolute top-2 left-2">
          <ServiceTypeBadge type={serviceType} bgColor={badgeColor} />
        </div>
      )}

      {/* Heart Icon Overlay */}
      <AnimatePresence>
        {isFavorited && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="absolute top-2 right-2 p-2 rounded-full bg-white/80"
          >
            <Heart className="h-5 w-5 text-red-500 fill-red-500" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 