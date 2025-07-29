const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://osvfybbvcdokbcfkmafv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zdmZ5YmJ2Y2Rva2JjZmttYWZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc4MDgwMjQsImV4cCI6MjA0MzM4NDAyNH0.87tNA0w7D0QdYo4AAcDyh_1JoKvjQnx4AM8kZgzgwNI';

const supabase = createClient(supabaseUrl, supabaseKey);

// Copy the normalizeServiceType function
function normalizeServiceType(serviceType) {
  const serviceTypeMap = {
    'dog parks': 'dog_park',
    'dog park': 'dog_park',
    'groomers': 'groomer',
    'groomer': 'groomer',
    'veterinarians': 'veterinarian',
    'veterinarian': 'veterinarian',
    'holistic veterinarians': 'veterinarian',
    'holistic veterinarian': 'veterinarian',
    'vets': 'veterinarian',
    'vet': 'veterinarian',
    'dog trainers': 'dog_trainer',
    'dog trainer': 'dog_trainer',
    'trainers': 'dog_trainer',
    'trainer': 'dog_trainer',
    'daycare': 'daycare',
    'day care': 'daycare',
    'dog sitters': 'dog_sitter',
    'dog sitter': 'dog_sitter',
    'sitters': 'dog_sitter',
    'sitter': 'dog_sitter',
    'dog walkers': 'dog_walker',
    'dog walker': 'dog_walker',
    'walkers': 'dog_walker',
    'walker': 'dog_walker',
    'contractors': 'contractor',
    'contractor': 'contractor',
    'landscape contractors': 'landscape_contractor',
    'landscape contractor': 'landscape_contractor',
    'apartments': 'apartments',
    'apartment': 'apartments',
  };

  const normalized = serviceType.toLowerCase().trim();
  
  if (serviceTypeMap[normalized]) {
    return serviceTypeMap[normalized];
  }
  
  return normalized.replace(/\s+/g, '_');
}

async function debugSearch() {
  console.log('🔍 Testing searchServices function...\n');

  try {
    // Test 1: Search for everything in Indiana (no service type)
    console.log('Test 1: Search for everything in Indiana');
    
    // First, get the total count without pagination
    let countQuery = supabase
      .from('services')
      .select('*', { count: 'exact', head: true })
      .eq('state', 'IN');

    const { count, error: countError } = await countQuery;
    
    if (countError) {
      console.error('Count error:', countError);
      return;
    }

    console.log(`Total count for Indiana: ${count}`);

    // Now get the actual data with pagination
    let dataQuery = supabase
      .from('services')
      .select('*')
      .eq('state', 'IN')
      .range(0, 14) // First 15 results
      .order('name');

    const { data, error } = await dataQuery;

    if (error) {
      console.error('Data error:', error);
      return;
    }

    console.log(`Returned ${data.length} results`);
    
    // Check service types in results
    const serviceTypes = [...new Set(data.map(service => service.service_type))];
    console.log('Service types in first 15 results:', serviceTypes);

    // Test 2: Check if there are any dog_park services in Indiana
    console.log('\nTest 2: Check for dog_park services in Indiana');
    
    const { data: dogParks, error: dogParkError } = await supabase
      .from('services')
      .select('*')
      .eq('state', 'IN')
      .eq('service_type', 'dog_park')
      .limit(5);

    if (dogParkError) {
      console.error('Dog park error:', dogParkError);
    } else {
      console.log(`Found ${dogParks.length} dog_park services in Indiana`);
      if (dogParks.length > 0) {
        console.log('Sample dog park:', dogParks[0].name);
      }
    }

    // Test 3: Check all service types in Indiana
    console.log('\nTest 3: All service types in Indiana');
    
    const { data: allIndiana, error: allError } = await supabase
      .from('services')
      .select('service_type')
      .eq('state', 'IN');

    if (allError) {
      console.error('All Indiana error:', allError);
    } else {
      const allServiceTypes = [...new Set(allIndiana.map(s => s.service_type))];
      console.log('All service types in Indiana:', allServiceTypes);
      
      // Count each type
      const counts = {};
      allIndiana.forEach(service => {
        counts[service.service_type] = (counts[service.service_type] || 0) + 1;
      });
      
      console.log('Counts by service type:');
      Object.entries(counts).forEach(([type, count]) => {
        console.log(`  ${type}: ${count}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

debugSearch(); 