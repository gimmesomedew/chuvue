import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// User role types
export type UserRole = 'admin' | 'service_provider' | 'pet_owner' | 'guest' | 'reviewer';

// Function to get the current user's role
export async function getUserRole(): Promise<UserRole> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return 'guest';
  
  // First, check if role is in user metadata
  if (user.user_metadata && user.user_metadata.role) {
    const metadataRole = user.user_metadata.role as string;
    if (['admin', 'service_provider', 'pet_owner', 'reviewer'].includes(metadataRole)) {
      return metadataRole as UserRole;
    }
  }
  
  // Check if role is in app_metadata (Supabase sometimes stores roles here)
  if (user.app_metadata && user.app_metadata.role) {
    const appMetadataRole = user.app_metadata.role as string;
    if (['admin', 'service_provider', 'pet_owner', 'reviewer'].includes(appMetadataRole)) {
      return appMetadataRole as UserRole;
    }
  }
  
  // Try to get role from the public users table (but handle the case where it doesn't exist)
  try {
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (!error && data?.role) {
      if (['admin', 'service_provider', 'pet_owner', 'reviewer'].includes(data.role)) {
        return data.role as UserRole;
      }
    }
  } catch (error) {
    // Silently handle error - we'll fall back to email-based detection
    console.log('Users table may not exist, falling back to email detection');
  }
  
  // Email-based role determination as fallback
  if (user.email) {
    // Admin detection
    if (
      user.email.includes('admin') || 
      user.email.endsWith('@dogparkadventures.com') || 
      user.email === 'admin@example.com'
    ) {
      return 'admin';
    }
    
    // Reviewer detection
    if (user.email.includes('review') || user.email.includes('moderator')) {
      return 'reviewer';
    }
    
    // Service provider detection
    if (user.email.includes('provider') || user.email.includes('service')) {
      return 'service_provider';
    }
  }
  
  // Default role if no other method works
  return 'pet_owner';
}

// Function to check if user has specific role
export async function hasRole(role: UserRole | UserRole[]): Promise<boolean> {
  const currentRole = await getUserRole();
  
  if (Array.isArray(role)) {
    return role.includes(currentRole);
  }
  
  return currentRole === role;
}
