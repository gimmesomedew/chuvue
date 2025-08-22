'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Sidebar from '../components/Sidebar'
import { 
  Plus, 
  Play, 
  Users, 
  BookOpen, 
  BarChart3, 
  Settings,
  Video,
  Brain,
  Target,
  Lightbulb,
  TrendingUp,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageCircle
} from 'lucide-react'

interface Interactive {
  id: string
  title: string
  students: number
  completion: number
  status: 'active' | 'draft'
  lastUpdated: string
  icon: any
  color: string
}

export default function Dashboard() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  // Animation variants for staggered animations
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

  const recentInteractives: Interactive[] = [
    {
      id: '1',
      title: 'Growth vs Fixed Mindset',
      students: 342,
      completion: 89,
      status: 'active',
      lastUpdated: '2 days ago',
      icon: Brain,
      color: 'text-accent-purple'
    },
    {
      id: '2',
      title: 'Receiving Feedback',
      students: 187,
      completion: 91,
      status: 'active',
      lastUpdated: '1 week ago',
      icon: MessageCircle,
      color: 'text-accent-green'
    },
    {
      id: '3',
      title: 'Self-Assessment Tools',
      students: 124,
      completion: 76,
      status: 'draft',
      lastUpdated: '3 days ago',
      icon: Target,
      color: 'text-accent-blue'
    }
  ]

  const recentActivity = [
    {
      id: '1',
      name: 'Alex',
      action: 'completed',
      module: 'Growth vs Fixed Mindset',
      time: '2 minutes ago',
      score: '9.2/10',
      status: 'completed',
      color: 'bg-accent-green'
    },
    {
      id: '2',
      name: 'Sarah',
      action: 'started',
      module: 'Receiving Feedback',
      time: '15 minutes ago',
      status: 'started',
      color: 'bg-slate-600'
    },
    {
      id: '3',
      name: 'Mike',
      action: 'submitted feedback on',
      module: 'Learning from Mistakes',
      time: '1 hour ago',
      status: 'feedback',
      color: 'bg-accent-purple'
    },
    {
      id: '4',
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
                <h1 className="text-4xl font-bold text-white mb-2">Welcome back, Sarah!</h1>
                <p className="text-gray-300 text-lg">Here's what's happening with your interactive learning system today</p>
              </motion.div>
              <motion.button 
                className="glass-button flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-accent-purple/20 to-slate-800/40 hover:from-accent-purple/30 hover:to-slate-800/60 border-accent-purple/30 glow-effect"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/interactives'}
              >
                <Plus className="w-5 h-5" />
                <span className="font-semibold">Create Interactive</span>
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
                  <p className="text-gray-400 text-sm">Total Interactives</p>
                  <p className="text-3xl font-bold text-white">24</p>
                  <p className="text-accent-green text-sm">+3 this week</p>
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
                  className="p-3 rounded-xl glass-dark text-accent-green"
                  whileHover={{ rotate: -5, scale: 1.1 }}
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
                  className="p-3 rounded-xl glass-dark text-accent-purple"
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <TrendingUp className="w-6 h-6" />
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
                  <p className="text-gray-400 text-sm">Avg. Score</p>
                  <p className="text-3xl font-bold text-white">8.4</p>
                  <p className="text-accent-green text-sm">+0.3 improvement</p>
                </div>
                <motion.div 
                  className="p-3 rounded-xl glass-dark text-accent-orange"
                  whileHover={{ rotate: -5, scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Star className="w-6 h-6" />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="px-6 grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            
            {/* Recent Interactives - Left Column */}
            <div className="glass-panel p-6 floating-element">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Recent Interactives</h2>
                <a href="#" className="text-accent-purple hover:text-accent-purple/80 text-sm">View all</a>
              </div>
              <div className="space-y-4">
                {recentInteractives.map((interactive) => (
                  <div key={interactive.id} className="flex items-center space-x-3 p-3 rounded-xl glass-light hover:glass-hover transition-all duration-300 cursor-pointer">
                    <div className={`p-2 rounded-lg ${interactive.color} glass-dark`}>
                      <interactive.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{interactive.title}</p>
                      <p className="text-gray-400 text-sm">{interactive.students} students • {interactive.completion}% completion</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        interactive.status === 'active' 
                          ? 'bg-accent-green/20 text-accent-green' 
                          : 'bg-slate-600/20 text-slate-300'
                      }`}>
                        {interactive.status === 'active' ? 'Active' : 'Draft'}
                      </span>
                      <p className="text-gray-400 text-xs mt-1">{interactive.lastUpdated}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions - Middle Column */}
            <div className="glass-panel p-6 floating-element">
              <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
              <div className="space-y-4">
                <button 
                  className="w-full glass-button flex items-center justify-center space-x-2 bg-gradient-to-r from-accent-purple/20 to-slate-800/40 hover:from-accent-purple/30 hover:to-slate-800/60 border-accent-purple/30 py-3 glow-effect"
                  onClick={() => window.location.href = '/interactives'}
                >
                  <Plus className="w-4 h-4" />
                  <span className="font-semibold">Create Interactive</span>
                </button>
                
                <div className="space-y-3">
                  <button className="w-full p-4 rounded-xl glass-light hover:glass-hover transition-all duration-300 text-left">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-accent-green/20 text-accent-green">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-white font-medium">View Students</p>
                        <p className="text-gray-400 text-sm">Manage learners</p>
                      </div>
                    </div>
                  </button>
                  
                  <button className="w-full p-4 rounded-xl glass-light hover:glass-hover transition-all duration-300 text-left">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-slate-600/20 text-slate-300">
                        <BarChart3 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Analytics</p>
                        <p className="text-gray-400 text-sm">View reports</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Performance Insights - Right Column */}
            <div className="glass-panel p-6 floating-element">
              <h2 className="text-xl font-semibold text-white mb-6">Performance Insights</h2>
              <div className="space-y-4">
                <div className="p-3 rounded-xl glass-light">
                  <p className="text-gray-400 text-sm">Most Popular Module</p>
                  <p className="text-white font-medium">Growth vs Fixed Mindset</p>
                  <p className="text-accent-green text-sm">342 students</p>
                </div>
                
                <div className="p-3 rounded-xl glass-light">
                  <p className="text-gray-400 text-sm">Highest Completion</p>
                  <p className="text-white font-medium">Receiving Feedback</p>
                  <p className="text-accent-green text-sm">91% completion</p>
                </div>
                
                <div className="p-3 rounded-xl glass-light">
                  <p className="text-gray-400 text-sm">Average Study Time</p>
                  <p className="text-white font-medium">Per interactive session</p>
                  <p className="text-slate-300 text-sm">24 minutes</p>
                </div>
                
                <div className="mt-6 p-4 rounded-xl glass-dark border border-accent-purple/20 glow-effect">
                  <div className="flex items-center space-x-2 mb-2">
                    <Lightbulb className="w-5 h-5 text-accent-purple" />
                    <span className="text-accent-purple font-medium">Tip</span>
                  </div>
                  <p className="text-gray-300 text-sm">Students engage 40% more with video-based learning modules</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="px-6 mb-8">
            <div className="glass-panel p-6 floating-element">
              <h2 className="text-xl font-semibold text-white mb-6">Recent Activity</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
