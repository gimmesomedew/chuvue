'use client';

import { CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Pencil, Star } from 'lucide-react';
import { ServiceHeaderProps } from '@/types/service';
import { ICON_SIZES, HOVER_STYLES } from '@/constants/serviceCard';

export function ServiceHeader({ service, featured, isAdminOrReviewer, onEdit }: ServiceHeaderProps) {
  return (
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-2">
        <CardTitle className="text-xl">{service.name}</CardTitle>
        {isAdminOrReviewer && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 p-0.5 hover:bg-gray-100 hover:text-gray-900"
                  onClick={onEdit}
                >
                  <Pencil className="h-4 w-4 text-gray-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit Service</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      {featured && (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">
          <Star className="h-3 w-3 mr-1 fill-yellow-500 text-yellow-500" />
          Featured
        </Badge>
      )}
    </div>
  );
} 