'use client';

import { Service } from '@/lib/types';

export interface ServiceHeaderProps {
  service: Service;
  featured?: string;
  isAdminOrReviewer: boolean;
  onEdit: () => void;
}

export function ServiceHeader({ service, featured }: ServiceHeaderProps) {
  return (
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          {service.name}
          {featured === 'Y' && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
              Featured
            </span>
          )}
        </h2>
      </div>
    </div>
  );
} 