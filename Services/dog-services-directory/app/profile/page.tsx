'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { User, Settings, MapPin, Calendar, Heart, Briefcase, Shield } from 'lucide-react';
import { showToast } from '@/lib/toast';
import { motion } from 'framer-motion';
import { MotionWrapper } from '@/components/ui/MotionWrapper';
import { AnimatedCard } from '@/components/ui/AnimatedCard';

export default function ProfilePage() {
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
    }
  }, [user, isLoading, router]);

  const fetchProfileData = async () => {
    setLoadingProfile(true);
    const loadingToast = showToast.loading('Loading your profile...');
    
    try {
      // This would typically fetch data from Supabase based on the user's role
      // For now, we'll use mock data
      setTimeout(() => {
        const mockData = {
          admin: {
            name: 'Admin User',
            email: user?.email,
            role: 'Administrator',
            joinDate: 'May 15, 2025',
            managedServices: 48,
            activeUsers: 156
          },
          reviewer: {
            name: 'Reviewer',
            email: user?.email,
            role: 'Content Reviewer',
            joinDate: 'May 10, 2025',
            reviewedServices: 37,
            pendingReviews: 8,
            rejectedSubmissions: 12
          },
          service_provider: {
            name: 'Service Provider',
            email: user?.email,
            role: 'Service Provider',
            joinDate: 'April 3, 2025',
            businessName: 'Happy Paws Grooming',
            location: 'Indianapolis, IN',
            services: ['Grooming', 'Nail Trimming', 'Bathing'],
            bookings: 12
          },
          pet_owner: {
            name: 'Pet Owner',
            email: user?.email,
            role: 'Pet Owner',
            joinDate: 'March 22, 2025',
            pets: [
              { name: 'Max', breed: 'Golden Retriever', age: 3 },
              { name: 'Bella', breed: 'Beagle', age: 2 }
            ],
            upcomingBookings: 2,
            favoriteServices: 5
          },
          guest: {
            name: 'Guest User',
            email: 'Not signed in',
            role: 'Guest'
          }
        };
        
        setProfileData(mockData[userRole]);
        setLoadingProfile(false);
        showToast.dismiss(loadingToast);
        
        // Get user's name or first part of email for personalized welcome
        const userName = user?.user_metadata?.pet_name || 
                        (user?.email ? user.email.split('@')[0] : 'there');
        showToast.success(`Welcome back, ${userName}!`);
      }, 1000);
    } catch (error) {
      console.error('Error fetching profile data:', error);
      showToast.dismiss(loadingToast);
      showToast.error('Error loading profile data. Please try again.');
      setLoadingProfile(false);
    }
  };

  const handleSignOut = async () => {
    const loadingToast = showToast.loading('Signing out...');
    try {
      await signOut();
      showToast.dismiss(loadingToast);
      showToast.success('Successfully signed out');
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
      showToast.dismiss(loadingToast);
      showToast.error('Error signing out. Please try again.');
    }
  };

  if (isLoading || loadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <MotionWrapper
          variant="fadeIn"
          className="container mx-auto px-4 py-8"
        >
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-gray-900 mb-8"
          >
            My Profile
          </motion.h1>
          
          {isLoading || loadingProfile ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center items-center h-64"
            >
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"
              ></motion.div>
            </motion.div>
          ) : (
            <div>
              <div className="pt-16 pb-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    {/* Profile Header */}
                    <div className="bg-emerald-600 p-6">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div className="flex items-center">
                          <div className="bg-white p-3 rounded-full">
                            <User className="h-10 w-10 text-emerald-600" />
                          </div>
                          <div className="ml-4 text-white">
                            <h1 className="text-2xl font-bold">{profileData?.name}</h1>
                            <p className="opacity-90">{profileData?.email}</p>
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0">
                          <Button 
                            onClick={handleSignOut}
                            variant="outline" 
                            className="bg-white text-emerald-600 hover:bg-gray-100"
                          >
                            Sign Out
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Role Badge */}
                    <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
                      <div className="flex items-center">
                        {userRole === 'admin' && <Shield className="h-5 w-5 text-emerald-600 mr-2" />}
                        {userRole === 'service_provider' && <Briefcase className="h-5 w-5 text-emerald-600 mr-2" />}
                        {userRole === 'pet_owner' && <Heart className="h-5 w-5 text-emerald-600 mr-2" />}
                        <span className="font-medium text-gray-700">{profileData?.role}</span>
                        <span className="ml-2 text-sm text-gray-500">• Joined {profileData?.joinDate}</span>
                      </div>
                    </div>
                    
                    {/* Profile Content - Admin */}
                    {userRole === 'admin' && (
                      <div className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Admin Dashboard Overview</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center">
                              <div className="bg-emerald-100 p-3 rounded-full">
                                <Briefcase className="h-6 w-6 text-emerald-600" />
                              </div>
                              <div className="ml-4">
                                <h3 className="text-lg font-medium">Managed Services</h3>
                                <p className="text-3xl font-bold text-emerald-600">{profileData?.managedServices}</p>
                              </div>
                            </div>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center">
                              <div className="bg-emerald-100 p-3 rounded-full">
                                <User className="h-6 w-6 text-emerald-600" />
                              </div>
                              <div className="ml-4">
                                <h3 className="text-lg font-medium">Active Users</h3>
                                <p className="text-3xl font-bold text-emerald-600">{profileData?.activeUsers}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-6">
                          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                            <Settings className="h-4 w-4 mr-2" />
                            Admin Settings
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {/* Profile Content - Service Provider */}
                    {userRole === 'service_provider' && (
                      <div className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Business Profile</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">BUSINESS NAME</h3>
                              <p className="mt-1 text-lg">{profileData?.businessName}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">LOCATION</h3>
                              <div className="mt-1 flex items-center">
                                <MapPin className="h-5 w-5 text-gray-400 mr-1" />
                                <span>{profileData?.location}</span>
                              </div>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">SERVICES OFFERED</h3>
                              <div className="mt-2 flex flex-wrap gap-2">
                                {profileData?.services.map((service: string) => (
                                  <span key={service} className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded">
                                    {service}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center">
                              <div className="bg-emerald-100 p-3 rounded-full">
                                <Calendar className="h-6 w-6 text-emerald-600" />
                              </div>
                              <div className="ml-4">
                                <h3 className="text-lg font-medium">Current Bookings</h3>
                                <p className="text-3xl font-bold text-emerald-600">{profileData?.bookings}</p>
                              </div>
                            </div>
                            <div className="mt-4">
                              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                                Manage Bookings
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="mt-6 flex space-x-4">
                          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                            Edit Business Profile
                          </Button>
                          <Button variant="outline" className="border-emerald-500 text-emerald-500 hover:bg-emerald-50">
                            Add New Service
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {/* Profile Content - Pet Owner */}
                    {userRole === 'pet_owner' && (
                      <div className="p-6">
                        <h2 className="text-xl font-semibold mb-4">My Pets</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {profileData?.pets.map((pet: any) => (
                            <div key={pet.name} className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex items-center">
                                <div className="bg-emerald-100 p-3 rounded-full">
                                  <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017a2 2 0 01-1.789-2.894l3.5-7A2 2 0 0114 10zm-3-9v9m-9 3h7m3-3h7" />
                                  </svg>
                                </div>
                                <div className="ml-4">
                                  <h3 className="text-lg font-medium">{pet.name}</h3>
                                  <p className="text-gray-600">{pet.breed}, {pet.age} years old</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex items-center">
                                <div className="bg-emerald-100 p-3 rounded-full">
                                  <Calendar className="h-6 w-6 text-emerald-600" />
                                </div>
                                <div className="ml-4">
                                  <h3 className="text-lg font-medium">Upcoming Bookings</h3>
                                  <p className="text-3xl font-bold text-emerald-600">{profileData?.upcomingBookings}</p>
                                </div>
                              </div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex items-center">
                                <div className="bg-emerald-100 p-3 rounded-full">
                                  <Heart className="h-6 w-6 text-emerald-600" />
                                </div>
                                <div className="ml-4">
                                  <h3 className="text-lg font-medium">Favorite Services</h3>
                                  <p className="text-3xl font-bold text-emerald-600">{profileData?.favoriteServices}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-6 flex space-x-4">
                          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                            Add New Pet
                          </Button>
                          <Button variant="outline" className="border-emerald-500 text-emerald-500 hover:bg-emerald-50">
                            View Bookings
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </MotionWrapper>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-16 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Profile Header */}
            <div className="bg-emerald-600 p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="flex items-center">
                  <div className="bg-white p-3 rounded-full">
                    <User className="h-10 w-10 text-emerald-600" />
                  </div>
                  <div className="ml-4 text-white">
                    <h1 className="text-2xl font-bold">{profileData?.name}</h1>
                    <p className="opacity-90">{profileData?.email}</p>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <Button 
                    onClick={handleSignOut}
                    variant="outline" 
                    className="bg-white text-emerald-600 hover:bg-gray-100"
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Role Badge */}
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
              <div className="flex items-center">
                {userRole === 'admin' && <Shield className="h-5 w-5 text-emerald-600 mr-2" />}
                {userRole === 'service_provider' && <Briefcase className="h-5 w-5 text-emerald-600 mr-2" />}
                {userRole === 'pet_owner' && <Heart className="h-5 w-5 text-emerald-600 mr-2" />}
                <span className="font-medium text-gray-700">{profileData?.role}</span>
                <span className="ml-2 text-sm text-gray-500">• Joined {profileData?.joinDate}</span>
              </div>
            </div>
            
            {/* Profile Content - Admin */}
            {userRole === 'admin' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Admin Dashboard Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <div className="bg-emerald-100 p-3 rounded-full">
                        <Briefcase className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium">Managed Services</h3>
                        <p className="text-3xl font-bold text-emerald-600">{profileData?.managedServices}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <div className="bg-emerald-100 p-3 rounded-full">
                        <User className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium">Active Users</h3>
                        <p className="text-3xl font-bold text-emerald-600">{profileData?.activeUsers}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Settings className="h-4 w-4 mr-2" />
                    Admin Settings
                  </Button>
                </div>
              </div>
            )}
            
            {/* Profile Content - Service Provider */}
            {userRole === 'service_provider' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Business Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">BUSINESS NAME</h3>
                      <p className="mt-1 text-lg">{profileData?.businessName}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">LOCATION</h3>
                      <div className="mt-1 flex items-center">
                        <MapPin className="h-5 w-5 text-gray-400 mr-1" />
                        <span>{profileData?.location}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">SERVICES OFFERED</h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {profileData?.services.map((service: string) => (
                          <span key={service} className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <div className="bg-emerald-100 p-3 rounded-full">
                        <Calendar className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium">Current Bookings</h3>
                        <p className="text-3xl font-bold text-emerald-600">{profileData?.bookings}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                        Manage Bookings
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex space-x-4">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    Edit Business Profile
                  </Button>
                  <Button variant="outline" className="border-emerald-500 text-emerald-500 hover:bg-emerald-50">
                    Add New Service
                  </Button>
                </div>
              </div>
            )}
            
            {/* Profile Content - Pet Owner */}
            {userRole === 'pet_owner' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">My Pets</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {profileData?.pets.map((pet: any) => (
                    <div key={pet.name} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <div className="bg-emerald-100 p-3 rounded-full">
                          <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017a2 2 0 01-1.789-2.894l3.5-7A2 2 0 0114 10zm-3-9v9m-9 3h7m3-3h7" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium">{pet.name}</h3>
                          <p className="text-gray-600">{pet.breed}, {pet.age} years old</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <div className="bg-emerald-100 p-3 rounded-full">
                          <Calendar className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium">Upcoming Bookings</h3>
                          <p className="text-3xl font-bold text-emerald-600">{profileData?.upcomingBookings}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <div className="bg-emerald-100 p-3 rounded-full">
                          <Heart className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium">Favorite Services</h3>
                          <p className="text-3xl font-bold text-emerald-600">{profileData?.favoriteServices}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex space-x-4">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    Add New Pet
                  </Button>
                  <Button variant="outline" className="border-emerald-500 text-emerald-500 hover:bg-emerald-50">
                    View Bookings
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
