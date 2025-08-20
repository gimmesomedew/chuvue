const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://osvfybbvcdokbcfkmafv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zdmZ5YmJ2Y2Rva2JjZmttYWZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc4MDgwMjQsImV4cCI6MjA0MzM4NDAyNH0.87tNA0w7D0QdYo4AAcDyh_1JoKvjQnx4AM8kZgzgwNI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSearchPerformance() {
  console.log('🚀 Testing Search Performance with New Indexes...\n');

  const testCases = [
    { name: 'Indiana Groomers', serviceType: 'groomer', state: 'IN', zipCode: '' },
    { name: 'Indiana Veterinarians', serviceType: 'veterinarian', state: 'IN', zipCode: '' },
    { name: 'Indiana Dog Trainers', serviceType: 'dog_trainer', state: 'IN', zipCode: '' },
    { name: 'All Indiana Services', serviceType: '', state: 'IN', zipCode: '' },
    { name: 'All Groomers', serviceType: 'groomer', state: '', zipCode: '' },
  ];

  for (const testCase of testCases) {
    console.log(`\n📊 Testing: ${testCase.name}`);
    
    // Test 1: Count query performance
    const countStart = Date.now();
    let countQuery = supabase
      .from('services')
      .select('*', { count: 'exact', head: true });

    if (testCase.serviceType) {
      countQuery = countQuery.eq('service_type', testCase.serviceType);
    }
    if (testCase.state) {
      countQuery = countQuery.eq('state', testCase.state);
    }
    if (testCase.zipCode) {
      countQuery = countQuery.eq('zip_code', testCase.zipCode);
    }

    const { count, error: countError } = await countQuery;
    const countTime = Date.now() - countStart;

    if (countError) {
      console.log(`❌ Count query failed: ${countError.message}`);
      continue;
    }

    // Test 2: Data query performance
    const dataStart = Date.now();
    let dataQuery = supabase
      .from('services')
      .select('*');

    if (testCase.serviceType) {
      dataQuery = dataQuery.eq('service_type', testCase.serviceType);
    }
    if (testCase.state) {
      dataQuery = dataQuery.eq('state', testCase.state);
    }
    if (testCase.zipCode) {
      dataQuery = dataQuery.eq('zip_code', testCase.zipCode);
    }

    dataQuery = dataQuery.range(0, 14).order('name');
    const { data, error: dataError } = await dataQuery;
    const dataTime = Date.now() - dataStart;

    if (dataError) {
      console.log(`❌ Data query failed: ${dataError.message}`);
      continue;
    }

    // Results
    console.log(`✅ Count Query: ${countTime}ms (${count} results)`);
    console.log(`✅ Data Query: ${dataTime}ms (${data.length} results)`);
    console.log(`📈 Total Time: ${countTime + dataTime}ms`);
    
    // Performance assessment
    if (countTime < 100 && dataTime < 100) {
      console.log('🎉 Excellent performance!');
    } else if (countTime < 200 && dataTime < 200) {
      console.log('👍 Good performance');
    } else if (countTime < 500 && dataTime < 500) {
      console.log('⚠️  Acceptable performance');
    } else {
      console.log('🐌 Slow performance - may need optimization');
    }
  }

  // Test 3: Full-text search performance (if GIN index exists)
  console.log('\n🔍 Testing Full-Text Search Performance...');
  try {
    const textSearchStart = Date.now();
    const { data: textResults, error: textError } = await supabase
      .from('services')
      .select('*')
      .textSearch('name', 'dog')
      .limit(10);
    
    const textSearchTime = Date.now() - textSearchStart;
    
    if (textError) {
      console.log(`❌ Full-text search failed: ${textError.message}`);
      console.log('💡 Consider adding GIN index: CREATE INDEX idx_services_name_gin ON services USING gin(to_tsvector(\'english\', name));');
    } else {
      console.log(`✅ Full-text search: ${textSearchTime}ms (${textResults.length} results)`);
    }
  } catch (error) {
    console.log('❌ Full-text search not available');
  }

  console.log('\n🎯 Performance Test Complete!');
  console.log('\n💡 Recommendations:');
  console.log('- If queries are > 200ms, consider additional indexes');
  console.log('- Monitor query performance in production');
  console.log('- Consider implementing query result caching');
}

// Run the performance test
testSearchPerformance().catch(console.error); 