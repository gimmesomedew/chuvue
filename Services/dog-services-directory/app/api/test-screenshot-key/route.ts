import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const SCREENSHOT_API_KEY = process.env.SCREENSHOT_API_KEY;
    const BROWSERLESS_API_KEY = process.env.BROWSERLESS_API_KEY;
    
    return NextResponse.json({
      message: 'Screenshot API key status',
      screenshotApiKey: {
        found: !!SCREENSHOT_API_KEY,
        length: SCREENSHOT_API_KEY ? SCREENSHOT_API_KEY.length : 0,
        preview: SCREENSHOT_API_KEY ? `${SCREENSHOT_API_KEY.substring(0, 8)}...` : 'Not found'
      },
      browserlessApiKey: {
        found: !!BROWSERLESS_API_KEY,
        length: BROWSERLESS_API_KEY ? BROWSERLESS_API_KEY.length : 0,
        preview: BROWSERLESS_API_KEY ? `${BROWSERLESS_API_KEY.substring(0, 8)}...` : 'Not found'
      },
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to check API keys' },
      { status: 500 }
    );
  }
}
