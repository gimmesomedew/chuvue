'use client'

import { useState, useEffect, useCallback } from 'react'
import { Video, Activity, BookOpen } from 'lucide-react'
import { Touchpoint } from '../types/touchpoint'

export function useChapterEdit(chapterId: string) {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saveMessage, setSaveMessage] = useState('')
  
  const [chapterTitle, setChapterTitle] = useState('')
  const [chapterDescription, setChapterDescription] = useState('')
  const [duration, setDuration] = useState('')
  const [difficulty, setDifficulty] = useState('Beginner')
  const [touchpoints, setTouchpoints] = useState<Touchpoint[]>([])

  // Fetch existing chapter data
  const fetchChapter = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/chapters/${chapterId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch chapter')
      }
      const data = await response.json()
      if (data.success) {
        setChapterTitle(data.chapter.title)
        setChapterDescription(data.chapter.description)
        setDuration(data.chapter.duration)
        setDifficulty(data.chapter.difficulty)
        
        // Convert API touchpoints to local format
        const localTouchpoints: Touchpoint[] = (data.chapter.touchpoints || []).map((tp: any, index: number) => ({
          id: tp.id || `tp-${index}`,
          number: index + 1,
          title: tp.title,
          description: tp.description,
          duration: tp.duration,
          type: tp.type,
          typeIcon: getTypeIcon(tp.type),
          typeColor: getTypeColor(tp.type),
          videoUrl: tp.video_url || ''
        }))
        console.log('Loaded touchpoints from API:', data.chapter.touchpoints)
        console.log('Converted to local format:', localTouchpoints)
        setTouchpoints(localTouchpoints)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch chapter')
      console.error('Error fetching chapter:', err)
    } finally {
      setIsLoading(false)
    }
  }, [chapterId])

  useEffect(() => {
    if (chapterId) {
      fetchChapter()
    }
  }, [fetchChapter])

  const addTouchpoint = () => {
    const newTouchpoint: Touchpoint = {
      id: Date.now().toString(),
      number: touchpoints.length + 1,
      title: 'New Touchpoint',
      description: 'Add description for this touchpoint.',
      duration: '2 mins',
      type: 'Content',
      typeIcon: getTypeIcon('Content'),
      typeColor: getTypeColor('Content'),
      videoUrl: ''
    }
    setTouchpoints([...touchpoints, newTouchpoint])
  }

  const deleteTouchpoint = (id: string) => {
    setTouchpoints(prev => {
      const filtered = prev.filter(tp => tp.id !== id)
      // Renumber remaining touchpoints
      return filtered.map((tp, index) => ({ ...tp, number: index + 1 }))
    })
  }

  const updateTouchpoint = (updatedTouchpoint: Touchpoint) => {
    setTouchpoints(prev => prev.map(tp => 
      tp.id === updatedTouchpoint.id ? updatedTouchpoint : tp
    ))
  }

  const saveChanges = async () => {
    if (!chapterTitle.trim()) {
      setSaveMessage('Chapter title is required')
      return
    }

    setIsSaving(true)
    setSaveMessage('')

    try {
      // Convert local touchpoints to API format
      const apiTouchpoints = touchpoints.map(tp => ({
        title: tp.title,
        description: tp.description,
        duration: tp.duration,
        type: tp.type,
        videoUrl: tp.videoUrl || ''
      }))

      const response = await fetch(`/api/chapters/${chapterId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: chapterTitle,
          description: chapterDescription,
          duration: duration,
          difficulty: difficulty,
          touchpoints: apiTouchpoints
        })
      })

      if (!response.ok) {
        throw new Error('Failed to save chapter')
      }

      setSaveMessage('Chapter saved successfully!')
      setTimeout(() => setSaveMessage(''), 3000)
    } catch (err) {
      setSaveMessage(err instanceof Error ? err.message : 'Failed to save chapter')
      console.error('Error saving chapter:', err)
    } finally {
      setIsSaving(false)
    }
  }

  // Helper functions for icon and color mapping
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Video': return Video
      case 'Interactive': return Activity
      case 'Content': return BookOpen
      default: return BookOpen
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Video': return 'text-blue-400'
      case 'Interactive': return 'text-green-400'
      case 'Content': return 'text-orange-400'
      default: return 'text-orange-400'
    }
  }

  return {
    // State
    isLoading,
    isSaving,
    error,
    saveMessage,
    chapterTitle,
    chapterDescription,
    duration,
    difficulty,
    touchpoints,
    
    // Actions
    setChapterTitle,
    setChapterDescription,
    setDuration,
    setDifficulty,
    addTouchpoint,
    deleteTouchpoint,
    updateTouchpoint,
    saveChanges,
    fetchChapter
  }
}
