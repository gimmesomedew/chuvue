#!/usr/bin/env node

/**
 * Search Functionality Test Suite
 * Tests the search API endpoints for services, products, and combined searches
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';

// Test data for different search scenarios
const SEARCH_TEST_DATA = {
  // Service searches
  serviceSearches: [
    { query: 'grooming', expectedType: 'service', description: 'Basic service search' },
    { query: 'veterinary care', expectedType: 'service', description: 'Multi-word service search' },
    { query: 'dog training', expectedType: 'service', description: 'Specific service type' },
    { query: 'pet sitting', expectedType: 'service', description: 'Another service type' },
    { query: 'dog walking', expectedType: 'service', description: 'Basic service' }
  ],
  
  // Product searches
  productSearches: [
    { query: 'dog food', expectedType: 'product', description: 'Basic product search' },
    { query: 'pet toys', expectedType: 'product', description: 'Product category search' },
    { query: 'dog treats', expectedType: 'product', description: 'Specific product type' },
    { query: 'pet supplies', expectedType: 'product', description: 'General product category' },
    { query: 'dog collars', expectedType: 'product', description: 'Specific product' }
  ],
  
  // Combined searches (should return both)
  combinedSearches: [
    { query: 'pet', expectedType: 'both', description: 'Generic term that could match both' },
    { query: 'dog', expectedType: 'both', description: 'Common term for both services and products' },
    { query: 'care', expectedType: 'both', description: 'Term that applies to both' },
    { query: 'health', expectedType: 'both', description: 'Health-related term' },
    { query: 'wellness', expectedType: 'both', description: 'Wellness-related term' }
  ],
  
  // Location-based searches
  locationSearches: [
    { query: 'grooming', location: 'Indianapolis', expectedType: 'service', description: 'Service with location' },
    { query: 'dog food', location: 'Carmel', expectedType: 'product', description: 'Product with location' },
    { query: 'veterinary', location: 'Fishers', expectedType: 'service', description: 'Service with specific location' }
  ],
  
  // Edge cases
  edgeCases: [
    { query: '', expectedType: 'error', description: 'Empty search query' },
    { query: '   ', expectedType: 'error', description: 'Whitespace only query' },
    { query: 'a', expectedType: 'both', description: 'Single character query' },
    { query: 'supercalifragilisticexpialidocious', expectedType: 'both', description: 'Very long query' },
    { query: '123456789', expectedType: 'both', description: 'Numeric query' },
    { query: '!@#$%^&*()', expectedType: 'both', description: 'Special characters query' }
  ]
};

// Test scenarios
const TEST_SCENARIOS = [
  {
    name: 'Basic Service Search',
    endpoint: '/api/search',
    method: 'POST',
    data: { query: 'grooming', serviceType: 'Grooming' },
    expectedStatus: 200,
    expectedFields: ['metadata', 'results', 'success']
  },
  {
    name: 'Basic Product Search',
    endpoint: '/api/search',
    method: 'POST',
    data: { query: 'dog food', serviceType: 'Pet Products' },
    expectedStatus: 200,
    expectedFields: ['metadata', 'results', 'success']
  },
  {
    name: 'Combined Search (No Service Type)',
    endpoint: '/api/search',
    method: 'POST',
    data: { query: 'pet care' },
    expectedStatus: 200,
    expectedFields: ['metadata', 'results', 'success']
  },
  {
    name: 'Location-Based Service Search',
    endpoint: '/api/search',
    method: 'POST',
    data: { query: 'veterinary', location: 'Indianapolis, IN' },
    expectedStatus: 200,
    expectedFields: ['metadata', 'results', 'success']
  },
  {
    name: 'Simple Search Endpoint',
    endpoint: '/api/search-simple',
    method: 'POST',
    data: { query: 'dog training' },
    expectedStatus: 200,
    expectedFields: ['metadata', 'results', 'success']
  },
  {
    name: 'Search with Filters',
    endpoint: '/api/search',
    method: 'POST',
    data: { 
      query: 'pet services',
      serviceType: 'Pet Services',
      radius: 25,
      sortBy: 'distance'
    },
    expectedStatus: 200,
    expectedFields: ['metadata', 'results', 'success']
  }
];

// Utility functions
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const colors = {
    info: '\x1b[36m',    // Cyan
    success: '\x1b[32m', // Green
    warning: '\x1b[33m', // Yellow
    error: '\x1b[31m',   // Red
    reset: '\x1b[0m'     // Reset
  };
  
  console.log(`${colors[type]}[${timestamp}] ${message}${colors.reset}`);
}

function logTestResult(testName, passed, details = '') {
  const status = passed ? '✅ PASS' : '❌ FAIL';
  const color = passed ? '\x1b[32m' : '\x1b[31m';
  console.log(`${color}${status}${'\x1b[0m'} - ${testName}${details ? `: ${details}` : ''}`);
}

async function makeRequest(endpoint, method = 'GET', data = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    }
  };
  
  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    options.body = JSON.stringify(data);
  }
  
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const responseData = await response.json().catch(() => null);
    
    return {
      status: response.status,
      ok: response.ok,
      data: responseData,
      headers: Object.fromEntries(response.headers.entries())
    };
  } catch (error) {
    return {
      status: 0,
      ok: false,
      error: error.message,
      data: null
    };
  }
}

async function testSearchEndpoint(scenario) {
  log(`Testing: ${scenario.name}`, 'info');
  
  try {
    const response = await makeRequest(scenario.endpoint, scenario.method, scenario.data);
    
    // Check status code
    const statusPassed = response.status === scenario.expectedStatus;
    logTestResult(`Status Code`, statusPassed, `Expected: ${scenario.expectedStatus}, Got: ${response.status}`);
    
    if (!statusPassed) {
      log(`Response data: ${JSON.stringify(response.data, null, 2)}`, 'warning');
      return false;
    }
    
    // Check response structure
    let structurePassed = true;
    const missingFields = [];
    
    for (const field of scenario.expectedFields) {
      if (!response.data || !(field in response.data)) {
        missingFields.push(field);
        structurePassed = false;
      }
    }
    
    logTestResult(`Response Structure`, structurePassed, 
      missingFields.length > 0 ? `Missing fields: ${missingFields.join(', ')}` : '');
    
    // Check data quality
    let dataQualityPassed = true;
    let qualityDetails = [];
    
    if (response.data) {
          // Check if results are returned
    if (response.data.metadata && response.data.metadata.resultCount !== undefined) {
      if (response.data.metadata.resultCount < 0) {
        dataQualityPassed = false;
        qualityDetails.push('resultCount is negative');
      }
    }
    
    // Check if results array exists and is an array
    if (response.data.results && !Array.isArray(response.data.results)) {
      dataQualityPassed = false;
      qualityDetails.push('results should be an array');
    }
    
    // Check if metadata exists and contains query info
    if (response.data.metadata && response.data.metadata.originalQuery) {
      if (response.data.metadata.originalQuery !== scenario.data.query) {
        dataQualityPassed = false;
        qualityDetails.push('query not preserved in metadata');
      }
    }
    }
    
    logTestResult(`Data Quality`, dataQualityPassed, 
      qualityDetails.length > 0 ? qualityDetails.join(', ') : '');
    
    return statusPassed && structurePassed && dataQualityPassed;
    
  } catch (error) {
    logTestResult(`Error Handling`, false, error.message);
    return false;
  }
}

async function testSearchQueries() {
  log('🧪 Testing Individual Search Queries', 'info');
  
  const results = {
    serviceSearches: { passed: 0, total: 0 },
    productSearches: { passed: 0, total: 0 },
    combinedSearches: { passed: 0, total: 0 },
    locationSearches: { passed: 0, total: 0 },
    edgeCases: { passed: 0, total: 0 }
  };
  
  // Test service searches
  log('\n📋 Testing Service Searches...', 'info');
  for (const search of SEARCH_TEST_DATA.serviceSearches) {
    const response = await makeRequest('/api/search', 'POST', { query: search.query });
    const passed = response.ok && response.data && response.data.results && Array.isArray(response.data.results) && response.data.results.length > 0;
    results.serviceSearches.total++;
    if (passed) results.serviceSearches.passed++;
    
    logTestResult(`Service Search: "${search.query}"`, passed, search.description);
  }
  
  // Test product searches
  log('\n📦 Testing Product Searches...', 'info');
  for (const search of SEARCH_TEST_DATA.productSearches) {
    const response = await makeRequest('/api/search', 'POST', { query: search.query });
    const passed = response.ok && response.data && response.data.results && Array.isArray(response.data.results) && response.data.results.length > 0;
    results.productSearches.total++;
    if (passed) results.productSearches.passed++;
    
    logTestResult(`Product Search: "${search.query}"`, passed, search.description);
  }
  
  // Test combined searches
  log('\n🔄 Testing Combined Searches...', 'info');
  for (const search of SEARCH_TEST_DATA.combinedSearches) {
    const response = await makeRequest('/api/search', 'POST', { query: search.query });
    const passed = response.ok && response.data && response.data.results && Array.isArray(response.data.results) && response.data.results.length > 0;
    results.combinedSearches.total++;
    if (passed) results.combinedSearches.passed++;
    
    logTestResult(`Combined Search: "${search.query}"`, passed, search.description);
  }
  
  // Test location searches
  log('\n📍 Testing Location-Based Searches...', 'info');
  for (const search of SEARCH_TEST_DATA.locationSearches) {
    const response = await makeRequest('/api/search', 'POST', { 
      query: search.query, 
      location: search.location 
    });
    const passed = response.ok && response.data;
    results.locationSearches.total++;
    if (passed) results.locationSearches.passed++;
    
    logTestResult(`Location Search: "${search.query}" in ${search.location}`, passed, search.description);
  }
  
  // Test edge cases
  log('\n⚠️ Testing Edge Cases...', 'info');
  for (const search of SEARCH_TEST_DATA.edgeCases) {
    const response = await makeRequest('/api/search', 'POST', { query: search.query });
    const passed = response.ok; // Edge cases should handle gracefully
    results.edgeCases.total++;
    if (passed) results.edgeCases.passed++;
    
    logTestResult(`Edge Case: "${search.query}"`, passed, search.description);
  }
  
  return results;
}

async function runSearchTests() {
  log('🚀 Starting Search Functionality Test Suite', 'info');
  log(`Base URL: ${BASE_URL}`, 'info');
  
  // Test main search endpoints
  log('\n🔍 Testing Search Endpoints...', 'info');
  let endpointTestsPassed = 0;
  let endpointTestsTotal = 0;
  
  for (const scenario of TEST_SCENARIOS) {
    const passed = await testSearchEndpoint(scenario);
    endpointTestsTotal++;
    if (passed) endpointTestsPassed++;
    
    // Add delay between requests to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Test individual search queries
  const queryResults = await testSearchQueries();
  
  // Summary
  log('\n📊 Test Summary', 'info');
  log('=' * 50, 'info');
  
  log(`Search Endpoints: ${endpointTestsPassed}/${endpointTestsTotal} passed`, 
    endpointTestsPassed === endpointTestsTotal ? 'success' : 'warning');
  
  for (const [category, result] of Object.entries(queryResults)) {
    const percentage = ((result.passed / result.total) * 100).toFixed(1);
    const status = result.passed === result.total ? 'success' : 'warning';
    log(`${category}: ${result.passed}/${result.total} passed (${percentage}%)`, status);
  }
  
  const totalPassed = endpointTestsPassed + 
    Object.values(queryResults).reduce((sum, r) => sum + r.passed, 0);
  const totalTests = endpointTestsTotal + 
    Object.values(queryResults).reduce((sum, r) => sum + r.total, 0);
  
  log(`\nOverall: ${totalPassed}/${totalTests} tests passed`, 
    totalPassed === totalTests ? 'success' : 'warning');
  
  return totalPassed === totalTests;
}

// Run tests if this file is executed directly
if (require.main === module) {
  runSearchTests()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      log(`Test suite failed: ${error.message}`, 'error');
      process.exit(1);
    });
}

module.exports = { runSearchTests, testSearchEndpoint, testSearchQueries };
