'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Service } from '@/lib/types';
import { getFeaturedServices } from '@/lib/services';
import Link from 'next/link';

// Dummy data for testing
const dummyServices: Service[] = [
  {
    id: '1',
    name: 'Central Bark Dog Park',
    description: 'A beautiful dog park with plenty of space for your furry friend to run and play.',
    address: '123 Dogwood Lane',
    city: 'Pawsville',
    state: 'CA',
    zip_code: '90210',
    service_type: 'dog_park',
    latitude: 34.0522,
    longitude: -118.2437,
    email: 'info@centralbark.com',
    website_url: 'https://www.centralbark.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    featured: 'Y',
    image_url: '/images/dogs.jpg'
  },
  {
    id: '2',
    name: 'Pawsome Grooming',
    description: 'Professional dog grooming services to keep your pet looking their best.',
    address: '456 Bark Avenue',
    city: 'Dogtown',
    state: 'NY',
    zip_code: '10001',
    service_type: 'groomer',
    latitude: 40.7128,
    longitude: -74.0060,
    email: 'appointments@pawsomegrooming.com',
    website_url: 'https://www.pawsomegrooming.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    featured: 'Y',
    image_url: '/images/groom.jpg'
  },
  {
    id: '3',
    name: 'Canine Academy',
    description: 'Expert dog training for all breeds and ages. We specialize in obedience and agility training.',
    address: '789 Fetch Street',
    city: 'Barkley',
    state: 'TX',
    zip_code: '75001',
    service_type: 'trainer',
    latitude: 32.7767,
    longitude: -96.7970,
    email: 'train@canineacademy.com',
    website_url: 'https://www.canineacademy.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    featured: 'Y',
    image_url: '/images/placeholder.svg'
  }
];

export function FeaturedCarousel() {
  const [featuredServices, setFeaturedServices] = useState<Service[]>(dummyServices);
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Fetch featured services on component mount
  useEffect(() => {
    async function loadFeaturedServices() {
      try {
        const services = await getFeaturedServices(20);
        if (services && services.length > 0) {
          setFeaturedServices(services);
        }
      } catch (err) {
        console.error('Error loading featured services:', err);
        // Keep using dummy data on error
      }
    }

    loadFeaturedServices();
  }, []);

  // Auto-scroll the carousel every 5 seconds
  useEffect(() => {
    if (featuredServices.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === featuredServices.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredServices.length]);

  // Scroll to the current index when it changes
  useEffect(() => {
    if (carouselRef.current && featuredServices.length > 0) {
      const scrollAmount = currentIndex * (carouselRef.current.scrollWidth / featuredServices.length);
      carouselRef.current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  }, [currentIndex, featuredServices.length]);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? featuredServices.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === featuredServices.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (isLoading) {
    return (
      <div className="w-full py-8">
        <div className="animate-pulse flex flex-col">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
          <div className="flex space-x-4 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-none w-full md:w-1/2 lg:w-1/3 px-4">
                <div className="bg-gray-200 h-56 rounded-lg mb-3"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-8">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold text-center mb-3"
      >
        Featured Service Providers
      </motion.h2>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-gray-600 text-center mb-6"
      >
        Discover top-rated dog services in your area
      </motion.p>

      <div className="relative">
        {/* Previous button */}
        <button 
          onClick={handlePrevious}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
          aria-label="Previous service"
        >
          <ChevronLeft className="h-6 w-6 text-gray-700" />
        </button>

        {/* Carousel container */}
        <div 
          ref={carouselRef}
          className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-6 pb-4 px-10 -mx-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {featuredServices.map((service, index) => (
            <div 
              key={service.id}
              className="flex-none w-full md:w-1/2 lg:w-1/3 px-4 snap-center"
            >
              <Link href={service.service_url || `/services/${service.id}`} target="_blank" rel="noopener noreferrer">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 h-full cursor-pointer hover:shadow-lg transition-shadow"
                >
                <div className="relative h-56 w-full">
                  {service.image_url ? (
                    <img 
                      src={service.image_url} 
                      alt={service.name} 
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        // Set default image on error
                        (e.target as HTMLImageElement).src = '/images/paw-placeholder.png';
                        (e.target as HTMLImageElement).classList.add('image-placeholder');
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-orange-100">
                      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
                        <path d="M22 8.35a10 10 0 0 0-20 0c0 .61.39 1.15 1 1.3 1.31.33 2.67.53 4.04.54.79.01 1.58-.07 2.37-.23l.32-.08a1 1 0 0 1 .82.2 1 1 0 0 1 .38.74v.16a2 2 0 0 0 2 2h.01a2 2 0 0 0 2-2v-.09a2.94 2.94 0 0 1 .6-1.8 2.99 2.99 0 0 1 2.4-.9c1.76.19 3.25.94 4.06 2.05a1 1 0 0 0 1.4.17.98.98 0 0 0 .17-1.4c-1.15-1.57-3.1-2.58-5.32-2.81a4.99 4.99 0 0 0-4.12 1.53 4.9 4.9 0 0 0-1.19 2.06v.09a5 5 0 0 1-5 5h-.01a5 5 0 0 1-5-5v-.08a2.98 2.98 0 0 0-2.45-2.94 2.99 2.99 0 0 0-3.55 2.92 14.09 14.09 0 0 0 28.18 0z"/>
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-2 left-2 bg-[#E91A7E] text-white text-xs font-bold px-2 py-1 rounded-md flex items-center">
                    <Star className="h-3 w-3 mr-1 fill-white" />
                    Featured
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{service.name}</h3>
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>{service.city}, {service.state}</span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">{service.description}</p>
                </div>
                </motion.div>
              </Link>
            </div>
          ))}
        </div>

        {/* Next button */}
        <button 
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
          aria-label="Next service"
        >
          <ChevronRight className="h-6 w-6 text-gray-700" />
        </button>
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center mt-4 space-x-2">
        {featuredServices.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all ${index === currentIndex ? 'w-6 bg-emerald-500' : 'w-2 bg-gray-300'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}  
      </div>
    </div>
  );
}
