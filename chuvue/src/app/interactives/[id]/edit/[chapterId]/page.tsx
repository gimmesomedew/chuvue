'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Sidebar from '../../../../../components/Sidebar'
import { 
  ArrowLeft,
  GraduationCap,
  Save,
  Rocket,
  Plus,
  Edit,
  Trash2,
  Play,
  Video,
  Activity,
  BookOpen,
  Clock,
  Target
} from 'lucide-react'

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

export default function EditChapterPage({ 
  params 
}: { 
  params: { id: string; chapterId: string } 
}) {
  const router = useRouter()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [chapterTitle, setChapterTitle] = useState('')
  const [chapterDescription, setChapterDescription] = useState('')
  const [duration, setDuration] = useState('')
  const [difficulty, setDifficulty] = useState('Beginner')
  const [touchpoints, setTouchpoints] = useState<Touchpoint[]>([])
  const [editingTouchpoint, setEditingTouchpoint] = useState<Touchpoint | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  // Fetch existing chapter data
  useEffect(() => {
    const fetchChapter = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/chapters/${params.chapterId}`)
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
          const localTouchpoints: Touchpoint[] = (data.touchpoints || []).map((tp: any, index: number) => ({
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
          setTouchpoints(localTouchpoints)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch chapter')
        console.error('Error fetching chapter:', err)
      } finally {
        setIsLoading(false)
      }
    }

    if (params.chapterId) {
      fetchChapter()
    }
  }, [params.chapterId])

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

  const getNumberColor = (number: number) => {
    const colors = [
      'bg-gradient-to-br from-blue-500 to-blue-600',
      'bg-gradient-to-br from-green-500 to-green-600',
      'bg-gradient-to-br from-purple-500 to-purple-600',
      'bg-gradient-to-br from-orange-500 to-orange-600',
      'bg-gradient-to-br from-red-500 to-red-600',
      'bg-gradient-to-br from-indigo-500 to-indigo-600',
      'bg-gradient-to-br from-pink-500 to-pink-600',
      'bg-gradient-to-br from-yellow-500 to-yellow-600'
    ]
    return colors[(number - 1) % colors.length]
  }

  const addTouchpoint = () => {
    const newTouchpoint: Touchpoint = {
      id: Date.now().toString(),
      number: touchpoints.length + 1,
      title: 'New Touchpoint',
      description: 'Add description for this touchpoint.',
      duration: '2 mins',
      type: 'Content',
      typeIcon: BookOpen,
      typeColor: 'text-orange-400',
      videoUrl: ''
    }
    setTouchpoints([...touchpoints, newTouchpoint])
  }

  const deleteTouchpoint = (id: string) => {
    setTouchpoints(touchpoints.filter(tp => tp.id !== id))
    // Renumber remaining touchpoints
    setTouchpoints(prev => prev.map((tp, index) => ({ ...tp, number: index + 1 })))
  }

  const editTouchpoint = (touchpoint: Touchpoint) => {
    setEditingTouchpoint({ ...touchpoint })
    setIsEditModalOpen(true)
  }

  const saveTouchpoint = () => {
    if (editingTouchpoint) {
      setTouchpoints(touchpoints.map(tp => 
        tp.id === editingTouchpoint.id ? editingTouchpoint : tp
      ))
      setEditingTouchpoint(null)
      setIsEditModalOpen(false)
    }
  }

  const cancelEdit = () => {
    setEditingTouchpoint(null)
    setIsEditModalOpen(false)
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

      const response = await fetch(`/api/chapters/${params.chapterId}`, {
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
        throw new Error('Failed to update chapter')
      }

      const data = await response.json()
      if (data.success) {
        setSaveMessage('Chapter updated successfully!')
        setTimeout(() => {
          router.push(`/interactives/${params.id}`)
        }, 1500)
      }
    } catch (err) {
      setSaveMessage(`Error: ${err instanceof Error ? err.message : 'Failed to save chapter'}`)
      console.error('Error saving chapter:', err)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-black">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-purple mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading chapter...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-black">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-400 text-2xl">!</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Error Loading Chapter</h2>
            <p className="text-gray-300 mb-6">{error}</p>
            <button
              onClick={() => router.back()}
              className="glass-button bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30 px-6 py-2"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

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
          
          {/* Top Header Bar */}
          <motion.div 
            className="flex items-center justify-between p-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Left Side - Back Button and Module Info */}
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => router.back()}
                className="glass-hover p-2 rounded-lg"
                whileHover={{ scale: 1.1, x: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </motion.button>
              
              <div className="flex items-center space-x-3">
                <div className="glass-hover p-2 rounded-xl">
                  <GraduationCap className="w-6 h-6 text-accent-purple" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">{chapterTitle || 'Edit Chapter'}</h1>
                  <p className="text-gray-400 text-sm">
                    Editing Chapter
                    <span className="ml-2 text-accent-purple">(Existing Chapter)</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Action Buttons and User Avatar */}
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={saveChanges}
                disabled={isSaving}
                className={`glass-button px-4 py-2 flex items-center space-x-2 ${
                  isSaving 
                    ? 'bg-gray-500/20 border-gray-500/30 text-gray-400 cursor-not-allowed' 
                    : 'bg-green-500/20 border-green-500/30 text-green-400 hover:bg-green-500/30'
                }`}
                whileHover={isSaving ? {} : { scale: 1.05 }}
                whileTap={isSaving ? {} : { scale: 0.95 }}
              >
                <Save className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </motion.button>
              
              <motion.button
                onClick={() => router.back()}
                className="glass-button bg-accent-purple/20 border-accent-purple/30 text-accent-purple hover:bg-accent-purple/30 px-4 py-2 flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Module</span>
              </motion.button>

              <motion.div 
                className="w-10 h-10 bg-gradient-to-br from-accent-green to-slate-700 rounded-full flex items-center justify-center glass-hover"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-white font-bold text-sm">S</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Save Message */}
          {saveMessage && (
            <motion.div
              className="px-6 mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className={`glass-card p-3 text-center ${
                saveMessage.includes('Error') || saveMessage.includes('required')
                  ? 'border-red-500/30 bg-red-500/10'
                  : 'border-green-500/30 bg-green-500/10'
              }`}>
                <span className={saveMessage.includes('Error') || saveMessage.includes('required') ? 'text-red-400' : 'text-green-400'}>
                  {saveMessage}
                </span>
              </div>
            </motion.div>
          )}

          {/* Main Content Grid */}
          <div className="px-6 grid grid-cols-1 lg:grid-cols-10 gap-8 mb-8">
            
            {/* Left Panel - Chapter Details */}
            <div className="lg:col-span-5">
              <motion.div 
                className="glass-panel p-6"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Chapter Details</h2>
                  <p className="text-gray-400">Configure your interactive learning touchpoints.</p>
                </div>

                {/* Chapter Title */}
                <div className="mb-4">
                  <label className="block text-white font-medium mb-2">Chapter Title</label>
                  <input
                    type="text"
                    value={chapterTitle}
                    onChange={(e) => setChapterTitle(e.target.value)}
                    className="glass-input w-full p-3 text-white placeholder-gray-400"
                    placeholder="Enter chapter title"
                  />
                </div>

                {/* Chapter Description */}
                <div className="mb-4">
                  <label className="block text-white font-medium mb-2">Description</label>
                  <textarea
                    value={chapterDescription}
                    onChange={(e) => setChapterDescription(e.target.value)}
                    rows={3}
                    className="glass-input w-full p-3 text-white placeholder-gray-400 resize-none"
                    placeholder="Enter chapter description"
                  />
                </div>

                {/* Duration & Difficulty */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-white font-medium mb-2">Duration</label>
                    <input
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="glass-input w-full p-3 text-white placeholder-gray-400"
                      placeholder="e.g., 15-20 mins."
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Difficulty</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="glass-input w-full p-3 text-white"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                {/* Touchpoints Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Touchpoints</h3>
                    <motion.button
                      onClick={addTouchpoint}
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
                      <motion.div
                        key={touchpoint.id}
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
                              onClick={() => editTouchpoint(touchpoint)}
                              className="glass-hover p-2 rounded-lg text-blue-400 hover:text-blue-300"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Edit className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              onClick={() => deleteTouchpoint(touchpoint.id)}
                              className="glass-hover p-2 rounded-lg text-red-400 hover:text-red-300"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 mb-3">
                          <div className={`flex items-center space-x-2 ${touchpoint.typeColor}`}>
                            <touchpoint.typeIcon className="w-4 h-4" />
                            <span className="text-sm font-medium">{touchpoint.type}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-400">
                            <Clock className="w-3 h-3" />
                            <span className="text-sm">{touchpoint.duration}</span>
                          </div>
                        </div>

                        <p className="text-gray-300 text-sm">{touchpoint.description}</p>
                      </motion.div>
                    ))}

                    {touchpoints.length === 0 && (
                      <motion.div 
                        className="text-center py-8 text-gray-400"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium text-white mb-2">No Touchpoints Yet</p>
                        <p className="text-sm">Add touchpoints to see a live preview of your chapter</p>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Panel - Chapter Preview */}
            <div className="lg:col-span-5">
              <motion.div 
                className="glass-panel p-6"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2 }}
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Chapter Preview</h2>
                  <p className="text-gray-400">See how your chapter will look to learners.</p>
                </div>

                {/* Chapter Header Preview */}
                <div className="glass-card p-4 mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">{chapterTitle || 'Chapter Title'}</h3>
                  <p className="text-gray-300 mb-4">{chapterDescription || 'Chapter description will appear here...'}</p>
                  
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>{duration || 'Duration not set'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Target className="w-4 h-4" />
                      <span>{difficulty}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-400">
                      <BookOpen className="w-4 h-4" />
                      <span>{touchpoints.length} touchpoints</span>
                    </div>
                  </div>
                </div>

                {/* Touchpoints Preview */}
                <div className="space-y-4">
                  {touchpoints.length === 0 ? (
                    <motion.div 
                      className="text-center py-8 text-gray-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium text-white mb-2">No Touchpoints Yet</p>
                      <p className="text-sm">Add touchpoints to see a live preview of your chapter</p>
                    </motion.div>
                  ) : (
                    touchpoints.map((touchpoint, index) => (
                      <motion.div
                        key={touchpoint.id}
                        className="glass-card p-4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        whileHover={{ y: -2, scale: 1.01 }}
                      >
                        <div className="flex items-center space-x-3 mb-4">
                          <div className={`w-8 h-8 ${getNumberColor(touchpoint.number)} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                            {touchpoint.number}
                          </div>
                          <h3 className="text-white font-semibold">{touchpoint.title}</h3>
                        </div>

                        {touchpoint.type === 'Video' && (
                          <div className="space-y-3">
                            <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg h-32 flex items-center justify-center mb-3">
                              <motion.div 
                                className="glass-hover p-4 rounded-full"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                              >
                                <Play className="w-8 h-8 text-white" />
                              </motion.div>
                            </div>
                            
                            {/* Show video URL if available */}
                            {touchpoint.videoUrl && (
                              <div className="bg-gray-800/50 rounded-lg p-3">
                                <p className="text-gray-300 text-xs mb-1">Video URL:</p>
                                <p className="text-blue-400 text-sm break-all">{touchpoint.videoUrl}</p>
                              </div>
                            )}
                            
                            {/* Show placeholder if no URL */}
                            {!touchpoint.videoUrl && (
                              <div className="bg-gray-800/30 rounded-lg p-3 text-center">
                                <p className="text-gray-500 text-sm">No video URL set</p>
                                <p className="text-gray-600 text-xs">Edit touchpoint to add video URL</p>
                              </div>
                            )}
                          </div>
                        )}

                        {touchpoint.type === 'Interactive' && (
                          <div className="space-y-3">
                            <p className="text-white text-sm">
                              {touchpoint.number === 2 
                                ? "You failed your math test. What do you think?"
                                : "Same situation, different mindset. What would you think?"
                              }
                            </p>
                            <div className="space-y-2">
                              <button className="w-full p-3 text-left glass-button bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30">
                                "I'm just not good at math"
                              </button>
                              {touchpoint.number === 2 && (
                                <>
                                  <button className="w-full p-3 text-left glass-button hover:bg-accent-green/20 hover:border-accent-green/30 hover:text-accent-green">
                                    "I need to study harder next time"
                                  </button>
                                  <button className="w-full p-3 text-left glass-button hover:bg-accent-green/20 hover:border-accent-green/30 hover:text-accent-green">
                                    "I can learn from this mistake"
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        )}

                        {touchpoint.type === 'Content' && (
                          <div className="text-white text-sm">
                            {touchpoint.description || "Content description will appear here..."}
                          </div>
                        )}
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Touchpoint Modal */}
      <AnimatePresence>
        {isEditModalOpen && editingTouchpoint && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="glass-panel w-full max-w-md p-6"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Edit Touchpoint</h3>
              <motion.button
                onClick={cancelEdit}
                className="glass-hover p-2 rounded-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="text-gray-400 text-xl">×</span>
              </motion.button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={editingTouchpoint.title}
                  onChange={(e) => setEditingTouchpoint({ ...editingTouchpoint, title: e.target.value })}
                  className="glass-input w-full p-3 text-white placeholder-gray-400"
                  placeholder="Enter touchpoint title"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Description</label>
                <textarea
                  value={editingTouchpoint.description}
                  onChange={(e) => setEditingTouchpoint({ ...editingTouchpoint, description: e.target.value })}
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
                    value={editingTouchpoint.duration}
                    onChange={(e) => setEditingTouchpoint({ ...editingTouchpoint, duration: e.target.value })}
                    className="glass-input w-full p-3 text-white placeholder-gray-400"
                    placeholder="e.g., 2 mins"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Type</label>
                  <select
                    value={editingTouchpoint.type}
                    onChange={(e) => {
                      const newType = e.target.value as 'Video' | 'Interactive' | 'Content'
                      setEditingTouchpoint({
                        ...editingTouchpoint,
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
              {editingTouchpoint.type === 'Video' && (
                <div>
                  <label className="block text-white font-medium mb-2">Video URL</label>
                  <input
                    type="url"
                    value={editingTouchpoint.videoUrl || ''}
                    onChange={(e) => setEditingTouchpoint({ ...editingTouchpoint, videoUrl: e.target.value })}
                    className="glass-input w-full p-3 text-white placeholder-gray-400"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                  <p className="text-gray-400 text-xs mt-1">Paste a YouTube URL or any video link</p>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <motion.button
                  onClick={cancelEdit}
                  className="glass-button flex-1 p-3 text-gray-400 hover:text-white"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={saveTouchpoint}
                  className="glass-button flex-1 p-3 bg-accent-purple/20 border-accent-purple/30 text-accent-purple hover:bg-accent-purple/30"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Save Changes
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
