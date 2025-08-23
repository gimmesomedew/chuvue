'use client'

import { BookOpen, Clock, TrendingUp, Star } from 'lucide-react'

interface ModuleStats {
  totalInteractives: number
  activeStudents: number
  completionRate: number
  avgScore: number
  totalChapters: number
  totalDuration: string
}

interface StatsSectionProps {
  moduleStats: ModuleStats
}

export default function StatsSection({ moduleStats }: StatsSectionProps) {
  return (
    <section className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="glass-card p-6">
          <div className="flex items-center space-x-4">
            <div className="glass-hover p-3 rounded-xl">
              <BookOpen className="w-6 h-6 text-accent-purple" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Chapters</p>
              <p className="text-2xl font-bold text-white">{moduleStats.totalChapters}</p>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-6">
          <div className="flex items-center space-x-4">
            <div className="glass-hover p-3 rounded-xl">
              <Clock className="w-6 h-6 text-accent-green" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Duration</p>
              <p className="text-2xl font-bold text-white">{moduleStats.totalDuration}</p>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-6">
          <div className="flex items-center space-x-4">
            <div className="glass-hover p-3 rounded-xl">
              <TrendingUp className="w-6 h-6 text-accent-blue" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Completion Rate</p>
              <p className="text-2xl font-bold text-white">{moduleStats.completionRate}%</p>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-6">
          <div className="flex items-center space-x-4">
            <div className="glass-hover p-3 rounded-xl">
              <Star className="w-6 h-6 text-accent-yellow" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Average Score</p>
              <p className="text-2xl font-bold text-white">{moduleStats.avgScore}%</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

