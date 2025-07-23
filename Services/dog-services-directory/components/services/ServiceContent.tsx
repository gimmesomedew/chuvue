import { MapPin, Navigation } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ServiceContentProps } from '@/types/service';
import { formatDistance } from '@/lib/location';
import { DESCRIPTION_MAX_LENGTH, ICON_SIZES } from '@/constants/serviceCard';

export function ServiceContent({ service, sortByDistance, userLocation }: ServiceContentProps) {
  const distance = 'distance' in service ? service.distance : undefined;

  return (
    <div className="space-y-1.5">
      <div className="space-y-0.5">
        <div className="flex items-center text-gray-500 text-sm">
          <MapPin className="h-5 w-5 mr-1.5 text-secondary flex-shrink-0" />
          <span>{service.address}</span>
        </div>
        
        {sortByDistance && userLocation && typeof distance === 'number' && (
          <div className="flex items-center text-secondary text-sm font-medium">
            <Navigation className={`h-${ICON_SIZES.MEDIUM.height} w-${ICON_SIZES.MEDIUM.width} mr-1 text-secondary`} />
            <span>{formatDistance(distance)}</span>
          </div>
        )}
        
        <div className="text-gray-500 text-sm">
          {service.city}, {service.state} {service.zip_code}
        </div>
      </div>

      <div className="flex-1 space-y-2">
        <div className="space-y-0.5">
          <h3 className="text-sm font-medium text-secondary">Description</h3>
          <p className="text-sm text-gray-600">
            {service.description.length > DESCRIPTION_MAX_LENGTH 
              ? `${service.description.substring(0, DESCRIPTION_MAX_LENGTH)}...` 
              : service.description}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-1.5">
          {service.is_verified && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Verified
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
} 