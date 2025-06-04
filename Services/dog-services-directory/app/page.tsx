'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { SearchForm } from '@/components/search/SearchForm';
import { SearchResults } from '@/components/search/SearchResults';
import { FeaturedCarousel } from '@/components/services/FeaturedCarousel';
import { Footer } from '@/components/Footer';
import { getServiceDefinitions, searchServices } from '@/lib/services';
import { ServiceDefinition, Service } from '@/lib/types';
import { getSortedStates } from '@/lib/states';

export default function Home() {
  // State for service definitions
  const [serviceDefinitions, setServiceDefinitions] = useState<ServiceDefinition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for location selection
  const [states, setStates] = useState(getSortedStates());
  
  // State for search form
  const [selectedState, setSelectedState] = useState('');
  const [selectedServiceType, setSelectedServiceType] = useState('');
  const [zipCode, setZipCode] = useState('');
  
  // State for search results
  const [searchResults, setSearchResults] = useState<Service[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const resultsPerPage = 30;
  
  // Load service definitions on component mount
  useEffect(() => {
    async function loadServiceDefinitions() {
      setIsLoading(true);
      try {
        const definitions = await getServiceDefinitions();
        setServiceDefinitions(definitions);
      } catch (error) {
        console.error('Error loading service definitions:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadServiceDefinitions();
  }, []);
  
  // Handle search form submission
  const handleSearch = async () => {
    setIsSearching(true);
    setHasSearched(true);
    setCurrentPage(1); // Reset to first page on new search
    
    try {
      const results = await searchServices(
        selectedServiceType,
        selectedState,
        zipCode,
        1,
        resultsPerPage
      );
      
      setSearchResults(results.services);
      setTotalPages(results.totalPages);
      setTotalResults(results.total);
    } catch (error) {
      console.error('Error searching services:', error);
    } finally {
      setIsSearching(false);
    }
  };
  
  // Handle pagination
  const handlePageChange = async (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
    
    setIsSearching(true);
    setCurrentPage(newPage);
    
    try {
      const results = await searchServices(
        selectedServiceType,
        selectedState,
        zipCode,
        newPage,
        resultsPerPage
      );
      
      setSearchResults(results.services);
    } catch (error) {
      console.error('Error fetching page:', error);
    } finally {
      setIsSearching(false);
    }
  };
  
  // Reset search form and results
  const resetSearch = () => {
    setSelectedServiceType('');
    setSelectedState('');
    setZipCode('');
    setSearchResults([]);
    setHasSearched(false);
    setCurrentPage(1);
    setTotalPages(0);
    setTotalResults(0);
  };

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      
      {/* Search Section */}
      <section className="bg-gradient-to-b from-[#f3f9f4]/40 to-white  py-16">
        <div className="container mx-auto px-4">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-center mb-3"
          >
            Explore All Available Dog Services
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-600 text-center mb-10"
          >
            Find the perfect services for your furry friend across various locations and categories
          </motion.p>
          
          {/* Search Form Component */}
          <SearchForm 
            serviceDefinitions={serviceDefinitions}
            states={states}
            isLoading={isLoading}
            isSearching={isSearching}
            selectedServiceType={selectedServiceType}
            selectedState={selectedState}
            zipCode={zipCode}
            setSelectedServiceType={setSelectedServiceType}
            setSelectedState={setSelectedState}
            setZipCode={setZipCode}
            handleSearch={handleSearch}
            resetSearch={resetSearch}
            hasSearched={hasSearched}
          />
        </div>
      </section>
      
      {/* Search Results Section */}
      {hasSearched && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <SearchResults 
              searchResults={searchResults}
              isSearching={isSearching}
              totalResults={totalResults}
              currentPage={currentPage}
              totalPages={totalPages}
              selectedServiceType={selectedServiceType}
              selectedState={selectedState}
              serviceDefinitions={serviceDefinitions}
              states={states}
              handlePageChange={handlePageChange}
              resetSearch={resetSearch}
            />
          </div>
        </section>
      )}
      
      {/* Featured Service Providers Carousel - Only show if not searched */}
      {!hasSearched && (
        <section className="py-16">
          <div className="container mx-auto px-4" data-component-name="Home">
            <FeaturedCarousel />
          </div>
        </section>
      )}
      
      <Footer />
    </main>
  );
}
