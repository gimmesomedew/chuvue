'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams } from 'next/navigation'
import Intro from '../components/Intro'
import TouchpointDisplay from '../components/TouchpointDisplay'
import TouchpointNavigation from '../components/TouchpointNavigation'
import AnimationControls from '../components/AnimationControls'
import { LoadingState, ErrorState, EmptyState } from '../components/PreviewStates'
import { useTouchpointPreview } from '../hooks/useTouchpointPreview'
import type { Chapter } from '../../../../types/chapter'

export default function SharedPreviewPage() {
  const params = useParams()
  const chapterId = params.id as string
  const [chapter, setChapter] = useState<Chapter | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch(`/api/chapters/${chapterId}`)
        if (!response.ok) {
          throw new Error('Chapter not found')
        }
        const data = await response.json()
        if (data.success) {
          setChapter(data.chapter)
        } else {
          throw new Error('Failed to load chapter')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load chapter')
        console.error('Error fetching chapter:', err)
      } finally {
        setIsLoading(false)
      }
    }

    if (chapterId) {
      fetchChapter()
    }
  }, [chapterId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-black flex items-center justify-center">
        <LoadingState />
      </div>
    )
  }

  if (error || !chapter) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-black flex items-center justify-center">
        <ErrorState error={error || 'Chapter not found'} onRetry={() => window.location.reload()} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-black">
      {/* Background Effects */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(139,92,246,0.08)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.06)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(75,85,99,0.05)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_60%,rgba(245,158,11,0.04)_0%,transparent_50%)]"></div>
      </div>

      {/* Floating Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-accent-purple/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-accent-green/5 rounded-full blur-2xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-32 left-1/3 w-28 h-28 bg-slate-600/8 rounded-full blur-2xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="glass-panel p-6 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">{chapter.title}</h1>
          <p className="text-gray-300 text-lg">Shared Chapter Preview</p>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 pb-6">
        <div className="glass-panel rounded-2xl shadow-2xl overflow-hidden">
          <SharedPreviewContent chapter={chapter} />
        </div>
      </div>
    </div>
  )
}

function SharedPreviewContent({ chapter }: { chapter: Chapter }) {
  const {
    currentTouchpoint,
    currentTouchpointIndex,
    totalTouchpoints,
    isLoading,
    error,
    isAnimationComplete,
    showIntro,
    fetchTouchpoints,
    startChapter,
    nextTouchpoint,
    previousTouchpoint,
    goToTouchpoint,
    updateTouchpoint,
    resetAnimation,
    markAnimationComplete
  } = useTouchpointPreview(chapter, true)

  if (isLoading) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState error={error} onRetry={fetchTouchpoints} />
  }

  if (showIntro) {
    return <Intro chapter={chapter} onStart={startChapter} />
  }

  if (totalTouchpoints === 0) {
    return <EmptyState />
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
      {/* Left Column - Touchpoint Content */}
      <div className="space-y-6">
        <TouchpointDisplay
          currentTouchpoint={currentTouchpoint!}
          currentTouchpointIndex={currentTouchpointIndex}
          totalTouchpoints={totalTouchpoints}
          isAnimationComplete={isAnimationComplete}
          onAnimationComplete={markAnimationComplete}
          isLoading={isLoading}
          onUpdateTouchpoint={updateTouchpoint}
        />
        
        <TouchpointNavigation
          currentIndex={currentTouchpointIndex}
          totalTouchpoints={totalTouchpoints}
          onPrevious={previousTouchpoint}
          onNext={nextTouchpoint}
          onGoTo={goToTouchpoint}
          onBackToIntro={startChapter}
        />
      </div>

      {/* Right Column - Animation Settings */}
      <div className="space-y-6">
        <AnimationControls
          currentTouchpoint={currentTouchpoint!}
          onUpdateTouchpoint={updateTouchpoint}
          onResetAnimation={resetAnimation}
        />
      </div>
    </div>
  )
}
