'use client';

import Image from 'next/image';
import { Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ServiceImageProps {
  imageUrl: string | null;
  name: string;
  onError?: () => void;
  isFavorited?: boolean;
}

export function ServiceImage({ imageUrl, name, onError, isFavorited }: ServiceImageProps) {
  return (
    <div className="relative aspect-[16/9] bg-[#E91A7E] rounded-t-lg overflow-hidden">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
          onError={onError}
          priority
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <Image
            src="/images/paw-placeholder.svg"
            alt="Paw print"
            width={64}
            height={64}
            className="opacity-50"
          />
          <span className="mt-2 text-sm font-medium">No Image Available</span>
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
            className="absolute top-2 right-2 p-2 rounded-full bg-black/50"
          >
            <Heart className="h-5 w-5 text-white fill-white" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 