'use client'

import { motion } from 'framer-motion'
import { BookOpen, Plus } from 'lucide-react'

interface EmptyStateProps {
  interactiveId: string
}

export default function EmptyState({ interactiveId }: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <BookOpen className="w-24 h-24 mx-auto mb-6 opacity-50 text-gray-400" />
      <h3 className="text-xl font-bold text-white mb-3">No Chapters Yet</h3>
      <p className="text-gray-400 mb-6">Create your first chapter to get started</p>
      <motion.button
        onClick={() => window.location.href = `/interactives/${interactiveId}/create`}
        className="glass-button bg-accent-purple/20 border-accent-purple/30 text-accent-purple hover:bg-accent-purple/30 px-6 py-3"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Plus className="w-5 h-5 mr-2" />
        Create First Chapter
      </motion.button>
    </div>
  )
}

