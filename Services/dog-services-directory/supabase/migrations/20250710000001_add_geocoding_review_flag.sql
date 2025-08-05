-- Migration: add needs_geocoding_review flag to services and service_submissions tables
-- +supabase

-- Add needs_geocoding_review column to services table
alter table services
  add column if not exists needs_geocoding_review boolean default false;

-- Add needs_geocoding_review column to service_submissions table
alter table service_submissions
  add column if not exists needs_geocoding_review boolean default false;

-- Add comments to document the new columns
comment on column services.needs_geocoding_review is 'Flag indicating if coordinates need manual review by a reviewer';
comment on column service_submissions.needs_geocoding_review is 'Flag indicating if coordinates need manual review by a reviewer'; 