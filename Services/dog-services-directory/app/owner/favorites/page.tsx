'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Service } from '@/lib/types';
import { ServiceCard } from '@/components/search/ServiceCard';
import { ServicesMap } from '@/components/maps/ServicesMap';
import { Button } from '@/components/ui/button';
import { LayoutGrid, Map as MapIcon } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

export default function FavoritesPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [favorites, setFavorites] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'cards' | 'map'>('cards');

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/auth/login?redirect=/owner/favorites');
        return;
      }
      fetchFavorites();
    }
  }, [authLoading, user]);

  const fetchFavorites = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('services(*)')
        .eq('user_id', user.id);
      if (error) throw error;
      const svcs = (data || []).map((row: any) => row.services as Service).filter(Boolean);
      setFavorites(svcs);
    } catch (err) {
      console.error('Error loading favorites', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-6xl space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Favorite Services</h1>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Card view"
                  onClick={() => setView('cards')}
                  className={view === 'cards' ? 'bg-emerald-50 text-emerald-600' : ''}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Grid View</p></TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Map view"
                  onClick={() => setView('map')}
                  className={view === 'map' ? 'bg-emerald-50 text-emerald-600' : ''}
                >
                  <MapIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Map View</p></TooltipContent>
            </Tooltip>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : favorites.length === 0 ? (
          <p className="text-center text-gray-500">You have no favorite services.</p>
        ) : view === 'map' ? (
          <ServicesMap services={favorites} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((svc) => (
              <ServiceCard
                key={svc.id}
                service={svc}
                sortByDistance={false}
                userLocation={null}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
} 