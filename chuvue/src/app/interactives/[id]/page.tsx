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
  SkipForward,
  Share2
} from 'lucide-react'

// Import extracted components
import ChapterCard from './components/ChapterCard'
import LoadingState from './components/LoadingState'
import ErrorState from './components/ErrorState'
import EmptyState from './components/EmptyState'
import ChapterPreviewPopup from './components/ChapterPreviewPopup'

// Import custom hooks
import { useChapters } from '../../../hooks/useChapters'
import { useSidebar } from '../../../hooks/useSidebar'
import { usePreview } from '../../../hooks/usePreview'

// Import utility functions
import { getStatusColor, getDifficultyColor } from '../../../utils/statusUtils'

// Import types
import type { Chapter, ModuleStats } from '../../../types/chapter'

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
          <div className="mx-4 mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div 
              className="glass-card p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Chapters</p>
                  <p className="text-3xl font-bold text-white">{moduleStats?.totalChapters || 0}</p>
                </div>
                <div className="p-3 rounded-xl glass-dark text-accent-purple">
                  <BookOpen className="w-6 h-6" />
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
                  <p className="text-3xl font-bold text-white">{moduleStats?.activeStudents || 0}</p>
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
                  <p className="text-3xl font-bold text-white">{moduleStats?.completionRate || 0}%</p>
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
                  <p className="text-3xl font-bold text-white">{moduleStats?.avgScore || 0}</p>
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
                    onClick={() => {
                      const moduleUrl = `${window.location.origin}/interactives/${params.id}`
                      const shareText = `Check out this interactive learning module: ${moduleUrl}`
                      if (navigator.share) {
                        navigator.share({
                          title: 'Interactive Learning Module',
                          text: shareText,
                          url: moduleUrl
                        })
                      } else {
                        navigator.clipboard.writeText(moduleUrl)
                        // You could add a toast notification here
                      }
                    }}
                    className="w-full p-4 rounded-xl glass-light hover:glass-hover transition-all duration-300 text-left"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-accent-purple/20 text-accent-purple">
                        <Share2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Share Module</p>
                        <p className="text-gray-400 text-sm">Share this learning module</p>
                      </div>
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
            interactiveId={params.id}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
