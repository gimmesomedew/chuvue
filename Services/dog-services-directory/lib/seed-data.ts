import { supabase } from './supabase';

// Sample service definitions data
const sampleServiceDefinitions = [
  {
    service_name: 'Boarding & Daycare',
    service_value: 'boarding_daycare',
    service_description: 'Dog boarding and daycare facilities',
    badge_color: 'teal'
  },
  {
    service_name: 'Dog Parks',
    service_value: 'dog_park',
    service_description: 'Off-leash dog parks and recreational areas for dogs',
    badge_color: 'emerald'
  },
  {
    service_name: 'Dog Trainers',
    service_value: 'dog_trainer',
    service_description: 'Professional dog training services',
    badge_color: 'pink'
  },
  {
    service_name: 'Groomers',
    service_value: 'groomer',
    service_description: 'Professional dog grooming services',
    badge_color: 'purple'
  },
  {
    service_name: 'Holistic Veterinarians',
    service_value: 'veterinarian',
    service_description: 'Holistic veterinary care and services',
    badge_color: 'blue'
  },
  {
    service_name: 'Other',
    service_value: 'other',
    service_description: 'Other pet-related services',
    badge_color: 'cyan'
  },
  {
    service_name: 'Pet Products',
    service_value: 'pet_products',
    service_description: 'Pet supplies and retail products',
    badge_color: 'amber'
  }
];

// Sample service data
const sampleServices = [
  {
    name: 'Central Bark Dog Park',
    description: 'A spacious off-leash dog park with separate areas for small and large dogs, agility equipment, and water stations.',
    service_value: 'dog_park',
    address: '123 Dogwood Lane',
    city: 'Indianapolis',
    state: 'Indiana',
    zip_code: '46220',
    latitude: 39.8282,
    longitude: -86.1384,
    image_url: '/images/dog-park.svg',
    rating: 4.5,
    review_count: 28,
    is_verified: true,
    website_url: 'https://example.com/centralbark',
    email: 'info@centralbark.com'
  },
  {
    name: 'Pawfect Grooming',
    description: 'Professional grooming services including baths, haircuts, nail trimming, and special treatments for all dog breeds.',
    service_value: 'groomer',
    address: '456 Furry Street',
    city: 'Carmel',
    state: 'Indiana',
    zip_code: '46032',
    latitude: 39.9784,
    longitude: -86.1180,
    image_url: '/images/groomer.svg',
    rating: 4.8,
    review_count: 42,
    is_verified: true,
    website_url: 'https://example.com/pawfect',
    email: 'appointments@pawfect.com'
  },
  {
    name: 'Healing Hands Holistic Vet',
    description: 'Holistic veterinary care providing comprehensive medical care, acupuncture, and natural remedies.',
    service_value: 'veterinarian',
    address: '789 Vet Way',
    city: 'Indianapolis',
    state: 'Indiana',
    zip_code: '46208',
    latitude: 39.8267,
    longitude: -86.1747,
    image_url: '/images/vet.svg',
    rating: 4.9,
    review_count: 56,
    is_verified: true,
    website_url: 'https://example.com/healinghands',
    email: 'care@healinghands.com'
  },
  {
    name: 'Happy Tails Boarding & Daycare',
    description: 'Luxury dog boarding and daycare facility with spacious play areas and 24/7 supervision.',
    service_value: 'boarding_daycare',
    address: '101 Kennel Drive',
    city: 'Fishers',
    state: 'Indiana',
    zip_code: '46038',
    latitude: 39.9589,
    longitude: -86.0146,
    image_url: '/images/boarding.svg',
    rating: 4.7,
    review_count: 38,
    is_verified: true,
    website_url: 'https://example.com/happytails',
    email: 'stay@happytails.com'
  },
  {
    name: 'Canine Training Academy',
    description: 'Professional dog training services offering obedience classes, behavior modification, and specialized training programs.',
    service_value: 'dog_trainer',
    address: '222 Obedience Road',
    city: 'Noblesville',
    state: 'Indiana',
    zip_code: '46060',
    latitude: 40.0456,
    longitude: -86.0085,
    image_url: '/images/training.svg',
    rating: 4.6,
    review_count: 31,
    is_verified: true,
    website_url: 'https://example.com/caninetraining',
    email: 'train@canineacademy.com'
  }
];

/**
 * Seed the service_definitions table with sample data
 * @returns Promise<void>
 */
export async function seedServiceDefinitions(): Promise<void> {
  try {
    console.log('Seeding service_definitions table...');
    
    // First, check if service definitions already exist
    const { count, error: countError } = await supabase
      .from('service_definitions')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('Error checking service_definitions count:', countError);
      return;
    }
    
    if (count && count > 0) {
      console.log(`Service_definitions table already has ${count} records. Skipping seed.`);
      return;
    }
    
    // Insert sample service definitions
    const { data, error } = await supabase
      .from('service_definitions')
      .insert(sampleServiceDefinitions);
    
    if (error) {
      console.error('Error seeding service_definitions:', error);
      return;
    }
    
    console.log(`Successfully seeded ${sampleServiceDefinitions.length} service definitions.`);
  } catch (error) {
    console.error('Error in seedServiceDefinitions:', error);
  }
}

/**
 * Seed the services table with sample data
 * @returns Promise<void>
 */
export async function seedServices(): Promise<void> {
  try {
    console.log('Seeding services table...');
    
    // First, check if services already exist
    const { count, error: countError } = await supabase
      .from('services')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('Error checking services count:', countError);
      return;
    }
    
    if (count && count > 0) {
      console.log(`Services table already has ${count} records. Skipping seed.`);
      return;
    }
    
    // Insert sample services
    const { data, error } = await supabase
      .from('services')
      .insert(sampleServices);
    
    if (error) {
      console.error('Error seeding services:', error);
      return;
    }
    
    console.log(`Successfully seeded ${sampleServices.length} services.`);
  } catch (error) {
    console.error('Error in seedServices:', error);
  }
}

/**
 * Seed both service_definitions and services tables
 * @returns Promise<void>
 */
export async function seedAllData(): Promise<void> {
  try {
    console.log('Seeding all data...');
    
    // Seed service definitions first
    await seedServiceDefinitions();
    
    // Then seed services
    await seedServices();
    
    console.log('All data seeded successfully!');
  } catch (error) {
    console.error('Error seeding all data:', error);
  }
}
