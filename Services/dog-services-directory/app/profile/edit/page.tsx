// Edit Profile Page (app/profile/edit/page.tsx)
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { showToast } from '@/lib/toast';
import { MotionWrapper } from '@/components/ui/MotionWrapper';
import { PageTransition } from '@/components/ui/PageTransition';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Save, Upload, X, Camera } from 'lucide-react';
import { motion } from 'framer-motion';

type ProfileFormData = {
  pet_name: string;
  bio: string;
  pet_breed: string;
  pet_favorite_tricks: string[];
  city: string;
  state: string;
  zip_code: string;
  profile_photo: string | null;
  pet_photos: string[];
};

export default function ProfileEditPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<ProfileFormData>({
    pet_name: '',
    bio: '',
    pet_breed: '',
    pet_favorite_tricks: [],
    city: '',
    state: '',
    zip_code: '',
    profile_photo: null,
    pet_photos: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newTrick, setNewTrick] = useState('');

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !user) {
      router.push('/auth/login?redirect=/profile/edit');
      showToast.error('You need to be logged in to edit your profile');
    } else if (user) {
      fetchProfileData();
    }
  }, [user, isLoading, router]);

  const fetchProfileData = async () => {
    setLoading(true);
    
    try {
      if (user) {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
          throw error;
        }
        
        if (profileData) {
          console.log('Profile data from database:', profileData);
          
          setFormData({
            pet_name: profileData.pet_name || '',
            bio: profileData.bio || '',
            pet_breed: profileData.pet_breed || '',
            pet_favorite_tricks: profileData.pet_favorite_tricks || [],
            city: profileData.city || '',
            state: profileData.state || '',
            zip_code: profileData.zip_code || '',
            profile_photo: profileData.profile_photo,
            pet_photos: profileData.pet_photos || [],
          });
        }
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      showToast.error('Failed to load your profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTrick = () => {
    if (newTrick.trim() && !formData.pet_favorite_tricks.includes(newTrick.trim())) {
      setFormData(prev => ({
        ...prev,
        pet_favorite_tricks: [...prev.pet_favorite_tricks, newTrick.trim()]
      }));
      setNewTrick('');
    }
  };

  const handleRemoveTrick = (trick: string) => {
    setFormData(prev => ({
      ...prev,
      pet_favorite_tricks: prev.pet_favorite_tricks.filter(t => t !== trick)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const savingToast = showToast.loading('Saving your profile...');
    
    try {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          pet_name: formData.pet_name,
          bio: formData.bio,
          pet_breed: formData.pet_breed,
          pet_favorite_tricks: formData.pet_favorite_tricks,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zip_code,
          profile_photo: formData.profile_photo,
          pet_photos: formData.pet_photos,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' });
      
      if (error) throw error;
      
      showToast.dismiss(savingToast);
      showToast.success('Profile updated successfully!');
      
      // Add a slight delay before redirecting for better UX
      setTimeout(() => {
        router.push('/profile');
      }, 800);
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast.dismiss(savingToast);
      showToast.error('Failed to update profile');
    } finally {
      setSaving(false);
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
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <h2 className="text-xl font-medium text-gray-700">Loading your profile...</h2>
          </div>
        </MotionWrapper>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <PageTransition>
        <main className="container mx-auto px-4 py-8 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 flex items-center"
          >
            <Button
              variant="ghost"
              onClick={() => router.push('/profile')}
              className="mr-4 group transition-all duration-300"
            >
              <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-5">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <label htmlFor="pet_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Pet Name
                  </label>
                  <Input
                    id="pet_name"
                    name="pet_name"
                    value={formData.pet_name}
                    onChange={handleInputChange}
                    placeholder="Your pet's name"
                    className="w-full transition-all duration-300 focus:ring-2 focus:ring-emerald-500"
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about you and your pet"
                    className="w-full min-h-[100px] transition-all duration-300 focus:ring-2 focus:ring-emerald-500"
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <label htmlFor="pet_breed" className="block text-sm font-medium text-gray-700 mb-1">
                    Pet Breed
                  </label>
                  <Input
                    id="pet_breed"
                    name="pet_breed"
                    value={formData.pet_breed}
                    onChange={handleInputChange}
                    placeholder="What breed is your pet?"
                    className="w-full transition-all duration-300 focus:ring-2 focus:ring-emerald-500"
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pet's Favorite Tricks
                  </label>
                  <div className="flex">
                    <Input
                      value={newTrick}
                      onChange={(e) => setNewTrick(e.target.value)}
                      placeholder="Add a trick"
                      className="flex-1 mr-2 transition-all duration-300 focus:ring-2 focus:ring-emerald-500"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTrick())}
                    />
                    <Button 
                      type="button" 
                      onClick={handleAddTrick}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-300 hover:scale-105"
                    >
                      Add
                    </Button>
                  </div>
                  
                  {formData.pet_favorite_tricks.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {formData.pet_favorite_tricks.map((trick, index) => (
                        <motion.div 
                          key={index} 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.1 * index }}
                          className="bg-emerald-100 text-emerald-800 text-sm px-3 py-1 rounded-full flex items-center group"
                        >
                          {trick}
                          <button
                            type="button"
                            onClick={() => handleRemoveTrick(trick)}
                            className="ml-2 text-emerald-600 hover:text-emerald-800 transition-all duration-300 opacity-70 group-hover:opacity-100"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Your city"
                      className="w-full transition-all duration-300 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="Your state"
                      className="w-full transition-all duration-300 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.7 }}
                >
                  <label htmlFor="zip_code" className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code
                  </label>
                  <Input
                    id="zip_code"
                    name="zip_code"
                    value={formData.zip_code}
                    onChange={handleInputChange}
                    placeholder="Your ZIP code"
                    className="w-full transition-all duration-300 focus:ring-2 focus:ring-emerald-500"
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.8 }}
                  className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-6 rounded-xl"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-emerald-700">Photo Upload</h3>
                    <Camera className="h-5 w-5 text-emerald-600" />
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Add photos of your pet to personalize your profile.</p>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="border-emerald-300 text-emerald-700 hover:bg-emerald-100 transition-all duration-300 hover:scale-105" 
                    disabled
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photos
                  </Button>
                  <p className="text-xs text-emerald-600 mt-2 italic">Photo upload functionality coming soon!</p>
                </motion.div>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.9 }}
                className="pt-6 border-t border-gray-200 flex justify-end"
              >
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/profile')}
                  className="mr-3 transition-all duration-300 hover:scale-105"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
          </motion.div>
        </main>
      </PageTransition>
    </div>
  );
}