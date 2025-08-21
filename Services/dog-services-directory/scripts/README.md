# 🧪 Product Testing System

This directory contains comprehensive testing scripts for the Dog Services Directory product submission system.

## 📋 **Overview**

The testing system covers three main areas:
1. **API Testing** - Direct endpoint testing
2. **Frontend Testing** - Form behavior and UI testing
3. **Database Testing** - Data storage and integration testing

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 16+ installed
- Development server running (`npm run dev`)
- Supabase environment variables configured
- Puppeteer installed for frontend tests

### **Install Dependencies**
```bash
npm install puppeteer dotenv
```

### **Run All Tests**
```bash
node scripts/run-all-tests.js
```

### **Run Individual Test Suites**
```bash
# API tests only
node scripts/test-product-submission.js

# Frontend tests only
node scripts/test-form-validation.js

# Database tests only
node scripts/test-database-integration.js
```

## 📁 **Script Files**

### **`test-product-submission.js`**
- **Purpose**: Tests the product submission API endpoints
- **Coverage**: 10 test scenarios including valid submissions, validation errors, and edge cases
- **Dependencies**: None (uses fetch API)
- **Output**: Console results with pass/fail status

**Test Scenarios:**
- Valid product with all fields
- Minimal required fields only
- Missing required fields
- Invalid website URLs
- Very long product names
- Special characters in description

### **`test-form-validation.js`**
- **Purpose**: Tests the frontend form behavior and validation
- **Coverage**: 6 test scenarios covering form elements, validation, and submission
- **Dependencies**: Puppeteer for browser automation
- **Output**: Browser-based testing with visual feedback

**Test Scenarios:**
- Form element verification
- Service type selection
- Form validation
- Category selection
- URL validation
- Form submission

### **`test-database-integration.js`**
- **Purpose**: Tests database operations and data integrity
- **Coverage**: 5 test scenarios covering CRUD operations
- **Dependencies**: Supabase client, environment variables
- **Output**: Database operation results and verification

**Test Scenarios:**
- Database connection
- Data insertion
- Status updates
- Timestamp handling
- Data cleanup

### **`run-all-tests.js`**
- **Purpose**: Master test runner that executes all test suites
- **Coverage**: All test scenarios from individual scripts
- **Dependencies**: All other test scripts
- **Output**: Comprehensive report with summary and tracking updates

## ⚙️ **Configuration**

### **Environment Variables**
Create a `.env` file in the project root:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### **Test Configuration**
Modify `TEST_CONFIG` in `run-all-tests.js` to enable/disable specific test suites:
```javascript
const TEST_CONFIG = {
  api: { enabled: true, timeout: 30000 },
  frontend: { enabled: true, timeout: 60000 },
  database: { enabled: true, timeout: 30000 }
};
```

## 📊 **Test Data**

### **Sample Products**
The system includes three sample products for testing:
1. **Pawsome Premium Dog Food** - Complete product with all fields
2. **ZenPaws Calming Chews** - Minimal product with required fields only
3. **HealBeam Pro** - Product with location data

### **Product Categories**
Tests cover all 10 product categories:
- Nutritional, Food, Supplements
- Calming
- Immune Support
- Multi-Vitamin Supplements
- Anti-Inflammatory, Anti-Itch
- Skin and Wound Care
- Teeth and Dental Care
- Gear
- Red Light Therapy
- Other

## 🔍 **Understanding Test Results**

### **Pass/Fail Criteria**
- **API Tests**: HTTP status codes and response validation
- **Frontend Tests**: Element presence, form behavior, and validation
- **Database Tests**: Data insertion, updates, and verification

### **Output Format**
```
🧪 Testing: Valid product with all fields
✅ Valid product with all fields: PASSED
   Details: Status: 200

📊 Test Results Summary
Total Tests: 10
Passed: 8
Failed: 2
Success Rate: 80.0%
```

### **Exit Codes**
- **0**: All tests passed
- **1**: Some tests failed

## 🛠️ **Troubleshooting**

### **Common Issues**

#### **API Tests Failing**
- Ensure development server is running on `http://localhost:3000`
- Check that product submission endpoints are accessible
- Verify API routes are properly configured

#### **Frontend Tests Failing**
- Install Puppeteer: `npm install puppeteer`
- Ensure browser can launch (check system permissions)
- Verify form elements exist on the add-listing page

#### **Database Tests Failing**
- Check Supabase environment variables
- Verify database connection and permissions
- Ensure `product_submissions` table exists

### **Debug Mode**
Add debug logging to individual test scripts:
```javascript
// Enable verbose logging
const DEBUG = true;

if (DEBUG) {
  console.log('Debug info:', data);
}
```

## 📈 **Continuous Integration**

### **GitHub Actions**
Add to your workflow:
```yaml
- name: Run Product Tests
  run: |
    npm install
    node scripts/run-all-tests.js
```

### **Pre-commit Hooks**
Add to package.json:
```json
{
  "scripts": {
    "test:products": "node scripts/run-all-tests.js",
    "precommit": "npm run test:products"
  }
}
```

## 📝 **Adding New Tests**

### **API Test**
1. Add new scenario to `TEST_SCENARIOS` array
2. Define expected status and validation logic
3. Update test data if needed

### **Frontend Test**
1. Add new test object to `FORM_TEST_SCENARIOS`
2. Implement test function with Puppeteer commands
3. Define pass/fail criteria

### **Database Test**
1. Add new test to `DATABASE_TEST_SCENARIOS`
2. Implement database operations
3. Add verification logic

## 🎯 **Best Practices**

1. **Test Isolation**: Each test should be independent
2. **Data Cleanup**: Always clean up test data
3. **Error Handling**: Gracefully handle test failures
4. **Documentation**: Document complex test scenarios
5. **Performance**: Keep tests fast and efficient

## 📞 **Support**

For issues with the testing system:
1. Check the troubleshooting section
2. Review test output for specific error messages
3. Verify environment configuration
4. Check that all dependencies are installed

---

*This testing system ensures the product submission workflow is robust and reliable.*
