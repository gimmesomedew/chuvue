import { supabase } from './supabase';

// Sample service data
const sampleServices = [
  {
    name: 'Central Bark Dog Park',
    description: 'A spacious off-leash dog park with separate areas for small and large dogs, agility equipment, and water stations.',
    service_type: 'dog_park',
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
    service_type: 'grooming',
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
    name: 'Healing Hands Veterinary',
    description: 'Full-service veterinary hospital providing comprehensive medical care, surgery, and preventative services.',
    service_type: 'veterinarian',
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
    name: 'Happy Tails Boarding',
    description: 'Luxury dog boarding facility with spacious kennels, play areas, and 24/7 supervision for your furry friend.',
    service_type: 'boarding',
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
    service_type: 'training',
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
