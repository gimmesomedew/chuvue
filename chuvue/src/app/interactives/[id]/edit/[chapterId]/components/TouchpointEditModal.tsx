'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { 
  Video, 
  Activity, 
  BookOpen 
} from 'lucide-react'
import { Touchpoint } from '@/types/touchpoint'

interface TouchpointEditModalProps {
  isOpen: boolean
  touchpoint: Touchpoint | null
  onSave: (touchpoint: Touchpoint) => void
  onCancel: () => void
  getTypeIcon: (type: string) => any
  getTypeColor: (type: string) => string
}

export default function TouchpointEditModal({ 
  isOpen, 
  touchpoint, 
  onSave, 
  onCancel, 
  getTypeIcon, 
  getTypeColor 
}: TouchpointEditModalProps) {
  if (!isOpen || !touchpoint) return null

  const handleSave = () => {
    onSave(touchpoint)
  }

  const updateTouchpoint = (updates: Partial<Touchpoint>) => {
    // This would be handled by the parent component's state
    // For now, we'll call onSave with the updated touchpoint
    onSave({ ...touchpoint, ...updates })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
              <h2 className="text-xl font-bold text-white">Edit Touchpoint</h2>
              <motion.button
                onClick={onCancel}
                className="glass-button p-2 text-gray-400 hover:text-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ×
              </motion.button>
            </div>

            {/* Form Content */}
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-white font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={touchpoint.title}
                    onChange={(e) => updateTouchpoint({ title: e.target.value })}
                    className="glass-input w-full p-3 text-white placeholder-gray-400"
                    placeholder="Enter touchpoint title"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Description</label>
                  <textarea
                    value={touchpoint.description}
                    onChange={(e) => updateTouchpoint({ description: e.target.value })}
                    rows={3}
                    className="glass-input w-full p-3 text-white placeholder-gray-400 resize-none"
                    placeholder="Enter touchpoint description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Duration</label>
                    <input
                      type="text"
                      value={touchpoint.duration}
                      onChange={(e) => updateTouchpoint({ duration: e.target.value })}
                      className="glass-input w-full p-3 text-white placeholder-gray-400"
                      placeholder="e.g., 2 mins"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Type</label>
                    <select
                      value={touchpoint.type}
                      onChange={(e) => {
                        const newType = e.target.value as 'Video' | 'Interactive' | 'Content'
                        updateTouchpoint({
                          type: newType,
                          typeIcon: getTypeIcon(newType),
                          typeColor: getTypeColor(newType)
                        })
                      }}
                      className="glass-input w-full p-3 text-white"
                    >
                      <option value="Video">Video</option>
                      <option value="Interactive">Interactive</option>
                      <option value="Content">Content</option>
                    </select>
                  </div>
                </div>

                {/* Video URL input - only show for Video type */}
                {touchpoint.type === 'Video' && (
                  <div>
                    <label className="block text-white font-medium mb-2">Video URL</label>
                    <input
                      type="url"
                      value={touchpoint.videoUrl || ''}
                      onChange={(e) => updateTouchpoint({ videoUrl: e.target.value })}
                      className="glass-input w-full p-3 text-white placeholder-gray-400"
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                    <p className="text-gray-400 text-xs mt-1">Paste a YouTube URL or any video link</p>
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <motion.button
                    onClick={onCancel}
                    className="glass-button flex-1 p-3 text-gray-400 hover:text-white"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleSave}
                    className="glass-button flex-1 p-3 bg-accent-purple/20 border-accent-purple/30 text-accent-purple hover:bg-accent-purple/30"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Save Changes
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
