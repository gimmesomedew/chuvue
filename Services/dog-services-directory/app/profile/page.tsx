// Profile Page (app/profile/page.tsx)
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { User, Settings, MapPin, Calendar, Heart, Briefcase, Shield, Edit, Mail, Camera, Image } from 'lucide-react';
import { showToast } from '@/lib/toast';
import { motion, AnimatePresence } from 'framer-motion';
import { MotionWrapper } from '@/components/ui/MotionWrapper';
import { PageTransition } from '@/components/ui/PageTransition';
import { supabase } from '@/lib/supabase';
import { ServiceCard } from '@/components/search/ServiceCard';

export default function ProfilePage() {
  console.log('Enhanced profile page component is rendering');

  const { user, userRole, isLoading, signOut } = useAuth();
  const router = useRouter();
  const [profileData, setProfileData] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !user) {
      router.push('/auth/login');
    } else if (user) {
      // Fetch profile data based on role
      fetchProfileData();
      console.log('User authenticated, fetching profile data');
    }
  }, [user, isLoading, router]);

  const fetchProfileData = async () => {
    setLoadingProfile(true);
    
    try {
      // Fetch actual profile data from the profiles table
      if (user) {
        console.log('Fetching profile data for user:', user.id);
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
          // If the profile doesn't exist yet, create one
          if (error.code === 'PGRST116') {
            console.log('Profile not found, creating new profile');
            const newProfile = {
              id: user.id,
              email: user.email,
              pet_name: user.email ? user.email.split('@')[0] : 'My Pet',
              created_at: new Date().toISOString()
            };
            
            const { error: insertError } = await supabase
              .from('profiles')
              .insert(newProfile);
              
            if (insertError) {
              console.error('Error creating profile:', insertError);
              throw insertError;
            }
            
            // Use the new profile data
            const formattedProfile = {
              id: newProfile.id,
              pet_name: newProfile.pet_name,
              email: newProfile.email,
              bio: 'No bio added yet',
              pet_breed: 'Not specified',
              pet_favorite_tricks: [],
              location: 'Location not set',
              zip_code: null,
              profile_photo: null,
              pet_photos: [],
              role: userRole,
              joinDate: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }),
              favoriteServices: 0,
              favoriteServicesList: []
            };
            
            setProfileData(formattedProfile);
            setLoadingProfile(false);
            return;
          }
          throw error;
        }
        
        if (profileData) {
          console.log('Profile data from database:', profileData);
          
          // Fetch favorite services list
          let favoriteServicesList: any[] = [];
          try {
            const { data: favRows, error: favErr } = await supabase
              .from('favorites')
              .select('service_id, services(*)')
              .eq('user_id', user.id);
            if (favErr) throw favErr;
            favoriteServicesList = (favRows || []).map((row: any) => row.services);
          } catch (favErr) {
            console.error('Error fetching favorites:', favErr);
          }

          const favoriteCount = favoriteServicesList.length;

          // Format the data for display
          const formattedProfile = {
            id: profileData.id,
            pet_name: profileData.pet_name || 'My Pet',
            email: profileData.email || user.email,
            bio: profileData.bio || 'No bio added yet',
            pet_breed: profileData.pet_breed || 'Not specified',
            pet_favorite_tricks: profileData.pet_favorite_tricks || [],
            location: profileData.city && profileData.state ? `${profileData.city}, ${profileData.state}` : 'Location not set',
            zip_code: profileData.zip_code,
            profile_photo: profileData.profile_photo,
            pet_photos: profileData.pet_photos || [],
            role: userRole,
            joinDate: new Date(profileData.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            favoriteServices: favoriteCount,
            favoriteServicesList
          };
          
          setProfileData(formattedProfile);
          setLoadingProfile(false);
          return;
        }
      }
      
      // Fallback to mock data if no profile found
      const mockProfile = {
        id: user?.id,
        pet_name: user?.email ? user.email.split('@')[0] : 'My Pet',
        email: user?.email,
        bio: 'No bio added yet',
        pet_breed: 'Not specified',
        pet_favorite_tricks: [],
        location: 'Location not set',
        zip_code: null,
        profile_photo: null,
        pet_photos: [],
        role: userRole,
        joinDate: 'May 2025',
        favoriteServices: 0,
        favoriteServicesList: []
      };
      
      setProfileData(mockProfile);
      setLoadingProfile(false);
    } catch (error) {
      console.error('Error fetching profile data:', error);
      setLoadingProfile(false);
    }
  };

  const handleSignOut = async () => {
    const loadingToast = showToast.loading('Signing out...');
    try {
      await signOut();
      showToast.dismiss(loadingToast);
      showToast.success('Signed out successfully');
      // Force a page reload to ensure clean state
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
      showToast.dismiss(loadingToast);
      showToast.error('Failed to sign out');
      // Force a page reload even on error to ensure clean state
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <PageTransition>
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="w-full mx-auto">
            {loadingProfile ? (
              <MotionWrapper
                variant="fadeIn"
                className="flex justify-center items-center min-h-[60vh]"
              >
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <h2 className="text-xl font-medium text-gray-700">Loading profile...</h2>
                </div>
              </MotionWrapper>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                  {/* Profile Header */}
                  <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mt-20 -mr-20"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-5 rounded-full -mb-20 -ml-20"></div>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between relative z-10">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="flex-shrink-0 mb-6 md:mb-0 md:mr-8"
                      >
                        <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center text-emerald-500 shadow-lg ring-4 ring-white/30 overflow-hidden">
                          {profileData?.profile_photo ? (
                            <img
                              src={profileData.profile_photo}
                              alt="Avatar"
                              className="w-full h-full object-cover"
                            />
                          ) : profileData?.pet_photos && profileData.pet_photos.length > 0 ? (
                            <img
                              src={profileData.pet_photos[0]}
                              alt="Pet"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="h-14 w-14" />
                          )}
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="flex-1"
                      >
                        <h1 className="text-4xl font-bold">{profileData?.pet_name}</h1>
                        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
                          {profileData?.email && (
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-1 opacity-80" />
                              <span>{profileData.email}</span>
                            </div>
                          )}
                          {profileData?.joinDate && (
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1 opacity-80" />
                              <span>Joined {profileData.joinDate}</span>
                            </div>
                          )}
                          {profileData?.role && (
                            <div className="flex items-center capitalize">
                              <Shield className="h-4 w-4 mr-1 opacity-80" />
                              <span>{profileData.role.replace('_', ' ')}</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="mt-6 md:mt-0 flex gap-3"
                      >
                        <Button 
                          variant="outline" 
                          className="bg-white/10 text-white hover:bg-white/20 border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                          onClick={() => router.push('/profile/edit')}
                        >
                          <Edit className="h-5 w-5 mr-2" />
                          Edit Profile
                        </Button>
                        <Button 
                          variant="outline" 
                          className="bg-white/10 text-white hover:bg-white/20 border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                          onClick={handleSignOut}
                        >
                          Sign Out
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                  
                  {/* Bio & Details Section */}
                  <div className="p-8 grid md:grid-cols-3 gap-8 bg-white">
                    {/* Bio */}
                    {profileData?.bio && profileData.bio !== 'No bio added yet' && (
                      <div className="md:col-span-2">
                        <h2 className="text-lg font-semibold mb-2 flex items-center">
                          <Heart className="h-5 w-5 mr-2 text-emerald-600" /> About {profileData.pet_name}
                        </h2>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                          {profileData.bio}
                        </p>
                      </div>
                    )}

                    {/* Pet Details */}
                    <div>
                      <h2 className="text-lg font-semibold mb-2 flex items-center">
                        <Briefcase className="h-5 w-5 mr-2 text-emerald-600" /> Details
                      </h2>
                      <ul className="space-y-1 text-gray-700">
                        {profileData?.pet_breed && profileData.pet_breed !== 'Not specified' && (
                          <li className="flex items-center"><span className="font-medium mr-2">Breed:</span>{profileData.pet_breed}</li>
                        )}
                        {profileData?.location && profileData.location !== 'Location not set' && (
                          <li className="flex items-center"><MapPin className="h-4 w-4 mr-2 text-emerald-600" /> {profileData.location}</li>
                        )}
                        {profileData?.pet_favorite_tricks && profileData.pet_favorite_tricks.length > 0 && (
                          <li>
                            <span className="font-medium">Favorite Tricks:</span>
                            <div className="mt-1 flex flex-wrap gap-2">
                              {profileData.pet_favorite_tricks.map((trick:string, idx:number)=>(
                                <span key={idx} className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs">{trick}</span>
                              ))}
                            </div>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* Photos Gallery */}
                  {profileData?.pet_photos && profileData.pet_photos.length > 0 && (
                    <div className="p-8 bg-gray-50">
                      <h2 className="text-lg font-semibold mb-4 flex items-center"><Image className="h-5 w-5 mr-2 text-emerald-600" /> Pet Photos</h2>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {profileData.pet_photos.map((url:string, idx:number)=>(
                          <img key={idx} src={url} alt={`Pet ${idx}`} className="rounded-lg object-cover w-full h-40" />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Favorite Services */}
                  <div className="p-8 bg-white border-t border-gray-100">
                    <h2 className="text-lg font-semibold mb-4 flex items-center">
                      <Heart className="h-5 w-5 mr-2 text-emerald-600" /> Favorite Services
                    </h2>
                    {profileData?.favoriteServicesList && profileData.favoriteServicesList.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {profileData.favoriteServicesList.map((svc:any, idx:number)=>(
                          <ServiceCard key={svc.id} service={svc} sortByDistance={false} userLocation={null} delay={idx*0.05} />
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No favorite services added yet</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </PageTransition>
    </div>
  );
}