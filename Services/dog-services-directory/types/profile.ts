// Shared profile data type for use across the application
export type ProfileData = {
  id: string;
  // Core profile fields
  name: string;
  pet_name?: string;
  email?: string;
  bio?: string;
  about?: string;
  
  // Location fields
  city?: string;
  state?: string;
  zip_code?: string;
  location?: string;
  
  // Role and status
  member_type?: 'Member' | 'Admin' | 'Service Provider' | 'Reviewer';
  role?: string;
  open_to_public?: boolean;
  accept_titer_exemption?: boolean;
  
  // Pet details
  pet_photos?: string[];
  pet_breed?: string;
  pet_favorite_tricks?: string[];
  profile_photo?: string;
  
  // Additional fields
  tags?: string[];
  created_at: string;
  updated_at?: string;
};

// Helper functions for profile data
export const getProfileName = (profile: ProfileData): string => {
  return profile.pet_name || profile.name || 'Pet Owner';
};

export const getProfileLocation = (profile: ProfileData): string => {
  if (profile.city && profile.state) {
    return `${profile.city}, ${profile.state} ${profile.zip_code || ''}`.trim();
  }
  return profile.location || '';
};

export const getProfileDescription = (profile: ProfileData): string => {
  return profile.bio || profile.about || '';
};

export const getProfileRole = (profile: ProfileData): string => {
  return profile.role || profile.member_type || 'Member';
};

export const getProfileImage = (profile: ProfileData): string | null => {
  if (profile.pet_photos && profile.pet_photos.length > 0) {
    return profile.pet_photos[0];
  }
  return null;
};
