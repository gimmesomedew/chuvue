require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Test coordinates for Fishers, Indiana
const TEST_COORDS = {
  latitude: 39.9567,
  longitude: -85.9550,
  radiusMiles: 25
};

// Test the services_within_radius function
async function testGeolocationSearch() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  console.log('🔍 Testing Geolocation Search...');
  console.log('📍 Test Location:', TEST_COORDS);
  console.log('');

  try {
    // Test 1: Direct RPC call to services_within_radius
    console.log('📊 Test 1: Direct RPC call to services_within_radius');
    const { data: rpcData, error: rpcError } = await supabase.rpc('services_within_radius', {
      p_lat: TEST_COORDS.latitude,
      p_lon: TEST_COORDS.longitude,
      p_radius_miles: TEST_COORDS.radiusMiles
    });

    if (rpcError) {
      console.error('❌ RPC Error:', rpcError);
    } else {
      console.log(`✅ RPC Results: ${rpcData?.length || 0} services found`);
      
      // Group by service type
      const serviceTypeCounts = {};
      rpcData?.forEach(service => {
        serviceTypeCounts[service.service_type] = (serviceTypeCounts[service.service_type] || 0) + 1;
      });
      
      console.log('📋 Service Type Distribution:');
      Object.entries(serviceTypeCounts).forEach(([type, count]) => {
        console.log(`   ${type}: ${count}`);
      });
      
      // Show some sample results with distances
      console.log('\n📍 Sample Results (first 5):');
      rpcData?.slice(0, 5).forEach(service => {
        console.log(`   ${service.name} (${service.service_type}) - ${service.distance_miles?.toFixed(2)} miles`);
      });
    }

    console.log('\n' + '='.repeat(60) + '\n');

    // Test 2: Check total services in database
    console.log('📊 Test 2: Total services in database');
    const { count: totalCount, error: countError } = await supabase
      .from('services')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('❌ Count Error:', countError);
    } else {
      console.log(`✅ Total services in database: ${totalCount}`);
    }

    console.log('\n' + '='.repeat(60) + '\n');

    // Test 3: Check services with valid coordinates
    console.log('📊 Test 3: Services with valid coordinates');
    const { data: coordData, error: coordError } = await supabase
      .from('services')
      .select('id, name, service_type, latitude, longitude, state')
      .not('latitude', 'is', null)
      .not('longitude', 'is', null);

    if (coordError) {
      console.error('❌ Coordinate Query Error:', coordError);
    } else {
      console.log(`✅ Services with coordinates: ${coordData?.length || 0}`);
      
      // Check for coordinate quality issues
      const invalidCoords = coordData?.filter(service => 
        service.latitude === 0 || service.longitude === 0 ||
        service.latitude < -90 || service.latitude > 90 ||
        service.longitude < -180 || service.longitude > 180
      );
      
      if (invalidCoords?.length > 0) {
        console.log(`⚠️  Services with invalid coordinates: ${invalidCoords.length}`);
        invalidCoords.slice(0, 3).forEach(service => {
          console.log(`   ${service.name}: lat=${service.latitude}, lon=${service.longitude}`);
        });
      }
    }

    console.log('\n' + '='.repeat(60) + '\n');

    // Test 4: Check services in Indiana
    console.log('📊 Test 4: Services in Indiana');
    const { data: indianaData, error: indianaError } = await supabase
      .from('services')
      .select('id, name, service_type, latitude, longitude, state')
      .eq('state', 'IN');

    if (indianaError) {
      console.error('❌ Indiana Query Error:', indianaError);
    } else {
      console.log(`✅ Services in Indiana: ${indianaData?.length || 0}`);
      
      // Group by service type
      const indianaServiceTypeCounts = {};
      indianaData?.forEach(service => {
        indianaServiceTypeCounts[service.service_type] = (indianaServiceTypeCounts[service.service_type] || 0) + 1;
      });
      
      console.log('📋 Indiana Service Type Distribution:');
      Object.entries(indianaServiceTypeCounts).forEach(([type, count]) => {
        console.log(`   ${type}: ${count}`);
      });
    }

    console.log('\n' + '='.repeat(60) + '\n');

    // Test 5: Manual distance calculation for a few services
    console.log('📊 Test 5: Manual distance calculation');
    const { data: sampleServices } = await supabase
      .from('services')
      .select('id, name, service_type, latitude, longitude, state')
      .not('latitude', 'is', null)
      .not('longitude', 'is', null)
      .limit(10);

    if (sampleServices?.length > 0) {
      console.log('📍 Sample services with calculated distances:');
      sampleServices.forEach(service => {
        const distance = calculateDistance(
          TEST_COORDS.latitude,
          TEST_COORDS.longitude,
          service.latitude,
          service.longitude
        );
        console.log(`   ${service.name} (${service.service_type}): ${distance.toFixed(2)} miles`);
      });
    }

    console.log('\n' + '='.repeat(60) + '\n');

    // Test 6: Check the exact SQL being executed
    console.log('📊 Test 6: SQL Query Analysis');
    console.log('🔍 Checking if distance calculation is working...');
    
    // Test with a smaller radius to see if the function works
    const { data: smallRadiusData, error: smallRadiusError } = await supabase.rpc('services_within_radius', {
      p_lat: TEST_COORDS.latitude,
      p_lon: TEST_COORDS.longitude,
      p_radius_miles: 5
    });
    
    if (smallRadiusError) {
      console.error('❌ Small Radius Error:', smallRadiusError);
    } else {
      console.log(`✅ Small radius (5 miles) results: ${smallRadiusData?.length || 0} services`);
      
      if (smallRadiusData?.length > 0) {
        console.log('📍 First result details:');
        const firstResult = smallRadiusData[0];
        console.log('   Raw result:', JSON.stringify(firstResult, null, 2));
        
        // Manual distance calculation
        const manualDistance = calculateDistance(
          TEST_COORDS.latitude,
          TEST_COORDS.longitude,
          firstResult.latitude,
          firstResult.longitude
        );
        console.log(`   Manual distance: ${manualDistance.toFixed(2)} miles`);
        console.log(`   RPC distance: ${firstResult.distance_miles || 'undefined'}`);
      }
    }

    console.log('\n' + '='.repeat(60) + '\n');

    // Test 7: Check for coordinate precision issues
    console.log('📊 Test 7: Coordinate Precision Analysis');
    const { data: precisionData } = await supabase
      .from('services')
      .select('id, name, latitude, longitude')
      .not('latitude', 'is', null)
      .not('longitude', 'is', null)
      .limit(20);
    
    if (precisionData?.length > 0) {
      console.log('📍 Sample coordinate precision:');
      precisionData.slice(0, 5).forEach(service => {
        console.log(`   ${service.name}: lat=${service.latitude}, lon=${service.longitude}`);
        console.log(`   Lat precision: ${service.latitude.toString().split('.')[1]?.length || 0} decimal places`);
        console.log(`   Lon precision: ${service.longitude.toString().split('.')[1]?.length || 0} decimal places`);
      });
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Haversine distance calculation
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 3958.8; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Run the test
testGeolocationSearch().catch(console.error);
