import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { attemptGeocoding, getDefaultCoordinates } from '@/lib/geocoding';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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

    // Attempt to geocode the address
    const geocoded = await attemptGeocoding(address, city, state, zip_code);
    
    let latitude: number;
    let longitude: number;
    let needsReview: boolean;

    if (geocoded.success && typeof geocoded.latitude === 'number' && typeof geocoded.longitude === 'number') {
      latitude = geocoded.latitude;
      longitude = geocoded.longitude;
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
        : 'Coordinates obtained successfully'
    });

  } catch (error) {
    console.error('Error obtaining coordinates:', error);
    return NextResponse.json(
      { error: 'Failed to obtain coordinates' },
      { status: 500 }
    );
  }
} 