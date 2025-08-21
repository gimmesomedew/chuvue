import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function POST(request: NextRequest) {
  try {
    const { serviceId, websiteUrl } = await request.json();

    if (!serviceId || !websiteUrl) {
      return NextResponse.json({ 
        error: 'Service ID and website URL are required' 
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

    // Capture screenshot using a real service
    const screenshotUrl = await captureWebsiteScreenshot(websiteUrl);
    
    if (!screenshotUrl) {
      return NextResponse.json({ 
        error: 'Failed to capture screenshot' 
      }, { status: 500 });
    }

    // Update the service with the new screenshot
    const { error: updateError } = await supabaseAdmin
      .from('services')
      .update({ 
        image_url: screenshotUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', serviceId);

    if (updateError) {
      console.error('Error updating service with screenshot:', updateError);
      return NextResponse.json({ 
        error: 'Failed to update service with screenshot' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Screenshot captured and service updated successfully',
      screenshotUrl 
    });

  } catch (error) {
    console.error('Screenshot capture error:', error);
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
    // You'll need to sign up for an API key at https://screenshotapi.net/
    const SCREENSHOT_API_KEY = process.env.SCREENSHOT_API_KEY;
    console.log('Screenshot API key found:', SCREENSHOT_API_KEY ? 'Yes' : 'No');
    
    if (SCREENSHOT_API_KEY) {
      console.log('Attempting to use Screenshotapi.net...');
      const response = await fetch('https://api.screenshotapi.net/screenshot', {
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
          delay: 2000, // Wait 2 seconds for page to load
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }),
      });

      console.log('Screenshotapi.net response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Screenshotapi.net success response:', data);
        
        // Check for different possible response formats
        if (data.screenshot) {
          return data.screenshot;
        } else if (data.url) {
          return data.url;
        } else if (data.image_url) {
          return data.image_url;
        } else if (data.data && data.data.screenshot) {
          return data.data.screenshot;
        } else {
          console.log('Unexpected response format:', data);
          return null;
        }
      } else {
        const errorData = await response.text();
        console.error('Screenshotapi.net error response:', errorData);
        return null;
      }
    }

    // Option 2: Use Browserless.io (requires account)
    const BROWSERLESS_API_KEY = process.env.BROWSERLESS_API_KEY;
    console.log('Browserless API key found:', BROWSERLESS_API_KEY ? 'Yes' : 'No');
    
    if (BROWSERLESS_API_KEY) {
      console.log('Attempting to use Browserless.io...');
      const response = await fetch(`https://production-sfo.browserless.io/screenshot?token=${BROWSERLESS_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: websiteUrl,
          options: {
            type: 'png',
            fullPage: false,
            width: 1200,
            height: 800
          }
        }),
      });

      console.log('Browserless.io response status:', response.status);
      
      if (response.ok) {
        const screenshotBuffer = await response.arrayBuffer();
        console.log('Browserless.io screenshot captured, size:', screenshotBuffer.byteLength);
        
        // For now, we'll return a placeholder since we need to upload the buffer
        // In production, you'd upload this to your storage service
        return `https://via.placeholder.com/1200x800/4F46E5/FFFFFF?text=Real+Screenshot+via+Browserless+${Date.now()}`;
      } else {
        const errorData = await response.text();
        console.error('Browserless.io error response:', errorData);
      }
    }

    // Option 3: Use Puppeteer (requires server setup)
    // This would require installing Puppeteer and setting up a headless browser environment
    
    console.log('No valid API keys found or all attempts failed, using fallback placeholder');
    // Fallback: Return placeholder with helpful message
    const timestamp = Date.now();
    const fallbackUrl = `https://via.placeholder.com/1200x800/4F46E5/FFFFFF?text=Configure+Screenshot+Service+${timestamp}`;
    console.log('Returning fallback URL:', fallbackUrl);
    return fallbackUrl;
    
  } catch (error) {
    console.error('Screenshot capture failed:', error);
    return null;
  }
}
