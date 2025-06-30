'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { showToast } from '@/lib/toast';
import { MotionWrapper } from '@/components/ui/MotionWrapper';
import { PageTransition } from '@/components/ui/PageTransition';
import Link from 'next/link';

// Import custom hooks and components
import { useProfiles } from '@/hooks/useProfiles';
import { ProfileCard } from '@/components/directory/ProfileCard';
import { ProfileCardSkeleton } from '@/components/directory/ProfileCardSkeleton';
import { Pagination } from '@/components/directory/Pagination';
import { DirectoryFilters } from '@/components/directory/DirectoryFilters';

export default function DirectoryPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  // State for filters and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Use our custom hook to fetch and manage profiles
  const { 
    profiles, 
    loading, 
    error, 
    totalCount, 
    pageSize,
    fetchProfiles
  } = useProfiles({
    pageSize: 12,
    initialPage: currentPage,
    filter,
    sortBy,
    searchQuery
  });
  
  // Handle auth redirect
  if (!authLoading && !user) {
    router.push('/auth/login?redirect=/directory');
    showToast.error('You need to be logged in to view the directory');
    return null;
  }
  
  // Fetch profiles when component mounts
  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  // Calculate total pages for pagination
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Loading state with skeleton UI
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <MotionWrapper
          variant="fadeIn"
          className="container mx-auto px-4 py-8"
        >
          <div className="flex items-center mb-6">
            <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm">
              Home
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-700 text-sm">Directory</span>
          </div>
          
          <h1 className="text-3xl font-bold mb-6">Member Directory</h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array(8).fill(0).map((_, i) => (
              <ProfileCardSkeleton key={i} />
            ))}
          </div>
        </MotionWrapper>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Directory</h2>
            <p className="text-gray-600 mb-6">{error.message || 'There was a problem loading the directory. Please try again.'}</p>
            <Button 
              onClick={() => fetchProfiles()}
              className="bg-[#D28000] hover:bg-[#b06c00] text-white"
            >
              Try Again
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <PageTransition>
        <main className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center mb-6">
            <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm">
              Home
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-700 text-sm">Directory</span>
          </div>
          
          {/* Page Title */}
          <h1 
            id="directory-title" 
            className="text-3xl font-bold mb-6"
          >
            Member Directory
          </h1>
          
          {/* Search and Filters */}
          <DirectoryFilters
            onSearchChange={setSearchQuery}
            onFilterChange={setFilter}
            onSortChange={setSortBy}
            searchQuery={searchQuery}
            currentFilter={filter}
            currentSort={sortBy}
          />
          
          {/* Results count */}
          <div className="mb-4 text-gray-600">
            Showing {profiles.length} of {totalCount} profiles
          </div>
          
          {/* Profile Grid */}
          {profiles.length > 0 ? (
            <div 
              role="list" 
              aria-labelledby="directory-title"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {profiles.map((profile, index) => (
                <div role="listitem" key={profile.id}>
                  <ProfileCard profile={profile} index={index} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600 mb-4">No profiles match your search criteria.</p>
              <Button 
                onClick={() => {
                  setSearchQuery('');
                  setFilter('all');
                  setSortBy('created_at');
                }}
                variant="outline"
                className="border-[#D28000] text-[#D28000] hover:bg-[#D28000] hover:text-white"
              >
                Clear Filters
              </Button>
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </main>
      </PageTransition>
    </div>
  );
}
