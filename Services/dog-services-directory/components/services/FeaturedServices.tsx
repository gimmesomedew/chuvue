'use client';

import { motion } from 'framer-motion';
import { MapPin, Globe, Heart, ExternalLink, Map, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// Define the interface for featured services
interface FeaturedService {
  id: number;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  imageUrl: string;
  website_url?: string;
  service_url?: string;
  searchPage_url?: string;
  tags: string[];
}

// Sample featured services data
const featuredServices: FeaturedService[] = [
  {
    id: 1,
    name: 'Central Bark Dog Park',
    description: 'A spacious off-leash dog park with separate areas for small and large dogs, agility equipment, and water stations.',
    address: '123 Dogwood Lane',
    city: 'Indianapolis',
    state: 'IN',
    zipCode: '46220',
    imageUrl: '/images/dogs.jpg',
    website_url: 'https://example.com/centralbark',
    service_url: '/services/central-bark',
    searchPage_url: 'https://maps.google.com/?q=Central+Bark+Dog+Park+Indianapolis',
    tags: ['Off-leash', 'Water Stations', 'Agility Course']
  },
  {
    id: 2,
    name: 'Pawfect Grooming',
    description: 'Professional grooming services including baths, haircuts, nail trimming, and special treatments for all dog breeds.',
    address: '456 Furry Street',
    city: 'Carmel',
    state: 'IN',
    zipCode: '46032',
    imageUrl: '/images/groom.jpg',
    website_url: 'https://example.com/pawfect',
    service_url: '/services/pawfect-grooming',
    searchPage_url: 'https://maps.google.com/?q=Pawfect+Grooming+Carmel',
    tags: ['Grooming', 'Nail Trimming', 'Bathing']
  },
  {
    id: 3,
    name: 'Healing Hands Veterinary',
    description: 'Full-service veterinary hospital providing comprehensive medical care, surgery, and preventative services.',
    address: '789 Vet Way',
    city: 'Indianapolis',
    state: 'IN',
    zipCode: '46208',
    imageUrl: '/images/holistic-vets.png',
    website_url: 'https://example.com/healinghands',
    service_url: '/services/healing-hands',
    searchPage_url: 'https://maps.google.com/?q=Healing+Hands+Veterinary+Indianapolis',
    tags: ['Veterinary', 'Surgery', 'Preventative Care']
  }
];

export function FeaturedServices() {
  return (
    <>
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
        {featuredServices.map((service, index) => (
          <AnimatedCard 
            key={service.id} 
            delay={0.1 * (index + 1)} 
            className="overflow-hidden border border-gray-200"
          >
            <div className="relative h-56 w-full">
              <img 
                src={service.imageUrl} 
                alt={service.name}
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
              <CardTitle className="text-xl">{service.name}</CardTitle>
              <div className="flex items-center text-gray-500 text-sm mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{service.address}</span>
              </div>
              <div className="text-gray-500 text-sm ml-5">{service.city}, {service.state} {service.zipCode}</div>
            </CardHeader>
            
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                {service.description}
              </p>
              
              {service.tags && service.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {service.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              
              <div className="flex justify-center border-t pt-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="outline" className="flex items-center text-gray-700 bg-white hover:bg-gray-100">
                        <Globe className="h-4 w-4 mr-2" />
                        View Options
                      </Button>
                    </motion.div>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-2">
                    <div className="flex flex-col gap-2">
                      {/* Only show the View Website button if there's a website URL */}
                      <Button 
                        variant="ghost" 
                        className="justify-start text-gray-700 hover:bg-emerald-50"
                        onClick={() => window.open(service.website_url || '#', '_blank')}
                        disabled={!service.website_url}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Website
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="justify-start text-gray-700 hover:bg-emerald-50"
                        onClick={() => window.open(`https://maps.google.com/?q=${service.address},${service.city},${service.state}`, '_blank')}
                      >
                        <Map className="h-4 w-4 mr-2" />
                        View Map
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="justify-start text-gray-700 hover:bg-emerald-50"
                        onClick={() => window.open(`/services/${service.id}`, '_self')}
                      >
                        <User className="h-4 w-4 mr-2" />
                        View Profile
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </AnimatedCard>
        ))}
      </motion.div>
    </>
  );
}
