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
      {/* Hero Section with Search */}
      <section className="bg-white py-16 md:py-24">
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
                // Loading skeleton for tags - use deterministic widths to avoid hydration mismatch
                Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 bg-gray-200 rounded-full animate-pulse"
                    style={{ width: `${120 + (index * 15)}px` }}
                  />
                ))
              ) : (
                tags.map((tag, index) => (
                  <button
                    key={index}
                    onClick={(e) => handleTagClick(tag, e)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 text-sm"
                  >
                    {tag}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-4xl font-bold text-secondary mb-2">5K+</div>
              <div className="text-gray-600">Services Listed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary mb-2">2K+</div>
              <div className="text-gray-600">Products Listed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary mb-2">50</div>
              <div className="text-gray-600">States Covered</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Search Your Area</h3>
              <p className="text-gray-600">Enter your ZIP code or city to find services nearby</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Browse & Compare</h3>
              <p className="text-gray-600">View ratings, photos, and details for each service</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Connect & Book</h3>
              <p className="text-gray-600">Contact providers directly or book appointments online</p>
            </div>
          </div>
        </div>
      </section>

      {/* Business CTA Section */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-6">Own a Dog Business?</h2>
            <p className="text-xl text-white/90 mb-8">
              Join our platform and connect with dog owners in your area. Grow your business with our comprehensive listing platform.
            </p>
            <a
              href="/add-listing"
              className="inline-block bg-white text-secondary px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              Sign Up Your Business
            </a>
          </div>
        </div>
      </section>
    </>
  );
} 