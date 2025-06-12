'use client';

import { useAuth } from '@/contexts/AuthContext';

export function SignUpCallout() {
  const { user } = useAuth();
  if (user) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center">
        <svg className="h-5 w-5 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" />
        </svg>
        <span className="text-blue-800 text-sm">
          <b>Sign up for a free account</b> to save your favorite services to your profile and more!
        </span>
      </div>
    </div>
  );
} 