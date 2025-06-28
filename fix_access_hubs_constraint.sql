-- Fix access_hubs table constraint issue
-- The error shows that there's a constraint named "events_tier_restriction_check" 
-- being applied to the access_hubs table, which is incorrect.

-- First, let's check what constraints exist on the access_hubs table
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'access_hubs'::regclass;

-- Drop the incorrect constraint if it exists
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'events_tier_restriction_check' 
        AND conrelid = 'access_hubs'::regclass
    ) THEN
        ALTER TABLE access_hubs DROP CONSTRAINT events_tier_restriction_check;
        RAISE NOTICE 'Dropped incorrect constraint: events_tier_restriction_check';
    END IF;
END $$;

-- Also drop any existing access_hubs tier_restriction constraint to avoid conflicts
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'access_hubs_tier_restriction_check' 
        AND conrelid = 'access_hubs'::regclass
    ) THEN
        ALTER TABLE access_hubs DROP CONSTRAINT access_hubs_tier_restriction_check;
        RAISE NOTICE 'Dropped existing constraint: access_hubs_tier_restriction_check';
    END IF;
END $$;

-- Create the correct constraint for access_hubs tier_restriction
-- Based on the code, the valid tiers are:
-- 'Free Member', 'Associate Member', 'Full Member', 'Gold Member', 'Premium Member'
ALTER TABLE access_hubs 
ADD CONSTRAINT access_hubs_tier_restriction_check 
CHECK (tier_restriction IN (
    'Free Member',
    'Associate Member', 
    'Full Member',
    'Gold Member',
    'Premium Member'
));

-- Verify the constraint was created correctly
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'access_hubs'::regclass 
AND conname = 'access_hubs_tier_restriction_check';

-- Test the constraint with a sample insert
-- This should work now
INSERT INTO access_hubs (
  title,
  description,
  is_available,
  images,
  amenities,
  country,
  pricing_per_day,
  city,
  capacity,
  space_type,
  tier_restriction,
  created_at,
  updated_at,
  created_by
) VALUES (
  'Test Hub',
  'A test access hub to verify the constraint is working correctly.',
  true,
  '[]'::jsonb,
  '["WiFi", "Coffee"]'::jsonb,
  'Test Country',
  50,
  'Test City',
  20,
  'Test Space',
  'Premium Member',
  NOW(),
  NOW(),
  '00000000-0000-0000-0000-000000000001'::uuid
);

-- Clean up the test record
DELETE FROM access_hubs WHERE title = 'Test Hub';

RAISE NOTICE 'Constraint fix completed successfully!'; 