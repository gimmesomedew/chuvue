'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ProfileHeaderProps = {
  profileName: string;
};

export function ProfileHeader({ profileName }: ProfileHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <Link href="/directory" className="text-gray-500 hover:text-gray-700 text-sm flex items-center">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Directory
        </Link>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl md:text-3xl font-bold">{profileName}'s Profile</h1>
        </div>
      </div>
    </div>
  );
}
