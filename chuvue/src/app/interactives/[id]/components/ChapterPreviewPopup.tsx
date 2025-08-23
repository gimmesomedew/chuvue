'use client'

import { motion, AnimatePresence } from 'framer-motion'
import PreviewHeader from './PreviewHeader'
import TouchpointDisplay from './TouchpointDisplay'
import TouchpointNavigation from './TouchpointNavigation'
import AnimationControls from './AnimationControls'
import { LoadingState, ErrorState, EmptyState } from './PreviewStates'
import { useTouchpointPreview } from '../hooks/useTouchpointPreview'
import type { Chapter } from '../../../types/chapter'

interface ChapterPreviewPopupProps {
  chapter: Chapter | null
  isOpen: boolean
  onClose: () => void
}

export default function ChapterPreviewPopup({ 
  chapter, 
  isOpen, 
  onClose 
}: ChapterPreviewPopupProps) {
  const {
    currentTouchpoint,
    currentTouchpointIndex,
    totalTouchpoints,
    isLoading,
    error,
    isAnimationComplete,
    fetchTouchpoints,
    nextTouchpoint,
    previousTouchpoint,
    goToTouchpoint,
    updateTouchpoint,
    resetAnimation,
    markAnimationComplete
  } = useTouchpointPreview(chapter, isOpen)

  if (!isOpen || !chapter) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <PreviewHeader title={chapter.title} onClose={onClose} />

          {/* Content */}
          <div className="p-6">
            {isLoading ? (
              <LoadingState />
            ) : error ? (
              <ErrorState error={error} onRetry={fetchTouchpoints} />
            ) : totalTouchpoints === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Touchpoint Content */}
                <div className="space-y-6">
                  <TouchpointDisplay
                    currentTouchpoint={currentTouchpoint!}
                    currentTouchpointIndex={currentTouchpointIndex}
                    totalTouchpoints={totalTouchpoints}
                    isAnimationComplete={isAnimationComplete}
                    onAnimationComplete={markAnimationComplete}
                    isLoading={isLoading}
                  />
                  
                  <TouchpointNavigation
                    currentIndex={currentTouchpointIndex}
                    totalTouchpoints={totalTouchpoints}
                    onPrevious={previousTouchpoint}
                    onNext={nextTouchpoint}
                    onGoTo={goToTouchpoint}
                  />
                </div>

                {/* Right Column - Animation Settings */}
                <div className="space-y-6">
                  <AnimationControls
                    currentTouchpoint={currentTouchpoint!}
                    onUpdateTouchpoint={updateTouchpoint}
                    onResetAnimation={resetAnimation}
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
