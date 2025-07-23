'use client';

import { MapPin, Search, Globe, Heart } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { motion } from 'framer-motion';
import { MotionWrapper } from '@/components/ui/MotionWrapper';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { StaggeredList } from '@/components/ui/StaggeredList';

export default function Home() {
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
            className="text-3xl md:text-4xl font-bold text-center mb-3" style={{ color: '#7CAADC' }}
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
          
          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="md:col-span-5"
              >
                <div className="flex items-center mb-2">
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, delay: 0.5 }}
                  >
                    <Search className="h-5 w-5 text-emerald-500 mr-2" />
                  </motion.div>
                  <span className="font-medium">What services?</span>
                </div>
                <div className="relative">
                  <motion.select 
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className="w-full p-3 border rounded-md appearance-none bg-gray-50 text-gray-700 pr-10"
                  >
                    <option>All Categories</option>
                    <option>Dog Parks</option>
                    <option>Veterinarians</option>
                    <option>Groomers</option>
                    <option>Daycare</option>
                  </motion.select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="md:col-span-5"
              >
                <div className="flex items-center mb-2">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, delay: 0.6 }}
                  >
                    <MapPin className="h-5 w-5 text-emerald-500 mr-2" />
                  </motion.div>
                  <span className="font-medium">What Location?</span>
                </div>
                <div className="relative">
                  <motion.select 
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className="w-full p-3 border rounded-md appearance-none bg-gray-50 text-gray-700 pr-10"
                  >
                    <option>Select location</option>
                    <option>Indianapolis, IN</option>
                    <option>Carmel, IN</option>
                    <option>Fishers, IN</option>
                    <option>Noblesville, IN</option>
                  </motion.select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="md:col-span-2 flex items-end"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full"
                >
                  <Button className="w-full bg-emerald-500 hover:bg-emerald-600 h-12">
                    <Search className="h-5 w-5 mr-2" />
                    Search
                  </Button>
                </motion.div>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mt-4"
            >
              <motion.button 
                whileHover={{ scale: 1.05 }}
                className="text-emerald-500 text-sm hover:underline"
              >
                Reset Search
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Featured Service Providers */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
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
            className="text-gray-600 text-center mb-10"
          >
            Discover top-rated dog services in your area
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {/* Service Provider 1 */}
            <AnimatedCard delay={0.1} className="overflow-hidden border border-gray-200">
              <div className="relative h-56 w-full">
                <img 
                  src="/images/dog-park.svg" 
                  alt="Central Bark Dog Park"
                  className="object-cover w-full h-full"
                />
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                >
                  <Heart className="h-5 w-5 text-gray-500" />
                </motion.button>
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Central Bark Dog Park</CardTitle>
                <div className="flex items-center text-gray-500 text-sm mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>123 Dogwood Lane</span>
                </div>
                <div className="text-gray-500 text-sm ml-5">Indianapolis, IN 46220</div>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  A spacious off-leash dog park with separate areas for small and large dogs, agility equipment, and water stations.
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    Off-leash
                  </Badge>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    Water Stations
                  </Badge>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    Agility Course
                  </Badge>
                </div>
                
                <div className="flex justify-center border-t pt-3">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" className="flex items-center text-gray-700">
                      <Globe className="h-4 w-4 mr-2" />
                      Website
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </AnimatedCard>
            
            {/* Service Provider 2 */}
            <AnimatedCard delay={0.2} className="overflow-hidden border border-gray-200">
              <div className="relative h-56 w-full">
                <img 
                  src="/images/groomer.svg" 
                  alt="Pawfect Grooming"
                  className="object-cover w-full h-full"
                />
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                >
                  <Heart className="h-5 w-5 text-gray-500" />
                </motion.button>
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Pawfect Grooming</CardTitle>
                <div className="flex items-center text-gray-500 text-sm mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>456 Furry Street</span>
                </div>
                <div className="text-gray-500 text-sm ml-5">Carmel, IN 46032</div>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Professional grooming services including baths, haircuts, nail trimming, and special treatments for all dog breeds.
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    Grooming
                  </Badge>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    Nail Trimming
                  </Badge>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    Bathing
                  </Badge>
                </div>
                
                <div className="flex justify-center border-t pt-3">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" className="flex items-center text-gray-700">
                      <Globe className="h-4 w-4 mr-2" />
                      Website
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </AnimatedCard>
            
            {/* Service Provider 3 */}
            <AnimatedCard delay={0.3} className="overflow-hidden border border-gray-200">
              <div className="relative h-56 w-full">
                <img 
                  src="/images/vet.svg" 
                  alt="Healing Hands Veterinary"
                  className="object-cover w-full h-full"
                />
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                >
                  <Heart className="h-5 w-5 text-gray-500" />
                </motion.button>
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Healing Hands Veterinary</CardTitle>
                <div className="flex items-center text-gray-500 text-sm mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>789 Vet Way</span>
                </div>
                <div className="text-gray-500 text-sm ml-5">Indianapolis, IN 46208</div>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Full-service veterinary hospital providing comprehensive medical care, surgery, and preventative services.
                </p>
                
                <div className="flex justify-center border-t pt-3">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" className="flex items-center text-gray-700">
                      <Globe className="h-4 w-4 mr-2" />
                      Website
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </AnimatedCard>
          </motion.div>
        </div>
      </section>
      
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
