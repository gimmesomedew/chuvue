'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { SearchForm } from '@/components/search/SearchForm';
import { SearchResults } from '@/components/search/SearchResults';
import { FeaturedServices } from '@/components/services/FeaturedServices';
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
  
  // State for search results
  const [searchResults, setSearchResults] = useState<Service[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const resultsPerPage = 15;
  
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
      <section className="bg-[#f3f9f4] py-16">
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
            setSelectedServiceType={setSelectedServiceType}
            setSelectedState={setSelectedState}
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
      
      {/* Featured Service Providers - Only show if not searched */}
      {!hasSearched && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <FeaturedServices />
          </div>
        </section>
      )}
      
      {/* Footer */}
      <footer className="bg-black text-white py-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center mb-4">
                <img src="/images/DogParkAdventures-Logo.png" alt="Dog Park Adventures Logo" className="h-12 mr-2" />
              </div>
              <p className="text-gray-400 text-sm">Connecting pet owners with trusted local services.</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  <a href="#" className="text-gray-400 hover:text-white">Home</a>
                </motion.li>
                <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  <a href="#" className="text-gray-400 hover:text-white">Register Your Pet</a>
                </motion.li>
                <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  <a href="#" className="text-gray-400 hover:text-white">Add Service</a>
                </motion.li>
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <motion.li 
                  whileHover={{ x: 5 }} 
                  transition={{ duration: 0.2 }}
                  className="flex items-center"
                >
                  <span className="mr-2">✉️</span>
                  <span>play@dogparkadventures.com</span>
                </motion.li>
                <motion.li 
                  whileHover={{ x: 5 }} 
                  transition={{ duration: 0.2 }}
                  className="flex items-center"
                >
                  <span className="mr-2">📞</span>
                  <span>(555) 123-4567</span>
                </motion.li>
                <motion.li 
                  whileHover={{ x: 5 }} 
                  transition={{ duration: 0.2 }}
                  className="flex items-center"
                >
                  <span className="mr-2">📍</span>
                  <span>Indianapolis, IN 46204</span>
                </motion.li>
              </ul>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center"
          >
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} Dog Park Adventures. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <motion.a 
                whileHover={{ scale: 1.05 }} 
                transition={{ duration: 0.2 }}
                href="#" 
                className="text-sm text-gray-500 hover:text-white"
              >
                Privacy Policy
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.05 }} 
                transition={{ duration: 0.2 }}
                href="#" 
                className="text-sm text-gray-500 hover:text-white"
              >
                Terms of Service
              </motion.a>
            </div>
          </motion.div>
        </div>
      </footer>
    </main>
  );
}
