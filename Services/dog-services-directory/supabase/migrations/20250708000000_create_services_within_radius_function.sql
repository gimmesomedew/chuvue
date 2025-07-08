-- Migration: enable earthdistance and create services_within_radius RPC
-- +supabase

-- Enable required extensions
create extension if not exists cube;
create extension if not exists earthdistance;

-- Drop function if it exists to allow redefinition
drop function if exists public.services_within_radius(double precision, double precision, double precision);

-- Create the RPC function
create or replace function public.services_within_radius(
  p_lat double precision,
  p_lon double precision,
  p_radius_miles double precision default 25
) returns table (
  id uuid,
  name text,
  service_type text,
  description text,
  latitude double precision,
  longitude double precision,
  state text,
  zip_code text,
  -- Adjust columns below to match the actual schema
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  distance_miles double precision
) as $$
  select s.*, 
         earth_distance(ll_to_earth(p_lat, p_lon), ll_to_earth(s.latitude, s.longitude)) / 1609.34 as distance_miles
    from public.services s
   where earth_box(ll_to_earth(p_lat, p_lon), p_radius_miles * 1609.34)
         @> ll_to_earth(s.latitude, s.longitude);
$$ language sql stable;

-- Grant execute permission to anon & authenticated roles if needed
-- grant execute on function public.services_within_radius to anon, authenticated; 