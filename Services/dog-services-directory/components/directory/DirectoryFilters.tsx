'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, SortAsc } from 'lucide-react';

type DirectoryFiltersProps = {
  onSearchChange: (query: string) => void;
  onFilterChange: (filter: string) => void;
  onSortChange: (sort: string) => void;
  searchQuery: string;
  currentFilter: string;
  currentSort: string;
};

export function DirectoryFilters({
  onSearchChange,
  onFilterChange,
  onSortChange,
  searchQuery,
  currentFilter,
  currentSort
}: DirectoryFiltersProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery);
  
  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearch);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange]);
  
  return (
    <div className="mb-6 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Search profiles..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D28000]"
          aria-label="Search profiles"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      </div>
      
      <div className="flex space-x-4">
        <div className="relative">
          <select
            value={currentFilter}
            onChange={(e) => onFilterChange(e.target.value)}
            className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D28000]"
            aria-label="Filter profiles"
          >
            <option value="all">All Profiles</option>
            <option value="pet_owner">Pet Owners</option>
            <option value="service_provider">Service Providers</option>
          </select>
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        
        <div className="relative">
          <select
            value={currentSort}
            onChange={(e) => onSortChange(e.target.value)}
            className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D28000]"
            aria-label="Sort profiles"
          >
            <option value="created_at">Newest First</option>
            <option value="name">Name</option>
            <option value="location">Location</option>
          </select>
          <SortAsc className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
