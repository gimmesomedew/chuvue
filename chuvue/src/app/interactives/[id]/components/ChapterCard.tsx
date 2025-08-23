'use client'

import { motion } from 'framer-motion'
import { 
  Edit, 
  Play, 
  Share, 
  Trash2, 
  Clock, 
  List,
  Eye
} from 'lucide-react'

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
  return (
    <motion.div
      className="glass-card p-6 hover:scale-105 transition-transform duration-300"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Top Section - Image Placeholder with Play Button */}
      <div className="relative mb-4">
        <div className="w-full h-32 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center">
          <motion.button
            onClick={() => onPreview(chapter)}
            className="glass-button bg-accent-purple/20 border-accent-purple/30 text-accent-purple hover:bg-accent-purple/30 p-3 rounded-full"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Play className="w-6 h-6" />
          </motion.button>
        </div>
      </div>

      {/* Content Section */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white line-clamp-2">{chapter.title}</h3>
        <p className="text-gray-400 text-sm line-clamp-2">{chapter.description}</p>
        
        {/* Views Count */}
        <div className="flex items-center space-x-1 text-sm text-gray-400">
          <Eye className="w-4 h-4" />
          <span>{Math.floor(Math.random() * 500) + 100} views</span>
        </div>
        
        {/* Status Badge */}
        <div className="flex items-center justify-between">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(chapter.status)}`}>
            {chapter.status === 'published' ? 'Active' : chapter.status}
          </span>
        </div>
      </div>
      
      {/* Bottom Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-700/50 mt-4">
        <div className="flex space-x-2">
          <motion.button
            onClick={() => window.location.href = `/interactives/${interactiveId}/edit/${chapter.id}`}
            className="glass-button p-2 text-gray-400 hover:text-white"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Edit className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            className="glass-button p-2 text-gray-400 hover:text-white"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <List className="w-4 h-4" />
          </motion.button>
        </div>
        
        <motion.button
          className="glass-button p-2 text-gray-400 hover:text-white"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Share className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  )
}
