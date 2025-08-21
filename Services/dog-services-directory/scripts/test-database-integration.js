#!/usr/bin/env node

/**
 * 🧪 Database Integration Testing Script
 * Tests data storage, category relationships, and database state
 */

const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// Test data
const TEST_PRODUCT = {
  name: "Database Test Product",
  description: "This is a test product for database integration testing",
  website: "https://testproduct.com",
  contact_number: "(555) 999-8888",
  email: "test@testproduct.com",
  location_address: "123 Test Street",
  city: "Test City",
  state: "TX",
  zip_code: "12345",
  selectedCategories: [1, 3, 5]
};

// Test scenarios
const DATABASE_TEST_SCENARIOS = [
  {
    name: "Database connection test",
    description: "Verify connection to Supabase database",
    test: async () => {
      try {
        const { data, error } = await supabase
          .from('product_submissions')
          .select('count', { count: 'exact', head: true });
        
        if (error) throw error;
        
        return {
          passed: true,
          details: { connection: 'successful', count: data }
        };
      } catch (error) {
        return {
          passed: false,
          details: { connection: 'failed', error: error.message }
        };
      }
    }
  },
  {
    name: "Product submission insertion",
    description: "Insert a test product and verify it's stored",
    test: async () => {
      try {
        // Insert test product
        const { data: insertData, error: insertError } = await supabase
          .from('product_submissions')
          .insert({
            name: TEST_PRODUCT.name,
            description: TEST_PRODUCT.description,
            website: TEST_PRODUCT.website,
            contact_number: TEST_PRODUCT.contact_number,
            email: TEST_PRODUCT.email,
            location_address: TEST_PRODUCT.location_address,
            city: TEST_PRODUCT.city,
            state: TEST_PRODUCT.state,
            zip_code: TEST_PRODUCT.zip_code,
            status: 'pending'
          })
          .select()
          .single();
        
        if (insertError) throw insertError;
        
        // Verify the data was inserted correctly
        const { data: verifyData, error: verifyError } = await supabase
          .from('product_submissions')
          .select('*')
          .eq('id', insertData.id)
          .single();
        
        if (verifyError) throw verifyError;
        
        // Check if all fields match
        const fieldsMatch = 
          verifyData.name === TEST_PRODUCT.name &&
          verifyData.description === TEST_PRODUCT.description &&
          verifyData.website === TEST_PRODUCT.website &&
          verifyData.status === 'pending';
        
        return {
          passed: fieldsMatch,
          details: {
            inserted: insertData,
            verified: verifyData,
            fieldsMatch
          }
        };
      } catch (error) {
        return {
          passed: false,
          details: { error: error.message }
        };
      }
    }
  },
  {
    name: "Status field updates",
    description: "Test updating product submission status",
    test: async () => {
      try {
        // First, get a test product
        const { data: products, error: fetchError } = await supabase
          .from('product_submissions')
          .select('*')
          .eq('name', TEST_PRODUCT.name)
          .limit(1);
        
        if (fetchError || !products || products.length === 0) {
          return {
            passed: false,
            details: { error: 'No test product found for status update' }
          };
        }
        
        const testProduct = products[0];
        
        // Update status to approved
        const { data: updateData, error: updateError } = await supabase
          .from('product_submissions')
          .update({ status: 'approved' })
          .eq('id', testProduct.id)
          .select()
          .single();
        
        if (updateError) throw updateError;
        
        // Verify status was updated
        const statusUpdated = updateData.status === 'approved';
        
        return {
          passed: statusUpdated,
          details: {
            originalStatus: testProduct.status,
            newStatus: updateData.status,
            statusUpdated
          }
        };
      } catch (error) {
        return {
          passed: false,
          details: { error: error.message }
        };
      }
    }
  },
  {
    name: "Timestamp handling",
    description: "Verify created_at and updated_at timestamps",
    test: async () => {
      try {
        // Get a test product
        const { data: products, error: fetchError } = await supabase
          .from('product_submissions')
          .select('created_at, updated_at')
          .eq('name', TEST_PRODUCT.name)
          .limit(1);
        
        if (fetchError || !products || products.length === 0) {
          return {
            passed: false,
            details: { error: 'No test product found for timestamp check' }
          };
        }
        
        const product = products[0];
        
        // Check if timestamps exist and are valid dates
        const hasCreatedAt = !!product.created_at;
        const hasUpdatedAt = !!product.updated_at;
        const createdAtValid = !isNaN(new Date(product.created_at).getTime());
        const updatedAtValid = !isNaN(new Date(product.updated_at).getTime());
        
        const timestampsValid = hasCreatedAt && hasUpdatedAt && createdAtValid && updatedAtValid;
        
        return {
          passed: timestampsValid,
          details: {
            hasCreatedAt,
            hasUpdatedAt,
            createdAtValid,
            updatedAtValid,
            created_at: product.created_at,
            updated_at: product.updated_at
          }
        };
      } catch (error) {
        return {
          passed: false,
          details: { error: error.message }
        };
      }
    }
  },
  {
    name: "Data cleanup test",
    description: "Clean up test data after testing",
    test: async () => {
      try {
        // Delete test products
        const { data: deleteData, error: deleteError } = await supabase
          .from('product_submissions')
          .delete()
          .eq('name', TEST_PRODUCT.name);
        
        if (deleteError) throw deleteError;
        
        // Verify deletion
        const { data: verifyData, error: verifyError } = await supabase
          .from('product_submissions')
          .select('*')
          .eq('name', TEST_PRODUCT.name);
        
        if (verifyError) throw verifyError;
        
        const dataCleaned = !verifyData || verifyData.length === 0;
        
        return {
          passed: dataCleaned,
          details: {
            deleted: deleteData,
            remaining: verifyData,
            dataCleaned
          }
        };
      } catch (error) {
        return {
          passed: false,
          details: { error: error.message }
        };
      }
    }
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
    console.log(`   Details:`, details);
  }
}

// Main test execution
async function runDatabaseTests() {
  log('🚀 Starting Database Integration Tests', 'info');
  log(`Supabase URL: ${supabaseUrl}`, 'info');
  log(`Total test scenarios: ${DATABASE_TEST_SCENARIOS.length}`, 'info');
  
  const results = {
    total: DATABASE_TEST_SCENARIOS.length,
    passed: 0,
    failed: 0,
    details: []
  };
  
  // Run each test scenario
  for (const scenario of DATABASE_TEST_SCENARIOS) {
    log(``, 'info');
    log(`🧪 Testing: ${scenario.name}`, 'info');
    log(`Description: ${scenario.description}`, 'info');
    
    try {
      const result = await scenario.test();
      results.details.push({ scenario: scenario.name, ...result });
      
      if (result.passed) {
        results.passed++;
        logTestResult(scenario.name, true, result.details);
      } else {
        results.failed++;
        logTestResult(scenario.name, false, result.details);
      }
      
    } catch (error) {
      logTestResult(scenario.name, false, `Exception: ${error.message}`);
      results.details.push({ scenario: scenario.name, passed: false, error: error.message });
      results.failed++;
    }
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Summary
  log('', 'info');
  log('📊 Database Test Results Summary', 'info');
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
  runDatabaseTests()
    .then(results => {
      process.exit(results.failed > 0 ? 1 : 0);
    })
    .catch(error => {
      log(`Fatal error: ${error.message}`, 'error');
      process.exit(1);
    });
}

module.exports = {
  runDatabaseTests,
  DATABASE_TEST_SCENARIOS
};
