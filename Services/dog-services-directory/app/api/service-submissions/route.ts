import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const required = [
      'service_type','name','description','address','city','state','zip_code','latitude','longitude','email'
    ];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }

    // get user id from headers (supabase auth) - for simplicity accept from body
    const user_id = body.user_id || null;

    const { error } = await supabaseAdmin.from('service_submissions').insert([
      {
        user_id,
        service_type: body.service_type,
        name: body.name,
        description: body.description,
        address: body.address,
        city: body.city,
        state: body.state,
        zip_code: body.zip_code,
        latitude: body.latitude,
        longitude: body.longitude,
        contact_phone: body.contact_phone,
        website_url: body.website_url,
        email: body.email,
        facebook_url: body.facebook_url,
        instagram_url: body.instagram_url,
        twitter_url: body.twitter_url,
        pets_name: body.pets_name,
        pet_description: body.pet_description,
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