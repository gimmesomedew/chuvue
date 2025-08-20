import { useState, useEffect } from 'react';

export function useProductFavorites() {
  const [favoritedProducts, setFavoritedProducts] = useState<number[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('productFavorites');
    if (stored) {
      try {
        setFavoritedProducts(JSON.parse(stored));
      } catch (error) {
        console.error('Error parsing stored product favorites:', error);
        setFavoritedProducts([]);
      }
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('productFavorites', JSON.stringify(favoritedProducts));
  }, [favoritedProducts]);

  const toggleFavorite = (productId: number) => {
    setFavoritedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const isFavorited = (productId: number) => {
    return favoritedProducts.includes(productId);
  };

  const clearFavorites = () => {
    setFavoritedProducts([]);
  };

  return {
    favoritedProducts,
    toggleFavorite,
    isFavorited,
    clearFavorites,
  };
}
