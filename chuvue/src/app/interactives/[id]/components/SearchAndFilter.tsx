'use client'

import { Search } from 'lucide-react'

interface SearchAndFilterProps {
  onSearchChange?: (value: string) => void
  onStatusFilterChange?: (status: string) => void
}

export default function SearchAndFilter({ 
  onSearchChange, 
  onStatusFilterChange 
}: SearchAndFilterProps) {
  return (
    <div className="flex items-center space-x-4">
      <div className="relative">
        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search chapters..."
          className="glass-input pl-10 pr-4 py-2 w-64"
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>
      <select 
        className="glass-input px-4 py-2"
        onChange={(e) => onStatusFilterChange?.(e.target.value)}
      >
        <option value="">All Status</option>
        <option value="published">Published</option>
        <option value="draft">Draft</option>
        <option value="archived">Archived</option>
      </select>
    </div>
  )
}

