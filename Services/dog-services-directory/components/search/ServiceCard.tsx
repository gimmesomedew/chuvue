'use client';

import { motion } from 'framer-motion';
import { MapPin, Globe, Heart, ExternalLink, Map, User, PawPrint, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Service } from '@/lib/types';
import { formatDistance } from '@/lib/location';

interface ServiceCardProps {
  service: Service & { distance?: number };
  sortByDistance: boolean;
  userLocation: GeolocationCoordinates | null;
  delay?: number;
}

export function ServiceCard({ 
  service, 
  sortByDistance, 
  userLocation,
  delay = 0.1 
}: ServiceCardProps) {
  return (
    <AnimatedCard key={service.id} delay={delay} className="overflow-hidden border border-gray-200">
      <div className="relative h-48 w-full">
        {service.image_url ? (
          <img 
            src={service.image_url}
            alt={service.name}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="bg-[#D28000] w-full h-full flex flex-col items-center justify-center">
            <PawPrint className="h-24 w-24 text-white" />
            <p className="text-white text-sm mt-2">No Image Available</p>
          </div>
        )}
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
        
        {/* Display distance when sorting by distance is enabled */}
        {sortByDistance && userLocation && 'distance' in service && (
          <div className="flex items-center text-emerald-600 text-sm mt-1 font-medium">
            <Navigation className="h-4 w-4 mr-1" />
            <span>{formatDistance(service.distance || 0)}</span>
          </div>
        )}
        
        <div className="text-gray-500 text-sm">
          {service.city}, {service.state} {service.zip_code}
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">
          {service.description.length > 120 
            ? `${service.description.substring(0, 120)}...` 
            : service.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
            {service.service_type}
          </Badge>
          {service.is_verified && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Verified
            </Badge>
          )}
        </div>
        
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
                {service.website_url && (
                  <Button 
                    variant="ghost" 
                    className="justify-start text-gray-700 hover:bg-emerald-50"
                    onClick={() => window.open(service.website_url, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Website
                  </Button>
                )}
                {service.searchPage_url && (
                  <Button 
                    variant="ghost" 
                    className="justify-start text-gray-700 hover:bg-emerald-50"
                    onClick={() => window.open(service.searchPage_url, '_blank')}
                  >
                    <Map className="h-4 w-4 mr-2" />
                    View Map
                  </Button>
                )}
                {service.service_url && (
                  <Button 
                    variant="ghost" 
                    className="justify-start text-gray-700 hover:bg-emerald-50"
                    onClick={() => window.open(service.service_url, '_blank')}
                  >
                    <User className="h-4 w-4 mr-2" />
                    View Profile
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </AnimatedCard>
  );
}
