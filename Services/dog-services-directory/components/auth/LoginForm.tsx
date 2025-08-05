'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { showToast } from '@/lib/toast';
import { motion } from 'framer-motion';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    console.log('Login form submitted for:', email);

    // Show loading toast
    const loadingToast = showToast.loading('Signing in...');

    try {
      console.log('Calling signIn function...');
      const { user, userRole } = await signIn(email, password);
      console.log('SignIn successful, user:', user?.email, 'role:', userRole);
      
      // Dismiss loading toast
      showToast.dismiss(loadingToast);
      
      // Get user's name or first part of email for personalized welcome
      const userName = user?.user_metadata?.pet_name || 
                      (user?.email ? user.email.split('@')[0] : 'there');
      
      // Show role-specific toast notifications
      if (userRole === 'admin') {
        showToast.success(`Welcome back, ${userName}! You are logged in as an Administrator.`);
      } else if (userRole === 'reviewer') {
        showToast.success(`Welcome back, ${userName}! You are logged in as a Reviewer.`);
      } else {
        showToast.success(`Welcome back, ${userName}!`);
      }
      
      console.log('Redirecting to home page...');
      // Redirect to home page after successful login
      window.location.href = '/';
    } catch (error) {
      console.error('Login error:', error);
      // Dismiss loading toast and show error toast
      showToast.dismiss(loadingToast);
      
      let errorMessage = 'Invalid email or password. Please try again.';
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please check your credentials and try again.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Please check your email and confirm your account before signing in.';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Too many login attempts. Please wait a moment before trying again.';
        } else {
          errorMessage = `Login failed: ${error.message}`;
        }
      }
      
      showToast.error(errorMessage);
      setError(errorMessage);
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
        Sign In
      </motion.h2>
      
      {error && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-red-50 text-red-700 p-3 rounded-md mb-4"
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
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
              className="pl-10 w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="you@example.com"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
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
              className="pl-10 w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="••••••••"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-third text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </motion.div>
      </form>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-6 text-center"
      >
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <motion.a 
            href="/auth/signup" 
            className="font-medium text-secondary hover:text-alternate2"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            Sign up
          </motion.a>
        </p>
      </motion.div>
    </motion.div>
  );
}
