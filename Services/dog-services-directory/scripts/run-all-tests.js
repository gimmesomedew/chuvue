#!/usr/bin/env node

/**
 * 🚀 Master Test Runner
 * Executes all test suites and provides comprehensive reporting
 */

const path = require('path');
const fs = require('fs');

// Import test modules
const { runAllTests: runAPITests } = require('./test-product-submission');
const { runFormTests } = require('./test-form-validation');
const { runDatabaseTests } = require('./test-database-integration');

// Test configuration
const TEST_CONFIG = {
  api: {
    name: 'API Endpoint Tests',
    enabled: true,
    timeout: 30000
  },
  frontend: {
    name: 'Frontend Form Tests',
    enabled: true,
    timeout: 60000
  },
  database: {
    name: 'Database Integration Tests',
    enabled: true,
    timeout: 30000
  }
};

// Utility functions
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';
  console.log(`${prefix} [${timestamp}] ${message}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  console.log(`🧪 ${title}`);
  console.log('='.repeat(60));
}

function logTestSummary(results, testName) {
  log(`📊 ${testName} Results:`, 'info');
  log(`   Total Tests: ${results.total}`, 'info');
  log(`   Passed: ${results.passed}`, results.passed > 0 ? 'success' : 'info');
  log(`   Failed: ${results.failed}`, results.failed > 0 ? 'error' : 'info');
  log(`   Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`, 'info');
}

// Test execution functions
async function runAPITestSuite() {
  logSection('API Endpoint Testing');
  
  try {
    log('Starting API endpoint tests...', 'info');
    const results = await runAPITests();
    logTestSummary(results, 'API Endpoint');
    return results;
  } catch (error) {
    log(`API tests failed: ${error.message}`, 'error');
    return {
      total: 0,
      passed: 0,
      failed: 1,
      details: [{ scenario: 'API Tests', passed: false, error: error.message }]
    };
  }
}

async function runFrontendTestSuite() {
  logSection('Frontend Form Testing');
  
  try {
    log('Starting frontend form tests...', 'info');
    log('Note: This will launch a browser window for testing', 'warning');
    const results = await runFormTests();
    logTestSummary(results, 'Frontend Form');
    return results;
  } catch (error) {
    log(`Frontend tests failed: ${error.message}`, 'error');
    return {
      total: 0,
      passed: 0,
      failed: 1,
      details: [{ scenario: 'Frontend Tests', passed: false, error: error.message }]
    };
  }
}

async function runDatabaseTestSuite() {
  logSection('Database Integration Testing');
  
  try {
    log('Starting database integration tests...', 'info');
    const results = await runDatabaseTests();
    logTestSummary(results, 'Database Integration');
    return results;
  } catch (error) {
    log(`Database tests failed: ${error.message}`, 'error');
    return {
      total: 0,
      passed: 0,
      failed: 1,
      details: [{ scenario: 'Database Tests', passed: false, error: error.message }]
    };
  }
}

// Main test execution
async function runAllTestSuites() {
  const startTime = Date.now();
  
  log('🚀 Starting Comprehensive Product Testing Suite', 'info');
  log(`Start Time: ${new Date().toISOString()}`, 'info');
  log(`Test Configuration:`, 'info');
  
  Object.entries(TEST_CONFIG).forEach(([key, config]) => {
    log(`   ${config.name}: ${config.enabled ? '✅ Enabled' : '❌ Disabled'}`, 'info');
  });
  
  const allResults = {
    suites: {},
    summary: {
      total: 0,
      passed: 0,
      failed: 0,
      startTime,
      endTime: null,
      duration: null
    }
  };
  
  // Run API tests
  if (TEST_CONFIG.api.enabled) {
    allResults.suites.api = await runAPITestSuite();
    allResults.summary.total += allResults.suites.api.total;
    allResults.summary.passed += allResults.suites.api.passed;
    allResults.summary.failed += allResults.suites.api.failed;
  }
  
  // Run Frontend tests
  if (TEST_CONFIG.frontend.enabled) {
    allResults.suites.frontend = await runFrontendTestSuite();
    allResults.summary.total += allResults.suites.frontend.total;
    allResults.summary.passed += allResults.suites.frontend.passed;
    allResults.summary.failed += allResults.suites.frontend.failed;
  }
  
  // Run Database tests
  if (TEST_CONFIG.database.enabled) {
    allResults.suites.database = await runDatabaseTestSuite();
    allResults.summary.total += allResults.suites.database.total;
    allResults.summary.passed += allResults.suites.database.passed;
    allResults.summary.failed += allResults.suites.database.failed;
  }
  
  // Calculate final summary
  allResults.summary.endTime = Date.now();
  allResults.summary.duration = allResults.summary.endTime - startTime;
  
  // Final summary
  logSection('Final Test Results Summary');
  
  log(`⏱️  Total Duration: ${(allResults.summary.duration / 1000).toFixed(2)} seconds`, 'info');
  log(`📊 Overall Results:`, 'info');
  log(`   Total Tests: ${allResults.summary.total}`, 'info');
  log(`   Passed: ${allResults.summary.passed}`, allResults.summary.passed > 0 ? 'success' : 'info');
  log(`   Failed: ${allResults.summary.failed}`, allResults.summary.failed > 0 ? 'error' : 'info');
  log(`   Success Rate: ${((allResults.summary.passed / allResults.summary.total) * 100).toFixed(1)}%`, 'info');
  
  // Suite breakdown
  log('\n📋 Test Suite Breakdown:', 'info');
  Object.entries(allResults.suites).forEach(([suiteName, results]) => {
    const status = results.failed > 0 ? '❌' : '✅';
    log(`   ${status} ${suiteName}: ${results.passed}/${results.total} passed`, 
        results.failed > 0 ? 'error' : 'success');
  });
  
  // Failed tests summary
  if (allResults.summary.failed > 0) {
    log('\n❌ Failed Tests Summary:', 'error');
    Object.entries(allResults.suites).forEach(([suiteName, results]) => {
      if (results.failed > 0) {
        log(`   ${suiteName}:`, 'error');
        results.details
          .filter(r => !r.passed)
          .forEach(r => log(`     - ${r.scenario}`, 'error'));
      }
    });
  }
  
  // Update tracking document
  await updateTrackingDocument(allResults);
  
  return allResults;
}

// Update the tracking document
async function updateTrackingDocument(results) {
  try {
    const trackingPath = path.join(__dirname, '..', 'PRODUCT-TESTING-TRACKER.md');
    
    if (!fs.existsSync(trackingPath)) {
      log('Tracking document not found, skipping update', 'warning');
      return;
    }
    
    let content = fs.readFileSync(trackingPath, 'utf8');
    
    // Update test results summary
    const totalTests = results.summary.total;
    const passedTests = results.summary.passed;
    const failedTests = results.summary.failed;
    const successRate = ((passedTests / totalTests) * 100).toFixed(1);
    
    // Update overall status
    const overallStatus = failedTests === 0 ? '🟢 All Tests Passed' : '🔴 Some Tests Failed';
    
    // Update the summary section
    content = content.replace(
      /### \*\*Overall Status: 🟡 In Progress\*\*/,
      `### **Overall Status: ${overallStatus}**`
    );
    
    content = content.replace(
      /- \*\*Total Tests:\*\* 0\/25/,
      `- **Total Tests:** ${totalTests}/${totalTests}`
    );
    
    content = content.replace(
      /- \*\*Passed:\*\* 0/,
      `- **Passed:** ${passedTests}`
    );
    
    content = content.replace(
      /- \*\*Failed:\*\* 0/,
      `- **Failed:** ${failedTests}`
    );
    
    content = content.replace(
      /- \*\*Success Rate:\*\* TBD/,
      `- **Success Rate:** ${successRate}%`
    );
    
    // Update last updated section
    const currentDate = new Date().toISOString().split('T')[0];
    content = content.replace(
      /## 🔄 \*\*Last Updated\*\*\n\*\*Date:\*\* Initial setup/,
      `## 🔄 **Last Updated**\n**Date:** ${currentDate}`
    );
    
    content = content.replace(
      /\*\*Status:\*\* Initial setup complete, ready to begin testing/,
      `**Status:** Test run completed - ${passedTests}/${totalTests} tests passed`
    );
    
    fs.writeFileSync(trackingPath, content);
    log('✅ Tracking document updated successfully', 'success');
    
  } catch (error) {
    log(`Failed to update tracking document: ${error.message}`, 'error');
  }
}

// Main execution
if (require.main === module) {
  runAllTestSuites()
    .then(results => {
      const exitCode = results.summary.failed > 0 ? 1 : 0;
      log(`\n🏁 Test suite completed with exit code: ${exitCode}`, exitCode === 0 ? 'success' : 'error');
      process.exit(exitCode);
    })
    .catch(error => {
      log(`Fatal error in test suite: ${error.message}`, 'error');
      process.exit(1);
    });
}

module.exports = {
  runAllTestSuites,
  runAPITestSuite,
  runFrontendTestSuite,
  runDatabaseTestSuite
};
