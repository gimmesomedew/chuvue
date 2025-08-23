'use client'

import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface TouchpointNavigationProps {
  currentIndex: number
  totalTouchpoints: number
  onPrevious: () => void
  onNext: () => void
  onGoTo: (index: number) => void
}

export default function TouchpointNavigation({
  currentIndex,
  totalTouchpoints,
  onPrevious,
  onNext,
  onGoTo
}: TouchpointNavigationProps) {
  const canGoPrevious = currentIndex > 0
  const canGoNext = currentIndex < totalTouchpoints - 1

  return (
    <div className="space-y-6" onClick={(e) => e.stopPropagation()}>
      {/* Navigation Controls */}
      <div className="flex items-center justify-center space-x-4">
        <motion.button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className={`glass-button p-3 ${!canGoPrevious ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
          whileHover={canGoPrevious ? { scale: 1.05 } : {}}
          whileTap={canGoPrevious ? { scale: 0.95 } : {}}
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>

        <motion.button
          onClick={onNext}
          disabled={!canGoNext}
          className={`glass-button p-3 ${!canGoNext ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
          whileHover={canGoNext ? { scale: 1.05 } : {}}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Progress Dots */}
      <div className="flex items-center justify-center space-x-2">
        {Array.from({ length: totalTouchpoints }, (_, index) => (
          <motion.button
            key={index}
            onClick={() => onGoTo(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-accent-purple scale-125' 
                : 'bg-gray-600 hover:bg-gray-500'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            title={`Go to touchpoint ${index + 1}`}
          />
        ))}
      </div>

      {/* Touchpoint Counter */}
      <div className="text-center">
        <p className="text-sm text-gray-400">
          {currentIndex + 1} of {totalTouchpoints} touchpoints
        </p>
      </div>
    </div>
  )
}
