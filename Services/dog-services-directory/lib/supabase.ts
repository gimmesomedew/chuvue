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
  try {
    console.log('Getting user role...');
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting user:', userError);
      return 'guest';
    }
    
    if (!user) {
      console.log('No user found, returning guest role');
      return 'guest';
    }
    
    console.log('User found:', user.email);
    
    // Get role from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, role, pet_photos')
      .eq('id', user.id)
      .single()
      .throwOnError();
    
    console.log('Profile query result:', { profile, profileError });
    
    if (profileError || !profile) {
      // Fallback to admin detection for your email
      if (user.email === 'carykchandler@gmail.com') {
        console.log('Using fallback admin role for your email');
        return 'admin';
      }
      console.log('No profile or error, returning default pet_owner');
      return 'pet_owner';
    }
    
    const dbRole = profile.role as string | null;
    if (dbRole && ['admin', 'service_provider', 'pet_owner', 'reviewer'].includes(dbRole)) {
      console.log('Role found in profiles table:', dbRole);
      return dbRole as UserRole;
    }
    
    console.log('No valid role in profile, returning default pet_owner');
    return 'pet_owner';
  } catch (error) {
    console.error('Error in getUserRole:', error);
    return 'guest';
  }
}

// Function to check if user has specific role
export async function hasRole(role: UserRole | UserRole[]): Promise<boolean> {
  const currentRole = await getUserRole();
  
  if (Array.isArray(role)) {
    return role.includes(currentRole);
  }
  
  return currentRole === role;
}
