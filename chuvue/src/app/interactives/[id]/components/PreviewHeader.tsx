'use client'

import { motion } from 'framer-motion'
import { BookOpen, X } from 'lucide-react'

interface PreviewHeaderProps {
  title: string
  onClose: () => void
}

export default function PreviewHeader({ title, onClose }: PreviewHeaderProps) {
  return (
    <div className="flex items-center justify-between p-6 border-b border-gray-800">
      <div className="flex items-center space-x-4">
        <div className="glass-hover p-3 rounded-xl">
          <BookOpen className="w-6 h-6 text-accent-purple" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <p className="text-gray-400">Preview Mode</p>
        </div>
      </div>
      <motion.button
        onClick={onClose}
        className="glass-hover p-2 rounded-lg text-gray-400 hover:text-white"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Close preview"
      >
        <X className="w-6 h-6" />
      </motion.button>
    </div>
  )
}
