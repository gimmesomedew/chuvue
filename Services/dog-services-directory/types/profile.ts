// Shared profile data type for use across the application
export type ProfileData = {
  id: string;
  // Different possible name fields
  name?: string;
  pet_name?: string;
  username?: string;
  email?: string;
  // Different possible location fields
  location?: string;
  city?: string;
  state?: string;
  // Different possible description fields
  bio?: string;
  about?: string;
  // Photo fields
  image_url?: string;
  pet_photos?: string[];  // Array of photo URLs
  // Pet details
  pet_breed?: string;
  pet_favorite_tricks?: string;
  // Role and tags
  role?: string;
  tags?: string[];
  // Contact information
  contact_email?: string;
  phone?: string;
  // Additional fields
  joined_date?: string;
  pets?: any[];
  created_at?: string;
  updated_at?: string;
  // Allow for any other fields that might exist
  [key: string]: any;
};

// Helper functions for profile data
export const getProfileName = (profile: ProfileData): string => {
  return profile.pet_name || profile.name || profile.username || 'Pet Owner';
};

export const getProfileLocation = (profile: ProfileData): string => {
  if (profile.location) return profile.location;
  if (profile.city && profile.state) return `${profile.city}, ${profile.state}`;
  return profile.city || profile.state || '';
};

export const getProfileDescription = (profile: ProfileData): string => {
  return profile.bio || profile.about || '';
};

export const getProfileRole = (profile: ProfileData): string => {
  switch (profile.role) {
    case 'pet_owner':
      return 'Pet Owner';
    case 'service_provider':
      return 'Service Provider';
    case 'admin':
      return 'Administrator';
    default:
      return 'Member';
  }
};

export const getProfileImage = (profile: ProfileData): string | null => {
  if (profile.pet_photos && profile.pet_photos.length > 0) {
    return profile.pet_photos[0];
  }
  
  return profile.image_url || null;
};
