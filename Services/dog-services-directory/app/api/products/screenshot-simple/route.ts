import { NextRequest, NextResponse } from 'next/server';

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

    try {
      // Use a free screenshot service for demo purposes
      // In production, you'd want to use a paid service like ScreenshotOne
      const screenshotUrl = `https://api.apiflash.com/v1/urltoimage?access_key=demo&url=${encodeURIComponent(websiteUrl)}&format=jpeg&quality=85&width=1200&height=800`;
      
      console.log('✅ Screenshot URL generated:', screenshotUrl);

      return NextResponse.json({
        success: true,
        screenshot_url: screenshotUrl,
        message: 'Screenshot URL generated successfully (demo mode)',
        note: 'This is a demo screenshot. For production, sign up for a screenshot service API key.'
      });

    } catch (screenshotError) {
      console.error('❌ Screenshot generation error:', screenshotError);
      
      return NextResponse.json(
        { 
          error: 'Failed to generate screenshot',
          details: 'The website may be blocking screenshots or the service is temporarily unavailable',
          fallback: 'Consider manually uploading a product image instead'
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ Screenshot API Error:', error);
    return NextResponse.json(
      { error: 'Screenshot generation failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
