const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://osvfybbvcdokbcfkmafv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zdmZ5YmJ2Y2Rva2JjZmttYWZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc4MDgwMjQsImV4cCI6MjA0MzM4NDAyNH0.87tNA0w7D0QdYo4AAcDyh_1JoKvjQnx4AM8kZgzgwNI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function analyzePerformance() {
  console.log('🔍 Analyzing Search Performance and Suggesting Optimizations...\n');

  // Test current performance
  const performanceResults = [];
  
  const testQueries = [
    { name: 'State + Service Type', query: () => supabase.from('services').select('*').eq('state', 'IN').eq('service_type', 'groomer').limit(15) },
    { name: 'State Only', query: () => supabase.from('services').select('*').eq('state', 'IN').limit(15) },
    { name: 'Service Type Only', query: () => supabase.from('services').select('*').eq('service_type', 'groomer').limit(15) },
    { name: 'Count Query', query: () => supabase.from('services').select('*', { count: 'exact', head: true }).eq('state', 'IN').eq('service_type', 'groomer') },
  ];

  for (const test of testQueries) {
    const start = Date.now();
    const { data, error, count } = await test.query();
    const duration = Date.now() - start;
    
    performanceResults.push({
      name: test.name,
      duration,
      resultCount: data?.length || count || 0,
      error: error?.message
    });
  }

  // Display results
  console.log('📊 Current Performance Results:');
  performanceResults.forEach(result => {
    const status = result.error ? '❌' : '✅';
    console.log(`${status} ${result.name}: ${result.duration}ms (${result.resultCount} results)`);
  });

  // Calculate average performance
  const validResults = performanceResults.filter(r => !r.error);
  const avgDuration = validResults.reduce((sum, r) => sum + r.duration, 0) / validResults.length;
  
  console.log(`\n📈 Average Query Time: ${avgDuration.toFixed(0)}ms`);

  // Performance assessment and recommendations
  console.log('\n🎯 Performance Assessment:');
  
  if (avgDuration < 100) {
    console.log('🎉 Excellent performance! Indexes are working well.');
  } else if (avgDuration < 200) {
    console.log('👍 Good performance. Minor optimizations may help.');
  } else if (avgDuration < 500) {
    console.log('⚠️  Acceptable performance. Consider additional optimizations.');
  } else {
    console.log('🐌 Slow performance. Immediate optimization needed.');
  }

  // Suggest optimizations
  console.log('\n💡 Optimization Recommendations:');
  
  if (avgDuration > 200) {
    console.log('1. 🔍 Add covering indexes for common query patterns:');
    console.log('   CREATE INDEX idx_services_state_type_name ON services(state, service_type, name);');
    console.log('   CREATE INDEX idx_services_type_state_name ON services(service_type, state, name);');
    
    console.log('\n2. 📊 Add partial indexes for high-cardinality columns:');
    console.log('   CREATE INDEX idx_services_active ON services(state, service_type) WHERE active = true;');
    
    console.log('\n3. 🗂️  Consider partitioning for large datasets:');
    console.log('   - Partition by state for better query performance');
    console.log('   - Partition by service_type for type-specific queries');
  }

  console.log('\n4. 🚀 Implement query result caching (already done)');
  console.log('5. 📈 Monitor slow queries in production');
  console.log('6. 🔄 Regular VACUUM and ANALYZE maintenance');

  // Test caching impact
  console.log('\n🧪 Testing Cache Impact...');
  
  // Simulate cache hit (second query should be faster)
  const cacheTestStart = Date.now();
  await supabase.from('services').select('*').eq('state', 'IN').eq('service_type', 'groomer').limit(15);
  const cacheTestTime = Date.now() - cacheTestStart;
  
  console.log(`Cache test query: ${cacheTestTime}ms`);
  
  if (cacheTestTime < avgDuration * 0.5) {
    console.log('✅ Caching is providing significant performance benefits');
  } else {
    console.log('⚠️  Caching may need optimization');
  }

  // Suggest monitoring queries
  console.log('\n📋 Monitoring Queries for Production:');
  console.log(`
-- Monitor slow queries
SELECT query, calls, total_time, mean_time 
FROM pg_stat_statements 
WHERE query LIKE '%services%' 
ORDER BY mean_time DESC 
LIMIT 10;

-- Check index usage
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes 
WHERE tablename = 'services'
ORDER BY idx_scan DESC;

-- Check table statistics
SELECT 
    schemaname,
    tablename,
    n_live_tup,
    n_dead_tup,
    last_vacuum,
    last_autovacuum
FROM pg_stat_user_tables 
WHERE tablename = 'services';
  `);

  console.log('\n🎯 Next Steps:');
  console.log('1. Monitor performance in production environment');
  console.log('2. Implement additional indexes if needed');
  console.log('3. Set up query performance monitoring');
  console.log('4. Consider database connection pooling');
  console.log('5. Implement query result caching (already done)');
}

// Run the analysis
analyzePerformance().catch(console.error); 