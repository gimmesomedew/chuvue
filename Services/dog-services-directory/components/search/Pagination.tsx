'use client';

import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  isSearching: boolean;
  handlePageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  isSearching,
  handlePageChange
}: PaginationProps) {
  if (totalPages <= 1) return null;
  
  return (
    <div className="flex justify-center mt-10">
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || isSearching}
        >
          Previous
        </Button>
        
        <div className="flex items-center px-4">
          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
        </div>
        
        <Button 
          variant="outline" 
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isSearching}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
