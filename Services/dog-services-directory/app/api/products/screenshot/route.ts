import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, websiteUrl } = body;

    if (!productId || !websiteUrl) {
      return NextResponse.json(
        { error: 'Product ID and website URL are required' },
        { status: 400 }
      );
    }

    // Validate URL format
    let url: URL;
    try {
      url = new URL(websiteUrl);
      if (!url.protocol.startsWith('http')) {
        throw new Error('Invalid protocol');
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid website URL format' },
        { status: 400 }
      );
    }

    console.log('📸 Capturing screenshot for product', productId, 'from', websiteUrl);

    // Use a reliable screenshot service (you can choose one of these options)
    let screenshotUrl: string;

    try {
      // Option 1: Using ScreenshotOne API (recommended for production)
      // You'll need to sign up at https://screenshotone.com/ and get an API key
      const SCREENSHOT_API_KEY = process.env.SCREENSHOT_API_KEY;
      
      if (SCREENSHOT_API_KEY) {
        // ScreenshotOne API
        const screenshotApiUrl = 'https://api.screenshotone.com/take';
        const params = new URLSearchParams({
          access_key: SCREENSHOT_API_KEY,
          url: websiteUrl,
          viewport_width: '1200',
          viewport_height: '800',
          format: 'jpg',
          quality: '80',
          block_ads: 'true',
          block_trackers: 'true',
          delay: '2', // Wait 2 seconds for page to load
          timeout: '30'
        });

        const response = await fetch(`${screenshotApiUrl}?${params}`);
        
        if (!response.ok) {
          throw new Error(`Screenshot API error: ${response.status}`);
        }

        // For ScreenshotOne, the response is the actual image
        // We'll need to upload it to Supabase Storage or another service
        const imageBuffer = await response.arrayBuffer();
        
        // Upload to Supabase Storage
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
        );

        const fileName = `product-screenshots/${productId}-${Date.now()}.jpg`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, imageBuffer, {
            contentType: 'image/jpeg',
            cacheControl: '3600'
          });

        if (uploadError) {
          console.error('❌ Upload error:', uploadError);
          throw new Error('Failed to upload screenshot');
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        screenshotUrl = publicUrl;
        console.log('✅ Screenshot captured and uploaded:', screenshotUrl);

      } else {
        // Option 2: Fallback to a free service (less reliable)
        console.log('⚠️ No ScreenshotOne API key - using fallback service');
        
        // Using a free screenshot service as fallback
        const fallbackUrl = `https://api.apiflash.com/v1/urltoimage?access_key=${process.env.APIFLASH_KEY || 'demo'}&url=${encodeURIComponent(websiteUrl)}&format=jpeg&quality=85&width=1200&height=800&response_type=json`;
        
        const response = await fetch(fallbackUrl);
        const data = await response.json();
        
        if (data.url) {
          screenshotUrl = data.url;
          console.log('✅ Screenshot captured using fallback service:', screenshotUrl);
        } else {
          throw new Error('Fallback screenshot service failed');
        }
      }

      // Update the product with the screenshot URL
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { error: updateError } = await supabase
        .from('products')
        .update({
          screenshot_url: screenshotUrl,
          screenshot_updated_at: new Date().toISOString()
        })
        .eq('id', productId);

      if (updateError) {
        console.error('❌ Database update error:', updateError);
        return NextResponse.json(
          { error: 'Failed to update product with screenshot' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        screenshot_url: screenshotUrl,
        message: 'Screenshot captured and saved successfully'
      });

    } catch (screenshotError) {
      console.error('❌ Screenshot capture error:', screenshotError);
      
      // Return a more user-friendly error
      return NextResponse.json(
        { 
          error: 'Failed to capture screenshot',
          details: 'The website may be blocking screenshots or the service is temporarily unavailable',
          fallback: 'Consider manually uploading a product image instead'
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ Screenshot API Error:', error);
    return NextResponse.json(
      { error: 'Screenshot capture failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
