'use client'

import { motion } from 'framer-motion'
import { BookOpen } from 'lucide-react'

interface LoadingStateProps {
  message?: string
}

export function LoadingState({ message = "Loading touchpoints..." }: LoadingStateProps) {
  return (
    <div className="text-center py-16">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-purple mx-auto mb-6"></div>
      <p className="text-gray-400">{message}</p>
    </div>
  )
}

interface ErrorStateProps {
  error: string
  onRetry: () => void
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="text-center py-16">
      <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="text-red-400 text-2xl">!</span>
      </div>
      <h3 className="text-xl font-bold text-white mb-3">Error Loading Touchpoints</h3>
      <p className="text-gray-400 mb-6">{error}</p>
      <motion.button
        onClick={onRetry}
        className="glass-button bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30 px-6 py-3"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Retry
      </motion.button>
    </div>
  )
}

interface EmptyStateProps {
  message?: string
}

export function EmptyState({ message = "This chapter doesn't have any touchpoints yet." }: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <BookOpen className="w-24 h-24 mx-auto mb-6 opacity-50 text-gray-400" />
      <h3 className="text-xl font-bold text-white mb-3">No Touchpoints</h3>
      <p className="text-gray-400">{message}</p>
    </div>
  )
}
