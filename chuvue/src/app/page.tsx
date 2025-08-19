'use client'

import { useState } from 'react'
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
  Bell,
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
      color: 'bg-accent-blue'
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.3)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.3)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(120,219,255,0.2)_0%,transparent_50%)]"></div>
      </div>

      {/* Sidebar */}
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />

      {/* Main Content */}
      <div className={`transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? 'ml-20' : 'ml-64'
      }`}>
        <div className="relative z-10">
          
          {/* Top Header Bar */}
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-4">
              <button className="p-3 rounded-xl bg-glass-light border border-white/20 hover:bg-glass-dark transition-colors">
                <Bell className="w-5 h-5 text-white" />
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-accent-green to-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
            </div>
          </div>

          {/* Welcome Section */}
          <div className="px-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Welcome back, Sarah!</h1>
                <p className="text-gray-300 text-lg">Here's what's happening with your interactive learning system today</p>
              </div>
              <button className="glass-button flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-accent-purple to-primary-600 hover:from-accent-purple/80 hover:to-primary-600/80">
                <Plus className="w-5 h-5" />
                <span className="font-semibold">Create Interactive</span>
              </button>
            </div>
          </div>

          {/* Key Metrics Section */}
          <div className="px-6 mb-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="glass-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Interactives</p>
                  <p className="text-3xl font-bold text-white">24</p>
                  <p className="text-accent-green text-sm">+3 this week</p>
                </div>
                <div className="p-3 rounded-xl bg-glass-dark text-accent-purple">
                  <BookOpen className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Students</p>
                  <p className="text-3xl font-bold text-white">1,247</p>
                  <p className="text-accent-green text-sm">+124 this month</p>
                </div>
                <div className="p-3 rounded-xl bg-glass-dark text-accent-green">
                  <Users className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Completion Rate</p>
                  <p className="text-3xl font-bold text-white">87%</p>
                  <p className="text-accent-green text-sm">+5% from last month</p>
                </div>
                <div className="p-3 rounded-xl bg-glass-dark text-accent-purple">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Avg. Score</p>
                  <p className="text-3xl font-bold text-white">8.4</p>
                  <p className="text-accent-green text-sm">+0.3 improvement</p>
                </div>
                <div className="p-3 rounded-xl bg-glass-dark text-accent-orange">
                  <Star className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="px-6 grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            
            {/* Recent Interactives */}
            <div className="glass-panel p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Recent Interactives</h2>
                <a href="#" className="text-accent-purple hover:text-accent-purple/80 text-sm">View all</a>
              </div>
              <div className="space-y-4">
                {recentInteractives.map((interactive) => (
                  <div key={interactive.id} className="flex items-center space-x-3 p-3 rounded-lg bg-glass-light hover:bg-glass-dark transition-colors cursor-pointer">
                    <div className={`p-2 rounded-lg ${interactive.color} bg-glass-dark`}>
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
                          : 'bg-accent-blue/20 text-accent-blue'
                      }`}>
                        {interactive.status === 'active' ? 'Active' : 'Draft'}
                      </span>
                      <p className="text-gray-400 text-xs mt-1">{interactive.lastUpdated}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass-panel p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
              <div className="space-y-4">
                <button className="w-full glass-button flex items-center justify-center space-x-2 bg-gradient-to-r from-accent-purple to-primary-600 hover:from-accent-purple/80 hover:to-primary-600/80">
                  <Plus className="w-4 h-4" />
                  <span className="font-semibold">Create Interactive</span>
                </button>
                
                <div className="space-y-3">
                  <button className="w-full p-4 rounded-xl bg-glass-light border border-white/20 hover:bg-glass-dark transition-colors text-left">
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
                  
                  <button className="w-full p-4 rounded-xl bg-glass-light border border-white/20 hover:bg-glass-dark transition-colors text-left">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-accent-blue/20 text-accent-blue">
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

            {/* Performance Insights */}
            <div className="glass-panel p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Performance Insights</h2>
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-glass-light">
                  <p className="text-gray-400 text-sm">Most Popular Module</p>
                  <p className="text-white font-medium">Growth vs Fixed Mindset</p>
                  <p className="text-accent-green text-sm">342 students</p>
                </div>
                
                <div className="p-3 rounded-lg bg-glass-light">
                  <p className="text-gray-400 text-sm">Highest Completion</p>
                  <p className="text-white font-medium">Receiving Feedback</p>
                  <p className="text-accent-green text-sm">91% completion</p>
                </div>
                
                <div className="p-3 rounded-lg bg-glass-light">
                  <p className="text-gray-400 text-sm">Average Study Time</p>
                  <p className="text-white font-medium">Per interactive session</p>
                  <p className="text-accent-blue text-sm">24 minutes</p>
                </div>
                
                <div className="mt-6 p-4 rounded-lg bg-accent-purple/10 border border-accent-purple/20">
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
            <div className="glass-panel p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Recent Activity</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg bg-glass-light hover:bg-glass-dark transition-colors">
                    <div className="w-8 h-8 bg-gradient-to-br from-accent-green to-primary-500 rounded-full flex items-center justify-center">
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
