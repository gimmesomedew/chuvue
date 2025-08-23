'use client'

import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import TouchpointCard from './TouchpointCard'
import { Touchpoint } from '@/types/touchpoint'

interface TouchpointListProps {
  touchpoints: Touchpoint[]
  onAddTouchpoint: () => void
  onEditTouchpoint: (touchpoint: Touchpoint) => void
  onDeleteTouchpoint: (id: string) => void
  getNumberColor: (number: number) => string
}

export default function TouchpointList({
  touchpoints,
  onAddTouchpoint,
  onEditTouchpoint,
  onDeleteTouchpoint,
  getNumberColor
}: TouchpointListProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Touchpoints</h3>
        <motion.button
          onClick={onAddTouchpoint}
          className="glass-button bg-accent-purple/20 border-accent-purple/30 text-accent-purple hover:bg-accent-purple/30 px-4 py-2 flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-4 h-4" />
          <span>Add Touchpoint</span>
        </motion.button>
      </div>

      <div className="space-y-3">
        {touchpoints.map((touchpoint) => (
          <TouchpointCard
            key={touchpoint.id}
            touchpoint={touchpoint}
            onEdit={onEditTouchpoint}
            onDelete={onDeleteTouchpoint}
            getNumberColor={getNumberColor}
          />
        ))}
      </div>
    </div>
  )
}
