'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Lock, User, Briefcase, Stethoscope, Loader2, ArrowRight } from 'lucide-react';
import { showToast } from '@/lib/toast';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  // Fields for pet owners
  const [petName, setPetName] = useState('');
  const [petPictureFile, setPetPictureFile] = useState<File | null>(null);
  const [petPicturePreview, setPetPicturePreview] = useState<string | null>(null);
  const [petBreed, setPetBreed] = useState('');
  const [bio, setBio] = useState('');

  // Location fields
  const [city, setCity] = useState('');
  const [stateLoc, setStateLoc] = useState('');
  const [zipCode, setZipCode] = useState('');

  // Service provider specific fields
  const [openToPublic, setOpenToPublic] = useState<'yes' | 'no'>('yes');
  const [acceptTiter, setAcceptTiter] = useState<'yes' | 'no' | 'not_sure'>('not_sure');

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      showToast.error('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Move to step 2 for pet owner registration
    if (step === 1) {
      setIsLoading(false);
      setStep(2);
      return;
    }

    // Complete signup
    await completeSignUp();
  };

  const completeSignUp = async () => {
    // Show loading toast
    const loadingToast = showToast.loading('Creating your account...');

    try {
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) throw error;

      const user = data.user;

      // Insert or update profile with pet owner information
      if (user) {
        const profilePayload: Record<string, any> = {
          id: user.id,
          role: 'pet_owner',
          pet_name: petName,
          pet_breed: petBreed,
          bio: bio,
          city: city,
          state: stateLoc,
          zip_code: zipCode,
        };

        // Handle file upload if provided
        if (petPictureFile) {
          const fileExt = petPictureFile.name.split('.').pop();
          const filePath = `${user.id}/${Date.now()}.${fileExt}`;
          const { error: uploadError } = await supabase.storage
            .from('pet_photos')
            .upload(filePath, petPictureFile, { upsert: true });
          if (uploadError) {
            console.error('Image upload error:', uploadError);
            throw uploadError;
          }

          const { data: publicUrlData } = supabase.storage
            .from('pet_photos')
            .getPublicUrl(filePath);

          if (publicUrlData?.publicUrl) {
            profilePayload.profile_photo = publicUrlData.publicUrl;
          }
        }

        // Upsert into profiles table
        const { error: profileError } = await supabase.from('profiles').upsert(profilePayload, { onConflict: 'id' });
        if (profileError) {
          console.error('Profile insert error:', profileError);
          throw profileError;
        }
      }

      // Dismiss loading toast
      showToast.dismiss(loadingToast);

      // Personalized success toast
      const userName = email.split('@')[0];
      showToast.success(`Welcome to Dog Park Adventures, ${userName}!`);

      // Redirect to home
      window.location.href = '/';
    } catch (error: any) {
      console.error('Signup error:', error);
      showToast.dismiss(loadingToast);

      const msg: string =
        typeof error?.message === 'string' ? error.message : (error?.error_description || '').toString();

      if (msg.toLowerCase().includes('already') || error?.status === 422) {
        showToast.error('That email is already registered. Please sign in instead.');
        setError('That email is already registered. You can sign in on the next page.');
      } else {
        showToast.error('Error creating account. Please try again.');
        setError('Error creating account. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <motion.h2 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-2xl font-bold text-center text-gray-800 mb-6"
      >
        Register Your Pet
      </motion.h2>
      
      {error && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm"
        >
          {error}
        </motion.div>
      )}
      
      <form onSubmit={handleContinue} className="space-y-4 overflow-hidden">
        <AnimatePresence mode="wait">
        {step === 1 && (
        <motion.div
          key="step1"
          initial={{ x: 0, opacity: 1 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -500, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          {/* Email field */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="you@example.com"
              />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="••••••••"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Password must be at least 8 characters</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="••••••••"
              />
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex items-center"
          >
            <motion.input
              whileHover={{ scale: 1.2 }}
              transition={{ duration: 0.2 }}
              id="terms"
              name="terms"
              type="checkbox"
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              required
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
              I agree to the{' '}
              <Link href="/terms" className="font-medium text-emerald-600 hover:text-emerald-500">
                <motion.span whileHover={{ scale: 1.05 }}>
                  Terms of Service
                </motion.span>
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="font-medium text-emerald-600 hover:text-emerald-500">
                <motion.span whileHover={{ scale: 1.05 }}>
                  Privacy Policy
                </motion.span>
              </Link>
            </label>
          </motion.div>
        </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ x: 500, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 500, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {/* Pet Name */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <label htmlFor="petName" className="block text-sm font-medium text-gray-700 mb-1">
                Pet's Name<span className="text-red-500">*</span>
              </label>
              <input
                id="petName"
                type="text"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              />
            </motion.div>

            {/* Pet Picture Upload */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <label htmlFor="petPicture" className="block text-sm font-medium text-gray-700 mb-1">
                Pet Picture
              </label>
              <div className="flex items-center space-x-4">
                <input
                  id="petPicture"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setPetPictureFile(file);
                    if (file) {
                      setPetPicturePreview(URL.createObjectURL(file));
                    } else {
                      setPetPicturePreview(null);
                    }
                  }}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer focus:outline-none"
                />
                {petPicturePreview && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={petPicturePreview} alt="Preview" className="h-16 w-16 object-cover rounded-md" />
                )}
              </div>
            </motion.div>

            {/* Breed */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <label htmlFor="petBreed" className="block text-sm font-medium text-gray-700 mb-1">
                Breed
              </label>
              <input
                id="petBreed"
                type="text"
                value={petBreed}
                onChange={(e) => setPetBreed(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              />
            </motion.div>

            {/* Bio */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              />
            </motion.div>

            {/* Location Fields */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City<span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={city}
                  onChange={(e)=>setCity(e.target.value)}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State<span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={stateLoc}
                  onChange={(e)=>setStateLoc(e.target.value)}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code<span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e)=>setZipCode(e.target.value)}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
        </AnimatePresence>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {step === 1 ? 'Continuing...' : 'Creating account...'}
              </>
            ) : step === 1 ? (
              <>
                Continue <ArrowRight className="h-4 w-4 ml-2" />
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </motion.div>
      </form>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="mt-6 text-center"
      >
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <motion.a 
            href="/auth/login" 
            className="font-medium text-emerald-600 hover:text-emerald-500"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            Sign in
          </motion.a>
        </p>
      </motion.div>
    </motion.div>
  );
}
