'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

interface ImageModalProps {
  images: string[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageModal({ images, initialIndex, isOpen, onClose }: ImageModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  if (!isOpen || currentIndex < 0 || !images.length) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black/90">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/70 hover:text-white transition-colors z-50"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="relative aspect-square md:aspect-video w-full">
          <Image
            src={images[currentIndex]}
            alt={`Image ${currentIndex + 1}`}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            priority
          />
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          </>
        )}

        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 