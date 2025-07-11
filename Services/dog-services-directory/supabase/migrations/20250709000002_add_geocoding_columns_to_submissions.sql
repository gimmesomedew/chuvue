-- Migration: add geocoding_status and geocoding_error columns to service_submissions
-- +supabase

alter table service_submissions
  add column if not exists geocoding_status text,
  add column if not exists geocoding_error text; 