'use client'

import { motion } from 'framer-motion'
import { X, Share2 } from 'lucide-react'
import { useState } from 'react'
import ShareLink from './ShareLink'
import type { Chapter } from '../../../../types/chapter'

interface PreviewHeaderProps {
  title: string
  chapter: Chapter
  onClose: () => void
  interactiveId: string
}

export default function PreviewHeader({ title, chapter, onClose, interactiveId }: PreviewHeaderProps) {
  const [showShareModal, setShowShareModal] = useState(false)

  return (
    <>
      <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <div className="flex items-center space-x-3">
          <motion.button
            onClick={() => setShowShareModal(true)}
            className="glass-button p-2 text-gray-400 hover:text-accent-purple"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Share Chapter"
          >
            <Share2 className="w-5 h-5" />
          </motion.button>
          <motion.button
            onClick={onClose}
            className="glass-button p-2 text-gray-400 hover:text-white"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Share Modal */}
      <ShareLink
        chapter={chapter}
        interactiveId={interactiveId}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </>
  )
}
