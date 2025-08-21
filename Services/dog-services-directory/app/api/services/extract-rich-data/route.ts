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

    console.log('Starting rich data extraction for:', websiteUrl);
    
    // Extract rich link data
    const result = await extractRichData(websiteUrl);
    
    if (!result) {
      return NextResponse.json({ 
        error: 'Failed to extract rich data' 
      }, { status: 500 });
    }

    // Update the service with the new image
    const { error: updateError } = await supabaseAdmin
      .from('services')
      .update({ 
        image_url: result.imageUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', serviceId);

    if (updateError) {
      console.error('Error updating service with rich data:', updateError);
      return NextResponse.json({ 
        error: 'Failed to update service with rich data' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Rich data extracted and service updated successfully',
      imageUrl: result.imageUrl,
      extractedData: result.extractedData
    });

  } catch (error) {
    console.error('Rich data extraction error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function extractRichData(websiteUrl: string): Promise<{ imageUrl: string; extractedData: any } | null> {
  try {
    console.log('Extracting rich data from:', websiteUrl);
    
    // Fetch the HTML content
    const response = await fetch(websiteUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    
    // Parse the HTML to extract meta tags
    const extractedData = parseHTMLForRichData(html, websiteUrl);
    console.log('Extracted rich data:', extractedData);

    // Determine the best image URL to use
    let imageUrl = null;
    
    if (extractedData.bestImage) {
      imageUrl = extractedData.bestImage;
    } else if (extractedData.favicon) {
      imageUrl = extractedData.favicon;
    }

    // If we found an image, return it
    if (imageUrl) {
      console.log('Using extracted image:', imageUrl);
      return {
        imageUrl,
        extractedData
      };
    }

    // Fallback if no image found
    console.log('No image found, using fallback');
    return {
      imageUrl: `https://via.placeholder.com/400x400/4F46E5/FFFFFF?text=No+Rich+Data+Found`,
      extractedData
    };

  } catch (error) {
    console.error('Rich data extraction failed:', error);
    
    // Return fallback
    return {
      imageUrl: `https://via.placeholder.com/400x400/4F46E5/FFFFFF?text=Extraction+Failed`,
      extractedData: { error: error instanceof Error ? error.message : 'Unknown error' }
    };
  }
}

function parseHTMLForRichData(html: string, baseUrl: string): any {
  const data: any = {
    meta: {},
    title: '',
    description: '',
    favicon: '',
    bestImage: ''
  };

  try {
    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) {
      data.title = titleMatch[1].trim();
    }

    // Extract meta tags
    const metaRegex = /<meta[^>]+(?:property|name)=["']([^"']+)["'][^>]+content=["']([^"']+)["'][^>]*>/gi;
    let match;
    while ((match = metaRegex.exec(html)) !== null) {
      const property = match[1].toLowerCase();
      const content = match[2];
      data.meta[property] = content;
    }

    // Extract description
    if (data.meta['description']) {
      data.description = data.meta['description'];
    }

    // Extract favicon
    const faviconMatch = html.match(/<link[^>]+rel=["'][^"']*icon[^"']*["'][^>]+href=["']([^"']+)["'][^>]*>/i);
    if (faviconMatch) {
      data.favicon = makeUrlAbsolute(faviconMatch[1], baseUrl);
    }

    // Find the best image to use
    let bestImage = null;
    
    // Priority 1: Open Graph image
    if (data.meta['og:image']) {
      bestImage = makeUrlAbsolute(data.meta['og:image'], baseUrl);
    }
    // Priority 2: Twitter Card image
    else if (data.meta['twitter:image']) {
      bestImage = makeUrlAbsolute(data.meta['twitter:image'], baseUrl);
    }
    // Priority 3: Favicon
    else if (data.favicon) {
      bestImage = data.favicon;
    }

    data.bestImage = bestImage;

  } catch (error) {
    console.error('Error parsing HTML:', error);
    data.error = error instanceof Error ? error.message : 'Unknown error';
  }

  return data;
}

function makeUrlAbsolute(url: string, baseUrl: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    // Convert HTTP to HTTPS for security and compatibility
    if (url.startsWith('http://')) {
      return url.replace('http://', 'https://');
    }
    return url;
  }
  
  if (url.startsWith('//')) {
    return `https:${url}`;
  }
  
  if (url.startsWith('/')) {
    try {
      const base = new URL(baseUrl);
      return `${base.protocol}//${base.host}${url}`;
    } catch (e) {
      return url;
    }
  }
  
  try {
    const base = new URL(baseUrl);
    return `${base.protocol}//${base.host}/${url}`;
  } catch (e) {
    return url;
  }
}
