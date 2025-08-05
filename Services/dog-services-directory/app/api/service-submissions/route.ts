import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import { attemptGeocoding, getDefaultCoordinates, needsGeocodingReview } from '@/lib/geocoding';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Generate a fallback email if none supplied (DB column is NOT NULL)
    const emailSafe = (body.email && body.email.trim()) ? body.email.trim() : `no-email-${randomUUID()}@example.com`;

    const required = [
      'service_type', 'name', 'description', 'address', 'city', 'state', 'zip_code'
    ];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }

    // Enhanced geocoding with fallback to default coordinates
    let { latitude, longitude } = body;
    let needsReview = false;

    // Check if coordinates are missing or invalid
    if (!latitude || !longitude || needsGeocodingReview(latitude, longitude)) {
      // Attempt server-side geocoding
      const geocoded = await attemptGeocoding(body.address, body.city, body.state, body.zip_code);
      
      if (geocoded.success) {
        latitude = geocoded.latitude;
        longitude = geocoded.longitude;
        needsReview = false;
      } else {
        // Use default coordinates and flag for review
        const defaults = getDefaultCoordinates(body.state);
        latitude = defaults.latitude;
        longitude = defaults.longitude;
        needsReview = true;
      }
    }

    // Dynamically fetch allowed service types from service_definitions
    let allowedServiceTypes: string[] = [];
    try {
      const { data: defs, error: defsErr } = await supabaseAdmin
        .from('service_definitions')
        .select('service_type');

      if (defsErr) {
        console.error('Error fetching service definitions:', defsErr.message);
      } else {
        allowedServiceTypes = (defs || []).map((d: any) => d.service_type);
      }
    } catch (err) {
      console.error('Unexpected error fetching service definitions:', err);
    }

    // Fallback to other if not in list
    if (allowedServiceTypes.length > 0 && !allowedServiceTypes.includes(body.service_type)) {
      body.service_type = 'other';
    }

    // get user id from headers (supabase auth) - accept from body
    const user_id = body.user_id || null;

    const { error } = await supabaseAdmin.from('service_submissions').insert([
      {
        user_id,
        service_type: body.service_type,
        name: body.name,
        description: body.description,
        address: body.address,
        address_line_2: body.address_line_2 || null,
        city: body.city,
        state: body.state,
        zip_code: body.zip_code,
        latitude: latitude,
        longitude: longitude,
        needs_geocoding_review: needsReview,
        contact_phone: body.contact_phone || 'No phone provided',
        website_url: body.website_url || null,
        email: emailSafe,
        facebook_url: body.facebook_url || null,
        instagram_url: body.instagram_url || null,
        twitter_url: body.twitter_url || null,
        pets_name: body.pets_name || null,
        pet_description: body.pet_description || null,
      },
    ]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
} 