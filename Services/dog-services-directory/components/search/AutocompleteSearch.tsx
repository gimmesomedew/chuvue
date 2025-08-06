'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Service } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AutocompleteSearchProps {
  onSearch: (query: string) => void;
  onClear: () => void;
  isSearching?: boolean;
  placeholder?: string;
  className?: string;
  allSearchResults: Service[];
}

interface Suggestion {
  id: string;
  name: string;
  service_type: string;
  city: string;
  state: string;
}

export function AutocompleteSearch({ 
  onSearch, 
  onClear, 
  isSearching = false,
  placeholder = 'Search by name...',
  className = '',
  allSearchResults
}: AutocompleteSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Generate suggestions based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const generateSuggestions = () => {
      const query = searchQuery.toLowerCase();
      
      const filtered = allSearchResults
        .filter(service => 
          service.name.toLowerCase().includes(query) ||
          service.city?.toLowerCase().includes(query) ||
          service.service_type.toLowerCase().includes(query)
        )
        .slice(0, 8) // Limit to 8 suggestions
        .map(service => ({
          id: service.id,
          name: service.name,
          service_type: service.service_type,
          city: service.city || '',
          state: service.state || ''
        }));

      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      setSelectedIndex(-1);
    };

    // Debounce the search
    const timer = setTimeout(generateSuggestions, 200);
    return () => clearTimeout(timer);
  }, [searchQuery, allSearchResults]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionSelect(suggestions[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setShowSuggestions(false);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    onClear();
  };

  const handleSuggestionSelect = (suggestion: Suggestion) => {
    setSearchQuery(suggestion.name);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    onSearch(suggestion.name);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }, 200);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            className="w-full pr-8"
            disabled={isSearching}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchQuery('')}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
        
        <Button
          onClick={handleSearch}
          disabled={!searchQuery.trim() || isSearching}
          size="sm"
          className="bg-secondary hover:bg-secondary/90 text-white rounded-[40px]"
        >
          <Search className="h-4 w-4" />
        </Button>
        
        {searchQuery && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            disabled={isSearching}
          >
            Clear
          </Button>
        )}
      </div>

      {/* Autocomplete Suggestions */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            ref={suggestionsRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
          >
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={suggestion.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  duration: 0.15, 
                  delay: index * 0.05,
                  ease: "easeOut"
                }}
                onClick={() => handleSuggestionSelect(suggestion)}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors ${
                  index === selectedIndex ? 'bg-gray-100' : ''
                }`}
                whileHover={{ 
                  backgroundColor: "#f9fafb",
                  transition: { duration: 0.1 }
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {suggestion.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {suggestion.service_type} • {suggestion.city}, {suggestion.state}
                    </div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    transition={{ 
                      duration: 0.2, 
                      delay: index * 0.05 + 0.1,
                      ease: "easeOut"
                    }}
                  >
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </motion.div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 