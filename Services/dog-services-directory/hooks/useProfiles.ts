'use client';

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ProfileData } from '@/types/profile';
import { showToast } from '@/lib/toast';

type UseProfilesOptions = {
  pageSize?: number;
  initialPage?: number;
  filter?: string;
  sortBy?: string;
  searchQuery?: string;
};

export function useProfiles(options: UseProfilesOptions = {}) {
  const {
    pageSize = 12,
    initialPage = 1,
    filter = 'all',
    sortBy = 'created_at',
    searchQuery = ''
  } = options;

  const [profiles, setProfiles] = useState<ProfileData[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<ProfileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(initialPage);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  // Filter and sort profiles
  useEffect(() => {
    let result = [...profiles];

    // Apply role filter
    if (filter !== 'all') {
      result = result.filter(profile => profile.role === filter);
    }

    // Apply search filter if query exists
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(profile => {
        const name = (profile.pet_name || profile.name || profile.username || '').toLowerCase();
        const location = (profile.location || profile.city || profile.state || '').toLowerCase();
        const bio = (profile.bio || profile.about || '').toLowerCase();
        const breed = (profile.pet_breed || '').toLowerCase();
        
        return name.includes(query) || 
               location.includes(query) || 
               bio.includes(query) || 
               breed.includes(query);
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          const nameA = (a.pet_name || a.name || a.username || '').toLowerCase();
          const nameB = (b.pet_name || b.name || b.username || '').toLowerCase();
          return nameA.localeCompare(nameB);
        case 'location':
          const locationA = (a.location || a.city || '').toLowerCase();
          const locationB = (b.location || b.city || '').toLowerCase();
          return locationA.localeCompare(locationB);
        case 'created_at':
        default:
          // Newest first
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
      }
    });

    setFilteredProfiles(result);
    setTotalCount(result.length);
    setHasMore(result.length > page * pageSize);
  }, [profiles, filter, sortBy, searchQuery, page, pageSize]);

  // Get paginated profiles
  const getPaginatedProfiles = useCallback(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return filteredProfiles.slice(start, end);
  }, [filteredProfiles, page, pageSize]);

  // Fetch all profiles
  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // First, let's check what columns actually exist in the profiles table
      const { data: profileColumns, error: columnsError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);
        
      if (columnsError) {
        console.error('Error checking profile columns:', columnsError);
        throw columnsError;
      }
      
      console.log('Profile table structure:', profileColumns);
      
      // Now fetch all profiles with the correct column names
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) throw error;
      
      if (data) {
        console.log('Fetched profiles:', data);
        // Filter out profiles that don't have a pet_name
        const filteredData = data.filter(profile => profile.pet_name);
        console.log('Filtered profiles (with pet_name):', filteredData);
        setProfiles(filteredData);
      } else {
        // Fallback to mock data if no real data is available
        // All mock profiles have pet names to ensure consistency with our filtering
        const mockProfiles: ProfileData[] = [
          {
            id: '1',
            pet_name: 'Abby',
            location: 'Westfield, IN',
            pet_photos: [
              'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400&auto=format&fit=crop'
            ],
            bio: 'Abby is my very best friend. We love taking walks together and meeting new friends at the dog park.',
            role: 'pet_owner',
            tags: ['Fetch'],
            pet_breed: 'Golden Retriever',
            pet_favorite_tricks: 'Fetch, roll over, and high five!',
            created_at: '2025-01-15T00:00:00.000Z'
          },
          {
            id: '2',
            pet_name: 'Chloe',
            location: 'Carmel, IN',
            pet_photos: [
              'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=400&auto=format&fit=crop'
            ],
            bio: 'Chloe is a wonderful companion. She loves to lay in the sun and play with her toys.',
            role: 'pet_owner',
            tags: ['Fetch', 'Swimming'],
            pet_breed: 'Schnauzer',
            pet_favorite_tricks: 'Swimming and playing with toys',
            created_at: '2025-01-20T00:00:00.000Z'
          },
          {
            id: '3',
            pet_name: 'Louis',
            location: 'Fishers, IN',
            pet_photos: [
              'https://images.unsplash.com/photo-1583511655826-05700442982d?q=80&w=400&auto=format&fit=crop'
            ],
            bio: 'Louis is the quintessential boxer. He loves roughhousing with other dogs.',
            role: 'pet_owner',
            tags: ['Frisbee'],
            pet_breed: 'Boxer',
            pet_favorite_tricks: 'Catching frisbees and jumping',
            created_at: '2025-02-10T00:00:00.000Z'
          },
          {
            id: '4',
            pet_name: 'AJ',
            location: 'Carmel, IN',
            pet_photos: [
              'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=400&auto=format&fit=crop'
            ],
            bio: 'AJ is a great companion. I love to take walks. We also like to wrestle and play fetch.',
            role: 'pet_owner',
            tags: ['Swimming'],
            pet_breed: 'Schnauzer',
            pet_favorite_tricks: 'Swimming and diving',
            created_at: '2025-02-15T00:00:00.000Z'
          },
          {
            id: '5',
            pet_name: 'Stanley',
            location: 'Fishers, IN',
            pet_photos: [
              'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?q=80&w=400&auto=format&fit=crop'
            ],
            bio: 'Stanley is a playful and loyal mixed breed with a heart of gold and a love for adventure.',
            role: 'pet_owner',
            tags: ['Fetch', 'Slobber'],
            pet_breed: 'Mixed Breed',
            pet_favorite_tricks: 'Fetching sticks and digging holes',
            created_at: '2025-03-01T00:00:00.000Z'
          }
        ];
        setProfiles(mockProfiles);
      }
    } catch (err) {
      console.error('Error fetching profiles:', err);
      setError(err as Error);
      showToast.error('Failed to load profiles. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a single profile by ID
  const fetchProfileById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return data as ProfileData;
    } catch (err) {
      console.error(`Error fetching profile with ID ${id}:`, err);
      setError(err as Error);
      showToast.error('Failed to load profile. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    profiles: getPaginatedProfiles(),
    allProfiles: profiles,
    filteredProfiles,
    loading,
    error,
    page,
    setPage,
    totalCount,
    hasMore,
    pageSize,
    fetchProfiles,
    fetchProfileById
  };
}
