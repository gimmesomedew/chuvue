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
              favoriteServices: 0
            };
            
            setProfileData(formattedProfile);
            setLoadingProfile(false);
            return;
          }
          throw error;
        }
        
        if (profileData) {
          console.log('Profile data from database:', profileData);
          
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
            favoriteServices: 0 // Placeholder for now
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
        favoriteServices: 0
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
                          {profileData?.pet_photos && profileData.pet_photos.length > 0 ? (
                            <img
                              src={profileData.pet_photos[0]}
                              alt="Pet"
                              className="w-full h-full object-cover"
                            />
                          ) : profileData?.profile_photo ? (
                            <img
                              src={profileData.profile_photo}
                              alt="Profile"
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
                        <div className="flex flex-wrap items-center gap-4 mt-3">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2 opacity-80" />
                            <p className="text-sm">{profileData?.email}</p>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 opacity-80" />
                            <p className="text-sm">Joined {profileData?.joinDate}</p>
                          </div>
                          <div className="flex items-center">
                            <Shield className="h-4 w-4 mr-2 opacity-80" />
                            <p className="text-sm capitalize">{profileData?.role?.replace('_', ' ')}</p>
                          </div>
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
                  
                  {/* Basic Profile Details - Always visible */}
                  <div className="bg-white p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex-1 space-y-2">
                      <div>
                        <span className="font-semibold text-gray-700">Bio:</span>
                        <span className="ml-2 text-gray-800">{profileData?.bio || 'No bio added yet'}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Pet Breed:</span>
                        <span className="ml-2 text-gray-800">{profileData?.pet_breed || 'Not specified'}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Location:</span>
                        <span className="ml-2 text-gray-800">{profileData?.location || 'Location not set'}</span>
                      </div>
                      {profileData?.pet_favorite_tricks && profileData.pet_favorite_tricks.length > 0 && (
                        <div>
                          <span className="font-semibold text-gray-700">Favorite Tricks:</span>
                          <span className="ml-2 text-gray-800">{profileData.pet_favorite_tricks.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Profile Content - Conditional based on role */}
                  <AnimatePresence mode="wait">
                    {userRole === 'service_provider' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="p-8"
                      >
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Service Provider Dashboard</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          <motion.div 
                            whileHover={{ scale: 1.03 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
                            onClick={() => router.push('/services/my-services')}
                          >
                            <div className="bg-emerald-100 p-4 rounded-full w-fit mb-4">
                              <Briefcase className="h-8 w-8 text-emerald-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">My Services</h3>
                            <p className="text-gray-600">Manage your service listings</p>
                          </motion.div>
                          
                          <motion.div 
                            whileHover={{ scale: 1.03 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
                            onClick={() => router.push('/settings')}
                          >
                            <div className="bg-emerald-100 p-4 rounded-full w-fit mb-4">
                              <Settings className="h-8 w-8 text-emerald-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Account Settings</h3>
                            <p className="text-gray-600">Update your account information</p>
                          </motion.div>
                          
                          <motion.div 
                            whileHover={{ scale: 1.03 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
                            onClick={() => router.push(`/profile/${user?.id}`)}
                          >
                            <div className="bg-emerald-100 p-4 rounded-full w-fit mb-4">
                              <User className="h-8 w-8 text-emerald-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Public Profile</h3>
                            <p className="text-gray-600">View your public profile</p>
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                    
                    {userRole === 'admin' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="p-8"
                      >
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          <motion.div 
                            whileHover={{ scale: 1.03 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
                            onClick={() => router.push('/admin/services')}
                          >
                            <div className="bg-emerald-100 p-4 rounded-full w-fit mb-4">
                              <Briefcase className="h-8 w-8 text-emerald-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Manage Services</h3>
                            <p className="text-gray-600">Review and approve service listings</p>
                          </motion.div>
                          
                          <motion.div 
                            whileHover={{ scale: 1.03 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
                            onClick={() => router.push('/admin/users')}
                          >
                            <div className="bg-emerald-100 p-4 rounded-full w-fit mb-4">
                              <User className="h-8 w-8 text-emerald-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Manage Users</h3>
                            <p className="text-gray-600">View and edit user accounts</p>
                          </motion.div>
                          
                          <motion.div 
                            whileHover={{ scale: 1.03 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
                            onClick={() => router.push('/admin/settings')}
                          >
                            <div className="bg-emerald-100 p-4 rounded-full w-fit mb-4">
                              <Settings className="h-8 w-8 text-emerald-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Site Settings</h3>
                            <p className="text-gray-600">Configure application settings</p>
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                    
                    {userRole === 'pet_owner' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="p-8"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* Pet Information */}
                          <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="space-y-6"
                          >
                            <div className="bg-gray-50 rounded-xl p-6 shadow-sm transition-all duration-300 hover:shadow-md">
                              <h3 className="text-sm font-semibold text-emerald-700 uppercase tracking-wider mb-3">About</h3>
                              <p className="text-lg text-gray-700">{profileData?.bio || 'No bio added yet'}</p>
                            </div>
                            
                            <div className="bg-gray-50 rounded-xl p-6 shadow-sm transition-all duration-300 hover:shadow-md">
                              <h3 className="text-sm font-semibold text-emerald-700 uppercase tracking-wider mb-3">Pet Breed</h3>
                              <p className="text-lg text-gray-700">{profileData?.pet_breed || 'Not specified'}</p>
                            </div>
                            
                            <div className="bg-gray-50 rounded-xl p-6 shadow-sm transition-all duration-300 hover:shadow-md">
                              <h3 className="text-sm font-semibold text-emerald-700 uppercase tracking-wider mb-3">Location</h3>
                              <div className="flex items-center">
                                <MapPin className="h-5 w-5 text-emerald-500 mr-2" />
                                <span className="text-lg text-gray-700">{profileData?.location || 'Location not set'}</span>
                              </div>
                            </div>
                            
                            {profileData?.pet_favorite_tricks && profileData.pet_favorite_tricks.length > 0 && (
                              <div className="bg-gray-50 rounded-xl p-6 shadow-sm transition-all duration-300 hover:shadow-md">
                                <h3 className="text-sm font-semibold text-emerald-700 uppercase tracking-wider mb-3">Favorite Tricks</h3>
                                <div className="flex flex-wrap gap-2">
                                  {profileData.pet_favorite_tricks.map((trick: string, index: number) => (
                                    <motion.span 
                                      key={trick} 
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ delay: 0.3 + (index * 0.1) }}
                                      className="bg-emerald-100 text-emerald-800 text-sm px-3 py-1 rounded-full font-medium"
                                    >
                                      {trick}
                                    </motion.span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </motion.div>
                          
                          {/* Pet Photos */}
                          <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="space-y-6"
                          >
                            <div className="bg-gray-50 rounded-xl p-6 shadow-sm transition-all duration-300 hover:shadow-md">
                              <div className="flex justify-between items-center mb-4">
                                <h3 className="text-sm font-semibold text-emerald-700 uppercase tracking-wider">Pet Photos</h3>
                                <Camera className="h-5 w-5 text-emerald-500" />
                              </div>
                              
                              {profileData?.pet_photos && profileData.pet_photos.length > 0 ? (
                                <div className="grid grid-cols-2 gap-3">
                                  {profileData.pet_photos.map((photo: string, index: number) => (
                                    <motion.div 
                                      key={index} 
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: 0.4 + (index * 0.1) }}
                                      className="aspect-square rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:scale-105 cursor-pointer"
                                    >
                                      <img 
                                        src={photo} 
                                        alt={`Pet photo ${index + 1}`}
                                        className="w-full h-full object-cover"
                                      />
                                    </motion.div>
                                  ))}
                                </div>
                              ) : (
                                <div className="bg-white rounded-lg p-8 text-center border border-dashed border-gray-300">
                                  <Image className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                  <p className="text-gray-500">No pet photos added yet</p>
                                  <p className="text-sm text-gray-400 mt-1">Add photos in the edit profile section</p>
                                </div>
                              )}
                            </div>
                            
                            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 shadow-sm transition-all duration-300 hover:shadow-md">
                              <div className="flex items-center">
                                <div className="bg-emerald-200 p-4 rounded-full">
                                  <Heart className="h-6 w-6 text-emerald-600" />
                                </div>
                                <div className="ml-5">
                                  <h3 className="text-lg font-semibold text-gray-800">Favorite Services</h3>
                                  <p className="text-4xl font-bold text-emerald-600 mt-1">{profileData?.favoriteServices || 0}</p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                        
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6, duration: 0.5 }}
                          className="mt-8 flex justify-center"
                        >
                          <Button 
                            onClick={() => router.push('/profile/edit')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-6 text-lg transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
                          >
                            <Edit className="h-5 w-5 mr-2" />
                            Edit Profile
                          </Button>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </PageTransition>
    </div>
  );
}