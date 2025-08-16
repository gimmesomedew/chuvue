require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Test coordinates for Fishers, Indiana
const TEST_COORDS = {
  latitude: 39.9567,
  longitude: -85.9550,
  radiusMiles: 25
};

async function testFixedFunction() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  console.log('🔍 Testing Fixed Geolocation Function...');
  console.log('📍 Test Location:', TEST_COORDS);
  console.log('');

  try {
    // Test the fixed function
    console.log('📊 Testing fixed services_within_radius function...');
    const { data, error } = await supabase.rpc('services_within_radius', {
      p_lat: TEST_COORDS.latitude,
      p_lon: TEST_COORDS.longitude,
      p_radius_miles: TEST_COORDS.radiusMiles
    });

    if (error) {
      console.error('❌ Function Error:', error);
      return;
    }

    console.log(`✅ Function Results: ${data?.length || 0} services found`);
    
    if (data && data.length > 0) {
      // Check if distance field is working
      const firstResult = data[0];
      console.log('\n📍 First Result:');
      console.log(`   Name: ${firstResult.name}`);
      console.log(`   Service Type: ${firstResult.service_type}`);
      console.log(`   Distance: ${firstResult.distance_miles || 'undefined'} miles`);
      
      if (firstResult.distance_miles !== undefined) {
        console.log('✅ SUCCESS: Distance field is working!');
      } else {
        console.log('❌ FAILED: Distance field is still undefined');
      }

      // Check if results are properly filtered by radius
      const maxDistance = Math.max(...data.map(s => s.distance_miles || 0));
      const minDistance = Math.min(...data.map(s => s.distance_miles || 0));
      
      console.log(`\n📏 Distance Range: ${minDistance.toFixed(2)} to ${maxDistance.toFixed(2)} miles`);
      
      if (maxDistance <= TEST_COORDS.radiusMiles) {
        console.log('✅ SUCCESS: All results are within the specified radius!');
      } else {
        console.log(`❌ FAILED: Found results outside ${TEST_COORDS.radiusMiles}-mile radius`);
      }

      // Show sample results with distances
      console.log('\n📍 Sample Results (first 5):');
      data.slice(0, 5).forEach(service => {
        console.log(`   ${service.name} (${service.service_type}) - ${service.distance_miles?.toFixed(2) || 'undefined'} miles`);
      });

      // Group by service type
      const serviceTypeCounts = {};
      data.forEach(service => {
        serviceTypeCounts[service.service_type] = (serviceTypeCounts[service.service_type] || 0) + 1;
      });
      
      console.log('\n📋 Service Type Distribution:');
      Object.entries(serviceTypeCounts).forEach(([type, count]) => {
        console.log(`   ${type}: ${count}`);
      });

    } else {
      console.log('⚠️  No results returned - this might indicate an issue');
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testFixedFunction().catch(console.error);
