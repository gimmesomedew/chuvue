const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://osvfybbvcdokbcfkmafv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zdmZ5YmJ2Y2Rva2JjZmttYWZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc4MDgwMjQsImV4cCI6MjA0MzM4NDAyNH0.87tNA0w7D0QdYo4AAcDyh_1JoKvjQnx4AM8kZgzgwNI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugServiceDefinitions() {
  console.log('🔍 Debugging service definitions...\n');

  try {
    // Get all service definitions
    const { data: serviceDefinitions, error: defError } = await supabase
      .from('service_definitions')
      .select('*')
      .order('service_name');

    if (defError) {
      console.error('Error fetching service definitions:', defError);
      return;
    }

    console.log(`📊 Total service definitions: ${serviceDefinitions.length}\n`);
    console.log('🎯 All available service types:');
    serviceDefinitions.forEach(def => {
      console.log(`  ${def.service_name} (${def.service_type})`);
    });
    console.log('');

    // Check what service types exist across all states
    const { data: allServices, error: allError } = await supabase
      .from('services')
      .select('service_type')
      .not('service_type', 'is', null);

    if (allError) {
      console.error('Error fetching all services:', allError);
      return;
    }

    const allServiceTypes = [...new Set(allServices.map(service => service.service_type))];
    console.log(`🌍 Service types found across all states: ${allServiceTypes.length}`);
    console.log('Service types:', allServiceTypes);
    console.log('');

    // Check what's missing in Indiana
    const indianaServiceTypes = ['groomer', 'dog_trainer', 'veterinarian', 'dog_park'];
    const missingInIndiana = allServiceTypes.filter(type => !indianaServiceTypes.includes(type));
    
    if (missingInIndiana.length > 0) {
      console.log('❌ Service types missing in Indiana:');
      missingInIndiana.forEach(type => {
        console.log(`  ${type}`);
      });
    } else {
      console.log('✅ Indiana has all service types that exist in the database');
    }

    // Check if there are any services with null or empty service_type
    const { data: nullServiceTypes, error: nullError } = await supabase
      .from('services')
      .select('*')
      .or('service_type.is.null,service_type.eq.');

    if (nullError) {
      console.error('Error checking null service types:', nullError);
    } else if (nullServiceTypes.length > 0) {
      console.log(`⚠️  ${nullServiceTypes.length} services with null or empty service_type`);
    }

  } catch (error) {
    console.error('❌ Error during debug:', error);
  }
}

debugServiceDefinitions(); 