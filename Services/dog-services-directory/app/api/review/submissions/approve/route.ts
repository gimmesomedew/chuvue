import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { logServiceError } from '@/lib/errorLogging';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function generateCoordinates(address: string, city: string, state: string, zipCode: string) {
  try {
    const fullAddress = `${address}, ${city}, ${state} ${zipCode}`;
    const encodedAddress = encodeURIComponent(fullAddress);
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${process.env.GOOGLE_MAPS_API_KEY}`
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

export async function POST(req: NextRequest) {
  try {
    const { submissionId } = await req.json();

    if (!submissionId) {
      return NextResponse.json({ error: 'Submission ID is required' }, { status: 400 });
    }

    // Start a Supabase transaction
    const { data: submission, error: fetchError } = await supabaseAdmin
      .from('service_submissions')
      .select('*')
      .eq('id', submissionId)
      .single();

    if (fetchError || !submission) {
      return NextResponse.json(
        { error: fetchError?.message || 'Submission not found' },
        { status: 404 }
      );
    }

    // Generate coordinates
    const { latitude, longitude, error: geocodingError } = await generateCoordinates(
      submission.address,
      submission.city,
      submission.state,
      submission.zip_code
    );

    // If there's a geocoding error, log it
    if (geocodingError) {
      await logServiceError(
        geocodingError,
        'Service Approval - Geocoding',
        submissionId
      );
    }

    // Insert into services table
    const { error: insertError } = await supabaseAdmin.from('services').insert([{
      name: submission.name,
      service_type: submission.service_type,
      description: submission.description,
      address: submission.address,
      city: submission.city,
      state: submission.state,
      zip_code: submission.zip_code,
      website_url: submission.website_url,
      email: submission.email,
      latitude: latitude,
      longitude: longitude,
      geocoding_status: geocodingError ? 'failed' : 'success',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }]);

    if (insertError) {
      return NextResponse.json(
        { error: 'Failed to create service: ' + insertError.message },
        { status: 500 }
      );
    }

    // Update submission status
    const { error: updateError } = await supabaseAdmin
      .from('service_submissions')
      .update({ 
        status: 'approved',
        updated_at: new Date().toISOString(),
        geocoding_status: geocodingError ? 'failed' : 'success',
        geocoding_error: geocodingError || null
      })
      .eq('id', submissionId);

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update submission status: ' + updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      geocodingError: geocodingError || null
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 