import { useState, useEffect } from 'react';
import { ProductCategory } from '@/lib/types';

export function useProductCategories() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/product-categories');
        if (!response.ok) {
          throw new Error('Failed to fetch product categories');
        }
        
        const data = await response.json();
        setCategories(data.categories || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        // Fallback to default categories if API fails
        setCategories([
          { id: 1, name: 'Nutritional, Food, Supplements', description: 'Food and nutritional supplements for dogs', color: '#10B981', created_at: new Date().toISOString() },
          { id: 2, name: 'Calming', description: 'Products to help calm anxious dogs', color: '#8B5CF6', created_at: new Date().toISOString() },
          { id: 3, name: 'Immune Support', description: 'Products to boost immune system', color: '#F59E0B', created_at: new Date().toISOString() },
          { id: 4, name: 'Multi-Vitamin Supplements', description: 'Multi-vitamin products', color: '#3B82F6', created_at: new Date().toISOString() },
          { id: 5, name: 'Anti-Inflammatory, Anti-Itch', description: 'Products for inflammation and itching', color: '#EF4444', created_at: new Date().toISOString() },
          { id: 6, name: 'Skin and Wound Care', description: 'Products for skin health and wound healing', color: '#EC4899', created_at: new Date().toISOString() },
          { id: 7, name: 'Teeth and Dental Care', description: 'Dental hygiene products', color: '#06B6D4', created_at: new Date().toISOString() },
          { id: 8, name: 'Gear', description: 'Equipment, toys, and accessories', color: '#6366F1', created_at: new Date().toISOString() },
          { id: 9, name: 'Red Light Therapy', description: 'Therapeutic red light products', color: '#DC2626', created_at: new Date().toISOString() },
          { id: 10, name: 'Other', description: 'Miscellaneous products', color: '#6B7280', created_at: new Date().toISOString() }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
}
