const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://osvfybbvcdokbcfkmafv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zdmZ5YmJ2Y2Rva2JjZmttYWZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc4MDgwMjQsImV4cCI6MjA0MzM4NDAyNH0.87tNA0w7D0QdYo4AAcDyh_1JoKvjQnx4AM8kZgzgwNI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugIndianaServices() {
  console.log('🔍 Debugging Indiana services...\n');

  try {
    // 1. Get all services in Indiana
    const { data: indianaServices, error: servicesError } = await supabase
      .from('services')
      .select('*')
      .eq('state', 'IN');

    if (servicesError) {
      console.error('Error fetching Indiana services:', servicesError);
      return;
    }

    console.log(`📊 Total services in Indiana: ${indianaServices.length}\n`);

    // 2. Get unique service types in Indiana
    const serviceTypes = [...new Set(indianaServices.map(service => service.service_type))];
    console.log(`🎯 Unique service types in Indiana: ${serviceTypes.length}`);
    console.log('Service types found:', serviceTypes);
    console.log('');

    // 3. Count each service type
    const serviceTypeCounts = {};
    indianaServices.forEach(service => {
      serviceTypeCounts[service.service_type] = (serviceTypeCounts[service.service_type] || 0) + 1;
    });

    console.log('📈 Service type breakdown:');
    Object.entries(serviceTypeCounts).forEach(([type, count]) => {
      console.log(`  ${type}: ${count} services`);
    });
    console.log('');

    // 4. Check what the search query would return
    console.log('🔍 Testing search query (no service type filter):');
    const { data: searchResults, error: searchError } = await supabase
      .from('services')
      .select('*')
      .eq('state', 'IN')
      .order('name')
      .limit(15);

    if (searchError) {
      console.error('Error with search query:', searchError);
    } else {
      console.log(`Search returned ${searchResults.length} results`);
      const searchServiceTypes = [...new Set(searchResults.map(service => service.service_type))];
      console.log('Service types in search results:', searchServiceTypes);
    }

    // 5. Check if there are any data quality issues
    console.log('\n🔍 Data quality check:');
    const nullStates = indianaServices.filter(service => !service.state);
    const emptyNames = indianaServices.filter(service => !service.name);
    
    if (nullStates.length > 0) {
      console.log(`⚠️  ${nullStates.length} services with null state`);
    }
    if (emptyNames.length > 0) {
      console.log(`⚠️  ${emptyNames.length} services with empty names`);
    }

    // 6. Check for any services with unusual service_type values
    const unusualTypes = indianaServices.filter(service => 
      !['dog_park', 'groomer', 'veterinarian', 'contractor', 'dog_trainer', 'daycare', 'dog_sitter', 'dog_walker', 'landscape_contractor', 'apartments'].includes(service.service_type)
    );
    
    if (unusualTypes.length > 0) {
      console.log(`⚠️  ${unusualTypes.length} services with unusual service_type values:`);
      unusualTypes.forEach(service => {
        console.log(`    ${service.name}: ${service.service_type}`);
      });
    }

  } catch (error) {
    console.error('❌ Error during debug:', error);
  }
}

debugIndianaServices(); 