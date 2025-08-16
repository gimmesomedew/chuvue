-- Migration: Fix services_within_radius function to properly calculate distances and filter by radius
-- +supabase

-- Drop the existing function
drop function if exists public.services_within_radius(double precision, double precision, double precision);

-- Create the corrected RPC function
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
  address text,
  city text,
  image_url text,
  rating integer,
  review_count integer,
  is_verified boolean,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  service_url text,
  searchPage_url text,
  gMapsID text,
  website_url text,
  name_description_search text,
  email text,
  facebook_url text,
  instagram_url text,
  twitter_url text,
  featured text,
  contact_phone text,
  geocoding_status text,
  geocoding_error text,
  address_line_2 text,
  needs_geocoding_review boolean,
  distance_miles double precision
) as $$
  select 
    s.*,
    -- Calculate distance using Haversine formula for accurate results
    (
      3958.8 * acos(
        cos(radians(p_lat)) * 
        cos(radians(s.latitude)) * 
        cos(radians(s.longitude) - radians(p_lon)) + 
        sin(radians(p_lat)) * 
        sin(radians(s.latitude))
      )
    ) as distance_miles
  from public.services s
  where 
    -- Only include services with valid coordinates
    s.latitude is not null 
    and s.longitude is not null
    and s.latitude != 0 
    and s.longitude != 0
    -- Filter by actual distance calculation (more accurate than earth_box)
    and (
      3958.8 * acos(
        cos(radians(p_lat)) * 
        cos(radians(s.latitude)) * 
        cos(radians(s.longitude) - radians(p_lon)) + 
        sin(radians(p_lat)) * 
        sin(radians(s.latitude))
      )
    ) <= p_radius_miles
  order by distance_miles asc;
$$ language sql stable;

-- Grant execute permission
grant execute on function public.services_within_radius(double precision, double precision, double precision) to anon, authenticated;
