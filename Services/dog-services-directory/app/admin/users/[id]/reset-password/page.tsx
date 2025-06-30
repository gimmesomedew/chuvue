'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';
import { KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showToast } from '@/lib/toast';

interface Profile {
  id: string;
  pet_name: string | null;
  email: string | null;
}

export default function ResetPasswordPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { userRole } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userRole !== 'admin') {
      router.push('/');
      return;
    }
    fetchProfile();
  }, [userRole, router, params.id]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, pet_name, email')
        .eq('id', params.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      showToast.error('Failed to fetch user profile');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      showToast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      showToast.error('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/users/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: params.id,
          newPassword,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to reset password');
      }

      showToast.success('Password has been reset successfully');
      router.push('/admin/users');
    } catch (error) {
      console.error('Error resetting password:', error);
      showToast.error(error instanceof Error ? error.message : 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  if (!profile) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg">
        <div className="flex items-center gap-3 mb-6">
          <KeyRound className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold">Reset Password</h1>
            <p className="text-gray-600">
              Reset password for {profile.pet_name || 'Unnamed User'} ({profile.email})
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
              minLength={8}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              minLength={8}
            />
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/users')}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
} 