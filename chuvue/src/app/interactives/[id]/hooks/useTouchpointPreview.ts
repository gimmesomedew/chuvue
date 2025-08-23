import { useState, useEffect } from 'react'

interface Touchpoint {
  id: string
  title: string
  description: string
  duration: string
  type: string
  video_url: string
  order_index: number
  animation_effect?: string
  animation_speed?: number
  animation_delay?: number
  animation_easing?: string
  animation_duration?: number
}

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

export function useTouchpointPreview(chapter: Chapter | null, isOpen: boolean) {
  const [touchpoints, setTouchpoints] = useState<Touchpoint[]>([])
  const [currentTouchpointIndex, setCurrentTouchpointIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [viewedTouchpoints, setViewedTouchpoints] = useState<Set<number>>(new Set())
  const [showIntro, setShowIntro] = useState(true)

  const fetchTouchpoints = async () => {
    if (!chapter) return
    
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(`/api/chapters/${chapter.id}/touchpoints`)
      if (!response.ok) {
        throw new Error('Failed to fetch touchpoints')
      }
      const data = await response.json()
      console.log('Touchpoints API response:', data)
      if (data.success) {
        console.log('Setting touchpoints:', data.touchpoints)
        setTouchpoints(data.touchpoints || [])
        setCurrentTouchpointIndex(0)
        setViewedTouchpoints(new Set())
        setShowIntro(true) // Always start with intro
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch touchpoints')
      console.error('Error fetching touchpoints:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch touchpoints when popup opens
  useEffect(() => {
    if (isOpen && chapter) {
      fetchTouchpoints()
    }
  }, [isOpen, chapter])

  const startChapter = () => {
    setShowIntro(false)
    setCurrentTouchpointIndex(0)
  }

  const nextTouchpoint = () => {
    if (currentTouchpointIndex < touchpoints.length - 1) {
      setCurrentTouchpointIndex(currentTouchpointIndex + 1)
    }
  }

  const previousTouchpoint = () => {
    if (currentTouchpointIndex > 0) {
      setCurrentTouchpointIndex(currentTouchpointIndex - 1)
    }
  }

  const goToTouchpoint = (index: number) => {
    setCurrentTouchpointIndex(index)
  }

  const updateTouchpoint = (updates: Partial<Touchpoint>) => {
    const updatedTouchpoints = touchpoints.map((tp, index) => 
      index === currentTouchpointIndex 
        ? { ...tp, ...updates }
        : tp
    )
    setTouchpoints(updatedTouchpoints)
  }

  const resetAnimation = () => {
    setViewedTouchpoints(prev => {
      const newSet = new Set(Array.from(prev))
      newSet.delete(currentTouchpointIndex)
      return newSet
    })
  }

  const markAnimationComplete = () => {
    setViewedTouchpoints(prev => new Set(Array.from(prev).concat(currentTouchpointIndex)))
  }

  const currentTouchpoint = touchpoints[currentTouchpointIndex]

  return {
    // State
    touchpoints,
    currentTouchpoint,
    currentTouchpointIndex,
    isLoading,
    error,
    viewedTouchpoints,
    showIntro,
    
    // Actions
    fetchTouchpoints,
    startChapter,
    nextTouchpoint,
    previousTouchpoint,
    goToTouchpoint,
    updateTouchpoint,
    resetAnimation,
    markAnimationComplete,
    
    // Computed
    totalTouchpoints: touchpoints.length,
    canGoPrevious: currentTouchpointIndex > 0,
    canGoNext: currentTouchpointIndex < touchpoints.length - 1,
    isAnimationComplete: viewedTouchpoints.has(currentTouchpointIndex)
  }
}
