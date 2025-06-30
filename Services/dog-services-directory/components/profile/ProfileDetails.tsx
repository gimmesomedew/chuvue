'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Bone, MapPin, Tag, MessageCircle, Calendar, Edit, PawPrint, Info, Image as ImageIcon } from 'lucide-react';
import { showToast } from '@/lib/toast';
import { ProfileData, getProfileName, getProfileLocation, getProfileRole } from '@/types/profile';
import { MessageDialog } from './MessageDialog';
import { ImageModal } from '@/components/ui/ImageModal';
import Image from 'next/image';
import Link from 'next/link';

// Sub-components for better organization
const ProfileImage = ({ photo, name, onImageClick }: { photo: string | null; name: string; onImageClick: (e: React.MouseEvent) => void }) => (
  <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-[#D28000] shadow-lg hover:shadow-xl transition-shadow duration-300" onClick={(e) => e.stopPropagation()}>
    {photo ? (
      <button
        className="w-full h-full relative group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D28000] focus:ring-offset-2"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onImageClick(e);
        }}
      >
        <Image
          src={photo}
          alt={`${name}'s profile picture`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 192px, 192px"
          priority
        />
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
      </button>
    ) : (
      <div className="w-full h-full flex items-center justify-center bg-[#D28000]">
        <Bone className="w-16 h-16 text-white" />
      </div>
    )}
  </div>
);

const ProfileInfo = ({ profile }: { profile: ProfileData }) => (
  <div className="space-y-4 flex-1">
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold break-words text-gray-900">
        {profile.pet_name || 'Pet Name'}
      </h1>
      <p className="text-gray-500 mt-1">{profile.email}</p>
    </div>

    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-gray-600">
      {getProfileLocation(profile) && (
        <div className="flex items-center">
          <MapPin className="h-5 w-5 mr-2 flex-shrink-0 text-[#D28000]" />
          <span className="text-base">{getProfileLocation(profile)}</span>
        </div>
      )}
      <div className="flex items-center">
        <Tag className="h-5 w-5 mr-2 flex-shrink-0 text-[#D28000]" />
        <span className="text-base capitalize">{getProfileRole(profile)}</span>
      </div>
    </div>
  </div>
);

const AboutSection = ({ bio, about }: { bio?: string; about?: string }) => {
  const description = bio || about;
  if (!description) return null;
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center gap-2 mb-3">
        <Info className="h-5 w-5 text-[#D28000]" />
        <h2 className="text-xl font-semibold text-gray-900">About</h2>
      </div>
      <p className="text-gray-600 leading-relaxed whitespace-pre-line">{description}</p>
    </div>
  );
};

const PetDetails = ({ breed, tricks, openToPublic, acceptTiterExemption }: { 
  breed?: string; 
  tricks?: string[]; 
  openToPublic?: boolean;
  acceptTiterExemption?: boolean;
}) => {
  const hasDetails = breed || (tricks && tricks.length > 0) || openToPublic !== undefined || acceptTiterExemption !== undefined;
  if (!hasDetails) return null;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300 space-y-4">
      <div className="flex items-center gap-2">
        <PawPrint className="h-5 w-5 text-[#D28000]" />
        <h2 className="text-xl font-semibold text-gray-900">Pet Details</h2>
      </div>
      
      {breed && (
        <div className="flex items-center">
          <Bone className="h-5 w-5 mr-2 text-[#D28000]" />
          <span className="text-gray-700">Breed: <span className="font-medium">{breed}</span></span>
        </div>
      )}

      {tricks && tricks.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Favorite Tricks</h3>
          <div className="flex flex-wrap gap-2">
            {tricks.map((trick, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#D28000]/10 text-[#D28000]"
              >
                {trick}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 mt-4 text-sm">
        {openToPublic !== undefined && (
          <div className="flex items-center text-gray-700">
            <span className={`mr-2 w-2 h-2 rounded-full ${openToPublic ? 'bg-green-500' : 'bg-gray-400'}`} />
            {openToPublic ? 'Open to Public' : 'Private Profile'}
          </div>
        )}
        {acceptTiterExemption !== undefined && (
          <div className="flex items-center text-gray-700">
            <span className={`mr-2 w-2 h-2 rounded-full ${acceptTiterExemption ? 'bg-green-500' : 'bg-gray-400'}`} />
            {acceptTiterExemption ? 'Accepts Titer Exemption' : 'No Titer Exemption'}
          </div>
        )}
      </div>
    </div>
  );
};

const PhotosGrid = ({ photos, onPhotoClick }: { photos: string[]; onPhotoClick: (e: React.MouseEvent, index: number) => void }) => {
  if (photos.length <= 1) return null;
  
  const handlePhotoClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    onPhotoClick(e, index);
  };
  
  return (
    <div className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow duration-300" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center gap-2 mb-4">
        <ImageIcon className="h-5 w-5 text-[#D28000]" />
        <h2 className="text-xl font-semibold text-gray-900">More Photos</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.slice(1).map((photo, index) => (
          <button
            key={`${photo}-${index}`}
            className="relative aspect-square rounded-lg overflow-hidden bg-gray-200 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D28000] hover:ring-2 hover:ring-[#D28000]/50 transition-all duration-300"
            onClick={(e) => handlePhotoClick(e, index)}
          >
            <Image
              src={photo}
              alt={`Additional photo ${index + 2}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          </button>
        ))}
      </div>
    </div>
  );
};

interface ProfileDetailsProps {
  profile: ProfileData;
  currentUserId?: string;
}

export function ProfileDetails({ profile, currentUserId }: ProfileDetailsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(-1);
  
  const allPhotos = profile.pet_photos || [];
  const mainPhoto = profile.profile_photo || allPhotos[0] || null;
  const isOwnProfile = currentUserId === profile.id;

  const handleSendMessage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMessageDialogOpen(true);
  };

  const handleImageClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedImageIndex(index);
  };

  return (
    <div className="space-y-6" onClick={(e) => e.stopPropagation()}>
      {/* Profile Image and Info Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex flex-col md:flex-row gap-8 items-start relative" onClick={(e) => e.stopPropagation()}>
          <ProfileImage
            photo={mainPhoto}
            name={profile.pet_name || 'Pet'}
            onImageClick={(e) => handleImageClick(e, 0)}
          />

          <div className="flex-1 min-w-0" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <ProfileInfo profile={profile} />
              
              {/* Action Buttons */}
              {!isOwnProfile && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button 
                    onClick={handleSendMessage}
                    disabled={isLoading}
                    variant="outline"
                    size="sm"
                    className="border-[#D28000] text-[#D28000] hover:bg-[#D28000] hover:text-white transition-colors duration-300 whitespace-nowrap"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {isLoading ? 'Sending...' : 'Send Message'}
                  </Button>
                </motion.div>
              )}
            </div>

            {/* Edit Profile Button */}
            {isOwnProfile && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-4"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  asChild
                  variant="outline"
                  className="border-[#D28000] text-[#D28000] hover:bg-[#D28000] hover:text-white transition-colors duration-300"
                >
                  <Link href="/profile/edit">
                    <Edit className="w-5 h-5 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
              </motion.div>
            )}

            {/* Member Since */}
            {profile.created_at && (
              <div className="text-sm text-gray-500 flex items-center mt-4">
                <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                Member since {new Date(profile.created_at).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* About Section */}
      <AboutSection bio={profile.bio} about={profile.about} />

      {/* Pet Details Section */}
      <PetDetails 
        breed={profile.pet_breed} 
        tricks={profile.pet_favorite_tricks}
        openToPublic={profile.open_to_public}
        acceptTiterExemption={profile.accept_titer_exemption}
      />

      {/* Additional Photos Grid */}
      <PhotosGrid 
        photos={allPhotos} 
        onPhotoClick={(e, index) => handleImageClick(e, index + 1)} 
      />

      {/* Image Modal */}
      <ImageModal
        images={allPhotos}
        initialIndex={selectedImageIndex}
        isOpen={selectedImageIndex >= 0}
        onClose={() => setSelectedImageIndex(-1)}
      />

      {/* Message Dialog */}
      <MessageDialog
        isOpen={isMessageDialogOpen}
        onClose={() => setIsMessageDialogOpen(false)}
        recipientId={profile.id}
        recipientName={profile.pet_name || 'Pet Owner'}
        currentUserId={currentUserId}
      />
    </div>
  );
}
