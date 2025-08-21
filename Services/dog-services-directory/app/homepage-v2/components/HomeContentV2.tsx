'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SearchFormV2 } from './SearchFormV2';

export function HomeContentV2() {
  const router = useRouter();
  const [isSearching, setIsSearching] = useState(false);
  
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
      {/* Hero Section with Simplified Search */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ color: '#047FA3' }}>
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
              {[
                'Dog Parks close to me',
                'Dog Parks in Indiana',
                'Groomers in Indianapolis',
                'Veterinarians in Indiana',
                'Dog Trainers near me',
                'Boarding & Daycare'
              ].map((search, index) => (
                <button
                  key={index}
                  onClick={(e) => handleTagClick(search, e)}
                  className="px-4 py-2 bg-white text-gray-700 rounded-full border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 text-sm"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-pink-500 mb-2">5K+</div>
              <div className="text-gray-600">Services Listed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-pink-500 mb-2">2K+</div>
              <div className="text-gray-600">Products Listed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-pink-500 mb-2">50</div>
              <div className="text-gray-600">States Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Business CTA Section */}
      <section className="py-16 bg-pink-500">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Own a Dog Business?</h2>
            <p className="text-white text-lg mb-8">
              Join our platform and connect with dog owners in your area
            </p>
            <button className="bg-white text-pink-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200">
              Sign Up Your Business
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: "Search Your Area",
                description: "Enter your ZIP code or city to find services nearby"
              },
              {
                step: 2,
                title: "Browse & Compare",
                description: "View ratings, photos, and details for each service"
              },
              {
                step: 3,
                title: "Connect & Book",
                description: "Contact providers directly or book appointments online"
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
    </>
  );
}
