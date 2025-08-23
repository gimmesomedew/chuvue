'use client'

import { motion } from 'framer-motion'
import { Edit, Trash2 } from 'lucide-react'
import { Touchpoint } from '@/types/touchpoint'

interface TouchpointCardProps {
  touchpoint: Touchpoint
  onEdit: (touchpoint: Touchpoint) => void
  onDelete: (id: string) => void
  getNumberColor: (number: number) => string
}

export default function TouchpointCard({ 
  touchpoint, 
  onEdit, 
  onDelete, 
  getNumberColor 
}: TouchpointCardProps) {
  const IconComponent = touchpoint.typeIcon

  return (
    <motion.div
      className="glass-card p-4"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ y: -2, scale: 1.01 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 ${getNumberColor(touchpoint.number)} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
            {touchpoint.number}
          </div>
          <h3 className="text-white font-semibold">{touchpoint.title}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={() => onEdit(touchpoint)}
            className="glass-hover p-2 rounded-lg text-blue-400 hover:text-blue-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Edit className="w-4 h-4" />
          </motion.button>
          <motion.button
            onClick={() => onDelete(touchpoint.id)}
            className="glass-hover p-2 rounded-lg text-red-400 hover:text-red-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      <p className="text-gray-300 text-sm mb-3 line-clamp-2">{touchpoint.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {IconComponent && <IconComponent className={`w-4 h-4 ${touchpoint.typeColor}`} />}
          <span className="text-gray-400 text-sm">{touchpoint.type}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-400 text-sm">
          <span>{touchpoint.duration}</span>
          {touchpoint.videoUrl && (
            <span className="text-blue-400">• Has Video</span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
