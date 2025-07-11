-- Migration: add apartments value to service_type enum
-- +supabase

-- Add new value to service_type enum if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'service_type' AND e.enumlabel = 'apartments') THEN
    ALTER TYPE service_type ADD VALUE 'apartments';
  END IF;
END$$; 