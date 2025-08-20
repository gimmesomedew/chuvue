const { searchCache } = require('./lib/cache');

async function testCache() {
  console.log('🧪 Testing Search Cache Implementation...\n');

  try {
    // Test 1: Set and get search results
    console.log('Test 1: Setting and getting search results');
    const testData = {
      services: [{ id: '1', name: 'Test Service', service_type: 'groomer' }],
      totalPages: 1,
      total: 1
    };

    await searchCache.setSearchResults('groomer', 'IN', '', 1, 15, testData);
    const cachedResult = await searchCache.getSearchResults('groomer', 'IN', '', 1, 15);
    
    if (cachedResult && cachedResult.services.length === 1) {
      console.log('✅ Cache set and get working correctly');
    } else {
      console.log('❌ Cache set and get failed');
    }

    // Test 2: Cache miss for different parameters
    console.log('\nTest 2: Cache miss for different parameters');
    const missResult = await searchCache.getSearchResults('veterinarian', 'IN', '', 1, 15);
    
    if (missResult === null) {
      console.log('✅ Cache miss working correctly');
    } else {
      console.log('❌ Cache miss failed');
    }

    // Test 3: Cache invalidation
    console.log('\nTest 3: Cache invalidation');
    await searchCache.invalidateSearchResults('groomer');
    const invalidatedResult = await searchCache.getSearchResults('groomer', 'IN', '', 1, 15);
    
    if (invalidatedResult === null) {
      console.log('✅ Cache invalidation working correctly');
    } else {
      console.log('❌ Cache invalidation failed');
    }

    // Test 4: Cache statistics
    console.log('\nTest 4: Cache statistics');
    const stats = await searchCache.getStats();
    console.log('Cache stats:', stats);

    // Test 5: Set some more data and check stats
    console.log('\nTest 5: Multiple cache entries');
    await searchCache.setSearchResults('veterinarian', 'IN', '', 1, 15, testData);
    await searchCache.setAllSearchResults('groomer', 'IN', '', { services: [], total: 0 });
    
    const updatedStats = await searchCache.getStats();
    console.log('Updated cache stats:', updatedStats);

    console.log('\n🎉 All cache tests completed!');

  } catch (error) {
    console.error('❌ Cache test failed:', error);
  }
}

// Run the test
testCache(); 