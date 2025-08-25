#!/usr/bin/env node

/**
 * Master Search Test Runner
 * Runs all search-related tests including API and frontend tests
 */

const { runSearchTests } = require('./test-search-functionality');
const { runFrontendSearchTests } = require('./test-frontend-search');

// Test configuration
const TEST_CONFIG = {
  api: true,        // Run API search tests
  frontend: true,   // Run frontend search tests
  delay: 2000       // Delay between test suites (ms)
};

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

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  console.log(`🚀 ${title}`);
  console.log('='.repeat(60));
}

function logTestSummary(suiteName, passed, total) {
  const percentage = ((passed / total) * 100).toFixed(1);
  const status = passed === total ? 'success' : 'warning';
  log(`${suiteName}: ${passed}/${total} tests passed (${percentage}%)`, status);
}

async function runSearchTestSuite() {
  log('🔍 Starting Comprehensive Search Test Suite', 'info');
  log(`Configuration: API=${TEST_CONFIG.api}, Frontend=${TEST_CONFIG.frontend}`, 'info');
  
  const results = {
    api: { passed: 0, total: 0, success: false },
    frontend: { passed: 0, total: 0, success: false }
  };
  
  // Run API Search Tests
  if (TEST_CONFIG.api) {
    logSection('API Search Tests');
    try {
      const apiSuccess = await runSearchTests();
      results.api.success = apiSuccess;
      // Note: The actual test counts would need to be extracted from the test results
      results.api.passed = apiSuccess ? 1 : 0;
      results.api.total = 1;
    } catch (error) {
      log(`API Search Tests failed: ${error.message}`, 'error');
      results.api.success = false;
      results.api.passed = 0;
      results.api.total = 1;
    }
    
    if (TEST_CONFIG.delay > 0) {
      log(`Waiting ${TEST_CONFIG.delay}ms before next test suite...`, 'info');
      await new Promise(resolve => setTimeout(resolve, TEST_CONFIG.delay));
    }
  }
  
  // Run Frontend Search Tests
  if (TEST_CONFIG.frontend) {
    logSection('Frontend Search Tests');
    try {
      const frontendSuccess = await runFrontendSearchTests();
      results.frontend.success = frontendSuccess;
      // Note: The actual test counts would need to be extracted from the test results
      results.frontend.passed = frontendSuccess ? 1 : 0;
      results.frontend.total = 1;
    } catch (error) {
      log(`Frontend Search Tests failed: ${error.message}`, 'error');
      results.frontend.success = false;
      results.frontend.passed = 0;
      results.frontend.total = 1;
    }
  }
  
  // Final Summary
  logSection('Test Results Summary');
  
  if (TEST_CONFIG.api) {
    logTestSummary('API Search Tests', results.api.passed, results.api.total);
  }
  
  if (TEST_CONFIG.frontend) {
    logTestSummary('Frontend Search Tests', results.frontend.passed, results.frontend.total);
  }
  
  const totalPassed = results.api.passed + results.frontend.passed;
  const totalTests = results.api.total + results.frontend.total;
  
  log(`\nOverall: ${totalPassed}/${totalTests} test suites passed`, 
    totalPassed === totalTests ? 'success' : 'warning');
  
  // Recommendations
  log('\n📋 Recommendations:', 'info');
  
  if (results.api.success && results.frontend.success) {
    log('✅ All search functionality is working correctly!', 'success');
    log('✅ Your search system is ready for production use', 'success');
  } else if (results.api.success && !results.frontend.success) {
    log('⚠️ API search is working but frontend has issues', 'warning');
    log('🔧 Check frontend components and data-testid attributes', 'warning');
  } else if (!results.api.success && results.frontend.success) {
    log('⚠️ Frontend search is working but API has issues', 'warning');
    log('🔧 Check API endpoints and database connectivity', 'warning');
  } else {
    log('❌ Both API and frontend search have issues', 'error');
    log('🔧 Check system configuration and dependencies', 'error');
  }
  
  return totalPassed === totalTests;
}

// Run tests if this file is executed directly
if (require.main === module) {
  runSearchTestSuite()
    .then(success => {
      log(`\n${success ? '🎉' : '⚠️'} Search test suite completed`, 
        success ? 'success' : 'warning');
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      log(`Search test suite failed: ${error.message}`, 'error');
      process.exit(1);
    });
}

module.exports = { runSearchTestSuite };

