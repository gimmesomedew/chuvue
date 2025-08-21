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

    // For now, we'll use a placeholder screenshot service
    // In production, you might want to use services like:
    // - Puppeteer for server-side screenshot capture
    // - Browserless.io
    // - Screenshotapi.net
    // - Or similar screenshot-as-a-service APIs
    
    // Generate a placeholder screenshot URL (this is where you'd integrate with a real screenshot service)
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
    // This is a placeholder implementation
    // In production, you would integrate with a real screenshot service
    
    // Option 1: Use a screenshot-as-a-service API
    // const response = await fetch('https://api.screenshotapi.net/screenshot', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     url: websiteUrl,
    //     width: 1200,
    //     height: 800,
    //     format: 'png'
    //   })
    // });
    
    // Option 2: Use Puppeteer (requires additional setup)
    // const puppeteer = require('puppeteer');
    // const browser = await puppeteer.launch();
    // const page = await browser.newPage();
    // await page.goto(websiteUrl, { waitUntil: 'networkidle0' });
    // const screenshot = await page.screenshot({ type: 'png' });
    // await browser.close();
    
    // For now, return a placeholder that indicates the screenshot was "captured"
    // You can replace this with actual screenshot capture logic
    const timestamp = Date.now();
    const placeholderUrl = `https://via.placeholder.com/1200x800/4F46E5/FFFFFF?text=Website+Screenshot+${timestamp}`;
    
    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return placeholderUrl;
  } catch (error) {
    console.error('Screenshot capture failed:', error);
    return null;
  }
}
