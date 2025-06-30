// Profile Page (app/profile/page.tsx)
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { MotionWrapper } from '@/components/ui/MotionWrapper';
import { PageTransition } from '@/components/ui/PageTransition';
import { supabase } from '@/lib/supabase';
import { ProfileDetails } from '@/components/profile';
import { ProfileDetailsSkeleton } from '@/components/profile/ProfileDetailsSkeleton';
import { ProfileData } from '@/types/profile';

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/auth/login?redirect=/profile');
        return;
      }
      fetchProfileData();
    }
  }, [user, isLoading]);

  const fetchProfileData = async () => {
    if (!user) return;
    
    setLoadingProfile(true);
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Profile doesn't exist, create one
          const newProfile = {
            id: user.id,
            name: user.email?.split('@')[0] || 'New Member',
            email: user.email,
            about: 'No bio added yet',
            breed: 'Not specified',
            favorite_tricks: '',
            location: 'Location not set',
            created_at: new Date().toISOString(),
            member_type: 'Member' as const
          };

          const { error: insertError } = await supabase
            .from('profiles')
            .insert(newProfile);

          if (insertError) throw insertError;
          setProfile(newProfile);
        } else {
          throw error;
        }
      } else if (profileData) {
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <PageTransition>
        <main className="container mx-auto px-4 py-8 max-w-5xl">
          {loadingProfile ? (
            <ProfileDetailsSkeleton />
          ) : profile ? (
            <ProfileDetails profile={profile} currentUserId={user?.id} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">Profile not found</p>
            </div>
          )}
        </main>
      </PageTransition>
    </div>
  );
}