'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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
  Clock,
  Star,
  TrendingUp,
  BookOpen,
  Target,
  Zap,
  Trash2
} from 'lucide-react'

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

export default function ModuleDetailPage({ params }: { params: { id: string } }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Module stats - will be updated with real data
  const [moduleStats, setModuleStats] = useState<ModuleStats>({
    totalInteractives: 0,
    activeStudents: 0,
    completionRate: 0,
    avgScore: 0,
    totalChapters: 0,
    totalDuration: '0 hours'
  })

  // Fetch chapters for this interactive
  const fetchChapters = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(`/api/chapters?interactiveId=${params.id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch chapters')
      }
      const data = await response.json()
      if (data.success) {
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
  }

  useEffect(() => {
    if (params.id) {
      fetchChapters()
    }
  }, [params.id])

  // Refresh chapters when page becomes visible (e.g., returning from create page)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && params.id) {
        fetchChapters()
      }
    }

    const handleFocus = () => {
      if (params.id) {
        fetchChapters()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [params.id])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'draft':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'archived':
        return 'bg-slate-600/20 text-slate-300 border-slate-600/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-500/20 text-green-400'
      case 'Intermediate':
        return 'bg-yellow-500/20 text-yellow-400'
      case 'Advanced':
        return 'bg-red-500/20 text-red-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
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
            className="flex items-center justify-end p-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="w-10 h-10 bg-gradient-to-br from-accent-green to-slate-700 rounded-full flex items-center justify-center glass-hover"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-white font-bold text-sm">S</span>
            </motion.div>
          </motion.div>

          {/* Header Section */}
          <motion.div 
            className="px-6 mb-8"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="glass-hover p-3 rounded-xl">
                  <BookOpen className="w-8 h-8 text-accent-purple" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    Coachability Learning Module
                  </h1>
                  <p className="text-gray-300 text-lg">
                    Create and manage interactive learning chapters on coachability
                  </p>
                </div>
              </div>
              <motion.button
                onClick={() => window.location.href = `/interactives/${params.id}/create`}
                className="glass-button px-6 py-3 flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-5 h-5" />
                <span>New Chapter</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Key Metrics Section */}
          <motion.div 
            className="px-6 mb-8 grid grid-cols-1 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              className="glass-card p-6"
              variants={itemVariants}
              whileHover="hover"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Total Interactives</p>
                  <p className="text-3xl font-bold text-white">{moduleStats.totalInteractives}</p>
                </div>
                <div className="glass-hover p-3 rounded-xl">
                  <Target className="w-8 h-8 text-accent-purple" />
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="glass-card p-6"
              variants={itemVariants}
              whileHover="hover"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Active Students</p>
                  <p className="text-3xl font-bold text-white">{moduleStats.activeStudents}</p>
                </div>
                <div className="glass-hover p-3 rounded-xl">
                  <Users className="w-8 h-8 text-green-400" />
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="glass-card p-6"
              variants={itemVariants}
              whileHover="hover"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Completion Rate</p>
                  <p className="text-3xl font-bold text-white">{moduleStats.completionRate}%</p>
                </div>
                <div className="glass-hover p-3 rounded-xl">
                  <TrendingUp className="w-8 h-8 text-accent-purple" />
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="glass-card p-6"
              variants={itemVariants}
              whileHover="hover"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Avg. Score</p>
                  <p className="text-3xl font-bold text-white">{moduleStats.avgScore}</p>
                </div>
                <div className="glass-hover p-3 rounded-xl">
                  <Star className="w-8 h-8 text-yellow-400" />
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="px-6 grid grid-cols-1 lg:grid-cols-10 gap-8 mb-8">
            {/* Left Column - Chapters */}
            <div className="lg:col-span-7">
              <motion.div 
                className="glass-panel p-6"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Coachability Chapters</h2>
                  <div className="flex items-center space-x-3">
                    <div className="glass-input flex items-center px-3 py-2 rounded-lg">
                      <Search className="w-4 h-4 text-gray-400 mr-2" />
                      <input 
                        type="text" 
                        placeholder="Search chapters..." 
                        className="bg-transparent text-white placeholder-gray-400 outline-none flex-1"
                      />
                    </div>
                    <motion.button 
                      className="glass-hover p-2 rounded-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Filter className="w-5 h-5 text-gray-400" />
                    </motion.button>
                    <motion.button 
                      className="glass-hover p-2 rounded-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Grid3X3 className="w-5 h-5 text-gray-400" />
                    </motion.button>
                  </div>
                </div>

                {/* Chapters Grid */}
                {isLoading ? (
                  <div className="text-center py-16">
                    <div className="text-gray-400 mb-6">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-purple mx-auto mb-6"></div>
                      <h3 className="text-2xl font-bold text-white mb-3">Loading Chapters...</h3>
                      <p className="text-lg text-gray-300">Fetching your learning content</p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="text-center py-16">
                    <div className="text-gray-400 mb-6">
                      <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-red-400 text-2xl">!</span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3">Error Loading Chapters</h3>
                      <p className="text-lg text-gray-300 mb-6">{error}</p>
                      <motion.button
                        onClick={() => window.location.reload()}
                        className="glass-button bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30 px-8 py-3 flex items-center space-x-3 mx-auto"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="font-semibold">Retry</span>
                      </motion.button>
                    </div>
                  </div>
                ) : chapters.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-gray-400 mb-6">
                      <BookOpen className="w-24 h-24 mx-auto mb-6 opacity-50" />
                      <h3 className="text-2xl font-bold text-white mb-3">No Chapters Yet</h3>
                      <p className="text-lg text-gray-300 mb-6">Start building your interactive learning experience by creating your first chapter</p>
                      <motion.button
                        onClick={() => window.location.href = `/interactives/${params.id}/create`}
                        className="glass-button bg-accent-purple/20 border-accent-purple/30 text-accent-purple hover:bg-accent-purple/30 px-8 py-3 flex items-center space-x-3 mx-auto"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Plus className="w-5 h-5" />
                        <span className="font-semibold">Create Your First Chapter</span>
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {chapters.map((chapter, index) => (
                    <motion.div
                      key={chapter.id}
                      className="glass-card p-4 cursor-pointer transition-all duration-300"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                    >
                      <div className="relative mb-4">
                        <div className="w-full h-32 bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg flex items-center justify-center">
                          <motion.div 
                            className="glass-hover p-4 rounded-full"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                          >
                            <Play className="w-8 h-8 text-white" />
                          </motion.div>
                        </div>
                        <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(chapter.status)}`}>
                          {chapter.status === 'published' ? 'Published' : 
                           chapter.status === 'draft' ? 'Draft' : 
                           chapter.status === 'archived' ? 'Archived' : chapter.status}
                        </div>
                      </div>

                      <h3 className="text-white font-semibold mb-2 line-clamp-2">{chapter.title}</h3>
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">{chapter.description}</p>

                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-3 h-3" />
                          <span>{chapter.duration}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Target className="w-3 h-3" />
                          <span>{chapter.touchpoint_count} touchpoints</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(chapter.difficulty)}`}>
                          {chapter.difficulty}
                        </span>
                        <span className="text-xs text-gray-500">{new Date(chapter.updated_at).toLocaleDateString()}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <motion.button 
                          onClick={() => window.location.href = `/interactives/${params.id}/edit/${chapter.id}`}
                          className="glass-hover p-2 rounded-lg"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Edit Chapter"
                        >
                          <Edit className="w-4 h-4 text-gray-400" />
                        </motion.button>
                        <motion.button 
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete "${chapter.title}"? This action cannot be undone.`)) {
                              fetch(`/api/chapters/${chapter.id}`, { method: 'DELETE' })
                                .then(response => response.json())
                                .then(data => {
                                  if (data.success) {
                                    // Refresh chapters list
                                    fetchChapters()
                                  }
                                })
                                .catch(error => {
                                  console.error('Error deleting chapter:', error)
                                  alert('Failed to delete chapter. Please try again.')
                                })
                            }
                          }}
                          className="glass-hover p-2 rounded-lg text-red-400 hover:text-red-300"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Delete Chapter"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                        <motion.button 
                          className="glass-hover p-2 rounded-lg"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Share Chapter"
                        >
                          <Share className="w-4 h-4 text-gray-400" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
                )}
              </motion.div>
            </div>

            {/* Right Column - Quick Actions & Recent Activity */}
            <div className="lg:col-span-3 space-y-6">
              {/* Quick Actions */}
              <motion.div 
                className="glass-panel p-6"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <motion.button
                    className="glass-button w-full p-4 flex items-center space-x-3"
                    whileHover={{ x: 5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.location.href = `/interactives/${params.id}/create`}
                  >
                    <Plus className="w-5 h-5 text-accent-purple" />
                    <div className="text-left">
                      <div className="text-white font-medium">Create Chapter</div>
                      <div className="text-gray-400 text-sm">Start a new interactive</div>
                    </div>
                  </motion.button>

                  <motion.button
                    className="glass-button w-full p-4 flex items-center space-x-3"
                    whileHover={{ x: 5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Upload className="w-5 h-5 text-green-400" />
                    <div className="text-left">
                      <div className="text-white font-medium">Import Content</div>
                      <div className="text-gray-400 text-sm">Upload existing materials</div>
                    </div>
                  </motion.button>

                  <motion.button
                    className="glass-button w-full p-4 flex items-center space-x-3"
                    whileHover={{ x: 5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                    <div className="text-left">
                      <div className="text-white font-medium">View Analytics</div>
                      <div className="text-gray-400 text-sm">Check performance data</div>
                    </div>
                  </motion.button>

                  <motion.button
                    className="glass-button w-full p-4 flex items-center space-x-3"
                    whileHover={{ x: 5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Users className="w-5 h-5 text-orange-400" />
                    <div className="text-left">
                      <div className="text-white font-medium">Manage Students</div>
                      <div className="text-gray-400 text-sm">View student progress</div>
                    </div>
                  </motion.button>
                </div>
              </motion.div>

              {/* Recent Activity */}
              <motion.div 
                className="glass-panel p-6"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.5 }}
              >
                <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">
                    <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium text-white mb-2">No Activity Yet</p>
                    <p className="text-sm">Activity will appear here as students engage with your content</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
