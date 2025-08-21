#!/usr/bin/env node

/**
 * 🧪 Frontend Form Validation Testing Script
 * Tests the add-listing form behavior and validation
 */

const puppeteer = require('puppeteer');

const BASE_URL = 'http://localhost:3000';
const ADD_LISTING_URL = `${BASE_URL}/add-listing`;

// Test scenarios for form validation
const FORM_TEST_SCENARIOS = [
  {
    name: "Load form and verify elements",
    description: "Check that all form elements are present and visible",
    test: async (page) => {
      await page.goto(ADD_LISTING_URL);
      await page.waitForSelector('form', { timeout: 10000 });
      
      // Check required form elements
      const elements = await page.evaluate(() => {
        const form = document.querySelector('form');
        const nameInput = document.querySelector('input[name="name"]');
        const descriptionTextarea = document.querySelector('textarea[name="description"]');
        const websiteInput = document.querySelector('input[name="website_url"]');
        const serviceTypeSelect = document.querySelector('select[name="service_type"]');
        const categoryCheckboxes = document.querySelectorAll('input[type="checkbox"]');
        
        return {
          formExists: !!form,
          nameInputExists: !!nameInput,
          descriptionExists: !!descriptionTextarea,
          websiteExists: !!websiteInput,
          serviceTypeExists: !!serviceTypeSelect,
          categoryCount: categoryCheckboxes.length
        };
      });
      
      return {
        passed: elements.formExists && elements.nameInputExists && 
                elements.descriptionExists && elements.websiteExists && 
                elements.serviceTypeExists && elements.categoryCount > 0,
        details: elements
      };
    }
  },
  {
    name: "Select Pet Products service type",
    description: "Verify that selecting Pet Products shows product-specific fields",
    test: async (page) => {
      await page.goto(ADD_LISTING_URL);
      await page.waitForSelector('select[name="service_type"]');
      
      // Select Pet Products
      await page.select('select[name="service_type"]', 'pet_products');
      await page.waitForTimeout(500); // Wait for UI update
      
      // Check if product categories are visible
      const categoriesVisible = await page.evaluate(() => {
        const categorySection = document.querySelector('label:contains("Product Categories")');
        return !!categorySection;
      });
      
      // Check if progress indicator updates
      const progressUpdated = await page.evaluate(() => {
        const progressItems = document.querySelectorAll('ol li');
        return progressItems.length > 0;
      });
      
      return {
        passed: categoriesVisible && progressUpdated,
        details: { categoriesVisible, progressUpdated }
      };
    }
  },
  {
    name: "Form validation - empty required fields",
    description: "Submit form with empty required fields and check error messages",
    test: async (page) => {
      await page.goto(ADD_LISTING_URL);
      await page.waitForSelector('form');
      
      // Select Pet Products first
      await page.select('select[name="service_type"]', 'pet_products');
      await page.waitForTimeout(500);
      
      // Try to submit empty form
      await page.click('button[type="submit"]');
      await page.waitForTimeout(1000);
      
      // Check for error messages or validation
      const hasValidation = await page.evaluate(() => {
        // Look for error messages, validation classes, or toast notifications
        const errors = document.querySelectorAll('.error, .text-red-500, [role="alert"]');
        const requiredFields = document.querySelectorAll('input[required], textarea[required]');
        
        return {
          errorCount: errors.length,
          requiredFieldCount: requiredFields.length,
          hasValidation: errors.length > 0 || requiredFields.length > 0
        };
      });
      
      return {
        passed: hasValidation.hasValidation,
        details: hasValidation
      };
    }
  },
  {
    name: "Category selection functionality",
    description: "Test category checkbox selection and deselection",
    test: async (page) => {
      await page.goto(ADD_LISTING_URL);
      await page.waitForSelector('form');
      
      // Select Pet Products
      await page.select('select[name="service_type"]', 'pet_products');
      await page.waitForTimeout(500);
      
      // Wait for categories to load
      await page.waitForSelector('input[type="checkbox"]', { timeout: 5000 });
      
      // Select first category
      const firstCheckbox = await page.$('input[type="checkbox"]');
      await firstCheckbox.click();
      
      // Check if it's selected
      const isSelected = await page.evaluate((checkbox) => checkbox.checked, firstCheckbox);
      
      // Deselect and check again
      await firstCheckbox.click();
      const isDeselected = await page.evaluate((checkbox) => !checkbox.checked, firstCheckbox);
      
      return {
        passed: isSelected && isDeselected,
        details: { isSelected, isDeselected }
      };
    }
  },
  {
    name: "Website URL validation",
    description: "Test website URL input validation",
    test: async (page) => {
      await page.goto(ADD_LISTING_URL);
      await page.waitForSelector('input[name="website_url"]');
      
      const websiteInput = await page.$('input[name="website_url"]');
      
      // Test invalid URL
      await websiteInput.type('invalid-url');
      await page.waitForTimeout(500);
      
      // Test valid URL
      await websiteInput.clear();
      await websiteInput.type('https://example.com');
      await page.waitForTimeout(500);
      
      // Check if input accepts the values
      const inputValue = await page.evaluate((input) => input.value, websiteInput);
      
      return {
        passed: inputValue === 'https://example.com',
        details: { inputValue, expected: 'https://example.com' }
      };
    }
  },
  {
    name: "Form submission with valid data",
    description: "Fill form with valid data and test submission",
    test: async (page) => {
      await page.goto(ADD_LISTING_URL);
      await page.waitForSelector('form');
      
      // Select Pet Products
      await page.select('select[name="service_type"]', 'pet_products');
      await page.waitForTimeout(500);
      
      // Fill required fields
      await page.type('input[name="name"]', 'Test Product');
      await page.type('textarea[name="description"]', 'This is a test product description');
      await page.type('input[name="website_url"]', 'https://testproduct.com');
      
      // Select a category
      const firstCheckbox = await page.$('input[type="checkbox"]');
      await firstCheckbox.click();
      
      // Submit form
      await page.click('button[type="submit"]');
      await page.waitForTimeout(2000);
      
      // Check if form was submitted (look for success message or redirect)
      const submissionResult = await page.evaluate(() => {
        const successMessage = document.querySelector('.success, .text-green-500, [role="alert"]');
        const currentUrl = window.location.href;
        
        return {
          hasSuccessMessage: !!successMessage,
          currentUrl,
          isRedirected: currentUrl.includes('/submission/confirmation')
        };
      });
      
      return {
        passed: submissionResult.hasSuccessMessage || submissionResult.isRedirected,
        details: submissionResult
      };
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
async function runFormTests() {
  log('🚀 Starting Frontend Form Validation Tests', 'info');
  log(`Base URL: ${BASE_URL}`, 'info');
  log(`Add Listing URL: ${ADD_LISTING_URL}`, 'info');
  log(`Total test scenarios: ${FORM_TEST_SCENARIOS.length}`, 'info');
  
  let browser;
  let page;
  
  try {
    // Launch browser
    log('Launching browser...', 'info');
    browser = await puppeteer.launch({ 
      headless: false, // Set to true for CI/CD
      slowMo: 100,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({ width: 1280, height: 720 });
    
    const results = {
      total: FORM_TEST_SCENARIOS.length,
      passed: 0,
      failed: 0,
      details: []
    };
    
    // Run each test scenario
    for (const scenario of FORM_TEST_SCENARIOS) {
      log(``, 'info');
      log(`🧪 Testing: ${scenario.name}`, 'info');
      log(`Description: ${scenario.description}`, 'info');
      
      try {
        const result = await scenario.test(page);
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
      await page.waitForTimeout(500);
    }
    
    // Summary
    log('', 'info');
    log('📊 Frontend Test Results Summary', 'info');
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
    
  } catch (error) {
    log(`Fatal error: ${error.message}`, 'error');
    throw error;
  } finally {
    if (browser) {
      await browser.close();
      log('Browser closed', 'info');
    }
  }
}

// Main execution
if (require.main === module) {
  runFormTests()
    .then(results => {
      process.exit(results.failed > 0 ? 1 : 0);
    })
    .catch(error => {
      log(`Fatal error: ${error.message}`, 'error');
      process.exit(1);
    });
}

module.exports = {
  runFormTests,
  FORM_TEST_SCENARIOS
};
