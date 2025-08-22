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
  CheckCircle
} from 'lucide-react'

interface LearningConcept {
  id: string
  title: string
  description: string
  icon: any
  color: string
  status: 'active' | 'draft'
  completion: number
  chapters: number
  students: number
}

interface Activity {
  id: string
  name: string
  action: string
  module: string
  time: string
  score?: string
  status: 'completed' | 'started' | 'achieved'
  color: string
}

export default function ConceptsHub() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [learningConcepts, setLearningConcepts] = useState<LearningConcept[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newConcept, setNewConcept] = useState({
    title: '',
    description: '',
    category: 'Personal Development'
  })
  const [isCreating, setIsCreating] = useState(false)

  // Fetch real interactive data from database
  useEffect(() => {
    const fetchInteractives = async () => {
      try {
        const response = await fetch('/api/interactives')
        if (response.ok) {
          const data = await response.json()
          const concepts = data.map((interactive: any) => ({
            id: interactive.id, // This will be the real UUID
            title: interactive.title,
            description: interactive.description || 'Interactive learning module',
            icon: Brain, // Default icon for now
            color: 'text-accent-purple',
            status: interactive.status || 'draft',
            completion: Math.floor(Math.random() * 30) + 70, // Random completion for demo
            chapters: Math.floor(Math.random() * 20) + 10, // Random chapters for demo
            students: Math.floor(Math.random() * 200) + 100 // Random students for demo
          }))
          setLearningConcepts(concepts)
        }
      } catch (error) {
        console.error('Error fetching interactives:', error)
        // Fallback to sample data if API fails
        setLearningConcepts([
          {
            id: 'sample-1',
            title: 'Coachability',
            description: 'Interactive modules focusing on growth mindset, receiving feedback, self-assessment, and building resilience for personal development.',
            icon: Brain,
            color: 'text-accent-purple',
            status: 'active',
            completion: 87,
            chapters: 24,
            students: 342
          }
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchInteractives()
  }, [])

  const recentActivity: Activity[] = [
    {
      id: '1',
      name: 'Alex',
      action: 'completed',
      module: 'Coachability Module 3',
      time: '2 minutes ago',
      status: 'completed',
      color: 'bg-accent-green'
    },
    {
      id: '2',
      name: 'Sarah',
      action: 'started',
      module: 'Mental Toughness',
      time: '8 minutes ago',
      status: 'started',
      color: 'bg-accent-blue'
    },
    {
      id: '3',
      name: 'Mike',
      action: 'achieved 95% in',
      module: 'Grit Assessment',
      time: '15 minutes ago',
      status: 'achieved',
      color: 'bg-accent-orange'
    }
  ]

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  const handleCreateConcept = async () => {
    if (!newConcept.title.trim()) return
    
    setIsCreating(true)
    try {
      const response = await fetch('/api/interactives', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newConcept.title.trim(),
          description: newConcept.description.trim(),
          category: newConcept.category
        })
      })

      if (response.ok) {
        const result = await response.json()
        // Close modal and refresh concepts
        setIsCreateModalOpen(false)
        setNewConcept({ title: '', description: '', category: 'Personal Development' })
        // Refresh the concepts list
        const refreshResponse = await fetch('/api/interactives')
        if (refreshResponse.ok) {
          const data = await refreshResponse.json()
          const concepts = data.map((interactive: any) => ({
            id: interactive.id,
            title: interactive.title,
            description: interactive.description || 'Interactive learning module',
            icon: Brain,
            color: 'text-accent-purple',
            status: interactive.status || 'draft',
            completion: Math.floor(Math.random() * 30) + 70,
            chapters: Math.floor(Math.random() * 20) + 10,
            students: Math.floor(Math.random() * 200) + 100
          }))
          setLearningConcepts(concepts)
        }
      } else {
        console.error('Failed to create concept')
      }
    } catch (error) {
      console.error('Error creating concept:', error)
    } finally {
      setIsCreating(false)
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const
      }
    }
  }

  const cardHoverVariants = {
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const
      }
    }
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
                <h1 className="text-4xl font-bold text-white mb-2">Interactive Learning Concepts Hub</h1>
                <p className="text-gray-300 text-lg">Explore and manage your interactive learning modules.</p>
              </motion.div>
              <motion.button 
                onClick={() => setIsCreateModalOpen(true)}
                className="glass-button flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-accent-purple/20 to-slate-800/40 hover:from-accent-purple/30 hover:to-slate-800/60 border-accent-purple/30 glow-effect"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-5 h-5" />
                <span className="font-semibold">+ New Concept</span>
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
                  <p className="text-gray-400 text-sm">Total Concepts</p>
                  <p className="text-3xl font-bold text-white">{learningConcepts.length}</p>
                  <p className="text-accent-green text-sm">+{learningConcepts.length} this week</p>
                </div>
                <motion.div 
                  className="p-3 rounded-xl glass-dark text-accent-purple"
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Puzzle className="w-6 h-6" />
                </motion.div>
              </div>
            </motion.div>

            <motion.div 
              className="glass-card p-6"
              variants={itemVariants}
              whileHover="hover"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Modules</p>
                  <p className="text-3xl font-bold text-white">72</p>
                  <p className="text-accent-green text-sm">+8 this month</p>
                </div>
                <motion.div 
                  className="p-3 rounded-xl glass-dark text-accent-green"
                  whileHover={{ rotate: -5, scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <BookOpen className="w-6 h-6" />
                </motion.div>
              </div>
            </motion.div>

            <motion.div 
              className="glass-card p-6"
              variants={itemVariants}
              whileHover="hover"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Students</p>
                  <p className="text-3xl font-bold text-white">1,247</p>
                  <p className="text-accent-green text-sm">+124 this month</p>
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
              variants={itemVariants}
              whileHover="hover"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Completion Rate</p>
                  <p className="text-3xl font-bold text-white">87%</p>
                  <p className="text-accent-green text-sm">+5% from last month</p>
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
          <div className="px-6 grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            
            {/* Learning Concepts - Left Column */}
            <div className="lg:col-span-3">
              <motion.div 
                className="glass-panel p-6 floating-element"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">Learning Concepts</h2>
                  <div className="flex items-center space-x-3">
                    <button className="p-2 rounded-xl glass-light hover:glass-hover transition-all duration-300">
                      <Search className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="p-2 rounded-xl glass-light hover:glass-hover transition-all duration-300">
                      <Filter className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="text-gray-400">Loading concepts...</div>
                    </div>
                  ) : learningConcepts.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-gray-400">No concepts found</div>
                    </div>
                  ) : (
                    learningConcepts.map((concept, index) => (
                    <motion.div
                      key={concept.id}
                      className="glass-card p-4 cursor-pointer transition-all duration-300"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      whileHover={{ x: 5, scale: 1.01 }}
                      onClick={() => window.location.href = `/interactives/${concept.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-xl glass-dark ${concept.color}`}>
                            <concept.icon className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-white font-semibold text-lg mb-1">{concept.title}</h3>
                            <p className="text-gray-400 text-sm mb-2">{concept.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>{concept.chapters} Chapters</span>
                              <span>•</span>
                              <span>{concept.students} Students</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <div className={`text-xs px-2 py-1 rounded-full ${
                              concept.status === 'active' 
                                ? 'bg-accent-green/20 text-accent-green' 
                                : 'bg-accent-blue/20 text-accent-blue'
                            }`}>
                              {concept.status === 'active' ? 'Active' : 'Draft'}
                            </div>
                            <p className="text-accent-green text-sm font-medium mt-1">{concept.completion}% completion</p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    </motion.div>
                  ))
                  )}
                </div>
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
                    onClick={() => setIsCreateModalOpen(true)}
                    className="w-full glass-button flex items-center space-x-2 py-3"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
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
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      className="flex items-center space-x-3 p-2 rounded-xl glass-light"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.2 + index * 0.1 }}
                    >
                      <div className="w-6 h-6 bg-gradient-to-br from-accent-green to-primary-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xs">{activity.name.charAt(0)}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-xs">
                          <span className="font-medium">{activity.name}</span> {activity.action} {activity.module}
                        </p>
                        <p className="text-gray-400 text-xs">{activity.time}</p>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${activity.color}`}></div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Create Concept Modal */}
          {isCreateModalOpen && (
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
                  <h2 className="text-2xl font-bold text-white">Create New Concept</h2>
                  <button
                    onClick={() => setIsCreateModalOpen(false)}
                    className="glass-hover p-2 rounded-lg"
                  >
                    <span className="text-gray-400 hover:text-white">✕</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Concept Title
                    </label>
                    <input
                      type="text"
                      value={newConcept.title}
                      onChange={(e) => setNewConcept({ ...newConcept, title: e.target.value })}
                      placeholder="Enter concept title..."
                      className="w-full glass-input p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newConcept.description}
                      onChange={(e) => setNewConcept({ ...newConcept, description: e.target.value })}
                      placeholder="Describe your concept..."
                      rows={3}
                      className="w-full glass-input p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-purple/50 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={newConcept.category}
                      onChange={(e) => setNewConcept({ ...newConcept, category: e.target.value })}
                      className="w-full glass-input p-3 text-white focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
                    >
                      <option value="Personal Development">Personal Development</option>
                      <option value="Communication">Communication</option>
                      <option value="Leadership">Leadership</option>
                      <option value="Innovation">Innovation</option>
                    </select>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={() => setIsCreateModalOpen(false)}
                      className="flex-1 glass-button bg-gray-600/20 border-gray-600/30 text-gray-300 hover:bg-gray-600/30 py-3"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateConcept}
                      disabled={!newConcept.title.trim() || isCreating}
                      className={`flex-1 glass-button py-3 ${
                        !newConcept.title.trim() || isCreating
                          ? 'bg-gray-500/20 border-gray-500/30 text-gray-400 cursor-not-allowed'
                          : 'bg-accent-purple/20 border-accent-purple/30 text-accent-purple hover:bg-accent-purple/30'
                      }`}
                    >
                      {isCreating ? 'Creating...' : 'Create Concept'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  )
}
