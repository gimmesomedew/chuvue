const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://osvfybbvcdokbcfkmafv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zdmZ5YmJ2Y2Rva2JjZmttYWZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc4MDgwMjQsImV4cCI6MjA0MzM4NDAyNH0.87tNA0w7D0QdYo4AAcDyh_1JoKvjQnx4AM8kZgzgwNI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugNewSorting() {
  console.log('🔍 Testing new sorting (service_type first, then name)...\n');

  try {
    // Test the new sorting order
    const { data: newSorted, error } = await supabase
      .from('services')
      .select('*')
      .eq('state', 'IN')
      .order('service_type')
      .order('name')
      .range(0, 14);

    if (error) {
      console.error('Error:', error);
      return;
    }

    console.log(`First 15 results with new sorting: ${newSorted.length} services`);
    
    // Check service types in first page
    const serviceTypes = [...new Set(newSorted.map(service => service.service_type))];
    console.log('Service types in first page:', serviceTypes);
    
    // Show first few services
    console.log('\nFirst 10 services with new sorting:');
    newSorted.slice(0, 10).forEach(service => {
      console.log(`  ${service.name} (${service.service_type})`);
    });

    // Count service types in first 15
    const breakdown = {};
    newSorted.forEach(service => {
      breakdown[service.service_type] = (breakdown[service.service_type] || 0) + 1;
    });
    
    console.log('\nService type breakdown in first 15:');
    Object.entries(breakdown).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });

    // Check if dog_park appears in first 15
    const hasDogPark = newSorted.some(service => service.service_type === 'dog_park');
    console.log(`\nDog parks in first 15: ${hasDogPark ? '✅ Yes' : '❌ No'}`);

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

debugNewSorting(); 