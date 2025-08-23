'use client'

import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'
import AnimatedText from './AnimatedText'

interface Touchpoint {
  id: string
  title: string
  description: string
  duration: string
  type: string
  video_url: string
  order_index: number
  animation_effect?: string
  animation_speed?: number
  animation_delay?: number
  animation_easing?: string
  animation_duration?: number
}

interface TouchpointDisplayProps {
  currentTouchpoint: Touchpoint
  currentTouchpointIndex: number
  totalTouchpoints: number
  isAnimationComplete: boolean
  onAnimationComplete: () => void
}

// Helper function to extract YouTube video ID from various URL formats
const extractYouTubeId = (url: string): string => {
  if (!url) return ''
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
    /youtube\.com\/watch\?.*&v=([^&\n?#]+)/
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  
  return url
}

export default function TouchpointDisplay({
  currentTouchpoint,
  currentTouchpointIndex,
  totalTouchpoints,
  isAnimationComplete,
  onAnimationComplete
}: TouchpointDisplayProps) {
  return (
    <div className="space-y-6">
      {/* Touchpoint Display */}
      <div className="glass-card p-6 text-center">
        <div className="mb-6">
          {/* Touchpoint Counter */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent-purple/20 text-accent-purple text-sm font-medium mb-4">
            Touchpoint {currentTouchpointIndex + 1} of {totalTouchpoints}
          </div>
          
          {/* Animation Effect Badge */}
          <motion.div 
            className="inline-flex items-center px-3 py-1 rounded-full bg-accent-purple/20 text-accent-purple text-xs font-medium mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <span className="w-2 h-2 rounded-full bg-accent-purple mr-2"></span>
            {currentTouchpoint.animation_effect || 'typewriter'} effect
          </motion.div>
          
          {/* Touchpoint Title */}
          <motion.h3 
            className="text-2xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {currentTouchpoint.title}
          </motion.h3>
          
          {/* Touchpoint Description with Animation - Fixed Height Container */}
          <div className="min-h-[8rem] flex items-center justify-center mb-4 p-4 border border-gray-700/30 rounded-lg bg-gray-800/20">
            {isAnimationComplete ? (
              <span className="text-gray-300 text-base leading-relaxed max-w-2xl">
                {currentTouchpoint.description}
              </span>
            ) : (
              <AnimatedText 
                text={currentTouchpoint.description}
                effect={currentTouchpoint.animation_effect || 'typewriter'}
                speed={currentTouchpoint.animation_speed || 90}
                delay={currentTouchpoint.animation_delay || 1400}
                easing={currentTouchpoint.animation_easing || 'easeOut'}
                duration={currentTouchpoint.animation_duration || 3000}
                onComplete={onAnimationComplete}
              />
            )}
          </div>
        </div>

        {/* Touchpoint Type Badge */}
        <motion.div 
          className="inline-flex items-center px-4 py-2 rounded-full bg-gray-700/50 text-gray-300 text-sm font-medium mb-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <span className="w-2 h-2 rounded-full bg-accent-green mr-2"></span>
          {currentTouchpoint.type}
        </motion.div>

        {/* Duration */}
        <motion.div 
          className="flex items-center justify-center space-x-2 text-gray-400 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.4 }}
        >
          <Clock className="w-4 h-4" />
          <span>{currentTouchpoint.duration}</span>
        </motion.div>

        {/* Video Preview if available */}
        {currentTouchpoint.video_url && (
          <motion.div 
            className="mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.6 }}
          >
            <div className="w-full">
              <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden shadow-xl">
                <iframe
                  src={`https://www.youtube.com/embed/${extractYouTubeId(currentTouchpoint.video_url)}?rel=0&modestbranding=1&showinfo=0`}
                  title={currentTouchpoint.title}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="mt-2 text-center">
                <p className="text-xs text-gray-400">
                  Click the play button above to watch the video
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
