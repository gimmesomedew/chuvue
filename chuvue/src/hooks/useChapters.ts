import { useState, useEffect, useCallback, useRef } from 'react'

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

interface ModuleStats {
  totalInteractives: number
  activeStudents: number
  completionRate: number
  avgScore: number
  totalChapters: number
  totalDuration: string
}

export function useChapters(interactiveId: string) {
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [moduleStats, setModuleStats] = useState<ModuleStats>({
    totalInteractives: 0,
    activeStudents: 0,
    completionRate: 0,
    avgScore: 0,
    totalChapters: 0,
    totalDuration: '0 hours'
  })
  const initialized = useRef(false)

  const fetchChapters = useCallback(async () => {
    try {
      console.log('Fetching chapters for interactiveId:', interactiveId)
      setIsLoading(true)
      setError(null)
      const response = await fetch(`/api/chapters?interactiveId=${interactiveId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch chapters')
      }
      const data = await response.json()
      console.log('API response:', data)
      if (data.success) {
        console.log('Setting chapters:', data.chapters)
        setChapters(data.chapters)
        // Update module stats with real data
        setModuleStats(prev => ({
          ...prev,
          totalChapters: data.chapters.length
        }))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch chapters')
      console.error('Error fetching chapters:', err)
    } finally {
      setIsLoading(false)
    }
  }, [interactiveId])

  useEffect(() => {
    if (interactiveId && !initialized.current) {
      initialized.current = true
      fetchChapters()
    }
  }, [interactiveId, fetchChapters])

  return {
    chapters,
    isLoading,
    error,
    moduleStats,
    fetchChapters
  }
}
