'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  Edit, 
  Play, 
  Share2, 
  Trash2, 
  Clock, 
  List,
  Eye
} from 'lucide-react'
import ShareLink from './ShareLink'

interface Chapter {
  id: string
  title: string
  description: string
  status: string
  duration: string
  difficulty: string
  order_index: number
  created_at: string
  updated_at: string
  touchpoint_count: number
  views: number
}

interface ChapterCardProps {
  chapter: Chapter
  interactiveId: string
  onPreview: (chapter: Chapter) => void
  getStatusColor: (status: string) => string
  getDifficultyColor: (difficulty: string) => string
}

export default function ChapterCard({ 
  chapter, 
  interactiveId, 
  onPreview, 
  getStatusColor, 
  getDifficultyColor 
}: ChapterCardProps) {
  const [showShareModal, setShowShareModal] = useState(false)
  const [viewCount, setViewCount] = useState(chapter.views || 0)

  return (
    <>
      <motion.div
        className="glass-card p-5 hover:scale-105 transition-transform duration-300 h-full flex flex-col overflow-hidden"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Top Section - Image Placeholder with Play Button */}
        <div className="relative mb-4">
          <div className="w-full h-32 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center">
            <motion.button
              onClick={async () => {
                // Track the view when preview is opened
                try {
                  const response = await fetch(`/api/chapters/${chapter.id}/view`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  })
                  
                  if (response.ok) {
                    const data = await response.json()
                    setViewCount(data.views)
                  }
                } catch (error) {
                  console.error('Failed to track view:', error)
                }
                
                onPreview(chapter)
              }}
              className="glass-button bg-accent-purple/20 border-accent-purple/30 text-accent-purple hover:bg-accent-purple/30 p-3 rounded-full"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Play className="w-6 h-6" />
            </motion.button>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 space-y-3">
          <h3 className="text-lg font-semibold text-white line-clamp-2">{chapter.title}</h3>
          <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">{chapter.description}</p>
          
          {/* Views Count */}
          <div className="flex items-center space-x-1 text-sm text-gray-400">
            <Eye className="w-4 h-4" />
            <span>{viewCount} views</span>
          </div>

          {/* Duration and Touchpoints Info */}
          <div className="flex items-center space-x-4 text-xs text-gray-400">
            <span className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{chapter.duration || '3 mins'}</span>
            </span>
            <span>{chapter.touchpoint_count || 4} touchpoints</span>
          </div>
          
          {/* Status Badge */}
          <div className="flex items-center justify-start">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(chapter.status)}`}>
              {chapter.status === 'published' ? 'Active' : chapter.status}
            </span>
          </div>
        </div>
        
        {/* Bottom Section - Action Buttons */}
        <div className="pt-3 border-t border-gray-700/50 mt-auto">
          <div className="flex items-center space-x-1">
            <motion.button
              className="glass-button p-2 text-gray-400 hover:text-accent-purple"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Edit Chapter"
            >
              <Edit className="w-4 h-4" />
            </motion.button>
            
            <motion.button
              onClick={() => setShowShareModal(true)}
              className="glass-button p-2 text-gray-400 hover:text-accent-purple"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Share Chapter"
            >
              <Share2 className="w-4 h-4" />
            </motion.button>
            
            <motion.button
              className="glass-button p-2 text-gray-400 hover:text-accent-purple"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="View Touchpoints"
            >
              <List className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>

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
