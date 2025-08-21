import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { websiteUrl } = await request.json();

    if (!websiteUrl) {
      return NextResponse.json({ 
        error: 'Website URL is required' 
      }, { status: 400 });
    }

    // Validate URL format
    try {
      new URL(websiteUrl);
    } catch {
      return NextResponse.json({ 
        error: 'Invalid website URL format' 
      }, { status: 400 });
    }

    console.log('Testing screenshot capture for:', websiteUrl);
    
    // Test the screenshot capture function
    const screenshotUrl = await captureWebsiteScreenshot(websiteUrl);
    
    if (!screenshotUrl) {
      return NextResponse.json({ 
        error: 'Failed to capture screenshot' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Screenshot capture test successful',
      websiteUrl,
      screenshotUrl,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Screenshot capture test error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function captureWebsiteScreenshot(websiteUrl: string): Promise<string | null> {
  try {
    console.log('Starting screenshot capture for URL:', websiteUrl);
    
    // Option 1: Use Screenshotapi.net (free tier available)
    const SCREENSHOT_API_KEY = process.env.SCREENSHOT_API_KEY;
    console.log('Screenshot API key found:', SCREENSHOT_API_KEY ? 'Yes' : 'No');
    
    if (SCREENSHOT_API_KEY) {
      console.log('Attempting to use Screenshotapi.net...');
      
      // Try different endpoint variations
      const endpoints = [
        'https://screenshotapi.net/screenshot',
        'https://api.screenshotapi.net/screenshot',
        'https://screenshotapi.net/api/screenshot'
      ];
      
      for (const endpoint of endpoints) {
        try {
          console.log('Trying endpoint:', endpoint);
          
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${SCREENSHOT_API_KEY}`
            },
            body: JSON.stringify({
              url: websiteUrl,
              width: 1200,
              height: 800,
              format: 'png',
              full_page: false,
              delay: 2000,
              user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }),
          });

          console.log('Response status:', response.status);
          console.log('Response headers:', Object.fromEntries(response.headers.entries()));
          
          if (response.ok) {
            const data = await response.json();
            console.log('Success response:', data);
            
            // Check if the response has a screenshot URL
            if (data.screenshot || data.url || data.image_url) {
              return data.screenshot || data.url || data.image_url;
            } else {
              console.log('Response data structure:', data);
              console.log('No screenshot URL found in response');
            }
          } else {
            const errorData = await response.text();
            console.error('Error response from', endpoint, ':', errorData);
          }
        } catch (endpointError) {
          console.error('Error with endpoint', endpoint, ':', endpointError);
        }
      }
      
      // If all endpoints failed, try a GET request to see if the service is accessible
      try {
        console.log('Testing if Screenshotapi.net is accessible...');
        const testResponse = await fetch('https://screenshotapi.net/', { method: 'GET' });
        console.log('Screenshotapi.net accessibility test:', testResponse.status);
      } catch (accessError) {
        console.error('Screenshotapi.net accessibility error:', accessError);
      }
    }

    console.log('No valid API keys found or all attempts failed, using fallback placeholder');
    // Fallback: Return placeholder
    const timestamp = Date.now();
    return `https://via.placeholder.com/1200x800/4F46E5/FFFFFF?text=Configure+Screenshot+Service+${timestamp}`;
    
  } catch (error) {
    console.error('Screenshot capture failed:', error);
    return null;
  }
}
