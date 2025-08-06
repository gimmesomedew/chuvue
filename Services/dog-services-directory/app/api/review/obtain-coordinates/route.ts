import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getDefaultCoordinates } from '@/lib/geocoding';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function generateCoordinates(address: string, city: string, state: string, zipCode: string) {
  try {
    const fullAddress = `${address}, ${city}, ${state} ${zipCode}`;
    const encodedAddress = encodeURIComponent(fullAddress);
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Geocoding API request failed');
    }

    const data = await response.json();
    
    if (data.status !== 'OK') {
      throw new Error(`Geocoding failed: ${data.status}`);
    }

    const { lat, lng } = data.results[0].geometry.location;
    return { latitude: lat, longitude: lng, error: null };
  } catch (error) {
    return { 
      latitude: null, 
      longitude: null, 
      error: error instanceof Error ? error.message : 'Failed to geocode address'
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { submissionId, address, city, state, zip_code } = body;

    if (!submissionId || !address || !city || !state || !zip_code) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate coordinates using Google Maps API
    const { latitude: geoLat, longitude: geoLon, error: geocodingError } = await generateCoordinates(
      address,
      city,
      state,
      zip_code
    );

    let latitude: number;
    let longitude: number;
    let needsReview: boolean;

    if (geoLat !== null && geoLon !== null) {
      latitude = geoLat;
      longitude = geoLon;
      needsReview = false;
    } else {
      // Use default coordinates and flag for review
      const defaults = getDefaultCoordinates(state);
      latitude = defaults.latitude;
      longitude = defaults.longitude;
      needsReview = true;
    }

    // Update the submission with new coordinates
    const { error: updateError } = await supabaseAdmin
      .from('service_submissions')
      .update({
        latitude: latitude,
        longitude: longitude,
        needs_geocoding_review: needsReview,
      })
      .eq('id', submissionId);

    if (updateError) {
      console.error('Error updating submission coordinates:', updateError);
      return NextResponse.json(
        { error: 'Failed to update submission coordinates' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      latitude: latitude,
      longitude: longitude,
      needs_geocoding_review: needsReview,
      message: needsReview 
        ? 'Coordinates obtained using fallback method - please verify address accuracy' 
        : 'Coordinates obtained successfully using Google Maps'
    });

  } catch (error) {
    console.error('Error obtaining coordinates:', error);
    return NextResponse.json(
      { error: 'Failed to obtain coordinates' },
      { status: 500 }
    );
  }
} 