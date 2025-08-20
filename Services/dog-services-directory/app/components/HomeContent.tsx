'use client';

import { useState } from 'react';
import { SearchFormV2 } from '@/app/homepage-v2/components/SearchFormV2';
import { useRouter } from 'next/navigation';
import { usePopularSearchTags } from '@/hooks/usePopularSearchTags';

export function HomeContent() {
  const router = useRouter();
  const [isSearching, setIsSearching] = useState(false);
  const { tags, loading: tagsLoading } = usePopularSearchTags();

  const handleSearchSubmit = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    try {
      // Redirect to search results page with the query
      router.push(`/search-results?q=${encodeURIComponent(searchQuery)}`);
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleTagClick = (tagText: string, event: React.MouseEvent<HTMLButtonElement>) => {
    // Redirect directly to search results page with the tag text
    router.push(`/search-results?q=${encodeURIComponent(tagText)}`);
  };

  return (
    <>
      {/* Hero Section with New Dynamic Search */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Find Everything Your Dog Needs
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Discover dog parks, groomers, products, services & more anywhere
          </p>
          
          <SearchFormV2
            onSearch={handleSearchSubmit}
            isLoading={isSearching}
          />
          
          {/* Popular Searches */}
          <div className="mt-12">
            <p className="text-gray-600 mb-4 font-bold">Popular Searches:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {tagsLoading ? (
                // Loading skeleton for tags
                Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 bg-gray-200 rounded-full animate-pulse"
                    style={{ width: `${Math.random() * 100 + 120}px` }}
                  />
                ))
              ) : (
                tags.map((tag, index) => (
                  <button
                    key={index}
                    onClick={(e) => handleTagClick(tag, e)}
                    className="px-4 py-2 bg-white text-gray-700 rounded-full border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 text-sm"
                  >
                    {tag}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Business CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Are You a Dog Service Provider?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our directory and connect with pet owners in your area. It's free to list your services!
          </p>
          <a
            href="/add-listing"
            className="inline-block bg-secondary text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-pink-600 transition-colors duration-200"
          >
            Add Your Service
          </a>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Search</h3>
              <p className="text-gray-600">Find dog services, parks, and products in your area</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Discover</h3>
              <p className="text-gray-600">Browse detailed information and reviews</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect</h3>
              <p className="text-gray-600">Contact service providers directly</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
} 