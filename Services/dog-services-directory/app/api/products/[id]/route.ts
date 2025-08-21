import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = params.id;
    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const body = await req.json();

    // Allowed fields to update
    const updatable = [
      'name',
      'description',
      'website',
      'contact_number',
      'email',
      'location_address',
      'address_line_2',
      'city',
      'state',
      'zip_code',
      'image_url'
    ];
    
    const updateData: Record<string, any> = {};
    updatable.forEach((field) => {
      if (body[field] !== undefined) updateData[field] = body[field];
    });

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    updateData.updated_at = new Date().toISOString();

    const { error } = await supabaseAdmin
      .from('products')
      .update(updateData)
      .eq('id', productId);

    if (error) {
      console.error('Error updating product:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error updating product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
