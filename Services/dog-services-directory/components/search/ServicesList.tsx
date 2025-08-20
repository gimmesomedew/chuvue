'use client';

import { motion } from 'framer-motion';
import { Service } from '@/lib/types';
import { ServiceCard } from './ServiceCard';
import { useLocationSorting } from '@/hooks/useLocationSorting';

interface ServicesListProps {
  services: Service[];
}

export function ServicesList({ services }: ServicesListProps) {
  // Check if services already have distance information from API
  const hasApiDistance = services.length > 0 && 'distance' in services[0];
  
  // If API already calculated distances, use services as-is (they're already sorted)
  // Otherwise, use the location sorting hook
  const {
    sortByDistance,
    userLocation,
    displayResults: locationSortedResults,
  } = useLocationSorting(hasApiDistance ? [] : services);

  // Use API-sorted results if available, otherwise use hook-sorted results
  const displayResults = hasApiDistance ? services : locationSortedResults;

  if (services.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">No services found matching your criteria.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto w-full"
      style={{ maxWidth: '1400px' }}
    >
      {displayResults.map((service, index) => (
        <div key={service.id} className="w-full mx-auto md:max-w-[400px] max-w-[400px] px-2">
          <ServiceCard
            service={service}
            sortByDistance={hasApiDistance || sortByDistance}
            userLocation={userLocation}
            delay={0.1 * (index % 3)}
          />
        </div>
      ))}
    </motion.div>
  );
} 