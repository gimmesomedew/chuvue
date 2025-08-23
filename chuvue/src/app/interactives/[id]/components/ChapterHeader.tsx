'use client'

import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'

interface ChapterHeaderProps {
  interactiveId: string
}

export default function ChapterHeader({ interactiveId }: ChapterHeaderProps) {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Interactive Module</h1>
          <p className="text-gray-400 mt-2">Manage your interactive learning content</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={() => window.location.href = `/interactives/${interactiveId}/create`}
            className="glass-button bg-accent-purple/20 border-accent-purple/30 text-accent-purple hover:bg-accent-purple/30 px-6 py-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Chapter
          </motion.button>
        </div>
      </div>
    </header>
  )
}

