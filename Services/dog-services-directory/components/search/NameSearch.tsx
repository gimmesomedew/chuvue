'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';

interface NameSearchProps {
  onSearch: (query: string) => void;
  onClear: () => void;
  isSearching?: boolean;
}

export function NameSearch({ onSearch, onClear, isSearching = false }: NameSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    onClear();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-64 pr-8"
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
  );
} 