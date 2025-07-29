const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://osvfybbvcdokbcfkmafv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zdmZ5YmJ2Y2Rva2JjZmttYWZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc4MDgwMjQsImV4cCI6MjA0MzM4NDAyNH0.87tNA0w7D0QdYo4AAcDyh_1JoKvjQnx4AM8kZgzgwNI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugComprehensive() {
  console.log('🔍 Comprehensive database debug...\n');

  try {
    // 1. Check total services count
    const { count: totalServices, error: countError } = await supabase
      .from('services')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error counting services:', countError);
    } else {
      console.log(`📊 Total services in database: ${totalServices}\n`);
    }

    // 2. Check all unique service types
    const { data: allServices, error: allError } = await supabase
      .from('services')
      .select('service_type, state, name')
      .not('service_type', 'is', null);

    if (allError) {
      console.error('Error fetching all services:', allError);
      return;
    }

    const serviceTypeCounts = {};
    const stateServiceTypes = {};
    
    allServices.forEach(service => {
      // Count by service type
      serviceTypeCounts[service.service_type] = (serviceTypeCounts[service.service_type] || 0) + 1;
      
      // Count by state and service type
      if (!stateServiceTypes[service.state]) {
        stateServiceTypes[service.state] = new Set();
      }
      stateServiceTypes[service.state].add(service.service_type);
    });

    console.log('🎯 Service types across all states:');
    Object.entries(serviceTypeCounts).forEach(([type, count]) => {
      console.log(`  ${type}: ${count} services`);
    });
    console.log('');

    // 3. Check Indiana specifically
    const indianaServices = allServices.filter(service => service.state === 'IN');
    const indianaServiceTypes = [...new Set(indianaServices.map(s => s.service_type))];
    
    console.log(`🏠 Indiana services: ${indianaServices.length}`);
    console.log('Indiana service types:', indianaServiceTypes);
    console.log('');

    // 4. Check a few sample services to see their actual data
    console.log('📋 Sample services from Indiana:');
    indianaServices.slice(0, 5).forEach(service => {
      console.log(`  ${service.name} (${service.service_type}) - ${service.state}`);
    });
    console.log('');

    // 5. Check if there are any services with problematic service_type values
    const { data: problematicServices, error: probError } = await supabase
      .from('services')
      .select('*')
      .or('service_type.is.null,service_type.eq.,service_type.eq.null');

    if (probError) {
      console.log('Error checking problematic services:', probError.message);
    } else if (problematicServices.length > 0) {
      console.log(`⚠️  ${problematicServices.length} services with problematic service_type values`);
      problematicServices.slice(0, 3).forEach(service => {
        console.log(`  ${service.name}: service_type = "${service.service_type}"`);
      });
    }

    // 6. Check what the actual search query returns
    console.log('\n🔍 Testing the actual search query:');
    const { data: searchTest, error: searchError } = await supabase
      .from('services')
      .select('*')
      .eq('state', 'IN')
      .order('name')
      .limit(20);

    if (searchError) {
      console.error('Search test error:', searchError);
    } else {
      console.log(`Search test returned ${searchTest.length} results`);
      const searchTypes = [...new Set(searchTest.map(s => s.service_type))];
      console.log('Service types in search results:', searchTypes);
    }

  } catch (error) {
    console.error('❌ Error during comprehensive debug:', error);
  }
}

debugComprehensive(); 