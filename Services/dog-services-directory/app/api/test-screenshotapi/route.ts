import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const SCREENSHOT_API_KEY = process.env.SCREENSHOT_API_KEY;
    
    if (!SCREENSHOT_API_KEY) {
      return NextResponse.json({ error: 'No API key found' }, { status: 400 });
    }

    // Test different endpoints and methods
    const testResults: Array<{
      endpoint: string;
      status?: number;
      ok?: boolean;
      headers?: Record<string, string>;
      response?: any;
      error?: string;
    }> = [];
    
    // Test 1: Basic endpoint
    try {
      const response1 = await fetch('https://api.screenshotapi.net/screenshot', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SCREENSHOT_API_KEY}`
        },
        body: JSON.stringify({
          url: 'https://example.com',
          width: 1200,
          height: 800,
          format: 'png'
        }),
      });
      
      testResults.push({
        endpoint: 'https://api.screenshotapi.net/screenshot',
        status: response1.status,
        ok: response1.ok,
        headers: Object.fromEntries(response1.headers.entries())
      });
      
      if (response1.ok) {
        const data = await response1.json();
        testResults[testResults.length - 1].response = data;
      } else {
        const errorText = await response1.text();
        testResults[testResults.length - 1].error = errorText;
      }
    } catch (error) {
      testResults.push({
        endpoint: 'https://api.screenshotapi.net/screenshot',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test 2: Alternative endpoint
    try {
      const response2 = await fetch('https://screenshotapi.net/screenshot', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SCREENSHOT_API_KEY}`
        },
        body: JSON.stringify({
          url: 'https://example.com',
          width: 1200,
          height: 800,
          format: 'png'
        }),
      });
      
      testResults.push({
        endpoint: 'https://screenshotapi.net/screenshot',
        status: response2.status,
        ok: response2.ok,
        headers: Object.fromEntries(response2.headers.entries())
      });
      
      if (response2.ok) {
        const data = await response2.json();
        testResults[testResults.length - 1].response = data;
      } else {
        const errorText = await response2.text();
        testResults[testResults.length - 1].error = errorText;
      }
    } catch (error) {
      testResults.push({
        endpoint: 'https://screenshotapi.net/screenshot',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test 3: Check if service is accessible
    try {
      const response3 = await fetch('https://screenshotapi.net/', { method: 'GET' });
      testResults.push({
        endpoint: 'https://screenshotapi.net/ (accessibility)',
        status: response3.status,
        ok: response3.ok
      });
    } catch (error) {
      testResults.push({
        endpoint: 'https://screenshotapi.net/ (accessibility)',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    return NextResponse.json({
      message: 'Screenshotapi.net test results',
      apiKey: {
        found: !!SCREENSHOT_API_KEY,
        length: SCREENSHOT_API_KEY.length,
        preview: `${SCREENSHOT_API_KEY.substring(0, 8)}...`
      },
      testResults,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Test failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
