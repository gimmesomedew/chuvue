import { useState } from 'react'

interface Touchpoint {
  id: string
  number: number
  title: string
  description: string
  duration: string
  type: 'Video' | 'Interactive' | 'Content'
  typeIcon: any
  typeColor: string
  videoUrl?: string
}

export function useEditModal() {
  const [editingTouchpoint, setEditingTouchpoint] = useState<Touchpoint | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const openEditModal = (touchpoint: Touchpoint) => {
    setEditingTouchpoint({ ...touchpoint })
    setIsEditModalOpen(true)
  }

  const closeEditModal = () => {
    setEditingTouchpoint(null)
    setIsEditModalOpen(false)
  }

  const updateEditingTouchpoint = (updates: Partial<Touchpoint>) => {
    if (editingTouchpoint) {
      setEditingTouchpoint({ ...editingTouchpoint, ...updates })
    }
  }

  return {
    editingTouchpoint,
    isEditModalOpen,
    openEditModal,
    closeEditModal,
    updateEditingTouchpoint
  }
}

