'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, UserRole, getUserRole } from '@/lib/supabase';
import { logLogoutError, logAuthError } from '@/lib/errorLogging';
import { ProfileData } from '@/types/profile';
import { useRouter } from 'next/navigation';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  userRole: UserRole;
  isLoading: boolean;
  profile: ProfileData | null;
  unreadMessageCount: number;
  notifications: Record<string, number>;
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
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [notifications, setNotifications] = useState<Record<string, number>>({});
  const [isSigningOut, setIsSigningOut] = useState(false);
  const currentUserId = useRef<string | null>(null);
  const hasInitialized = useRef(false);
  const router = useRouter();

  useEffect(() => {
    // Prevent duplicate initialization
    if (hasInitialized.current) {
      return;
    }
    
    // Initial session check
    const initializeAuth = async () => {
      console.log('Initializing auth...');
      setIsLoading(true);
      
      try {
        // Get session
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        }
        
        console.log('Initial session:', session ? 'Found' : 'None');
        setSession(session);
        setUser(session?.user || null);
        
        // Get user role and profile if logged in
        if (session?.user) {
          console.log('User found, getting role and profile...');
          currentUserId.current = session.user.id;
          const role = await getUserRole();
          setUserRole(role);
          
          // Fetch profile
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profileError) {
            console.error('Error fetching profile:', profileError);
          }
          
          setProfile(profileData || null);
          console.log('Auth initialization complete for user:', session.user.email);
        } else {
          setProfile(null);
          currentUserId.current = null;
          console.log('Auth initialization complete - no user');
        }
      } catch (error) {
        console.error('Error during auth initialization:', error);
      } finally {
        setIsLoading(false);
        hasInitialized.current = true;
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session ? 'with session' : 'no session');
        
        setSession(session);
        setUser(session?.user || null);
        
        if (session?.user) {
          console.log('User authenticated, updating role and profile...');
          
          // Only fetch role and profile if we don't already have them for this user
          if (currentUserId.current !== session.user.id) {
            currentUserId.current = session.user.id;
            
            try {
              const role = await getUserRole();
              setUserRole(role);
              
              // Fetch profile
              const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
                
              if (profileError) {
                console.error('Error fetching profile on auth change:', profileError);
              }
              
              setProfile(profileData || null);
            } catch (error) {
              console.error('Error updating user data on auth change:', error);
            }
          }
        } else {
          console.log('User signed out, clearing state...');
          currentUserId.current = null;
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
        console.log('Inactivity timeout reached, signing out...');
        if (!isSigningOut) {
          await signOut();
          router.push('/');
        }
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

  /* --------------------------------------------------
   * Notification / badge counts (messages, review queues, etc.)
   * -------------------------------------------------- */
  useEffect(() => {
    if (!user) return;

    const fetchCounts = async () => {
      try {
        // Example unread messages count
        const { count, error } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('receiver_id', user.id)
          .is('read', false);

        if (!error) {
          setUnreadMessageCount(count || 0);
          setNotifications(prev => ({ ...prev, messages: count || 0 }));
        }
      } catch (err) {
        console.error('Error fetching notification counts', err);
      }
    };

    fetchCounts();
    const interval = setInterval(fetchCounts, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, [user]);

  const signIn = async (email: string, password: string) => {
    console.log('Signing in user:', email);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error('Sign in error:', error);
        await logAuthError(error instanceof Error ? error : String(error), 'signIn');
        throw error;
      }
      
      console.log('Sign in successful, getting user role...');
      
      // Get the user role after successful sign-in
      const role = await getUserRole();
      
      console.log('Sign in complete, user role:', role);
      
      // Return both the user and their role
      return { user: data.user, userRole: role };
    } catch (error) {
      console.error('Sign in failed:', error);
      await logAuthError(error instanceof Error ? error : String(error), 'signIn');
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    console.log('Signing up user:', email);
    
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      
      if (error) {
        console.error('Sign up error:', error);
        await logAuthError(error instanceof Error ? error : String(error), 'signUp');
        throw error;
      }
      
      console.log('Sign up successful');
      
      // New users typically start with a default role (usually pet_owner)
      // We'll set it to pet_owner by default, but this could be customized
      const defaultRole: UserRole = 'pet_owner';
      
      // Return both the user and their default role
      return { user: data.user, userRole: defaultRole };
    } catch (error) {
      console.error('Sign up failed:', error);
      await logAuthError(error instanceof Error ? error : String(error), 'signUp');
      throw error;
    }
  };

  const signOut = async () => {
    // Prevent duplicate sign-out calls
    if (isSigningOut) {
      console.log('Sign out already in progress, skipping...');
      return;
    }
    
    console.log('Signing out user...');
    setIsSigningOut(true);
    
    try {
      // Attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Supabase sign out error:', error);
        logLogoutError(error, 'Failed to sign out user from Supabase');
      } else {
        console.log('Supabase sign out successful');
      }
    } catch (error) {
      console.error('Unexpected error during sign out:', error);
      logLogoutError(error instanceof Error ? error : new Error(String(error)), 'Unexpected error during sign out');
    } finally {
      // Always clear local state, regardless of Supabase sign out success/failure
      console.log('Clearing local auth state...');
      setUser(null);
      setSession(null);
      setUserRole('guest');
      setProfile(null);
      setIsSigningOut(false);
      
      // Force redirect to home page to ensure clean state
      console.log('Redirecting to home page...');
      window.location.href = '/';
    }
  };

  const value = {
    user,
    session,
    userRole,
    isLoading,
    profile,
    unreadMessageCount,
    notifications,
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
