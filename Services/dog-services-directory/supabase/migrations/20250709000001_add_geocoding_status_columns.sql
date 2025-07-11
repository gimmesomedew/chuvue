-- Migration: add geocoding_status and geocoding_error columns to services
-- +supabase

alter table services
  add column if not exists geocoding_status text,
  add column if not exists geocoding_error text; 