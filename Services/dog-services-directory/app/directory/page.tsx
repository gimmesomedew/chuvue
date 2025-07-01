'use client';

import { useState } from 'react';
import { QueryErrorBoundary } from '@/components/ErrorBoundary';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { DirectoryFilters } from '@/components/directory/DirectoryFilters';
import { ProfileCard } from '@/components/directory/ProfileCard';
import { ProfileCardSkeleton } from '@/components/directory/ProfileCardSkeleton';
import { useProfiles } from '@/hooks/useProfiles';
import { Pagination } from '@/components/directory/Pagination';
import { motion } from 'framer-motion';

export default function DirectoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFilter, setCurrentFilter] = useState('all');
  const [currentSort, setCurrentSort] = useState('created_at');
  const [currentPage, setCurrentPage] = useState(1);

  const {
    profiles,
    loading,
    error,
    totalCount,
    hasMore
  } = useProfiles({
    pageSize: 12,
    initialPage: currentPage,
    filter: currentFilter,
    sortBy: currentSort,
    searchQuery
  });

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFilterChange = (filter: string) => {
    setCurrentFilter(filter);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: string) => {
    setCurrentSort(sort);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
        <QueryErrorBoundary>
          <div className="container mx-auto px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Member Directory</h1>
              <p className="text-gray-600 mb-8">Connect with other pet owners and service providers in your area</p>

              <DirectoryFilters
                onSearchChange={handleSearchChange}
                onFilterChange={handleFilterChange}
                onSortChange={handleSortChange}
                searchQuery={searchQuery}
                currentFilter={currentFilter}
                currentSort={currentSort}
              />

              {error && (
                <div className="text-center py-8">
                  <p className="text-red-500">Error loading profiles. Please try again later.</p>
                </div>
              )}

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {Array.from({ length: 12 }).map((_, index) => (
                    <ProfileCardSkeleton key={index} />
                  ))}
                </div>
              ) : profiles.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {profiles.map((profile, index) => (
                      <ProfileCard
                        key={profile.id}
                        profile={profile}
                        index={index}
                      />
                    ))}
                  </div>

                  {totalCount > 12 && (
                    <div className="mt-8">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(totalCount / 12)}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No profiles found matching your criteria.</p>
                </div>
              )}
            </motion.div>
          </div>
        </QueryErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}
