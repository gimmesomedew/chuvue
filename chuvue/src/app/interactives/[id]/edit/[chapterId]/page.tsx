'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Sidebar from '../../../../../components/Sidebar'
import { ArrowLeft, GraduationCap, Save, Clock, Play, Target, BookOpen } from 'lucide-react'
import React from 'react'

// Import our new components
import ChapterForm from './components/ChapterForm'
import TouchpointList from './components/TouchpointList'
import TouchpointEditModal from './components/TouchpointEditModal'

// Import our custom hooks
import { useChapterEdit } from '../../../../../hooks/useChapterEdit'
import { useEditModal } from '../../../../../hooks/useEditModal'

export default function EditChapterPage({ 
  params 
}: { 
  params: { id: string; chapterId: string } 
}) {
  const router = useRouter()
  
  // Use our custom hooks
  const {
    isLoading,
    isSaving,
    error,
    saveMessage,
    chapterTitle,
    chapterDescription,
    duration,
    difficulty,
    touchpoints,
    fetchChapter,
    addTouchpoint,
    deleteTouchpoint,
    updateTouchpoint,
    saveChanges,
    setChapterTitle,
    setChapterDescription,
    setDuration,
    setDifficulty
  } = useChapterEdit(params.chapterId)

  const {
    editingTouchpoint,
    isEditModalOpen,
    openEditModal,
    closeEditModal,
    updateEditingTouchpoint
  } = useEditModal()

  // Fetch chapter data on mount
  React.useEffect(() => {
    if (params.chapterId) {
      fetchChapter()
    }
  }, [params.chapterId, fetchChapter])

  const handleSaveChanges = async () => {
    await saveChanges()
    // Check if save was successful by looking at the message
    if (saveMessage && !saveMessage.includes('Error') && !saveMessage.includes('required')) {
      setTimeout(() => {
        router.push(`/interactives/${params.id}`)
      }, 1500)
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
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
      <Sidebar isCollapsed={false} onToggle={() => {}} />

      {/* Main Content */}
      <div className="ml-64">
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

            {/* Right Side - Action Buttons */}
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={handleSaveChanges}
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
                <ChapterForm
                  chapterTitle={chapterTitle}
                  chapterDescription={chapterDescription}
                  duration={duration}
                  difficulty={difficulty}
                  onTitleChange={setChapterTitle}
                  onDescriptionChange={setChapterDescription}
                  onDurationChange={setDuration}
                  onDifficultyChange={setDifficulty}
                />
                
                <TouchpointList
                  touchpoints={touchpoints}
                  onAddTouchpoint={addTouchpoint}
                  onEditTouchpoint={openEditModal}
                  onDeleteTouchpoint={deleteTouchpoint}
                  getNumberColor={getNumberColor}
                />
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
      <TouchpointEditModal
        isOpen={isEditModalOpen}
        touchpoint={editingTouchpoint}
        onSave={(updatedTouchpoint) => {
          updateTouchpoint(updatedTouchpoint)
          closeEditModal()
        }}
        onCancel={closeEditModal}
        getTypeIcon={(type) => {
          switch (type) {
            case 'Video': return 'Video'
            case 'Interactive': return 'Activity'
            case 'Content': return 'BookOpen'
            default: return 'BookOpen'
          }
        }}
        getTypeColor={(type) => {
          switch (type) {
            case 'Video': return 'text-blue-400'
            case 'Interactive': return 'text-green-400'
            case 'Content': return 'text-orange-400'
            default: return 'text-orange-400'
          }
        }}
      />
    </div>
  )
}

// Helper function for number colors (moved from inline)
function getNumberColor(number: number) {
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
