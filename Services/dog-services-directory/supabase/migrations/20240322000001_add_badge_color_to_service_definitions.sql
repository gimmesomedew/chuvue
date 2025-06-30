-- Add badge_color column to service_definitions table
ALTER TABLE service_definitions ADD COLUMN badge_color text NOT NULL DEFAULT 'gray';

-- Update existing service definitions with appropriate colors
UPDATE service_definitions
SET badge_color = CASE service_value
  WHEN 'dog_park' THEN 'emerald'
  WHEN 'veterinarian' THEN 'blue'
  WHEN 'grooming' THEN 'purple'
  WHEN 'boarding' THEN 'amber'
  WHEN 'training' THEN 'indigo'
  WHEN 'daycare' THEN 'pink'
  WHEN 'walking' THEN 'green'
  WHEN 'sitting' THEN 'orange'
  WHEN 'rescue' THEN 'red'
  WHEN 'supplies' THEN 'cyan'
  WHEN 'photography' THEN 'violet'
  WHEN 'transport' THEN 'teal'
  ELSE 'gray'
END; 