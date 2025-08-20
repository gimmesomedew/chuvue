import { ProductCategory } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ProductCategoryBadgeProps {
  category: ProductCategory;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ProductCategoryBadge({ 
  category, 
  size = 'md',
  className 
}: ProductCategoryBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  return (
    <Badge
      className={cn(
        "font-medium border-0 shadow-sm transition-all duration-200",
        "hover:scale-105 hover:shadow-md",
        sizeClasses[size],
        className
      )}
      style={{ 
        backgroundColor: category.color,
        color: getContrastColor(category.color)
      }}
    >
      {category.name}
    </Badge>
  );
}

// Helper function to determine text color based on background color
function getContrastColor(hexColor: string): string {
  // Remove # if present
  const hex = hexColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black for light backgrounds, white for dark backgrounds
  return luminance > 0.5 ? '#000000' : '#ffffff';
}
