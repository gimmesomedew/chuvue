'use client';

import { Badge } from '@/components/ui/badge';

interface ServiceTypeBadgeProps {
  type: string;
  color?: string;
  className?: string;
}

export function ServiceTypeBadge({ type, color = 'emerald', className = '' }: ServiceTypeBadgeProps) {
  const baseClasses = 'text-xs font-medium';
  const colorClasses = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    rose: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  return (
    <Badge
      variant="outline"
      className={`${baseClasses} ${colorClasses[color as keyof typeof colorClasses] || colorClasses.emerald} ${className}`}
    >
      {type}
    </Badge>
  );
} 