'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Bone, MapPin, Tag, MessageCircle, Calendar } from 'lucide-react';
import { PawPrint } from 'lucide-react';
import { showToast } from '@/lib/toast';
import { ProfileData, getProfileName, getProfileLocation, getProfileRole } from '@/types/profile';
import { MessageDialog } from './MessageDialog';

type ProfileDetailsProps = {
  profile: ProfileData;
  currentUserId?: string;
};

export function ProfileDetails({ profile, currentUserId }: ProfileDetailsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  
  const handleSendMessage = () => {
    setIsMessageDialogOpen(true);
  };
  
  return (
    <div className="space-y-6">
      {/* Profile Header with Image */}
      <div className="relative bg-white shadow-md p-4 sm:p-6 rounded-lg">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          {/* Left Side - Profile Image and Photos */}
          <div className="md:w-1/3 flex flex-col gap-4">
            {/* Circular Profile Image */}
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 border-[#D28000] shadow-lg mx-auto md:mx-0 flex-shrink-0">
              {profile.pet_photos && profile.pet_photos.length > 0 ? (
                <img 
                  src={profile.pet_photos[0]} 
                  alt={`${getProfileName(profile)}'s profile`} 
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                  data-component-name="ProfileDetails"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#D28000]">
                  <Bone className="w-16 h-16 text-white" />
                </div>
              )}
            </div>
            
            {/* Additional Photos - Moved here to keep images together */}
            {profile.pet_photos && profile.pet_photos.length > 1 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">More Photos</h3>
                <div className="grid grid-cols-2 gap-2">
                  {profile.pet_photos.slice(1, 5).map((photo, index) => (
                    <div 
                      key={index} 
                      className="aspect-square rounded-md overflow-hidden bg-gray-200 shadow-sm hover:shadow transition-shadow duration-200"
                    >
                      <img 
                        src={photo} 
                        alt={`${getProfileName(profile)} photo ${index + 2}`}
                        className="w-full h-full object-cover object-center"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        
          {/* Right Side - Profile Details */}
          <div className="flex-1 md:w-2/3">
            <div className="flex flex-col gap-5">
              {/* Name and Basic Info */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold break-words">{getProfileName(profile)}</h1>
            
                {getProfileLocation(profile) && (
                  <div className="flex items-center text-gray-600 mt-2">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" />
                    <span className="text-sm sm:text-base">{getProfileLocation(profile)}</span>
                  </div>
                )}
            
                <div className="flex items-center text-gray-600 mt-2">
                  <Tag className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" />
                  <span className="text-sm sm:text-base">{getProfileRole(profile)}</span>
                </div>
              </div>
              
              {/* About Section - Integrated into details */}
              {(profile.bio || profile.about) && (
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <h2 className="text-md font-semibold mb-2">About</h2>
                  <p className="text-sm sm:text-base text-gray-700 whitespace-pre-line leading-relaxed">
                    {profile.bio || profile.about}
                  </p>
                </div>
              )}
              
              {/* Pet Details */}
              {(profile.pet_breed || profile.pet_favorite_tricks) && (
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <h2 className="text-md font-semibold mb-2 flex items-center">
                    <PawPrint className="mr-2 h-4 w-4 text-[#D28000] flex-shrink-0" />
                    Pet Details
                  </h2>
                  
                  <div className="space-y-3">
                    {profile.pet_breed && (
                      <div>
                        <h3 className="text-xs sm:text-sm font-medium text-gray-500">Breed</h3>
                        <p className="text-sm sm:text-base text-gray-800">{profile.pet_breed}</p>
                      </div>
                    )}
                    
                    {profile.pet_favorite_tricks && (
                      <div>
                        <h3 className="text-xs sm:text-sm font-medium text-gray-500">Favorite Tricks</h3>
                        <p className="text-sm sm:text-base text-gray-800">{profile.pet_favorite_tricks}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Tags/Interests */}
              {profile.tags && profile.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Interests</h3>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {profile.tags.map((tag) => (
                      <span 
                        key={tag} 
                        className="inline-block bg-emerald-100 text-emerald-800 text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
          
              {/* Prominent Send Message Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-2"
              >
                <Button 
                  onClick={handleSendMessage}
                  disabled={isLoading}
                  className="w-full bg-[#D28000] hover:bg-[#b06c00] text-white py-2 text-base font-medium shadow-md"
                  size="lg"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  {isLoading ? 'Sending...' : 'Send Message'}
                </Button>
              </motion.div>
              
              {/* Member Since */}
              {(profile.joined_date || profile.created_at) && (
                <div className="text-xs text-gray-500 flex items-center">
                  <Calendar className="h-3 w-3 mr-1.5 flex-shrink-0" />
                  Member since {new Date(profile.joined_date || profile.created_at || '').toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Message Dialog */}
      <MessageDialog
        profile={profile}
        isOpen={isMessageDialogOpen}
        onClose={() => setIsMessageDialogOpen(false)}
        currentUserId={currentUserId}
      />
    </div>
  );
}
