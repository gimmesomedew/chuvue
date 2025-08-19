'use client'

import { useState } from 'react'
import { 
  LayoutDashboard, 
  Puzzle, 
  Users, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

const navigationItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/',
    active: true,
    color: 'text-accent-purple'
  },
  {
    id: 'interactives',
    label: 'Concept Hub',
    icon: Puzzle,
    href: '/interactives',
    active: false,
    color: 'text-accent-blue'
  },
  {
    id: 'students',
    label: 'Students',
    icon: Users,
    href: '/students',
    active: false,
    color: 'text-accent-green'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    href: '/analytics',
    active: false,
    color: 'text-accent-orange'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    href: '/settings',
    active: false,
    color: 'text-gray-400'
  }
]

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  return (
    <div className={`fixed left-0 top-0 h-full bg-glass-dark backdrop-blur-md border-r border-white/10 transition-all duration-300 ease-in-out ${
      isCollapsed ? 'w-20' : 'w-64'
    }`}>
      
      {/* Header with Logo */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-accent-purple to-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-white font-bold text-lg">ChuVue</span>
          </div>
        )}
        
        {isCollapsed && (
          <div className="w-8 h-8 bg-gradient-to-br from-accent-purple to-primary-500 rounded-lg flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-sm">C</span>
          </div>
        )}
        
        <button
          onClick={onToggle}
          className="p-1 rounded-lg bg-glass-light hover:bg-glass-dark transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-white" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-white" />
          )}
        </button>
      </div>
      
      {/* Navigation Items */}
      <nav className="mt-6 px-3">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.id}>
              <a
                href={item.href}
                className={`flex items-center px-3 py-3 rounded-lg transition-all duration-200 group ${
                  item.active 
                    ? 'bg-accent-purple/20 border border-accent-purple/40 text-accent-purple' 
                    : 'text-gray-300 hover:bg-glass-light hover:text-white'
                }`}
              >
                <item.icon className={`w-5 h-5 ${
                  isCollapsed ? 'mx-auto' : 'mr-3'
                } ${item.color}`} />
                
                {!isCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-glass-dark text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Bottom Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-accent-green to-primary-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">A</span>
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-medium">Admin User</p>
              <p className="text-gray-400 text-xs">admin@chuvue.com</p>
            </div>
          </div>
        )}
        
        {isCollapsed && (
          <div className="w-8 h-8 bg-gradient-to-br from-accent-green to-primary-500 rounded-full flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-xs">A</span>
          </div>
        )}
      </div>
    </div>
  )
}
