#!/usr/bin/env node

/**
 * 🧪 Product Submission API Testing Script
 * Tests the complete product submission workflow
 */

const BASE_URL = 'http://localhost:3000';
const API_ENDPOINTS = {
  submit: '/api/product-submissions',
  review: '/api/review/product-submissions',
  approve: '/api/review/product-submissions/approve',
  reject: '/api/review/product-submissions/reject'
};

// Test data sets
const TEST_PRODUCTS = {
  valid: {
    name: "Pawsome Premium Dog Food",
    description: "High-quality, grain-free dog food made with real meat and vegetables. Perfect for all life stages.",
    website: "https://pawsomefoods.com",
    contact_number: "(555) 123-4567",
    email: "info@pawsomefoods.com",
    location_address: "123 Pet Street",
    city: "Austin",
    state: "TX",
    zip_code: "78701",
    selectedCategories: [1, 4]
  },
  minimal: {
    name: "ZenPaws Calming Chews",
    description: "Natural calming supplements for dogs.",
    website: "https://zenpaws.com",
    selectedCategories: [2]
  },
  withLocation: {
    name: "HealBeam Pro",
    description: "Professional red light therapy device for pets.",
    website: "https://healbeam.com",
    contact_number: "(555) 456-7890",
    email: "support@healbeam.com",
    location_address: "789 Therapy Way",
    city: "Denver",
    state: "CO",
    zip_code: "80201",
    selectedCategories: [9, 4]
  }
};

// Test scenarios
const TEST_SCENARIOS = [
  {
    name: "Valid product with all fields",
    data: TEST_PRODUCTS.valid,
    expectedStatus: 201,
    description: "Submit a complete product with all required and optional fields"
  },
  {
    name: "Minimal required fields only",
    data: TEST_PRODUCTS.minimal,
    expectedStatus: 201,
    description: "Submit product with only required fields (name, description, website, categories)"
  },
  {
    name: "Product with location data",
    data: TEST_PRODUCTS.withLocation,
    expectedStatus: 201,
    description: "Submit product with complete location information"
  },
  {
    name: "Missing required field - name",
    data: { ...TEST_PRODUCTS.valid, name: "" },
    expectedStatus: 400,
    description: "Should fail when product name is missing"
  },
  {
    name: "Missing required field - description",
    data: { ...TEST_PRODUCTS.valid, description: "" },
    expectedStatus: 400,
    description: "Should fail when description is missing"
  },
  {
    name: "Missing required field - website",
    data: { ...TEST_PRODUCTS.valid, website: "" },
    expectedStatus: 400,
    description: "Should fail when website URL is missing"
  },
  {
    name: "Missing required field - categories",
    data: { ...TEST_PRODUCTS.valid, selectedCategories: [] },
    expectedStatus: 400,
    description: "Should fail when no categories are selected"
  },
  {
    name: "Invalid website URL format",
    data: { ...TEST_PRODUCTS.valid, website: "not-a-url" },
    expectedStatus: 400,
    description: "Should fail with invalid website URL format"
  },
  {
    name: "Valid website URL formats",
    data: { ...TEST_PRODUCTS.valid, website: "https://example.com" },
    expectedStatus: 201,
    description: "Should accept valid HTTPS URLs"
  },
  {
    name: "Very long product name",
    data: { 
      ...TEST_PRODUCTS.valid, 
      name: "A".repeat(300) 
    },
    expectedStatus: 400,
    description: "Should fail with extremely long product name"
  },
  {
    name: "Special characters in description",
    data: { 
      ...TEST_PRODUCTS.valid, 
      description: "Product with special chars: !@#$%^&*()_+-=[]{}|;':\",./<>?`~" 
    },
    expectedStatus: 201,
    description: "Should handle special characters in description"
  }
];

// Utility functions
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';
  console.log(`${prefix} [${timestamp}] ${message}`);
}

function logTestResult(testName, passed, details = '') {
  const status = passed ? 'PASSED' : 'FAILED';
  const icon = passed ? '✅' : '❌';
  log(`${icon} ${testName}: ${status}`, passed ? 'success' : 'error');
  if (details) {
    console.log(`   Details: ${details}`);
  }
}

async function makeRequest(endpoint, data = null, method = 'POST') {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const responseData = await response.json().catch(() => ({}));
    
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

// Test execution functions
async function testProductSubmission(scenario) {
  log(`Testing: ${scenario.name}`, 'info');
  log(`Description: ${scenario.description}`, 'info');
  
  try {
    const response = await makeRequest(API_ENDPOINTS.submit, scenario.data);
    
    // Check if response matches expected status
    const statusMatch = response.status === scenario.expectedStatus;
    const responseValid = response.data && typeof response.data === 'object';
    
    if (statusMatch && responseValid) {
      logTestResult(scenario.name, true, `Status: ${response.status}`);
      
      // Additional validation for successful submissions
      if (response.status === 200) {
        if (response.data.message) {
          log(`   Success message: ${response.data.message}`, 'success');
        }
        if (response.data.id) {
          log(`   Product ID: ${response.data.id}`, 'success');
        }
      }
      
      return { passed: true, response };
    } else {
      const details = `Expected status: ${scenario.expectedStatus}, Got: ${response.status}`;
      logTestResult(scenario.name, false, details);
      
      if (response.data && response.data.error) {
        log(`   Error message: ${response.data.error}`, 'error');
      }
      
      return { passed: false, response };
    }
  } catch (error) {
    logTestResult(scenario.name, false, `Exception: ${error.message}`);
    return { passed: false, error: error.message };
  }
}

async function testReviewWorkflow() {
  log('Testing Review Workflow', 'info');
  
  // First submit a valid product
  const validProduct = TEST_PRODUCTS.valid;
  const submission = await makeRequest(API_ENDPOINTS.submit, validProduct);
  
  if (submission.status !== 200) {
    log('❌ Cannot test review workflow - product submission failed', 'error');
    return false;
  }
  
  log('✅ Product submitted successfully, testing review endpoints', 'success');
  
  // Test getting pending submissions
  const pendingResponse = await makeRequest(API_ENDPOINTS.review, null, 'GET');
  log(`   GET ${API_ENDPOINTS.review}: ${pendingResponse.status}`, 
      pendingResponse.ok ? 'success' : 'error');
  
  // Test approval (this would require admin privileges in real scenario)
  const approvalResponse = await makeRequest(API_ENDPOINTS.approve, { 
    submissionId: submission.data.id 
  });
  log(`   POST ${API_ENDPOINTS.approve}: ${approvalResponse.status}`, 
      approvalResponse.ok ? 'success' : 'error');
  
  return true;
}

async function runAllTests() {
  log('🚀 Starting Product Submission API Tests', 'info');
  log(`Base URL: ${BASE_URL}`, 'info');
  log(`Total test scenarios: ${TEST_SCENARIOS.length}`, 'info');
  
  const results = {
    total: TEST_SCENARIOS.length,
    passed: 0,
    failed: 0,
    details: []
  };
  
  // Run individual test scenarios
  for (const scenario of TEST_SCENARIOS) {
    const result = await testProductSubmission(scenario);
    results.details.push({ scenario: scenario.name, ...result });
    
    if (result.passed) {
      results.passed++;
    } else {
      results.failed++;
    }
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Test review workflow
  log('', 'info');
  await testReviewWorkflow();
  
  // Summary
  log('', 'info');
  log('📊 Test Results Summary', 'info');
  log(`Total Tests: ${results.total}`, 'info');
  log(`Passed: ${results.passed}`, results.passed > 0 ? 'success' : 'info');
  log(`Failed: ${results.failed}`, results.failed > 0 ? 'error' : 'info');
  log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`, 'info');
  
  if (results.failed > 0) {
    log('', 'info');
    log('❌ Failed Tests:', 'error');
    results.details
      .filter(r => !r.passed)
      .forEach(r => log(`   - ${r.scenario}`, 'error'));
  }
  
  return results;
}

// Main execution
if (require.main === module) {
  runAllTests()
    .then(results => {
      process.exit(results.failed > 0 ? 1 : 0);
    })
    .catch(error => {
      log(`Fatal error: ${error.message}`, 'error');
      process.exit(1);
    });
}

module.exports = {
  runAllTests,
  testProductSubmission,
  testReviewWorkflow,
  TEST_PRODUCTS,
  TEST_SCENARIOS
};
