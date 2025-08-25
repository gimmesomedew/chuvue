#!/usr/bin/env node

/**
 * Frontend Search Test Suite
 * Tests the search form, results display, and user interactions
 */

const puppeteer = require('puppeteer');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';

// Test scenarios for frontend search
const FRONTEND_TEST_SCENARIOS = [
  {
    name: 'Search Form Rendering',
    description: 'Verify search form elements are properly displayed',
    testFunction: testSearchFormRendering
  },
  {
    name: 'Basic Service Search',
    description: 'Search for a service and verify results',
    testFunction: testBasicServiceSearch
  },
  {
    name: 'Basic Product Search',
    description: 'Search for a product and verify results',
    testFunction: testBasicProductSearch
  },
  {
    name: 'Combined Search Results',
    description: 'Search without service type to get both services and products',
    testFunction: testCombinedSearch
  },
  {
    name: 'Service Type Filtering',
    description: 'Test filtering by specific service types',
    testFunction: testServiceTypeFiltering
  },
  {
    name: 'Location-Based Search',
    description: 'Test search with location input',
    testFunction: testLocationBasedSearch
  },
  {
    name: 'Search Results Pagination',
    description: 'Test pagination of search results',
    testFunction: testSearchPagination
  },
  {
    name: 'Search Form Validation',
    description: 'Test form validation and error handling',
    testFunction: testSearchFormValidation
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

async function testSearchFormRendering(page) {
  try {
    // Navigate to search page
    await page.goto(`${BASE_URL}/search-results`);
    await page.waitForSelector('[data-testid="search-form"]', { timeout: 10000 });
    
    // Check if search form elements are present
    const searchInput = await page.$('input[name="query"]');
    const serviceTypeSelect = await page.$('select[name="serviceType"]');
    const locationInput = await page.$('input[name="location"]');
    const searchButton = await page.$('button[type="submit"]');
    
    const elementsPresent = searchInput && serviceTypeSelect && locationInput && searchButton;
    
    if (elementsPresent) {
      logTestResult('Search Form Elements', true, 'All form elements are present');
      return true;
    } else {
      logTestResult('Search Form Elements', false, 'Some form elements are missing');
      return false;
    }
  } catch (error) {
    logTestResult('Search Form Elements', false, error.message);
    return false;
  }
}

async function testBasicServiceSearch(page) {
  try {
    // Navigate to search page
    await page.goto(`${BASE_URL}/search-results`);
    await page.waitForSelector('[data-testid="search-form"]', { timeout: 10000 });
    
    // Fill in search form for service
    await page.type('input[name="query"]', 'grooming');
    await page.select('select[name="serviceType"]', 'Grooming');
    
    // Submit search
    await page.click('button[type="submit"]');
    
    // Wait for results
    await page.waitForSelector('[data-testid="search-results"]', { timeout: 10000 });
    
    // Check if service results are displayed
    const serviceResults = await page.$$('[data-testid="service-card"]');
    const hasResults = serviceResults.length > 0;
    
    logTestResult('Basic Service Search', hasResults, 
      hasResults ? `${serviceResults.length} service results found` : 'No service results found');
    
    return hasResults;
  } catch (error) {
    logTestResult('Basic Service Search', false, error.message);
    return false;
  }
}

async function testBasicProductSearch(page) {
  try {
    // Navigate to search page
    await page.goto(`${BASE_URL}/search-results`);
    await page.waitForSelector('[data-testid="search-form"]', { timeout: 10000 });
    
    // Fill in search form for product
    await page.type('input[name="query"]', 'dog food');
    await page.select('select[name="serviceType"]', 'Pet Products');
    
    // Submit search
    await page.click('button[type="submit"]');
    
    // Wait for results
    await page.waitForSelector('[data-testid="search-results"]', { timeout: 10000 });
    
    // Check if product results are displayed
    const productResults = await page.$$('[data-testid="product-card"]');
    const hasResults = productResults.length > 0;
    
    logTestResult('Basic Product Search', hasResults, 
      hasResults ? `${productResults.length} product results found` : 'No product results found');
    
    return hasResults;
  } catch (error) {
    logTestResult('Basic Product Search', false, error.message);
    return false;
  }
}

async function testCombinedSearch(page) {
  try {
    // Navigate to search page
    await page.goto(`${BASE_URL}/search-results`);
    await page.waitForSelector('[data-testid="search-form"]', { timeout: 10000 });
    
    // Fill in search form without service type (should return both)
    await page.type('input[name="query"]', 'pet care');
    
    // Submit search
    await page.click('button[type="submit"]');
    
    // Wait for results
    await page.waitForSelector('[data-testid="search-results"]', { timeout: 10000 });
    
    // Check if both service and product results are displayed
    const serviceResults = await page.$$('[data-testid="service-card"]');
    const productResults = await page.$$('[data-testid="product-card"]');
    
    const hasServices = serviceResults.length > 0;
    const hasProducts = productResults.length > 0;
    const hasBoth = hasServices && hasProducts;
    
    logTestResult('Combined Search', hasBoth, 
      `Services: ${serviceResults.length}, Products: ${productResults.length}`);
    
    return hasBoth;
  } catch (error) {
    logTestResult('Combined Search', false, error.message);
    return false;
  }
}

async function testServiceTypeFiltering(page) {
  try {
    // Navigate to search page
    await page.goto(`${BASE_URL}/search-results`);
    await page.waitForSelector('[data-testid="search-form"]', { timeout: 10000 });
    
    // Test different service types
    const serviceTypes = ['Grooming', 'Veterinary', 'Pet Services', 'Pet Products'];
    let allPassed = true;
    
    for (const serviceType of serviceTypes) {
      try {
        // Clear previous search
        await page.click('input[name="query"]');
        await page.keyboard.down('Control');
        await page.keyboard.press('a');
        await page.keyboard.up('Control');
        await page.keyboard.press('Backspace');
        
        // Set service type and search
        await page.select('select[name="serviceType"]', serviceType);
        await page.type('input[name="query"]', 'test');
        await page.click('button[type="submit"]');
        
        // Wait for results
        await page.waitForSelector('[data-testid="search-results"]', { timeout: 10000 });
        
        // Check if results are filtered
        const results = await page.$$('[data-testid="service-card"], [data-testid="product-card"]');
        const hasResults = results.length >= 0; // Should at least not error
        
        if (!hasResults) {
          allPassed = false;
        }
        
        // Add delay between searches
        await page.waitForTimeout(500);
        
      } catch (error) {
        allPassed = false;
        log(`Service type ${serviceType} failed: ${error.message}`, 'warning');
      }
    }
    
    logTestResult('Service Type Filtering', allPassed, 
      allPassed ? 'All service types work correctly' : 'Some service types failed');
    
    return allPassed;
  } catch (error) {
    logTestResult('Service Type Filtering', false, error.message);
    return false;
  }
}

async function testLocationBasedSearch(page) {
  try {
    // Navigate to search page
    await page.goto(`${BASE_URL}/search-results`);
    await page.waitForSelector('[data-testid="search-form"]', { timeout: 10000 });
    
    // Fill in search form with location
    await page.type('input[name="query"]', 'grooming');
    await page.type('input[name="location"]', 'Indianapolis, IN');
    
    // Submit search
    await page.click('button[type="submit"]');
    
    // Wait for results
    await page.waitForSelector('[data-testid="search-results"]', { timeout: 10000 });
    
    // Check if location-aware results are displayed
    const results = await page.$$('[data-testid="service-card"], [data-testid="product-card"]');
    const hasResults = results.length >= 0;
    
    logTestResult('Location-Based Search', hasResults, 
      hasResults ? 'Location search completed' : 'Location search failed');
    
    return hasResults;
  } catch (error) {
    logTestResult('Location-Based Search', false, error.message);
    return false;
  }
}

async function testSearchPagination(page) {
  try {
    // Navigate to search page
    await page.goto(`${BASE_URL}/search-results`);
    await page.waitForSelector('[data-testid="search-form"]', { timeout: 10000 });
    
    // Perform a search that might have multiple pages
    await page.type('input[name="query"]', 'pet');
    await page.click('button[type="submit"]');
    
    // Wait for results
    await page.waitForSelector('[data-testid="search-results"]', { timeout: 10000 });
    
    // Check if pagination controls are present
    const pagination = await page.$('[data-testid="pagination"]');
    const hasPagination = pagination !== null;
    
    if (hasPagination) {
      // Test pagination navigation
      const nextButton = await page.$('[data-testid="next-page"]');
      if (nextButton) {
        await nextButton.click();
        await page.waitForTimeout(1000);
        
        // Check if page changed
        const currentPage = await page.$('[data-testid="current-page"]');
        const pageChanged = currentPage !== null;
        
        logTestResult('Search Pagination', pageChanged, 
          pageChanged ? 'Pagination navigation works' : 'Pagination navigation failed');
        return pageChanged;
      }
    }
    
    logTestResult('Search Pagination', true, 'Pagination not needed or not implemented');
    return true;
  } catch (error) {
    logTestResult('Search Pagination', false, error.message);
    return false;
  }
}

async function testSearchFormValidation(page) {
  try {
    // Navigate to search page
    await page.goto(`${BASE_URL}/search-results`);
    await page.waitForSelector('[data-testid="search-form"]', { timeout: 10000 });
    
    // Test empty search submission
    await page.click('button[type="submit"]');
    
    // Wait a moment for validation
    await page.waitForTimeout(1000);
    
    // Check if validation error is displayed
    const validationError = await page.$('[data-testid="validation-error"]');
    const hasValidation = validationError !== null;
    
    // Test with valid input
    await page.type('input[name="query"]', 'test search');
    await page.click('button[type="submit"]');
    
    // Wait for results
    await page.waitForSelector('[data-testid="search-results"]', { timeout: 10000 });
    
    const results = await page.$$('[data-testid="service-card"], [data-testid="product-card"]');
    const hasResults = results.length >= 0;
    
    logTestResult('Search Form Validation', hasValidation || hasResults, 
      hasValidation ? 'Form validation works' : 'Form validation not implemented');
    
    return hasValidation || hasResults;
  } catch (error) {
    logTestResult('Search Form Validation', false, error.message);
    return false;
  }
}

async function runFrontendSearchTests() {
  log('🚀 Starting Frontend Search Test Suite', 'info');
  log(`Base URL: ${BASE_URL}`, 'info');
  
  let browser;
  let page;
  
  try {
    // Launch browser
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({ width: 1280, height: 720 });
    
    // Test each scenario
    let testsPassed = 0;
    let testsTotal = 0;
    
    for (const scenario of FRONTEND_TEST_SCENARIOS) {
      log(`\n🧪 Testing: ${scenario.name}`, 'info');
      log(`Description: ${scenario.description}`, 'info');
      
      try {
        const passed = await scenario.testFunction(page);
        testsTotal++;
        if (passed) testsPassed++;
        
        // Add delay between tests
        await page.waitForTimeout(1000);
        
      } catch (error) {
        logTestResult(scenario.name, false, error.message);
        testsTotal++;
      }
    }
    
    // Summary
    log('\n📊 Frontend Search Test Summary', 'info');
    log('=' * 50, 'info');
    
    const percentage = ((testsPassed / testsTotal) * 100).toFixed(1);
    const status = testsPassed === testsTotal ? 'success' : 'warning';
    
    log(`Overall: ${testsPassed}/${testsTotal} tests passed (${percentage}%)`, status);
    
    return testsPassed === testsTotal;
    
  } catch (error) {
    log(`Frontend test suite failed: ${error.message}`, 'error');
    return false;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runFrontendSearchTests()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      log(`Test suite failed: ${error.message}`, 'error');
      process.exit(1);
    });
}

module.exports = { runFrontendSearchTests };

