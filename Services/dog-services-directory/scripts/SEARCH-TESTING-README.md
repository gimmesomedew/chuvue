# 🔍 Search Functionality Testing Guide

This guide covers testing the search functionality for services, products, and combined searches in the Dog Services Directory application.

## 📋 Overview

The search testing system consists of three main components:

1. **API Search Tests** - Test the backend search endpoints
2. **Frontend Search Tests** - Test the search form and results display
3. **Master Test Runner** - Orchestrates all search tests

## 🚀 Quick Start

### Run All Search Tests
```bash
npm run test:search
```

### Run Individual Test Suites
```bash
# API tests only
npm run test:search:api

# Frontend tests only
npm run test:search:frontend
```

## 🧪 Test Coverage

### API Search Tests (`test-search-functionality.js`)

#### Test Scenarios
- **Basic Service Search** - Search for services with specific service types
- **Basic Product Search** - Search for products with specific service types
- **Combined Search** - Search without service type to get both services and products
- **Location-Based Search** - Search with location input
- **Simple Search Endpoint** - Test the simplified search API
- **Search with Filters** - Test advanced filtering options

#### Search Query Categories
- **Service Searches**: grooming, veterinary care, dog training, pet sitting, dog walking
- **Product Searches**: dog food, pet toys, dog treats, pet supplies, dog collars
- **Combined Searches**: pet, dog, care, health, wellness
- **Location Searches**: Indianapolis, Carmel, Fishers
- **Edge Cases**: empty queries, whitespace, single characters, very long queries, numeric queries, special characters

#### What Gets Tested
- ✅ HTTP status codes
- ✅ Response structure validation
- ✅ Data quality checks
- ✅ Query preservation
- ✅ Array type validation
- ✅ Error handling

### Frontend Search Tests (`test-frontend-search.js`)

#### Test Scenarios
- **Search Form Rendering** - Verify all form elements are displayed
- **Basic Service Search** - Test service search form submission and results
- **Basic Product Search** - Test product search form submission and results
- **Combined Search Results** - Test search without service type
- **Service Type Filtering** - Test filtering by different service types
- **Location-Based Search** - Test search with location input
- **Search Results Pagination** - Test pagination controls
- **Search Form Validation** - Test form validation and error handling

#### What Gets Tested
- ✅ Form element presence
- ✅ Form submission
- ✅ Search results display
- ✅ Service/product result filtering
- ✅ Location-based search
- ✅ Pagination functionality
- ✅ Form validation

## 🔧 Configuration

### Environment Variables
```bash
# Set the base URL for testing (defaults to localhost:3001)
BASE_URL=http://localhost:3001

# For production testing
BASE_URL=https://your-domain.com
```

### Test Configuration
In `run-search-tests.js`, you can modify:
```javascript
const TEST_CONFIG = {
  api: true,        // Enable/disable API tests
  frontend: true,   // Enable/disable frontend tests
  delay: 2000       // Delay between test suites (ms)
};
```

## 📊 Understanding Test Results

### API Test Results
- **Status Code**: HTTP response status (200 = success)
- **Response Structure**: Required fields present in response
- **Data Quality**: Results are valid arrays, query preserved, etc.

### Frontend Test Results
- **Form Elements**: All required form inputs present
- **Search Results**: Results displayed correctly
- **User Interactions**: Form submission, filtering, pagination work

### Overall Results
- **✅ PASS**: All tests in the suite passed
- **❌ FAIL**: Some tests failed
- **Percentage**: Overall success rate

## 🐛 Troubleshooting

### Common Issues

#### API Tests Failing
1. **Server not running**: Ensure `npm run dev` is running
2. **Wrong port**: Check if server is on port 3001 (not 3000)
3. **Database issues**: Verify Supabase connection
4. **Missing data**: Ensure test data exists in database

#### Frontend Tests Failing
1. **Missing data-testid attributes**: Check if components have proper test IDs
2. **Page not loading**: Verify search page route exists
3. **Form elements missing**: Check if search form is properly rendered
4. **Timeout issues**: Increase timeout values in test functions

#### Puppeteer Issues
1. **Browser launch failures**: Check system dependencies
2. **Headless mode issues**: Try running with `headless: false` for debugging
3. **Selector timeouts**: Verify elements exist and have correct selectors

### Debug Mode

#### Enable Verbose Logging
```javascript
// In test files, add more detailed logging
log(`Debug: ${JSON.stringify(response.data, null, 2)}`, 'info');
```

#### Run Frontend Tests with Visible Browser
```javascript
// In test-frontend-search.js, change headless to false
browser = await puppeteer.launch({
  headless: false,  // Show browser for debugging
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});
```

## 📈 Adding New Tests

### Adding New API Test Scenarios
1. Add to `TEST_SCENARIOS` array in `test-search-functionality.js`
2. Define expected status and fields
3. Test with `testSearchEndpoint()` function

### Adding New Frontend Test Scenarios
1. Add to `FRONTEND_TEST_SCENARIOS` array in `test-frontend-search.js`
2. Create test function following existing pattern
3. Use proper selectors and data-testid attributes

### Adding New Search Query Types
1. Add to appropriate category in `SEARCH_TEST_DATA`
2. Include description and expected behavior
3. Update test logic if needed

## 🔍 Test Data Requirements

### Required Test Data
- **Services**: At least one service in each major category
- **Products**: At least one product in "Pet Products" category
- **Locations**: Services/products with various Indiana locations
- **Service Types**: All major service types defined

### Sample Test Data
```sql
-- Services
INSERT INTO services (name, service_type, city, state) VALUES
('Pawsome Grooming', 'Grooming', 'Indianapolis', 'IN'),
('VetCare Plus', 'Veterinary', 'Carmel', 'IN'),
('Dog Training Pro', 'Pet Services', 'Fishers', 'IN');

-- Products
INSERT INTO products (name, service_type, city, state) VALUES
('Premium Dog Food', 'Pet Products', 'Indianapolis', 'IN'),
('Interactive Pet Toys', 'Pet Products', 'Carmel', 'IN');
```

## 📝 Best Practices

### Writing Tests
1. **Be specific**: Test one thing at a time
2. **Use descriptive names**: Clear test and scenario names
3. **Handle errors gracefully**: Don't let one failure stop all tests
4. **Add delays**: Prevent overwhelming the server
5. **Validate responses**: Check both structure and content

### Maintaining Tests
1. **Update when APIs change**: Keep tests in sync with code
2. **Review test data**: Ensure test data is still valid
3. **Monitor performance**: Watch for slow tests
4. **Document changes**: Update this README when tests change

## 🚀 Integration with CI/CD

### GitHub Actions
```yaml
- name: Run Search Tests
  run: npm run test:search
  env:
    BASE_URL: ${{ secrets.TEST_BASE_URL }}
```

### Pre-commit Hooks
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run test:search:api"
    }
  }
}
```

## 📞 Support

### Getting Help
1. Check this README for common issues
2. Review test output for specific error messages
3. Enable debug logging for more details
4. Check browser console for frontend issues

### Contributing
1. Follow existing test patterns
2. Add comprehensive error handling
3. Update documentation
4. Test your changes thoroughly

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Maintainer**: Development Team

