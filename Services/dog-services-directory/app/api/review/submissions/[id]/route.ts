import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const submissionId = params.id;
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.service_type) {
      return NextResponse.json(
        { error: 'Name and service type are required' },
        { status: 400 }
      );
    }

    // Update the submission
    const { error } = await supabaseAdmin
      .from('service_submissions')
      .update({
        name: body.name,
        service_type: body.service_type,
        description: body.description || null,
        email: body.email || null,
        contact_phone: body.contact_phone || null,
        website_url: body.website_url || null,
        address: body.address || null,
        address_line_2: body.address_line_2 || null,
        city: body.city || null,
        state: body.state || null,
        zip_code: body.zip_code || null,
        latitude: body.latitude || null,
        longitude: body.longitude || null,
        needs_geocoding_review: body.needs_geocoding_review || false,
      })
      .eq('id', submissionId);

    if (error) {
      console.error('Error updating submission:', error);
      return NextResponse.json(
        { error: 'Failed to update submission' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 