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

    console.log('Starting logo extraction for product:', productId, 'URL:', websiteUrl);
    
    // Extract logo and rich link data
    const result = await extractLogoAndRichData(websiteUrl);
    
    if (!result) {
      return NextResponse.json({ 
        error: 'Failed to extract logo or rich data' 
      }, { status: 500 });
    }

    // Update the product with the new image
    const { error: updateError } = await supabaseAdmin
      .from('products')
      .update({ 
        image_url: result.imageUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', productId);

    if (updateError) {
      console.error('Error updating product with logo:', updateError);
      return NextResponse.json({ 
        error: 'Failed to update product with logo' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Logo extracted and product updated successfully',
      imageUrl: result.imageUrl,
      extractedData: result.extractedData
    });

  } catch (error) {
    console.error('Logo extraction error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function extractLogoAndRichData(websiteUrl: string): Promise<{ imageUrl: string; extractedData: any } | null> {
  try {
    const BROWSERLESS_API_KEY = process.env.BROWSERLESS_API_KEY;
    
    if (!BROWSERLESS_API_KEY) {
      console.log('No Browserless API key found, using fallback');
      return {
        imageUrl: `https://via.placeholder.com/400x400/4F46E5/FFFFFF?text=Logo+Extraction+Unavailable`,
        extractedData: { error: 'No API key configured' }
      };
    }

    console.log('Using Browserless.io to extract logo and rich data...');
    
    // Use Browserless.io to execute JavaScript and extract data
    const response = await fetch(`https://production-sfo.browserless.io/function?token=${BROWSERLESS_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: `
          (async () => {
            try {
              // Navigate to the page
              await page.goto('${websiteUrl}', { 
                waitUntil: 'networkidle0',
                timeout: 30000 
              });
              
              // Wait a bit for dynamic content to load
              await page.waitForTimeout(2000);
              
              // Extract logo and rich data
              const result = await page.evaluate(() => {
                const data = {};
                
                // Try to find logo in various ways
                const logoSelectors = [
                  'img[src*="logo"]',
                  'img[alt*="logo" i]',
                  'img[alt*="brand" i]',
                  'img[alt*="company" i]',
                  '.logo img',
                  '.brand img',
                  '.header img',
                  'header img',
                  'nav img',
                  '.navbar img',
                  '[class*="logo"] img',
                  '[id*="logo"] img'
                ];
                
                // Find the first logo image
                let logoImg = null;
                for (const selector of logoSelectors) {
                  const img = document.querySelector(selector);
                  if (img && img.src && img.naturalWidth > 50 && img.naturalHeight > 50) {
                    logoImg = img;
                    break;
                  }
                }
                
                if (logoImg) {
                  data.logo = {
                    src: logoImg.src,
                    alt: logoImg.alt,
                    width: logoImg.naturalWidth,
                    height: logoImg.naturalHeight
                  };
                }
                
                // Extract Open Graph and Twitter Card data
                data.meta = {};
                const metaTags = document.querySelectorAll('meta');
                metaTags.forEach(tag => {
                  const property = tag.getAttribute('property') || tag.getAttribute('name');
                  const content = tag.getAttribute('content');
                  if (property && content) {
                    data.meta[property] = content;
                  }
                });
                
                // Extract favicon
                const favicon = document.querySelector('link[rel*="icon"]');
                if (favicon) {
                  data.favicon = favicon.href;
                }
                
                // Extract title
                data.title = document.title;
                
                // Extract description
                const description = document.querySelector('meta[name="description"]');
                if (description) {
                  data.description = description.getAttribute('content');
                }
                
                // Find the best image to use
                let bestImage = null;
                
                // Priority 1: Open Graph image
                if (data.meta['og:image']) {
                  bestImage = data.meta['og:image'];
                }
                // Priority 2: Twitter Card image
                else if (data.meta['twitter:image']) {
                  bestImage = data.meta['twitter:image'];
                }
                // Priority 3: Logo
                else if (data.logo && data.logo.src) {
                  bestImage = data.logo.src;
                }
                // Priority 4: Favicon
                else if (data.favicon) {
                  bestImage = data.favicon;
                }
                
                data.bestImage = bestImage;
                
                return data;
              });
              
              return result;
            } catch (error) {
              return { error: error.message };
            }
          })()
        `,
        context: {
          url: websiteUrl
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Browserless.io error:', errorText);
      throw new Error(`Browserless.io failed: ${response.status} ${errorText}`);
    }

    const extractedData = await response.json();
    console.log('Extracted data:', extractedData);

    // Determine the best image URL to use
    let imageUrl = null;
    
    if (extractedData.bestImage) {
      imageUrl = extractedData.bestImage;
    } else if (extractedData.logo && extractedData.logo.src) {
      imageUrl = extractedData.logo.src;
    } else if (extractedData.favicon) {
      imageUrl = extractedData.favicon;
    }

    // If we found an image, return it
    if (imageUrl) {
      // Ensure the URL is absolute
      if (!imageUrl.startsWith('http')) {
        try {
          const baseUrl = new URL(websiteUrl);
          imageUrl = new URL(imageUrl, baseUrl).href;
        } catch (e) {
          console.error('Error making URL absolute:', e);
        }
      }
      
      console.log('Using extracted image:', imageUrl);
      return {
        imageUrl,
        extractedData
      };
    }

    // Fallback if no image found
    console.log('No image found, using fallback');
    return {
      imageUrl: `https://via.placeholder.com/400x400/4F46E5/FFFFFF?text=No+Logo+Found`,
      extractedData
    };

  } catch (error) {
    console.error('Logo extraction failed:', error);
    
    // Return fallback
    return {
      imageUrl: `https://via.placeholder.com/400x400/4F46E5/FFFFFF?text=Extraction+Failed`,
      extractedData: { error: error instanceof Error ? error.message : 'Unknown error' }
    };
  }
}
