'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { AlertCircle, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { showToast } from '@/lib/toast';
import { MotionWrapper } from '@/components/ui/MotionWrapper';
import { PageTransition } from '@/components/ui/PageTransition';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

// Import custom components
import { ProfileHeader, ProfileDetails } from '@/components/profile';
import { ProfileData, getProfileName } from '@/types/profile';
import { ProfileDetailsSkeleton } from '@/components/profile/ProfileDetailsSkeleton';

export default function ProfileDetailPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const profileId = params?.id as string;
  
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !user) {
      router.push(`/auth/login?redirect=/profile/${profileId}`);
      showToast.error('You need to be logged in to view profiles');
    } else if (user && profileId) {
      fetchProfileData(profileId);
    }
  }, [user, isLoading, profileId, router]);

  const fetchProfileData = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch profile data from Supabase
      const { data, error: supabaseError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (supabaseError) {
        console.error('Error fetching profile:', supabaseError);
        throw supabaseError;
      }
      
      if (data) {
        console.log('Fetched profile:', data);
        setProfile(data);
      } else {
        throw new Error('Profile not found');
      }
    } catch (err) {
      console.error('Error fetching profile data:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch profile'));
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <PageTransition>
          <main className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="flex items-center mb-6">
              <Link href="/directory" className="text-gray-500 hover:text-gray-700 text-sm flex items-center">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Directory
              </Link>
            </div>
            <ProfileDetailsSkeleton />
          </main>
        </PageTransition>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Profile</h2>
            <p className="text-gray-600 mb-6">{error.message || 'There was a problem loading this profile. Please try again.'}</p>
            <Button 
              onClick={() => fetchProfileData(profileId)}
              className="bg-[#D28000] hover:bg-[#b06c00] text-white"
            >
              Try Again
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // Not found state
  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile Not Found</h2>
            <p className="text-gray-600 mb-6">The profile you're looking for doesn't exist or has been removed.</p>
            <Button 
              asChild
              className="bg-[#D28000] hover:bg-[#b06c00] text-white"
            >
              <Link href="/directory">Back to Directory</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // Main profile view
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <PageTransition>
        <main className="container mx-auto px-4 py-8 max-w-5xl">
          {/* Profile Header */}
          <ProfileHeader title={getProfileName(profile)} />
          
          {/* Profile Details */}
          <ProfileDetails profile={profile} currentUserId={user?.id} />
        </main>
      </PageTransition>
    </div>
  );
}