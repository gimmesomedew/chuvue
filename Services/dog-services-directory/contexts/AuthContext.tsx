'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, UserRole, getUserRole } from '@/lib/supabase';
import { logLogoutError } from '@/lib/errorLogging';
import { ProfileData } from '@/types/profile';
import { useRouter } from 'next/navigation';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  userRole: UserRole;
  isLoading: boolean;
  profile: ProfileData | null;
  signIn: (email: string, password: string) => Promise<{ user: User; userRole: UserRole }>;
  signUp: (email: string, password: string) => Promise<{ user: User | null; userRole: UserRole }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('guest');
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Initial session check
    const initializeAuth = async () => {
      setIsLoading(true);
      
      // Get session
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user || null);
      
      // Get user role and profile if logged in
      if (session?.user) {
        const role = await getUserRole();
        setUserRole(role);
        // Fetch profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setProfile(profileData || null);
      } else {
        setProfile(null);
      }
      
      setIsLoading(false);
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user || null);
        
        if (session?.user) {
          const role = await getUserRole();
          setUserRole(role);
          // Fetch profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          setProfile(profileData || null);
        } else {
          setUserRole('guest');
          setProfile(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Inactivity timeout (30 minutes)
  useEffect(() => {
    if (!user) return;
    let timeoutId: NodeJS.Timeout;
    const INACTIVITY_LIMIT = 30 * 60 * 1000; // 30 minutes

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        await signOut();
        router.push('/');
      }, INACTIVITY_LIMIT);
    };

    // Listen for user activity
    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [user]);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      throw error;
    }
    
    // Get the user role after successful sign-in
    const role = await getUserRole();
    
    // Return both the user and their role
    return { user: data.user, userRole: role };
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    
    if (error) {
      throw error;
    }
    
    // New users typically start with a default role (usually pet_owner)
    // We'll set it to pet_owner by default, but this could be customized
    const defaultRole: UserRole = 'pet_owner';
    
    // Return both the user and their default role
    return { user: data.user, userRole: defaultRole };
  };

  const signOut = async () => {
    try {
      // Set a timeout for the signOut operation
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Sign out timed out')), 5000);
      });

      // Race between the signOut operation and the timeout
      await Promise.race([
        supabase.auth.signOut(),
        timeoutPromise
      ]);

      // Clear local state
      setUser(null);
      setSession(null);
      setUserRole('guest');
      setProfile(null);
    } catch (error) {
      console.error('Error during sign out:', error);
      // Log the error
      logLogoutError(error instanceof Error ? error : new Error(String(error)), 'Failed to sign out user');
      // Even if there's an error, clear the local state
      setUser(null);
      setSession(null);
      setUserRole('guest');
      setProfile(null);
      throw error;
    }
  };

  const value = {
    user,
    session,
    userRole,
    isLoading,
    profile,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
