'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Globe, Heart, ExternalLink, Map, User, PawPrint, Navigation, Star, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Service } from '@/lib/types';
import { formatDistance } from '@/lib/location';
import { useAuth } from '@/contexts/AuthContext';
import { toggleServiceFeatured, deleteService, toggleFavorite, isServiceFavorited } from '@/lib/services';
import { showToast } from '@/lib/toast';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

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
  const { userRole, user } = useAuth();
  const [featured, setFeatured] = useState(service.featured === 'Y');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const isAdminOrReviewer = userRole === 'admin' || userRole === 'reviewer';
  
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (user) {
        const favorited = await isServiceFavorited(user.id, service.id);
        setIsFavorited(favorited);
      }
    };
    checkFavoriteStatus();
  }, [user, service.id]);
  
  const handleDeleteService = async () => {
    try {
      setIsDeleting(true);
      const success = await deleteService(service.id);
      
      if (success) {
        setIsDeleted(true);
        showToast.success(`${service.name} has been deleted successfully`);
      } else {
        showToast.error('Failed to delete service. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      showToast.error('An error occurred while deleting the service');
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleToggleFeatured = async () => {
    try {
      const updatedService = await toggleServiceFeatured(service.id);
      if (updatedService) {
        setFeatured(updatedService.featured === 'Y');
        const message = `${service.name} has been ${updatedService.featured === 'Y' ? 'featured' : 'unfeatured'}`;
        showToast.success(message);
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
      showToast.error('Failed to update featured status. Please try again.');
    }
  };

  const handleFavoriteClick = async () => {
    if (!user) {
      showToast.error('Please sign in to favorite services');
      return;
    }

    try {
      const newFavoriteStatus = await toggleFavorite(user.id, service.id);
      setIsFavorited(newFavoriteStatus);
      
      if (newFavoriteStatus) {
        setShowHeartAnimation(true);
        setTimeout(() => setShowHeartAnimation(false), 3000);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      showToast.error('Failed to update favorite status');
    }
  };

  // If the service has been deleted, don't render the card
  if (isDeleted) {
    return null;
  }
  
  return (
    <>
      <AnimatedCard key={service.id} delay={delay} className="overflow-hidden border border-gray-200">
        <div className="relative h-48 w-full">
        {service.image_url && service.image_url.trim() !== '' ? (
          <img 
            src={service.image_url}
            alt={service.name}
            className="object-cover w-full h-full"
            onError={(e) => {
              // If image fails to load, replace with the default placeholder
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement?.classList.add('image-error');
              // Force re-render to show the placeholder
              setFeatured(prev => prev);
            }}
          />
        ) : (
          <div className="bg-[#D28000] w-full h-full flex flex-col items-center justify-center">
            <PawPrint className="h-24 w-24 text-white" />
            <p className="text-white text-sm mt-2">No Image Available</p>
          </div>
        )}
        {/* Add a hidden placeholder that will be shown if the image fails to load */}
        <div className="hidden image-error bg-[#D28000] w-full h-full flex flex-col items-center justify-center absolute top-0 left-0">
          <PawPrint className="h-24 w-24 text-white" />
          <p className="text-white text-sm mt-2">No Image Available</p>
        </div>
        {user && (
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
            onClick={handleFavoriteClick}
          >
            <Heart 
              className={`h-5 w-5 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} 
            />
          </motion.button>
        )}

        {/* Animated Heart */}
        <AnimatePresence>
          {showHeartAnimation && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              <Heart className="h-16 w-16 fill-red-500 text-red-500" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{service.name}</CardTitle>
          {featured && (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">
              <Star className="h-3 w-3 mr-1 fill-yellow-500 text-yellow-500" />
              Featured
            </Badge>
          )}
        </div>
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
                {isAdminOrReviewer && (
                  <>
                    <Button 
                      variant="ghost" 
                      className="justify-start text-gray-700 hover:bg-emerald-50"
                      onClick={handleToggleFeatured}
                    >
                      <Star className={`h-4 w-4 mr-2 ${featured ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                      {featured ? 'Unfeature Service' : 'Feature Service'}
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="justify-start text-gray-700 hover:bg-red-50"
                      onClick={() => setIsDeleteDialogOpen(true)}
                      disabled={isDeleting || isDeleted}
                    >
                      <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                      Delete Service
                    </Button>
                  </>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </AnimatedCard>
    
    {/* Confirmation Dialog for Delete */}
    <ConfirmDialog
      isOpen={isDeleteDialogOpen}
      onClose={() => setIsDeleteDialogOpen(false)}
      onConfirm={handleDeleteService}
      title="Delete Service"
      description={`Would you like to delete ${service.name}?`}
      confirmText="Yes"
      cancelText="No"
      variant="destructive"
    />
    </>
  );
}
