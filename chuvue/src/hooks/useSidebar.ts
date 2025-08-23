import { useState } from 'react'

export function useSidebar() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  const collapseSidebar = () => {
    setIsSidebarCollapsed(true)
  }

  const expandSidebar = () => {
    setIsSidebarCollapsed(false)
  }

  return {
    isSidebarCollapsed,
    toggleSidebar,
    collapseSidebar,
    expandSidebar
  }
}

