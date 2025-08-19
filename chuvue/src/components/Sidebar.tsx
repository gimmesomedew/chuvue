'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  Puzzle, 
  Users, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { usePathname } from 'next/navigation'

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
    active: false,
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
  // Animation variants
  const sidebarVariants = {
    expanded: { width: 256 },
    collapsed: { width: 80 }
  }

  const logoVariants = {
    expanded: { scale: 1, opacity: 1 },
    collapsed: { scale: 0.8, opacity: 0.8 }
  }

  const navItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  }

  const pathname = usePathname()

  return (
    <motion.div 
      className="fixed left-0 top-0 h-full glass-panel border-r border-white/10"
      variants={sidebarVariants}
      animate={isCollapsed ? 'collapsed' : 'expanded'}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      
      {/* Header with Logo */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-accent-purple to-primary-500 rounded-lg flex items-center justify-center glass-hover">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-white font-bold text-lg">ChuVue</span>
          </div>
        )}
        
        {isCollapsed && (
          <div className="w-8 h-8 bg-gradient-to-br from-accent-purple to-primary-500 rounded-lg flex items-center justify-center mx-auto glass-hover">
            <span className="text-white font-bold text-sm">C</span>
          </div>
        )}
        
        <button
          onClick={onToggle}
          className="p-1 rounded-lg glass-light hover:glass-hover transition-all duration-300"
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
          {navigationItems.map((item, index) => {
            const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
            return (
              <motion.li 
                key={item.id}
                variants={navItemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
              >
                <motion.a
                  href={item.href}
                  className={`flex items-center px-3 py-3 rounded-xl transition-all duration-300 group ${
                    isActive 
                      ? 'glass-dark border border-accent-purple/40 text-accent-purple glow-effect' 
                      : 'text-gray-300 hover:glass-light hover:text-white'
                  }`}
                  whileHover={{ x: 5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <item.icon className={`w-5 h-5 ${
                      isCollapsed ? 'mx-auto' : 'mr-3'
                    } ${item.color}`} />
                  </motion.div>
                  
                  {!isCollapsed && (
                    <motion.span 
                      className="font-medium"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                  
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <motion.div 
                      className="absolute left-full ml-2 px-2 py-1 glass-dark text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50"
                      initial={{ opacity: 0, x: -10 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.label}
                    </motion.div>
                  )}
                </motion.a>
              </motion.li>
            )
          })}
        </ul>
      </nav>
      
      {/* Bottom Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-accent-green to-primary-500 rounded-full flex items-center justify-center glass-hover">
              <span className="text-white font-bold text-xs">A</span>
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-medium">Admin User</p>
              <p className="text-gray-400 text-xs">admin@chuvue.com</p>
            </div>
          </div>
        )}
        
        {isCollapsed && (
          <div className="w-8 h-8 bg-gradient-to-br from-accent-green to-primary-500 rounded-full flex items-center justify-center mx-auto glass-hover">
            <span className="text-white font-bold text-xs">A</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
