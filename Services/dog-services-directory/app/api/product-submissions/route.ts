import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      website,
      contact_number,
      email,
      location_address,
      city,
      state,
      zip_code,
      latitude,
      longitude,
      is_verified_gentle_care = false,
      image_url,
      user_id,
      selectedCategories = []
    } = body;

    // Validate required fields
    if (!name || !location_address || !city || !state || !zip_code) {
      return NextResponse.json(
        { error: 'Missing required fields: name, location_address, city, state, zip_code' },
        { status: 400 }
      );
    }

    // Validate state format (2 characters)
    if (state.length !== 2) {
      return NextResponse.json(
        { error: 'State must be a 2-character abbreviation' },
        { status: 400 }
      );
    }

    // Validate coordinates if provided
    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        return NextResponse.json(
          { error: 'Invalid latitude or longitude values' },
          { status: 400 }
        );
      }
    }

    // Insert the product submission
    const { data: product, error: productError } = await supabase
      .from('product_submissions')
      .insert([
        {
          name,
          description,
          website,
          contact_number,
          email,
          location_address,
          city,
          state,
          zip_code,
          latitude: latitude ? parseFloat(latitude) : null,
          longitude: longitude ? parseFloat(longitude) : null,
          is_verified_gentle_care,
          image_url,
          user_id
        }
      ])
      .select()
      .single();

    if (productError) {
      console.error('Database error:', productError);
      return NextResponse.json(
        { error: 'Failed to create product submission' },
        { status: 500 }
      );
    }

    // Create category mappings if categories are selected
    if (selectedCategories.length > 0 && product) {
      const categoryMappings = selectedCategories.map((categoryId: number) => ({
        product_id: product.id,
        category_id: categoryId
      }));

      const { error: mappingError } = await supabase
        .from('product_category_mappings')
        .insert(categoryMappings);

      if (mappingError) {
        console.error('Error creating category mappings:', mappingError);
        // Don't fail the entire request if category mapping fails
        // The product was created successfully
      }
    }

    return NextResponse.json({
      message: 'Product submission created successfully',
      data: product
    }, { status: 201 });

  } catch (error) {
    console.error('Product submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Get product submissions with pagination
    const { data, error, count } = await supabase
      .from('product_submissions')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch product submissions' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Product submissions fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
