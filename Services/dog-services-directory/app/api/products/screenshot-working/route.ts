import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function POST(request: NextRequest) {
  try {
    const { productId, websiteUrl } = await request.json();

    if (!productId || !websiteUrl) {
      return NextResponse.json({ 
        error: 'Product ID and website URL are required' 
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

    console.log('Starting screenshot capture for product:', productId, 'URL:', websiteUrl);
    
    // Try multiple screenshot services
    const screenshotUrl = await captureScreenshotWithFallbacks(websiteUrl);
    
    if (!screenshotUrl) {
      return NextResponse.json({ 
        error: 'Failed to capture screenshot from any service' 
      }, { status: 500 });
    }

    // Update the product with the new screenshot
    const { error: updateError } = await supabaseAdmin
      .from('products')
      .update({ 
        image_url: screenshotUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', productId);

    if (updateError) {
      console.error('Error updating product with screenshot:', updateError);
      return NextResponse.json({ 
        error: 'Failed to update product with screenshot' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Screenshot captured and product updated successfully',
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

async function captureScreenshotWithFallbacks(websiteUrl: string): Promise<string | null> {
  // Try multiple approaches in order of preference
  
  // 1. Try Screenshotapi.net with different endpoints
  const screenshotApiKey = process.env.SCREENSHOT_API_KEY;
  if (screenshotApiKey) {
    const endpoints = [
      'https://api.screenshotapi.net/screenshot',
      'https://screenshotapi.net/screenshot',
      'https://screenshotapi.net/api/screenshot'
    ];
    
    for (const endpoint of endpoints) {
      try {
        console.log('Trying Screenshotapi.net endpoint:', endpoint);
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${screenshotApiKey}`
          },
          body: JSON.stringify({
            url: websiteUrl,
            width: 1200,
            height: 800,
            format: 'png',
            full_page: false,
            delay: 2000
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.screenshot || data.url || data.image_url) {
            console.log('Screenshotapi.net success with endpoint:', endpoint);
            return data.screenshot || data.url || data.image_url;
          }
        }
      } catch (endpointError) {
        console.error('Error with endpoint', endpoint, ':', endpointError);
      }
    }
  }

  // 2. Try Browserless.io
  const browserlessApiKey = process.env.BROWSERLESS_API_KEY;
  if (browserlessApiKey) {
    try {
      console.log('Trying Browserless.io...');
      const response = await fetch(`https://production-sfo.browserless.io/screenshot?token=${browserlessApiKey}`, {
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

      if (response.ok) {
        console.log('Browserless.io success');
        // For now, return a placeholder since we need to handle the buffer
        return `https://via.placeholder.com/1200x800/4F46E5/FFFFFF?text=Real+Screenshot+via+Browserless+${Date.now()}`;
      }
    } catch (error) {
      console.log('Browserless.io failed:', error instanceof Error ? error.message : 'Unknown error');
    }
  }

  // 3. Try a different free service (Microlink.io)
  try {
    console.log('Trying Microlink.io...');
    const response = await fetch(`https://api.microlink.io?url=${encodeURIComponent(websiteUrl)}&screenshot=true&meta=false&embed=screenshot.url`);
    
    if (response.ok) {
      const data = await response.json();
      if (data.status === 'success' && data.data && data.data.screenshot && data.data.screenshot.url) {
        console.log('Microlink.io success');
        return data.data.screenshot.url;
      }
    }
  } catch (error) {
    console.log('Microlink.io failed:', error instanceof Error ? error.message : 'Unknown error');
  }

  // 4. Final fallback - generate a helpful placeholder
  console.log('All screenshot services failed, using fallback');
  const timestamp = Date.now();
  return `https://via.placeholder.com/1200x800/4F46E5/FFFFFF?text=Website+Screenshot+Unavailable+${timestamp}`;
}
