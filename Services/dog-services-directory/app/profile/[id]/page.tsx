'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { showToast } from '@/lib/toast';
import { MotionWrapper } from '@/components/ui/MotionWrapper';
import { PageTransition } from '@/components/ui/PageTransition';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

// Import custom components
import { ProfileHeader, ProfileDetails } from '@/components/profile';
import { ProfileData, getProfileName } from '@/types/profile';

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
      // If user is viewing their own profile, redirect to the enhanced profile page
      if (user.id === profileId) {
        console.log('Redirecting to enhanced profile page');
        router.push('/profile');
        return;
      }
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
        // If no profile found, use mock data
        const mockProfile: ProfileData = {
          id,
          pet_name: 'Buddy',
          name: 'John Doe',
          location: 'Indianapolis, IN',
          bio: 'Dog lover and outdoor enthusiast. I enjoy taking my pets on adventures and meeting other pet owners.',
          pet_photos: [
            'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=400&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1583511655826-05700442982d?q=80&w=400&auto=format&fit=crop'
          ],
          pet_breed: 'Golden Retriever',
          pet_favorite_tricks: 'Fetch, Sit, Stay, Roll Over',
          role: 'pet_owner',
          tags: ['Hiking', 'Fetch', 'Swimming'],
          joined_date: '2025-01-15'
        };
        setProfile(mockProfile);
      }
    } catch (err) {
      console.error('Error fetching profile data:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch profile'));
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <MotionWrapper
          variant="fadeIn"
          className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[80vh]"
        >
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-[#D28000] border-t-transparent rounded-full animate-spin mb-4"></div>
            <h2 className="text-xl font-medium text-gray-700">Loading profile...</h2>
          </div>
        </MotionWrapper>
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
          <ProfileHeader profileName={getProfileName(profile)} />
          
          {/* Profile Details */}
          <ProfileDetails profile={profile} currentUserId={user?.id} />
        </main>
      </PageTransition>
    </div>
  );
}