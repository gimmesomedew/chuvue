import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function POST(request: NextRequest) {
  try {
    const { submissionId } = await request.json();

    if (!submissionId) {
      return NextResponse.json({ error: 'Submission ID is required' }, { status: 400 });
    }

    // Get the product submission details
    const { data: submission, error: fetchError } = await supabaseAdmin
      .from('product_submissions')
      .select('*')
      .eq('id', submissionId)
      .single();

    if (fetchError || !submission) {
      return NextResponse.json({ error: 'Product submission not found' }, { status: 404 });
    }

    // Update the submission status to approved
    const { error: updateError } = await supabaseAdmin
      .from('product_submissions')
      .update({ status: 'approved' })
      .eq('id', submissionId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Insert the approved product into the products table
    const { error: insertError } = await supabaseAdmin
      .from('products')
      .insert([{
        name: submission.name,
        description: submission.description,
        website: submission.website,
        contact_number: submission.contact_number,
        email: submission.email,
        location_address: submission.location_address,
        city: submission.city,
        state: submission.state,
        zip_code: submission.zip_code,
        latitude: submission.latitude,
        longitude: submission.longitude,
        is_verified_gentle_care: submission.is_verified_gentle_care,
        image_url: submission.image_url,
        status: 'active'
      }]);

    if (insertError) {
      console.error('Error inserting approved product:', insertError);
      // Don't fail the approval if product insertion fails
      // The submission was already approved
    }

    return NextResponse.json({ 
      message: 'Product submission approved successfully',
      geocodingError: false
    });

  } catch (error) {
    console.error('Error approving product submission:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
