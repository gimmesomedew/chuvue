const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://osvfybbvcdokbcfkmafv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zdmZ5YmJ2Y2Rva2JjZmttYWZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc4MDgwMjQsImV4cCI6MjA0MzM4NDAyNH0.87tNA0w7D0QdYo4AAcDyh_1JoKvjQnx4AM8kZgzgwNI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugAccurate() {
  console.log('🔍 Accurate Indiana service counts...\n');

  try {
    // Direct SQL queries for accurate counts
    const queries = [
      "SELECT service_type, COUNT(*) as count FROM services WHERE state = 'IN' GROUP BY service_type ORDER BY count DESC",
      "SELECT COUNT(*) as total FROM services WHERE state = 'IN'",
      "SELECT service_type, COUNT(*) as count FROM services WHERE state = 'IN' AND service_type = 'dog_park'",
      "SELECT service_type, COUNT(*) as count FROM services WHERE state = 'IN' AND service_type = 'groomer'",
      "SELECT service_type, COUNT(*) as count FROM services WHERE state = 'IN' AND service_type = 'veterinarian'",
      "SELECT service_type, COUNT(*) as count FROM services WHERE state = 'IN' AND service_type = 'dog_trainer'"
    ];

    for (let i = 0; i < queries.length; i++) {
      const { data, error } = await supabase.rpc('exec_sql', { sql: queries[i] });
      
      if (error) {
        console.log(`Query ${i + 1} error:`, error.message);
      } else {
        console.log(`Query ${i + 1} result:`, data);
      }
    }

    // Alternative approach using Supabase queries
    console.log('\n📊 Using Supabase queries:');
    
    // Get all service types in Indiana
    const { data: indianaServices, error } = await supabase
      .from('services')
      .select('service_type')
      .eq('state', 'IN');

    if (error) {
      console.error('Error:', error);
      return;
    }

    // Count each service type
    const counts = {};
    indianaServices.forEach(service => {
      counts[service.service_type] = (counts[service.service_type] || 0) + 1;
    });

    console.log('Service type counts in Indiana:');
    Object.entries(counts).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });

    console.log(`\nTotal services in Indiana: ${indianaServices.length}`);
    console.log(`Unique service types: ${Object.keys(counts).length}`);

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

debugAccurate(); 