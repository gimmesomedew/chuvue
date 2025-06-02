'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Bone, MapPin } from 'lucide-react';
import Link from 'next/link';
import { ProfileData, getProfileName, getProfileLocation, getProfileDescription } from '@/types/profile';

type ProfileCardProps = {
  profile: ProfileData;
  index: number;
};

export function ProfileCard({ profile, index }: ProfileCardProps) {
  // Calculate staggered animation delay based on index
  const animationDelay = 0.05 * (index % 12);
  
  return (
    <motion.div
      key={profile.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: animationDelay }}
      className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col"
      role="article"
      aria-label={`Profile for ${getProfileName(profile)}`}
    >
      <div className="aspect-w-1 aspect-h-1 bg-gray-200 relative min-h-[230px]">
        {profile.pet_photos && profile.pet_photos.length > 0 ? (
          <img 
            src={profile.pet_photos[0]} 
            alt={`${getProfileName(profile)}'s profile`} 
            className="w-full h-full object-cover"
            data-component-name="DirectoryPage"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#D28000] min-h-[230px]">
            <Bone className="w-24 h-24 text-white" />
          </div>
        )}
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        <h2 className="text-lg font-semibold">{getProfileName(profile)}</h2>
        
        {getProfileLocation(profile) && (
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{getProfileLocation(profile)}</span>
          </div>
        )}
        
        {getProfileDescription(profile) && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {getProfileDescription(profile)}
          </p>
        )}
        
        {profile.tags && profile.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {profile.tags.map((tag) => (
              <span 
                key={tag} 
                className="inline-block bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="mt-auto pt-4">
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full"
          >
            <Button 
              asChild
              variant="outline" 
              className="w-full justify-center text-sm border-[#D28000] text-[#D28000] hover:bg-[#D28000] hover:text-white transition-colors duration-300"
            >
              <Link href={`/profile/${profile.id}`}>
                View Profile
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
