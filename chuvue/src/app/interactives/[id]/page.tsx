'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '../../../components/Sidebar'
import { 
  Play, 
  Edit, 
  List, 
  Share, 
  Plus, 
  Upload, 
  BarChart3, 
  Users, 
  Search, 
  Filter,
  Grid3X3,
  Eye,
  Star,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  X,
  Puzzle,
  BookOpen,
  Clock,
  Target,
  Zap,
  Trash2,
  Play as PlayIcon,
  Pause,
  SkipBack,
  SkipForward
} from 'lucide-react'

// Import extracted components
import ChapterCard from './components/ChapterCard'
import LoadingState from './components/LoadingState'
import ErrorState from './components/ErrorState'
import EmptyState from './components/EmptyState'

// Import custom hooks
import { useChapters } from '../../../hooks/useChapters'
import { useSidebar } from '../../../hooks/useSidebar'
import { usePreview } from '../../../hooks/usePreview'

// Import utility functions
import { getStatusColor, getDifficultyColor } from '../../../utils/statusUtils'

// Import types
import type { Chapter, ModuleStats } from '../../../types/chapter'

// Additional interface for touchpoints
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

// Animation Component with Multiple Effects
function AnimatedText({ 
  text, 
  effect = 'typewriter',
  speed = 90,
  delay = 1400,
  easing = 'easeOut',
  duration = 3000,
  onComplete 
}: { 
  text: string
  effect?: string
  speed?: number
  delay?: number
  easing?: string
  duration?: number
  onComplete?: () => void
}) {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (!text) return

    setIsAnimating(true)
    setDisplayedText('')
    setCurrentIndex(0)

    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setCurrentIndex(prev => {
          if (prev >= text.length) {
            clearInterval(interval)
            setIsAnimating(false)
            onComplete?.()
            return prev
          }
          setDisplayedText(text.slice(0, prev + 1))
          return prev + 1
        })
      }, speed)

      return () => clearInterval(interval)
    }, delay)

    return () => clearTimeout(timer)
  }, [text, speed, delay, onComplete])

  const renderText = () => {
    switch (effect) {
      case 'typewriter':
        return (
          <motion.span 
            className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {displayedText}
            {isAnimating && (
              <motion.span
                className="inline-block w-0.5 h-6 bg-accent-purple ml-1"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            )}
          </motion.span>
        )
      
      case 'fade':
        return (
          <motion.span 
            className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: duration / 1000, ease: easing as any }}
          >
            {displayedText}
          </motion.span>
        )
      
      case 'slide-up':
        return (
          <motion.span 
            className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration / 1000, ease: easing as any }}
          >
            {displayedText}
          </motion.span>
        )
      
      case 'zoom':
        return (
          <motion.span 
            className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: duration / 1000, ease: easing as any }}
          >
            {displayedText}
          </motion.span>
        )
      
      case 'stagger':
        return (
          <span className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
            {displayedText}
          </span>
        )
      
      default:
        return (
          <span className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
            {displayedText}
          </span>
        )
    }
  }

  return (
    <div className="relative">
      {renderText()}
    </div>
  )
}

// Preview Popup Component
function ChapterPreviewPopup({ 
  chapter, 
  isOpen, 
  onClose 
}: { 
  chapter: Chapter | null
  isOpen: boolean
  onClose: () => void
}) {
  // Helper function to extract YouTube video ID from various URL formats
  const extractYouTubeId = (url: string): string => {
    if (!url) return ''
    
    // Handle various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/,
      /youtube\.com\/watch\?.*&v=([^&\n?#]+)/
    ]
    
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }
    
    // If no pattern matches, assume it's already a video ID
    return url
  }

  const [touchpoints, setTouchpoints] = useState<Touchpoint[]>([])
  const [currentTouchpointIndex, setCurrentTouchpointIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isTypingComplete, setIsTypingComplete] = useState(false)

  // Track which touchpoints have been viewed to avoid repeating animations
  const [viewedTouchpoints, setViewedTouchpoints] = useState<Set<number>>(new Set())

  const fetchTouchpoints = async () => {
    if (!chapter) return
    
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(`/api/chapters/${chapter.id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch touchpoints')
      }
      const data = await response.json()
      if (data.success) {
        setTouchpoints(data.chapter.touchpoints || [])
        setCurrentTouchpointIndex(0)
        setIsTypingComplete(false)
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

  // Reset typing state when touchpoint changes
  useEffect(() => {
    setIsTypingComplete(false)
  }, [currentTouchpointIndex])

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

  const currentTouchpoint = touchpoints[currentTouchpointIndex]

  if (!isOpen || !chapter) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <div className="flex items-center space-x-4">
              <div className="glass-hover p-3 rounded-xl">
                <BookOpen className="w-6 h-6 text-accent-purple" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{chapter.title}</h2>
                <p className="text-gray-400">Preview Mode</p>
              </div>
            </div>
            <motion.button
              onClick={onClose}
              className="glass-hover p-2 rounded-lg text-gray-400 hover:text-white"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Content */}
          <div className="p-6">
            {isLoading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-purple mx-auto mb-6"></div>
                <p className="text-gray-400">Loading touchpoints...</p>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-red-400 text-2xl">!</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Error Loading Touchpoints</h3>
                <p className="text-gray-400 mb-6">{error}</p>
                <motion.button
                  onClick={fetchTouchpoints}
                  className="glass-button bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30 px-6 py-3"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Retry
                </motion.button>
              </div>
            ) : touchpoints.length === 0 ? (
              <div className="text-center py-16">
                <BookOpen className="w-24 h-24 mx-auto mb-6 opacity-50 text-gray-400" />
                <h3 className="text-xl font-bold text-white mb-3">No Touchpoints</h3>
                <p className="text-gray-400">This chapter doesn't have any touchpoints yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Touchpoint Content */}
                <div className="space-y-6">
                  {/* Touchpoint Display */}
                  <div className="glass-card p-6 text-center">
                    <div className="mb-6">
                      <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent-purple/20 text-accent-purple text-sm font-medium mb-4">
                        Touchpoint {currentTouchpointIndex + 1} of {touchpoints.length}
                      </div>
                      
                      {/* Animation Effect Badge */}
                      <motion.div 
                        className="inline-flex items-center px-3 py-1 rounded-full bg-accent-purple/20 text-accent-purple text-xs font-medium mb-4"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                      >
                        <span className="w-2 h-2 rounded-full bg-accent-purple mr-2"></span>
                        {currentTouchpoint.animation_effect || 'typewriter'} effect
                      </motion.div>
                      
                      <motion.h3 
                        className="text-2xl font-bold text-white mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        {currentTouchpoint.title}
                      </motion.h3>
                      
                      <div className="min-h-[4rem] flex items-center justify-center mb-4">
                        {viewedTouchpoints.has(currentTouchpointIndex) ? (
                          <span className="text-gray-300 text-base leading-relaxed">
                            {currentTouchpoint.description}
                          </span>
                        ) : (
                          <AnimatedText 
                            text={currentTouchpoint.description}
                            effect={currentTouchpoint.animation_effect || 'typewriter'}
                            speed={currentTouchpoint.animation_speed || 90}
                            delay={currentTouchpoint.animation_delay || 1400}
                            easing={currentTouchpoint.animation_easing || 'easeOut'}
                            duration={currentTouchpoint.animation_duration || 3000}
                            onComplete={() => {
                              setIsTypingComplete(true)
                              setViewedTouchpoints(prev => new Set(Array.from(prev).concat(currentTouchpointIndex)))
                            }}
                          />
                        )}
                      </div>
                    </div>

                    {/* Touchpoint Type Badge */}
                    <motion.div 
                      className="inline-flex items-center px-4 py-2 rounded-full bg-gray-700/50 text-gray-300 text-sm font-medium mb-4"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 1.2 }}
                    >
                      <span className="w-2 h-2 rounded-full bg-accent-green mr-2"></span>
                      {currentTouchpoint.type}
                    </motion.div>

                    {/* Duration */}
                    <motion.div 
                      className="flex items-center justify-center space-x-2 text-gray-400 mb-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 1.4 }}
                    >
                      <Clock className="w-4 h-4" />
                      <span>{currentTouchpoint.duration}</span>
                    </motion.div>

                    {/* Video Preview if available */}
                    {currentTouchpoint.video_url && (
                      <motion.div 
                        className="mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1.6 }}
                      >
                        <div className="w-full">
                          <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden shadow-xl">
                            <iframe
                              src={`https://www.youtube.com/embed/${extractYouTubeId(currentTouchpoint.video_url)}?rel=0&modestbranding=1&showinfo=0`}
                              title={currentTouchpoint.title}
                              className="w-full h-full"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                          <div className="mt-2 text-center">
                            <p className="text-xs text-gray-400">
                              Click the play button above to watch the video
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Navigation Controls */}
                  <div className="flex items-center justify-center space-x-4">
                    <motion.button
                      onClick={previousTouchpoint}
                      disabled={currentTouchpointIndex === 0}
                      className={`glass-button p-3 ${currentTouchpointIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                      whileHover={currentTouchpointIndex > 0 ? { scale: 1.05 } : {}}
                      whileTap={currentTouchpointIndex > 0 ? { scale: 0.95 } : {}}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </motion.button>

                    <motion.button
                      onClick={nextTouchpoint}
                      disabled={currentTouchpointIndex === touchpoints.length - 1}
                      className={`glass-button p-3 ${currentTouchpointIndex === touchpoints.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                      whileHover={currentTouchpointIndex < touchpoints.length - 1 ? { scale: 1.05 } : {}}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </motion.button>
                  </div>

                  {/* Progress Dots */}
                  <div className="flex items-center justify-center space-x-2">
                    {touchpoints.map((_, index) => (
                      <motion.button
                        key={index}
                        onClick={() => goToTouchpoint(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentTouchpointIndex 
                            ? 'bg-accent-purple scale-125' 
                            : 'bg-gray-600 hover:bg-gray-500'
                        }`}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      />
                    ))}
                  </div>
                </div>

                {/* Right Column - Animation Settings */}
                <div className="space-y-6">
                  <div className="glass-card p-6">
                    <h4 className="text-lg font-medium text-white mb-6 text-center">Animation Settings</h4>
                    
                    {/* Effect Dropdown */}
                    <div className="mb-6">
                      <label className="block text-sm text-gray-300 mb-3">Animation Effect</label>
                      <select 
                        value={currentTouchpoint.animation_effect || 'typewriter'}
                        onChange={(e) => {
                          const updatedTouchpoints = touchpoints.map((tp, index) => 
                            index === currentTouchpointIndex 
                              ? { ...tp, animation_effect: e.target.value }
                              : tp
                          )
                          setTouchpoints(updatedTouchpoints)
                          setViewedTouchpoints(prev => {
                            const newSet = new Set(Array.from(prev))
                            newSet.delete(currentTouchpointIndex)
                            return newSet
                          })
                        }}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-3 text-white text-sm focus:outline-none focus:border-accent-purple"
                      >
                        <option value="typewriter">Typewriter</option>
                        <option value="fade">Fade In</option>
                        <option value="slide-up">Slide Up</option>
                        <option value="zoom">Zoom In</option>
                        <option value="stagger">Stagger</option>
                      </select>
                    </div>

                    {/* Speed and Delay Controls */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm text-gray-300 mb-3">Speed (ms)</label>
                        <input 
                          type="number"
                          min="10"
                          max="500"
                          step="10"
                          value={currentTouchpoint.animation_speed || 90}
                          onChange={(e) => {
                            const updatedTouchpoints = touchpoints.map((tp, index) => 
                              index === currentTouchpointIndex 
                                ? { ...tp, animation_speed: parseInt(e.target.value) }
                                : tp
                            )
                            setTouchpoints(updatedTouchpoints)
                          }}
                          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-3 text-white text-sm focus:outline-none focus:border-accent-purple text-center"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-300 mb-3">Delay (ms)</label>
                        <input 
                          type="number"
                          min="0"
                          max="5000"
                          step="100"
                          value={currentTouchpoint.animation_delay || 1400}
                          onChange={(e) => {
                            const updatedTouchpoints = touchpoints.map((tp, index) => 
                              index === currentTouchpointIndex 
                                ? { ...tp, animation_delay: parseInt(e.target.value) }
                                : tp
                            )
                            setTouchpoints(updatedTouchpoints)
                          }}
                          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-3 text-white text-sm focus:outline-none focus:border-accent-purple text-center"
                        />
                      </div>
                    </div>

                    {/* Duration and Easing Controls */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm text-gray-300 mb-3">Duration (ms)</label>
                        <input 
                          type="number"
                          min="500"
                          max="10000"
                          step="500"
                          value={currentTouchpoint.animation_duration || 3000}
                          onChange={(e) => {
                            const updatedTouchpoints = touchpoints.map((tp, index) => 
                              index === currentTouchpointIndex 
                                ? { ...tp, animation_duration: parseInt(e.target.value) }
                                : tp
                            )
                            setTouchpoints(updatedTouchpoints)
                          }}
                          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-3 text-white text-sm focus:outline-none focus:border-accent-purple text-center"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-300 mb-3">Easing</label>
                        <select 
                          value={currentTouchpoint.animation_easing || 'easeOut'}
                          onChange={(e) => {
                            const updatedTouchpoints = touchpoints.map((tp, index) => 
                              index === currentTouchpointIndex 
                                ? { ...tp, animation_easing: e.target.value }
                                : tp
                            )
                            setTouchpoints(updatedTouchpoints)
                          }}
                          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-3 text-white text-sm focus:outline-none focus:border-accent-purple"
                        >
                          <option value="easeOut">Ease Out</option>
                          <option value="easeIn">Ease In</option>
                          <option value="easeInOut">Ease In Out</option>
                          <option value="linear">Linear</option>
                          <option value="anticipate">Anticipate</option>
                        </select>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <motion.button
                        onClick={() => {
                          setViewedTouchpoints(prev => {
                            const newSet = new Set(Array.from(prev))
                            newSet.delete(currentTouchpointIndex)
                            return newSet
                          })
                        }}
                        className="glass-button flex-1 px-4 py-3 text-sm"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Preview Animation
                      </motion.button>
                      
                      <motion.button
                        onClick={async () => {
                          try {
                            const response = await fetch(`/api/chapters/${chapter.id}`, {
                              method: 'PUT',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({
                                title: chapter.title,
                                description: chapter.description,
                                duration: chapter.duration,
                                difficulty: chapter.difficulty,
                                touchpoints: touchpoints.map(tp => ({
                                  id: tp.id,
                                  title: tp.title,
                                  description: tp.description,
                                  duration: tp.duration,
                                  type: tp.type,
                                  videoUrl: tp.video_url,
                                  order_index: tp.order_index,
                                  animation_effect: tp.animation_effect,
                                  animation_speed: tp.animation_speed,
                                  animation_delay: tp.animation_delay,
                                  animation_easing: tp.animation_easing,
                                  animation_duration: tp.animation_duration
                                }))
                              })
                            })
                            
                            if (response.ok) {
                              alert('Animation settings saved successfully!')
                            } else {
                              throw new Error('Failed to save settings')
                            }
                          } catch (error) {
                            console.error('Error saving animation settings:', error)
                            alert('Failed to save animation settings. Please try again.')
                          }
                        }}
                        className="glass-button bg-accent-green/20 border-accent-green/30 text-accent-green hover:bg-accent-green/30 flex-1 px-4 py-3 text-sm"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Save Settings
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Main Component
export default function ModuleDetailPage({ params }: { params: { id: string } }) {
  const { chapters, isLoading, error, moduleStats, fetchChapters } = useChapters(params.id)
  const { isSidebarCollapsed, toggleSidebar } = useSidebar()
  const { previewChapter, isPreviewOpen, openPreview, closePreview } = usePreview()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-black">
      {/* Enhanced Background Pattern with Glass Morphism - Darker Theme */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(139,92,246,0.08)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.06)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(75,85,99,0.05)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_60%,rgba(245,158,11,0.04)_0%,transparent_50%)]"></div>
      </div>

      {/* Floating Orbs for Enhanced Glass Effect - Darker Theme */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-accent-purple/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-accent-green/5 rounded-full blur-2xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-32 left-1/3 w-28 h-28 bg-slate-600/8 rounded-full blur-2xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Sidebar */}
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />

      {/* Main Content */}
      <div className={`transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? 'ml-20' : 'ml-64'
      }`}>
        <div className="relative z-10">
          
          {/* Header Section - Matching Wireframe */}
          <motion.div 
            className="glass-panel mx-4 mt-4 p-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Coachability Learning Module</h1>
                <p className="text-gray-300 text-lg">Create and manage interactive learning chapters on coachability</p>
              </div>
              <motion.button
                onClick={() => window.location.href = `/interactives/${params.id}/create`}
                className="glass-button flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-accent-purple/20 to-slate-800/40 hover:from-accent-purple/30 hover:to-slate-800/60 border-accent-purple/30 glow-effect"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-5 h-5" />
                <span className="font-semibold">New Chapter</span>
              </motion.button>
            </div>
          </motion.div>

          {/* KPI Cards Section - 4 Cards in a Row */}


          {/* KPI Cards Section - Matching Wireframe */}
          <div className="mx-4 mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div 
              className="glass-card p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Interactives</p>
                  <p className="text-3xl font-bold text-white">24</p>
                </div>
                <div className="p-3 rounded-xl glass-dark text-accent-blue">
                  <Puzzle className="w-6 h-6" />
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="glass-card p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Students</p>
                  <p className="text-3xl font-bold text-white">1,247</p>
                </div>
                <div className="p-3 rounded-xl glass-dark text-accent-green">
                  <Users className="w-6 h-6" />
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="glass-card p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Completion Rate</p>
                  <p className="text-3xl font-bold text-white">87%</p>
                </div>
                <div className="p-3 rounded-xl glass-dark text-accent-purple">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="glass-card p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Avg. Score</p>
                  <p className="text-3xl font-bold text-white">8.4</p>
                </div>
                <div className="p-3 rounded-xl glass-dark text-accent-orange">
                  <Star className="w-6 h-6" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main Content and Right Sidebar Container */}
          <div className="mx-4 mt-6 flex gap-6">
            
            {/* Main Content Area - Coachability Chapters - 70% */}
            <div className="flex-1">
              <motion.div 
                className="glass-panel p-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">Coachability Chapters</h2>
                  <div className="flex items-center space-x-3">
                    <button className="p-2 rounded-lg glass-light hover:glass-hover transition-all duration-300">
                      <Filter className="w-4 h-4 text-gray-300" />
                    </button>
                    <button className="p-2 rounded-lg glass-light hover:glass-hover transition-all duration-300">
                      <Search className="w-4 h-4 text-gray-300" />
                    </button>
                    <button className="p-2 rounded-lg glass-light hover:glass-hover transition-all duration-300">
                      <Grid3X3 className="w-4 h-4 text-gray-300" />
                    </button>
                  </div>
                </div>

                {isLoading ? (
                  <LoadingState />
                ) : error ? (
                  <ErrorState error={error} onRetry={fetchChapters} />
                ) : chapters.length === 0 ? (
                  <EmptyState interactiveId={params.id} />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {chapters.map((chapter) => (
                      <ChapterCard
                        key={chapter.id}
                        chapter={chapter}
                        interactiveId={params.id}
                        onPreview={openPreview}
                        getStatusColor={getStatusColor}
                        getDifficultyColor={getDifficultyColor}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Right Quick Actions Sidebar - 30% */}
            <motion.div 
              className="w-80 flex-shrink-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="glass-panel p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
                
                <div className="space-y-4">
                  <motion.button
                    onClick={() => window.location.href = `/interactives/${params.id}/create`}
                    className="w-full glass-button flex items-center justify-center space-x-2 bg-gradient-to-r from-accent-purple/20 to-slate-800/40 hover:from-accent-purple/30 hover:to-slate-800/60 border-accent-purple/30 py-3 glow-effect"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Plus className="w-5 h-5" />
                    <div className="text-left">
                      <span className="font-semibold block">Create Chapter</span>
                      <span className="text-sm opacity-80">Start a new interactive</span>
                    </div>
                  </motion.button>

                  <motion.button
                    className="w-full p-4 rounded-xl glass-light hover:glass-hover transition-all duration-300 text-left"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-accent-green/20 text-accent-green">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Import Content</p>
                        <p className="text-gray-400 text-sm">Upload existing materials</p>
                      </div>
                    </div>
                  </motion.button>

                  <motion.button
                    className="w-full p-4 rounded-xl glass-light hover:glass-hover transition-all duration-300 text-left"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-accent-blue/20 text-accent-blue">
                        <BarChart3 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-white font-medium">View Analytics</p>
                        <p className="text-gray-400 text-sm">Check performance data</p>
                      </div>
                    </div>
                  </motion.button>

                  <motion.button
                    className="w-full p-4 rounded-xl glass-light hover:glass-hover transition-all duration-300 text-left"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-accent-orange/20 text-accent-orange">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Manage Students</p>
                        <p className="text-gray-400 text-sm">View student progress</p>
                      </div>
                    </div>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {isPreviewOpen && previewChapter && (
          <ChapterPreviewPopup
            chapter={previewChapter}
            isOpen={isPreviewOpen}
            onClose={closePreview}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
