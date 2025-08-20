'use client';

import { useState, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { Product } from '@/lib/types';
import { ProductCategoryBadge } from './ProductCategoryBadge';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Star,
  Heart,
  HeartOff,
  Link,
  MapPlus,
  Image as ImageIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';


interface ProductCardProps {
  product: Product;
  onFavorite?: (productId: number) => void;
  isFavorited?: boolean;
  className?: string;
}

function ProductCardComponent({ 
  product, 
  onFavorite, 
  isFavorited = false,
  className 
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const hasLocation = product.latitude && product.longitude;

  const handleFavorite = useCallback(() => {
    if (onFavorite) {
      onFavorite(product.id);
    }
  }, [onFavorite, product.id]);

  const truncateDescription = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Card 
      className={cn(
        "group relative overflow-hidden transition-all duration-300 hover:shadow-lg",
        "bg-white/80 backdrop-blur-sm border border-white/20",
        "hover:bg-white/90 hover:scale-[1.02]",
        "h-[600px] flex flex-col", // Fixed height and flexbox layout
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Section */}
      <div className="relative h-56 w-full overflow-hidden flex-shrink-0">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={`Image of ${product.name}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              console.warn('Product image failed to load:', product.image_url);
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const placeholder = target.parentElement?.querySelector('.image-placeholder') as HTMLElement;
              if (placeholder) {
                placeholder.style.display = 'flex';
              }
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="text-center text-gray-500">
              <ImageIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">No image available</p>
            </div>
          </div>
        )}
        
        {/* Fallback placeholder for failed images */}
        <div className="image-placeholder w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 absolute inset-0" style={{ display: 'none' }}>
          <div className="text-center text-gray-500">
            <ImageIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">Image unavailable</p>
          </div>
        </div>

        {/* Verification Badge - Now on the image */}
        {product.is_verified_gentle_care && (
          <div className="absolute top-3 right-3 z-10">
            <Badge 
              className="bg-green-500/90 text-white border-0 shadow-lg animate-pulse"
              variant="secondary"
            >
              <Star className="w-3 h-3 mr-1" />
              Verified
            </Badge>
          </div>
        )}

        {/* Favorite Button - Now on the image */}
        {onFavorite && (
          <button
            className={cn(
              "absolute top-3 left-3 z-10 h-8 w-8 p-0 rounded-full",
              "bg-white/80 backdrop-blur-sm border border-white/20",
              "hover:bg-white/90 transition-all duration-200",
              "flex items-center justify-center",
              isFavorited ? "text-red-500" : "text-gray-400 hover:text-red-500"
            )}
            onClick={handleFavorite}
          >
            {isFavorited ? (
              <Heart className="w-4 h-4 fill-current" />
            ) : (
              <HeartOff className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Product Title and Categories - Now under the image */}
      <div className="px-6 pt-4 pb-3 flex-shrink-0">
        {/* Product Name */}
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-3 line-clamp-2">
          {product.name}
        </h3>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-4">
          {product.categories?.map((category) => (
            <ProductCategoryBadge 
              key={category.id} 
              category={category} 
              size="sm"
            />
          ))}
        </div>
      </div>



      <CardContent className="space-y-4 flex-grow flex flex-col">
        {/* Description */}
        <div className="space-y-2 flex-grow">
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
            {product.description || 'No description available'}
          </p>
        </div>

        {/* Location Information */}
        {hasLocation && (
          <div className="space-y-2 flex-shrink-0">
            <h4 className="text-sm font-medium text-gray-700">Location</h4>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
              <span className="line-clamp-2">
                {product.location_address && (
                  <span className="block">{product.location_address}</span>
                )}
                <span>
                  {product.city && product.state && (
                    `${product.city}, ${product.state}`
                  )}
                  {product.zip_code && ` ${product.zip_code}`}
                </span>
              </span>
            </div>
          </div>
        )}

        {/* Verification Highlight */}
        {product.is_verified_gentle_care && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex-shrink-0">
            <div className="flex items-center text-green-700">
              <Star className="w-4 h-4 mr-2 fill-current flex-shrink-0" />
              <span className="text-sm font-medium line-clamp-2">
                This product has been verified for gentle care standards
              </span>
            </div>
          </div>
        )}
      </CardContent>

      {/* Action Icons Section */}
      <div className="border-t border-gray-100 flex-shrink-0">
        <div className="flex items-center justify-center gap-6 py-3 px-4">
          {/* Website Link */}
          {product.website && (
            <motion.a
              href={product.website}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-primary-500 hover:text-primary-600 cursor-pointer"
              title="Visit Website"
            >
              <div className="p-2.5 rounded-full transition-all duration-200 bg-primary-50 hover:bg-primary-100">
                <Link className="h-6 w-6" color="#22c55e" />
              </div>
            </motion.a>
          )}

          {/* Map Location */}
          {product.latitude && product.longitude && (
            <motion.a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${product.name} ${product.location_address || ''} ${product.city || ''} ${product.state || ''} ${product.zip_code || ''}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-emerald-500 hover:text-emerald-600 cursor-pointer"
              title="View on Map"
            >
              <div className="p-2.5 rounded-full transition-all duration-200 bg-emerald-50 hover:bg-emerald-100">
                <MapPlus className="h-6 w-6 text-secondary" />
              </div>
            </motion.a>
          )}

          {/* Email */}
          {product.email && (
            <motion.a
              href={`mailto:${product.email}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-purple-500 hover:text-purple-600 cursor-pointer"
              title="Send Email"
            >
              <div className="p-2.5 rounded-full transition-all duration-200 bg-purple-50 hover:bg-purple-100">
                <Mail className="h-6 w-6" />
              </div>
            </motion.a>
          )}

          {/* Phone */}
          {product.contact_number && (
            <motion.a
              href={`tel:${product.contact_number}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-green-500 hover:text-green-600 cursor-pointer"
              title="Call Phone"
            >
              <div className="p-2.5 rounded-full transition-all duration-200 bg-green-50 hover:bg-green-100">
                <Phone className="h-6 w-6" />
              </div>
            </motion.a>
          )}

          {/* Favorite Button */}
          {onFavorite && (
            <motion.button
              onClick={handleFavorite}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`${
                isFavorited ? 'text-red-500' : 'text-red-400 hover:text-red-500'
              } cursor-pointer`}
              title={isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
            >
              <div className={`p-2.5 rounded-full transition-all duration-200 ${
                isFavorited ? 'bg-red-50' : 'bg-gray-50 hover:bg-red-50'
              }`}>
                <Heart className={`h-6 w-6 ${isFavorited ? 'fill-current' : ''}`} />
              </div>
            </motion.button>
          )}
        </div>
      </div>
    </Card>
  );
}

export const ProductCard = memo(ProductCardComponent);
