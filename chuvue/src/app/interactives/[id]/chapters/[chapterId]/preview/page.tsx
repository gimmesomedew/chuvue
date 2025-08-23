'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'

interface Chapter {
  id: string
  title: string
  description: string
  duration: string
  views?: number
}

interface Touchpoint {
  id: string
  title: string
  description: string
  duration: string
  type: string
  video_url?: string
  order_index: number
  animation_effect?: string
  animation_speed?: number
  animation_delay?: number
  animation_easing?: string
  animation_duration?: number
}

export default function ChapterPreviewPage() {
  const params = useParams()
  const chapterId = params.chapterId as string
  
  const [chapter, setChapter] = useState<Chapter | null>(null)
  const [touchpoints, setTouchpoints] = useState<Touchpoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showLearningExperience, setShowLearningExperience] = useState(false)
  const [currentTouchpointIndex, setCurrentTouchpointIndex] = useState(0)
  const [animationKey, setAnimationKey] = useState(0) // Add animation key for re-triggering animations

  // Memoize the fetchData function to prevent dependency array issues
  const fetchData = useCallback(async () => {
    if (!chapterId) return

    try {
      setLoading(true)
      setError(null)

      // Fetch chapter data
      const chapterResponse = await fetch(`/api/chapters/${chapterId}`)
      if (!chapterResponse.ok) {
        throw new Error('Failed to fetch chapter')
      }
      const chapterData = await chapterResponse.json()
      setChapter(chapterData.chapter || chapterData)

      // Fetch touchpoints
      const touchpointsResponse = await fetch(`/api/chapters/${chapterId}/touchpoints`)
      if (!touchpointsResponse.ok) {
        throw new Error('Failed to fetch touchpoints')
      }
      const touchpointsData = await touchpointsResponse.json()
      setTouchpoints(Array.isArray(touchpointsData.touchpoints) ? touchpointsData.touchpoints : [])

      // Track view - don't fail the whole request if this fails
      try {
        await fetch(`/api/chapters/${chapterId}/views`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'increment' })
        })
      } catch (viewError) {
        console.warn('Failed to track view:', viewError)
      }

    } catch (err) {
      console.error('Error fetching chapter data:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [chapterId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const nextTouchpoint = () => {
    if (currentTouchpointIndex < touchpoints.length - 1) {
      setCurrentTouchpointIndex(currentTouchpointIndex + 1)
      setAnimationKey(prev => prev + 1) // Re-trigger animations
    }
  }

  const previousTouchpoint = () => {
    if (currentTouchpointIndex > 0) {
      setCurrentTouchpointIndex(currentTouchpointIndex - 1)
      setAnimationKey(prev => prev + 1) // Re-trigger animations
    }
  }

  // Animation utility functions
  const getAnimationStyle = (touchpoint: Touchpoint) => {
    if (!touchpoint.animation_effect) return {}
    
    const baseStyle: React.CSSProperties = {
      animation: `${touchpoint.animation_effect} ${(touchpoint.animation_duration || 3000) / 1000}s ${touchpoint.animation_easing || 'easeOut'} both`,
      animationDelay: `${(touchpoint.animation_delay || 0) / 1000}s`
    }
    
    return baseStyle
  }

  const getAnimationClass = (touchpoint: Touchpoint) => {
    if (!touchpoint.animation_effect) return ''
    
    switch (touchpoint.animation_effect) {
      case 'typewriter':
        return 'animate-typewriter'
      case 'fadeIn':
        return 'animate-fadeIn'
      case 'slideUp':
        return 'animate-slideUp'
      case 'zoom':
        return 'animate-zoom'
      case 'stagger':
        return 'animate-stagger'
      case 'smoothReveal':
        return 'animate-smoothReveal'
      default:
        return 'animate-fadeIn'
    }
  }

  // Utility function to detect YouTube URLs and convert to embed
  const isYouTubeUrl = (url: string): boolean => {
    return url.includes('youtube.com') || url.includes('youtu.be')
  }

  const getYouTubeEmbedUrl = (url: string): string => {
    // Extract video ID from various YouTube URL formats
    let videoId = ''
    
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1]?.split('&')[0] || ''
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0] || ''
    }
    
    return `https://www.youtube.com/embed/${videoId}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-black">
        <div className="relative z-10 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-700 rounded-lg animate-pulse"></div>
              <div className="w-20 h-6 bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="w-6 h-6 bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="relative z-10 px-4 pb-6 space-y-6">
          <div className="glass-panel rounded-2xl p-6 text-center">
            <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-4 animate-pulse"></div>
            <div className="w-3/4 h-8 bg-gray-700 rounded mx-auto mb-4 animate-pulse"></div>
            <div className="w-full h-20 bg-gray-700 rounded mx-auto mb-6 animate-pulse"></div>
            <div className="w-48 h-12 bg-gray-700 rounded mx-auto animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-black">
        <div className="relative z-10 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-accent-purple rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-white font-semibold text-lg">ChuVue</span>
            </div>
          </div>
        </div>
        <div className="relative z-10 px-4 pb-6">
          <div className="glass-panel rounded-2xl p-8 text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Error Loading Chapter</h1>
            <p className="text-gray-300 mb-6">{error}</p>
            <button
              onClick={() => fetchData()}
              className="glass-button bg-accent-purple/20 border-accent-purple/30 text-accent-purple hover:bg-accent-purple/30 px-6 py-3"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!chapter) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-black">
        <div className="relative z-10 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-accent-purple rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-white font-semibold text-lg">ChuVue</span>
            </div>
          </div>
        </div>
        <div className="relative z-10 px-4 pb-6">
          <div className="glass-panel rounded-2xl p-8 text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Chapter Not Found</h1>
            <p className="text-gray-300 mb-6">The chapter you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    )
  }

  if (showLearningExperience) {
    const currentTouchpoint = touchpoints[currentTouchpointIndex]
    const totalTouchpoints = touchpoints.length

    if (!currentTouchpoint) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-black">
          <div className="relative z-10 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-accent-purple rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <span className="text-white font-semibold text-lg">ChuVue</span>
              </div>
              <button
                onClick={() => setShowLearningExperience(false)}
                className="text-gray-400 hover:text-white"
              >
                ← Back to Preview
              </button>
            </div>
          </div>
          <div className="relative z-10 px-4 pb-6">
            <div className="glass-panel rounded-2xl p-8 text-center">
              <h1 className="text-2xl font-bold text-white mb-4">No Content Available</h1>
              <p className="text-gray-300 mb-6">This chapter doesn't have any touchpoints yet.</p>
              <button
                onClick={() => setShowLearningExperience(false)}
                className="glass-button bg-accent-purple/20 border-accent-purple/30 text-accent-purple hover:bg-accent-purple/30 px-6 py-3"
              >
                Back to Preview
              </button>
            </div>
          </div>
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
        
        {/* Header */}
        <div className="relative z-10 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-accent-purple rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-white font-semibold text-lg">ChuVue</span>
            </div>
            <button
              onClick={() => setShowLearningExperience(false)}
              className="text-gray-400 hover:text-white"
            >
              ← Back to Preview
            </button>
          </div>
        </div>

        {/* Learning Experience Content */}
        <div className="relative z-10 px-4 pb-6">
          <div className="glass-panel rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 space-y-6">
              {/* Progress at Top */}
              <div className="glass-card p-4">
                <h4 className="text-white font-semibold mb-3">Progress</h4>
                <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                  <div
                    className="bg-accent-purple h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentTouchpointIndex + 1) / totalTouchpoints) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-400">
                  {currentTouchpointIndex + 1} of {totalTouchpoints} completed
                </p>
              </div>

              {/* Touchpoint Content */}
              <div className="glass-card p-6 min-h-[200px]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">
                    {currentTouchpoint.title}
                  </h3>
                  <span className="text-sm text-gray-400">
                    {currentTouchpointIndex + 1} of {totalTouchpoints}
                  </span>
                </div>

                <div 
                  key={`content-${animationKey}`}
                  className={`mb-4 leading-relaxed min-h-[150px] flex items-start ${getAnimationClass(currentTouchpoint)}`}
                  style={getAnimationStyle(currentTouchpoint)}
                >
                  <p className="text-gray-300 w-full">{currentTouchpoint.description}</p>
                </div>

                {currentTouchpoint.video_url && (
                  <div 
                    key={`video-${animationKey}`}
                    className={`mb-4 ${getAnimationClass(currentTouchpoint)}`}
                    style={getAnimationStyle(currentTouchpoint)}
                  >
                    {isYouTubeUrl(currentTouchpoint.video_url) ? (
                      <iframe
                        src={getYouTubeEmbedUrl(currentTouchpoint.video_url)}
                        title={currentTouchpoint.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-96 rounded-lg"
                      />
                    ) : (
                      <video
                        src={currentTouchpoint.video_url}
                        controls
                        preload="auto"
                        className="w-full h-96 rounded-lg"
                      />
                    )}
                  </div>
                )}

                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span>Duration: {currentTouchpoint.duration}</span>
                  <span>Type: {currentTouchpoint.type}</span>
                </div>
              </div>

              {/* Navigation on Same Row */}
              <div className="flex items-center justify-between">
                <button
                  onClick={previousTouchpoint}
                  disabled={currentTouchpointIndex === 0}
                  className="glass-button bg-accent-purple/20 border-accent-purple/30 text-accent-purple hover:bg-accent-purple/30 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3"
                >
                  Previous
                </button>

                <button
                  onClick={nextTouchpoint}
                  disabled={currentTouchpointIndex === totalTouchpoints - 1}
                  className="glass-button bg-accent-green/20 border-accent-green/30 text-accent-green hover:bg-accent-green/30 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3"
                >
                  Next
                </button>
              </div>

              {/* Tip at Bottom */}
              <div className="glass-card p-4 bg-accent-purple/10 border-accent-purple/20">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-accent-purple/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-accent-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm mb-1">Learning Tip</h4>
                    <p className="text-gray-300 text-sm">
                      Take your time with each touchpoint. The best learning happens when you fully engage with the content before moving forward.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Preview Page
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-black">
      {/* Background Effects */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(139,92,246,0.08)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.06)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(75,85,99,0.05)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_60%,rgba(245,158,11,0.04)_0%,transparent_50%)]"></div>
      </div>
      
      {/* Header */}
      <div className="relative z-10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-accent-purple rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-white font-semibold text-lg">ChuVue</span>
          </div>
          <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4 pb-6 space-y-6">
        {/* Chapter Overview */}
        <div className="glass-panel rounded-2xl p-6 text-center">
          <div className="w-16 h-16 bg-accent-purple/20 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-accent-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">{chapter.title}</h1>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            {chapter.description}
          </p>
          <button
            onClick={() => setShowLearningExperience(true)}
            className="glass-button bg-accent-purple/20 border-accent-purple/30 text-accent-purple hover:bg-accent-purple/30 px-8 py-4 text-lg font-semibold"
          >
            View Chapter
          </button>
        </div>

        {/* What You'll Learn */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white text-center mb-6">What You'll Learn</h2>
          <div className="space-y-3">
            {touchpoints.map((touchpoint) => (
              <div key={touchpoint.id} className="glass-card p-4 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-accent-purple/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-accent-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg">{touchpoint.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Journey Section */}
        <div className="glass-panel rounded-2xl p-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Begin Your Journey</h2>
          <p className="text-gray-300 mb-6">
            Take the first step toward developing essential {chapter.title.toLowerCase()} skills.
          </p>
          <button
            onClick={() => setShowLearningExperience(true)}
            className="glass-button bg-accent-green/20 border-accent-green/30 text-accent-green hover:bg-accent-green/30 px-8 py-4 text-lg font-semibold mb-4"
          >
            View Chapter
          </button>
          <div className="flex items-center justify-center space-x-2">
            {Array.from({ length: touchpoints.length }, (_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i === 0 ? 'bg-accent-green' : 'bg-gray-600'
                }`}
              ></div>
            ))}
            <span className="text-sm text-gray-400 ml-3">
              {touchpoints.length} touchpoints
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
