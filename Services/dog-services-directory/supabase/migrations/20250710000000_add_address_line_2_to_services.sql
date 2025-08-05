-- Migration: add address_line_2 column to services table
-- +supabase

-- Add address_line_2 column to services table
alter table services
  add column if not exists address_line_2 text;

-- Add address_line_2 column to service_submissions table for consistency
alter table service_submissions
  add column if not exists address_line_2 text;

-- Add comment to document the new column
comment on column services.address_line_2 is 'Optional second address line for apartment numbers, suite numbers, etc.';
comment on column service_submissions.address_line_2 is 'Optional second address line for apartment numbers, suite numbers, etc.'; 