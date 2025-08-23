'use client'

import { useState } from 'react'
import { 
  Plus,
  Upload,
  BarChart3,
  Users,
  Search,
  Filter,
  Grid3X3,
  Edit,
  List,
  Share,
  Play,
  ChevronLeft,
  LayoutDashboard,
  Settings,
  Brain,
  BookOpen,
  TrendingUp,
  Star
} from 'lucide-react'

interface Chapter {
  id: string
  title: string
  description: string
  views: number
  status: 'active' | 'draft' | 'archived'
}

interface ModuleStats {
  totalInteractives: number
  activeStudents: number
  completionRate: number
  avgScore: number
}

// Left Navigation Sidebar Component
function LeftSidebar() {
  return (
    <div className="fixed left-0 top-0 h-full w-64 glass-panel border-r border-white/10">
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-accent-purple to-slate-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <span className="text-white font-bold text-lg">ChuVue</span>
        </div>
        <button className="p-1 rounded-lg glass-light hover:glass-hover transition-all duration-300">
          <ChevronLeft className="w-4 h-4 text-white" />
        </button>
      </div>

      <nav className="mt-6 px-3">
        <ul className="space-y-2">
          <li>
            <a href="/" className="flex items-center px-3 py-3 rounded-xl transition-all duration-300 text-gray-300 hover:glass-light hover:text-white">
              <LayoutDashboard className="w-5 h-5 mr-3" />
              <span className="font-medium">Dashboard</span>
            </a>
          </li>
          <li>
            <a href="/interactives" className="flex items-center px-3 py-3 rounded-xl glass-dark border border-accent-purple/40 text-accent-purple glow-effect">
              <Brain className="w-5 h-5 mr-3" />
              <span className="font-medium">Concept Hub</span>
            </a>
          </li>
          <li>
            <a href="/students" className="flex items-center px-3 py-3 rounded-xl transition-all duration-300 text-gray-300 hover:glass-light hover:text-white">
              <Users className="w-5 h-5 mr-3" />
              <span className="font-medium">Students</span>
            </a>
          </li>
          <li>
            <a href="/analytics" className="flex items-center px-3 py-3 rounded-xl transition-all duration-300 text-gray-300 hover:glass-light hover:text-white">
              <BarChart3 className="w-5 h-5 mr-3" />
              <span className="font-medium">Analytics</span>
            </a>
          </li>
          <li>
            <a href="/settings" className="flex items-center px-3 py-3 rounded-xl transition-all duration-300 text-gray-300 hover:glass-light hover:text-white">
              <Settings className="w-5 h-5 mr-3" />
              <span className="font-medium">Settings</span>
            </a>
          </li>
        </ul>
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-accent-green to-primary-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xs">A</span>
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-medium">Admin User</p>
            <p className="text-gray-400 text-xs">admin@chuvue.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main Content Component
function MainContent({ chapters, stats }: { chapters: Chapter[], stats: ModuleStats }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'draft': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'archived': return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active'
      case 'draft': return 'Draft'
      case 'archived': return 'Archived'
      default: return status
    }
  }

  return (
    <div className="w-full max-w-4xl">
      {/* Header */}
      <header className="glass-panel p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Coachability Learning Module</h1>
            <p className="text-gray-300 text-lg">Interactive learning experience with {chapters.length} chapter{chapters.length !== 1 ? 's' : ''}.</p>
          </div>
          <button className="glass-button flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-accent-purple/20 to-slate-800/40 hover:from-accent-purple/30 hover:to-slate-800/60 border-accent-purple/30 glow-effect">
            <Plus className="w-5 h-5" />
            <span className="font-semibold">New Chapter</span>
          </button>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Interactives</p>
              <p className="text-3xl font-bold text-white">{stats.totalInteractives}</p>
            </div>
            <div className="p-3 rounded-xl glass-dark text-accent-blue">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Students</p>
              <p className="text-3xl font-bold text-white">{stats.activeStudents.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-xl glass-dark text-accent-green">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Completion Rate</p>
              <p className="text-3xl font-bold text-white">{stats.completionRate}%</p>
            </div>
            <div className="p-3 rounded-xl glass-dark text-accent-purple">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Avg. Score</p>
              <p className="text-3xl font-bold text-white">{stats.avgScore}</p>
            </div>
            <div className="p-3 rounded-xl glass-dark text-accent-orange">
              <Star className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Chapters Section */}
      <div className="glass-panel p-6">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chapters.map((chapter) => (
            <div key={chapter.id} className="glass-card p-4 hover:glass-hover transition-all duration-300">
              <div className="relative bg-gray-800 rounded-lg aspect-video mb-4 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Play className="w-8 h-8 text-white" />
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">{chapter.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{chapter.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs">{chapter.views} views</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(chapter.status)}`}>
                    {getStatusText(chapter.status)}
                  </span>
                </div>

                <div className="flex items-center space-x-3 pt-2">
                  <button className="p-2 rounded-lg glass-light hover:glass-hover transition-all duration-300">
                    <Edit className="w-4 h-4 text-gray-300" />
                  </button>
                  <button className="p-2 rounded-lg glass-light hover:glass-hover transition-all duration-300">
                    <List className="w-4 h-4 text-gray-300" />
                  </button>
                  <button className="p-2 rounded-lg glass-light hover:glass-hover transition-all duration-300">
                    <Share className="w-4 h-4 text-gray-300" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Right Sidebar Component
function RightSidebar() {
  return (
    <div className="w-80 flex-shrink-0">
      <div className="glass-panel p-6 h-fit sticky top-4">
        <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
        
        <div className="space-y-4">
          <button className="w-full glass-button flex items-center justify-center space-x-2 bg-gradient-to-r from-accent-purple/20 to-slate-800/40 hover:from-accent-purple/30 hover:to-slate-800/60 border-accent-purple/30 py-3 glow-effect">
            <Plus className="w-5 h-5" />
            <div className="text-left">
              <span className="font-semibold block">Create Chapter</span>
              <span className="text-sm opacity-80">Start a new interactive</span>
            </div>
          </button>

          <button className="w-full p-4 rounded-xl glass-light hover:glass-hover transition-all duration-300 text-left">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-accent-green/20 text-accent-green">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white font-medium">Import Content</p>
                <p className="text-gray-400 text-sm">Upload existing materials</p>
              </div>
            </div>
          </button>

          <button className="w-full p-4 rounded-xl glass-light hover:glass-hover transition-all duration-300 text-left">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-accent-blue/20 text-accent-blue">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white font-medium">View Analytics</p>
                <p className="text-gray-400 text-sm">Check performance data</p>
              </div>
            </div>
          </button>

          <button className="w-full p-4 rounded-xl glass-light hover:glass-hover transition-all duration-300 text-left">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-accent-orange/20 text-accent-orange">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white font-medium">Manage Students</p>
                <p className="text-gray-400 text-sm">View student progress</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

// Main Page Component
export default function CoachabilityModule({ params }: { params: { id: string } }) {
  const [chapters] = useState<Chapter[]>([
    {
      id: '1',
      title: 'Intro',
      description: 'Coachability is one of the most misunderstood traits in sports—and in life.',
      views: 189,
      status: 'draft'
    }
  ])

  const [stats] = useState<ModuleStats>({
    totalInteractives: 1,
    activeStudents: 1247,
    completionRate: 87,
    avgScore: 8.4
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.3)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.3)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(120,219,255,0.2)_0%,transparent_50%)]"></div>
      </div>

      <div className="relative z-10">
        {/* Left Sidebar */}
        <LeftSidebar />
        
        {/* Main Content Area */}
        <div className="ml-64 p-6">
          <div className="flex gap-6">
            {/* Main Content - 70% */}
            <div className="flex-1">
              <MainContent chapters={chapters} stats={stats} />
            </div>
            
            {/* Right Sidebar - 30% */}
            <RightSidebar />
          </div>
        </div>
      </div>
    </div>
  )
}
