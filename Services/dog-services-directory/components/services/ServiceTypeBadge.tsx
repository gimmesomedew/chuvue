'use client';

import { Badge } from '@/components/ui/badge';

interface ServiceTypeBadgeProps {
  type: string;
  color?: string;
  bgColor?: string;
  className?: string;
}

export function ServiceTypeBadge({ type, color = 'emerald', bgColor, className = '' }: ServiceTypeBadgeProps) {
  const baseClasses = 'text-xs font-medium text-white';

  return (
    <Badge
      variant="outline"
      className={`${baseClasses} ${bgColor || `bg-${color}-500`} border-transparent ${className}`}
    >
      {type}
    </Badge>
  );
} 