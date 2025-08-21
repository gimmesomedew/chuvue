# Website Screenshot Capture Setup

This document explains how to set up the website screenshot capture functionality for the Dog Services Directory.

## Overview

The screenshot capture feature allows reviewers and administrators to automatically capture website screenshots and add them to products/services that don't have images. This is particularly useful for products that have websites but no product photos.

## Features

- ✅ **Automatic Screenshot Capture** - Capture website screenshots with one click
- ✅ **Real-time Updates** - Screenshots are immediately added to the service/product
- ✅ **User-friendly Interface** - Simple button in the Edit Service modal
- ✅ **Multiple Service Options** - Support for various screenshot services

## Setup Options

### Option 1: Screenshotapi.net (Recommended for Production)

1. **Sign up** at [https://screenshotapi.net/](https://screenshotapi.net/)
2. **Get your API key** from the dashboard
3. **Add to environment variables**:
   ```bash
   SCREENSHOT_API_KEY=your_api_key_here
   ```

**Pros**: 
- Free tier available (100 screenshots/month)
- Reliable service
- Good documentation
- No server setup required

**Cons**: 
- Limited free tier
- Requires external service

### Option 2: Browserless.io

1. **Sign up** at [https://browserless.io/](https://browserless.io/)
2. **Get your API key** from the dashboard
3. **Add to environment variables**:
   ```bash
   BROWSERLESS_API_KEY=2SuPXcIN9ncg8709b7d9ae68bb95e6c7142a5fd33b8838cf4your_api_key_here
   ```

**Pros**: 
- High-quality screenshots
- Full browser automation
- Good for complex sites

**Cons**: 
- More expensive
- Requires external service

### Option 3: Puppeteer (Self-hosted)

1. **Install Puppeteer**:
   ```bash
   npm install puppeteer
   ```

2. **Update the screenshot function** in `app/api/services/screenshot-advanced/route.ts`:
   ```typescript
   import puppeteer from 'puppeteer';
   
   async function captureWebsiteScreenshot(websiteUrl: string): Promise<string | null> {
     const browser = await puppeteer.launch({ 
       headless: true,
       args: ['--no-sandbox', '--disable-setuid-sandbox']
     });
     
     try {
       const page = await browser.newPage();
       await page.setViewport({ width: 1200, height: 800 });
       await page.goto(websiteUrl, { waitUntil: 'networkidle0' });
       
       const screenshot = await page.screenshot({ 
         type: 'png',
         fullPage: false 
       });
       
       // Upload screenshot to your storage service
       // Return the public URL
       return await uploadScreenshotToStorage(screenshot);
     } finally {
       await browser.close();
     }
   }
   ```

**Pros**: 
- Full control
- No external dependencies
- No usage limits

**Cons**: 
- Requires server setup
- More complex configuration
- Resource intensive

## Environment Variables

Add these to your `.env.local` file:

```bash
# Screenshot API Keys (choose one)
SCREENSHOT_API_KEY=your_screenshotapi_key
BROWSERLESS_API_KEY=your_browserless_key

# Existing variables
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key
```

## Usage

1. **Open Edit Service Modal** - Available to reviewers and administrators
2. **Enter Website URL** - Add the website URL for the product/service
3. **Click "Capture Screenshot"** - Automatically captures and adds the screenshot
4. **Save Changes** - The screenshot is now part of the service

## API Endpoints

- **POST** `/api/services/screenshot` - Basic screenshot capture (placeholder)
- **POST** `/api/services/screenshot-advanced` - Advanced screenshot capture with real services

## Troubleshooting

### Screenshot Not Capturing
- Check if the website URL is valid
- Ensure the screenshot service API key is correct
- Check browser console for errors
- Verify the website is accessible from your server

### Poor Quality Screenshots
- Adjust the width/height parameters in the API
- Increase the delay to allow for page loading
- Check if the website has anti-bot protection

### Rate Limiting
- Monitor your screenshot service usage
- Implement caching for repeated screenshots
- Consider upgrading your plan if needed

## Security Considerations

- **API Keys**: Keep your screenshot service API keys secure
- **URL Validation**: Always validate website URLs before processing
- **Rate Limiting**: Implement rate limiting to prevent abuse
- **Content Filtering**: Consider filtering inappropriate content

## Future Enhancements

- **Screenshot Caching** - Store screenshots to avoid re-capturing
- **Batch Processing** - Capture multiple screenshots at once
- **Quality Settings** - Allow users to choose screenshot quality
- **Scheduled Updates** - Automatically refresh screenshots periodically
- **Mobile Screenshots** - Capture mobile versions of websites

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify your API keys are correct
3. Test with a simple website first
4. Check the screenshot service status page
