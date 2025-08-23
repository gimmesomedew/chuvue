'use client'

import { motion } from 'framer-motion'
import { Play, Clock } from 'lucide-react'
import type { Chapter } from '../../../../types/chapter'

interface IntroProps {
  chapter: Chapter
  onStart: () => void
}

export default function Intro({ chapter, onStart }: IntroProps) {
  // Calculate estimated time per touchpoint (assuming 2-3 minutes per touchpoint)
  const estimatedTimePerTouchpoint = 2.5
  const totalEstimatedMinutes = Math.round((chapter.touchpoint_count || 0) * estimatedTimePerTouchpoint)
  
  return (
    <div className="text-center space-y-8 p-8">
      {/* Chapter Title */}
      <motion.h1 
        className="text-4xl font-bold text-white mb-6"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {chapter.title}
      </motion.h1>

      {/* Chapter Description */}
      <motion.div 
        className="max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      >
        <p className="text-xl text-gray-300 leading-relaxed">
          {chapter.description}
        </p>
      </motion.div>

      {/* Estimated Time */}
      <motion.div 
        className="flex items-center justify-center space-x-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
      >
        <Clock className="w-6 h-6 text-accent-green" />
        <span className="text-lg text-gray-300">
          Estimated time: <span className="text-white font-semibold">{totalEstimatedMinutes} minutes</span>
        </span>
      </motion.div>

      {/* Start Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
      >
        <motion.button
          onClick={onStart}
          className="glass-button bg-accent-purple/20 border-accent-purple/30 text-accent-purple hover:bg-accent-purple/30 px-8 py-4 text-lg font-semibold glow-effect"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Play className="w-6 h-6 mr-3" />
          Start Chapter
        </motion.button>
      </motion.div>
    </div>
  )
}
