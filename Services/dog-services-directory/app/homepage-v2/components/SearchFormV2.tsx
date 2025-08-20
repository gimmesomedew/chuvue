'use client';

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

interface SearchFormV2Props {
  onSearch: (query: string) => void;
  initialValue?: string;
  isLoading?: boolean;
  resetKey?: number; // Add this to force reset when needed
  isPostSearch?: boolean; // New prop to indicate if this is after a search
}

export function SearchFormV2({ onSearch, initialValue = '', isLoading = false, resetKey, isPostSearch = false }: SearchFormV2Props) {
  const [searchQuery, setSearchQuery] = useState(initialValue || '');
  const [isVisible, setIsVisible] = useState(false);

  // Fade in effect when component mounts or initialValue changes
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Update searchQuery when initialValue changes
  useEffect(() => {
    if (initialValue) {
      setSearchQuery(initialValue);
    }
  }, [initialValue]);

  // Reset search query when resetKey changes
  useEffect(() => {
    if (resetKey !== undefined) {
      setSearchQuery('');
    }
  }, [resetKey]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div className={`max-w-4xl mx-auto transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <form onSubmit={handleSubmit} className="flex gap-4">
        {/* Main Search Input */}
        <div className="relative flex-1">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isPostSearch ? "Search again..." : "Search products, services, dog parks... or anything"}
            className="w-full pl-12 pr-4 py-4 text-lg border-0 rounded-xl shadow-lg focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all duration-200"
          />
        </div>
        
        {/* Search Button */}
        <button
          type="submit"
          disabled={!searchQuery.trim() || isLoading}
          className={`font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap ${
            isPostSearch 
              ? 'py-4 px-4 h-16 w-16' // Compact square button for post-search
              : 'py-4 px-8 text-lg' // Full button for initial search
          } ${
            searchQuery.trim() && !isLoading
              ? 'bg-secondary hover:bg-pink-600 text-white'
              : 'bg-gray-400 text-gray-200 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <Search className="w-5 h-5" />
          )}
          {!isPostSearch && (isLoading ? 'Searching...' : 'Search Everything')}
        </button>
      </form>
    </div>
  );
}
