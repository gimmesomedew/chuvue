'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Service, Product } from '@/lib/types';
import { ServiceCard } from './ServiceCard';
import { ProductCard } from '@/components/products/ProductCard';
import { useLocationSorting } from '@/hooks/useLocationSorting';

interface UnifiedResultsListProps {
  results: Array<Service | Product>;
  onProductFavorite?: (productId: number) => void;
  favoritedProducts?: number[];
}

export function UnifiedResultsList({ 
  results, 
  onProductFavorite,
  favoritedProducts = []
}: UnifiedResultsListProps) {
  // Separate services and products
  const services = results.filter((result): result is Service => 'service_type' in result);
  const products = results.filter((result): result is Product => 'categories' in result);

  // Check if services already have distance information from API
  const hasApiDistance = services.length > 0 && 'distance' in services[0];
  
  // If API already calculated distances, use services as-is (they're already sorted)
  // Otherwise, use the location sorting hook
  const {
    sortByDistance,
    userLocation,
    displayResults: locationSortedServices,
  } = useLocationSorting(hasApiDistance ? [] : services);

  // Use API-sorted results if available, otherwise use hook-sorted results
  const displayServices = hasApiDistance ? services : locationSortedServices;

  if (results.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">No results found matching your criteria.</p>
      </div>
    );
  }

  // Combine services and products for display
  const allResults = [...displayServices, ...products];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Services Section */}
      {services.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto w-full" style={{ maxWidth: '1400px' }}>
            <AnimatePresence mode="popLayout">
              {displayServices.map((service, index) => (
                <motion.div 
                  key={`service-${service.id}`} 
                  className="w-full mx-auto md:max-w-[400px] max-w-[400px] px-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ 
                    delay: index * 0.05, // Staggered effect
                    duration: 0.3,
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                  }}
                  layout // Framer Motion automatically animates position changes
                >
                  <ServiceCard
                    service={service}
                    sortByDistance={hasApiDistance || sortByDistance}
                    userLocation={userLocation}
                    delay={0.1 * (index % 3)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Products Section */}
      {products.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto w-full" style={{ maxWidth: '1400px' }}>
            <AnimatePresence mode="popLayout">
              {products.map((product, index) => (
                <motion.div 
                  key={`product-${product.id}`} 
                  className="w-full mx-auto md:max-w-[400px] max-w-[400px] px-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ 
                    delay: index * 0.05, // Staggered effect
                    duration: 0.3,
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                  }}
                  layout // Framer Motion automatically animates position changes
                >
                  <ProductCard
                    product={product}
                    onFavorite={onProductFavorite}
                    isFavorited={favoritedProducts.includes(product.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </motion.div>
  );
}
