'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Sidebar from '../../components/Sidebar'
import { 
  Plus, 
  Search,
  Filter,
  Puzzle,
  BookOpen,
  Users,
  TrendingUp,
  Brain,
  Shield,
  Flame,
  ArrowRight,
  Import,
  BarChart3,
  UserCheck,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface Interactive {
  id: string
  title: string
  description: string
  status: string
  created_at: string
  updated_at: string
  view_count: number
  completion_count: number
  category_name: string | null
  category_color: string | null
  category_icon: string | null
  chapter_count: number
  student_count: number
}

interface Activity {
  id: string
  name: string
  action: string
  module: string
  time: string
  score?: string
  status: 'completed' | 'started' | 'achieved' | 'feedback' | 'perfect'
  color: string
}

export default function ConceptsHub() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [interactives, setInteractives] = useState<Interactive[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch interactives from database
  const fetchInteractives = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('/api/interactives')
      if (!response.ok) {
        throw new Error('Failed to fetch interactives')
      }
      const data = await response.json()
      if (data.success) {
        setInteractives(data.interactives)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch interactives')
      console.error('Error fetching interactives:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchInteractives()
  }, [])

  // Get icon component based on category icon name
  const getIconComponent = (iconName: string | null) => {
    switch (iconName) {
      case 'brain':
        return Brain
      case 'users':
        return Users
      case 'target':
        return Shield
      case 'lightbulb':
        return Flame
      default:
        return Puzzle
    }
  }

  // Get color class based on category color
  const getColorClass = (color: string | null) => {
    switch (color) {
      case '#8b5cf6':
        return 'text-accent-purple'
      case '#3b82f6':
        return 'text-accent-blue'
      case '#10b981':
        return 'text-accent-green'
      case '#f59e0b':
        return 'text-accent-orange'
      default:
        return 'text-accent-purple'
    }
  }

  // Calculate completion percentage
  const getCompletionPercentage = (studentCount: number, completionCount: number) => {
    if (studentCount === 0) return 0
    return Math.round((completionCount / studentCount) * 100)
  }

  const recentActivity: Activity[] = [
    {
      id: '550e8400-e29b-41d4-a716-446655440007',
      name: 'Alex',
      action: 'completed',
      module: 'Coachability Module 3',
      time: '2 minutes ago',
      status: 'completed',
      color: 'bg-accent-green'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440008',
      name: 'Sarah',
      action: 'started',
      module: 'Mental Toughness',
      time: '15 minutes ago',
      status: 'started',
      color: 'bg-slate-600'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440009',
      name: 'Mike',
      action: 'submitted feedback on',
      module: 'Learning from Mistakes',
      time: '1 hour ago',
      status: 'feedback',
      color: 'bg-accent-purple'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440010',
      name: 'Emma',
      action: 'achieved 100% on',
      module: 'Asking for Help',
      time: '3 hours ago',
      score: 'Perfect score!',
      status: 'perfect',
      color: 'bg-yellow-400'
    }
  ]

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-black">
        <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
        <div className={`transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-purple mx-auto mb-6"></div>
              <h3 className="text-2xl font-bold text-white mb-3">Loading Concepts...</h3>
              <p className="text-lg text-gray-300">Fetching your learning modules</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-black">
        <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
        <div className={`transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="text-red-400 mb-6">
                <AlertCircle className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Error Loading Concepts</h3>
              <p className="text-lg text-gray-300 mb-6">{error}</p>
              <button 
                onClick={fetchInteractives}
                className="glass-button px-6 py-3"
              >
                Retry
              </button>
            </div>
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

          {/* Welcome Section */}
          <motion.div 
            className="px-6 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h1 className="text-4xl font-bold text-white mb-2">Concept Hub</h1>
                <p className="text-gray-300 text-lg">Explore and manage your interactive learning modules</p>
              </motion.div>
              <motion.button 
                className="glass-button flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-accent-purple/20 to-slate-800/40 hover:from-accent-purple/30 hover:to-slate-800/60 border-accent-purple/30 glow-effect"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/interactives/create'}
              >
                <Plus className="w-5 h-5" />
                <span className="font-semibold">Create Interactive</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Key Metrics Section */}
          <motion.div 
            className="px-6 mb-8 grid grid-cols-1 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div 
              className="glass-card p-6"
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Interactives</p>
                  <p className="text-3xl font-bold text-white">{interactives.length}</p>
                  <p className="text-accent-green text-sm">Active modules</p>
                </div>
                <motion.div 
                  className="p-3 rounded-xl glass-dark text-accent-purple"
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <BookOpen className="w-6 h-6" />
                </motion.div>
              </div>
            </motion.div>

            <motion.div 
              className="glass-card p-6"
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Chapters</p>
                  <p className="text-3xl font-bold text-white">{interactives.reduce((sum, i) => sum + i.chapter_count, 0)}</p>
                  <p className="text-accent-green text-sm">Learning content</p>
                </div>
                <motion.div 
                  className="p-3 rounded-xl glass-dark text-accent-green"
                  whileHover={{ rotate: -5, scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Puzzle className="w-6 h-6" />
                </motion.div>
              </div>
            </motion.div>

            <motion.div 
              className="glass-card p-6"
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Students</p>
                  <p className="text-3xl font-bold text-white">{interactives.reduce((sum, i) => sum + i.student_count, 0)}</p>
                  <p className="text-accent-green text-sm">Engaged learners</p>
                </div>
                <motion.div 
                  className="p-3 rounded-xl glass-dark text-accent-purple"
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Users className="w-6 h-6" />
                </motion.div>
              </div>
            </motion.div>

            <motion.div 
              className="glass-card p-6"
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Published</p>
                  <p className="text-3xl font-bold text-white">{interactives.filter(i => i.status === 'published').length}</p>
                  <p className="text-accent-green text-sm">Live modules</p>
                </div>
                <motion.div 
                  className="p-3 rounded-xl glass-dark text-accent-orange"
                  whileHover={{ rotate: -5, scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <TrendingUp className="w-6 h-6" />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="px-6 grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            
            {/* Learning Concepts - Left Column */}
            <div className="lg:col-span-2">
              <motion.div 
                className="glass-panel p-6 floating-element"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">Learning Concepts</h2>
                  <div className="flex items-center space-x-3">
                    <div className="glass-input flex items-center px-3 py-2 rounded-lg">
                      <Search className="w-4 h-4 text-gray-400 mr-2" />
                      <input 
                        type="text" 
                        placeholder="Search concepts..." 
                        className="bg-transparent text-white placeholder-gray-400 outline-none flex-1"
                      />
                    </div>
                    <button className="glass-hover p-2 rounded-lg">
                      <Filter className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>
                
                {interactives.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-gray-400 mb-6">
                      <Puzzle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-2xl font-bold text-white mb-3">No Concepts Yet</h3>
                      <p className="text-lg text-gray-300">Create your first interactive learning module to get started</p>
                    </div>
                    <button 
                      onClick={() => window.location.href = '/interactives/create'}
                      className="glass-button px-6 py-3"
                    >
                      Create Your First Concept
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {interactives.map((interactive, index) => {
                      const IconComponent = getIconComponent(interactive.category_icon)
                      const colorClass = getColorClass(interactive.category_color)
                      const completionPercentage = getCompletionPercentage(interactive.student_count, interactive.completion_count)
                      
                      return (
                        <motion.div
                          key={interactive.id}
                          className="glass-card p-4 cursor-pointer transition-all duration-300"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + index * 0.1 }}
                          whileHover={{ x: 5, scale: 1.01 }}
                          onClick={() => window.location.href = `/interactives/${interactive.id}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className={`p-3 rounded-xl glass-dark ${colorClass}`}>
                                <IconComponent className="w-6 h-6" />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-white font-semibold text-lg mb-1">{interactive.title}</h3>
                                <p className="text-gray-400 text-sm mb-2">{interactive.description}</p>
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <span>{interactive.chapter_count} Chapters</span>
                                  <span>•</span>
                                  <span>{interactive.student_count} Students</span>
                                  {interactive.category_name && (
                                    <>
                                      <span>•</span>
                                      <span>{interactive.category_name}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="text-right">
                                <div className={`text-xs px-2 py-1 rounded-full ${
                                  interactive.status === 'published' 
                                    ? 'bg-accent-green/20 text-accent-green' 
                                    : interactive.status === 'draft'
                                    ? 'bg-orange-500/20 text-orange-400'
                                    : 'bg-slate-600/20 text-slate-300'
                                }`}>
                                  {interactive.status === 'published' ? 'Published' : 
                                   interactive.status === 'draft' ? 'Draft' : 'Archived'}
                                </div>
                                <p className="text-accent-green text-sm font-medium mt-1">{completionPercentage}% completion</p>
                              </div>
                              <ArrowRight className="w-5 h-5 text-gray-400" />
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Quick Actions & Recent Activity - Right Column */}
            <div className="lg:col-span-1 space-y-6">
              {/* Quick Actions */}
              <motion.div 
                className="glass-panel p-6 floating-element"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <motion.button 
                    className="w-full glass-button flex items-center space-x-2 py-3"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.location.href = '/interactives/create'}
                  >
                    <Plus className="w-4 h-4" />
                    <span className="font-medium">+ Create Concept</span>
                  </motion.button>
                  
                  <motion.button 
                    className="w-full glass-button flex items-center space-x-2 py-3"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Import className="w-4 h-4" />
                    <span className="font-medium">Import Content</span>
                  </motion.button>
                  
                  <motion.button 
                    className="w-full glass-button flex items-center space-x-2 py-3"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span className="font-medium">View Analytics</span>
                  </motion.button>
                  
                  <motion.button 
                    className="w-full glass-button flex items-center space-x-2 py-3"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <UserCheck className="w-4 h-4" />
                    <span className="font-medium">Manage Students</span>
                  </motion.button>
                </div>
              </motion.div>

              {/* Recent Activity */}
              <motion.div 
                className="glass-panel p-6 floating-element"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.1 }}
              >
                <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-xl glass-light hover:glass-hover transition-all duration-300">
                      <div className="w-8 h-8 bg-gradient-to-br from-accent-green to-slate-700 rounded-full flex items-center justify-center glass-hover">
                        <span className="text-white font-bold text-xs">{activity.name.charAt(0)}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm">
                          <span className="font-medium">{activity.name}</span> {activity.action} {activity.module}
                        </p>
                        <p className="text-gray-400 text-xs">{activity.time}</p>
                        {activity.score && (
                          <p className="text-accent-green text-xs font-medium">{activity.score}</p>
                        )}
                      </div>
                      <div className={`w-3 h-3 rounded-full ${activity.color}`}></div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
