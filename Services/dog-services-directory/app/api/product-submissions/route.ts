import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Product submission request body:', body);
    
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

    console.log('Extracted fields:', {
      name, description, website, contact_number, email, 
      location_address, city, state, zip_code, latitude, longitude,
      is_verified_gentle_care, image_url, user_id, selectedCategories
    });

    // Validate required fields for products
    if (!name || !description || !website) {
      console.log('Missing required fields:', { name: !!name, description: !!description, website: !!website });
      return NextResponse.json(
        { error: 'Missing required fields: name, description, website' },
        { status: 400 }
      );
    }

    // Validate that at least one category is selected
    if (!selectedCategories || selectedCategories.length === 0) {
      console.log('No categories selected');
      return NextResponse.json(
        { error: 'At least one product category must be selected' },
        { status: 400 }
      );
    }

    // Validate state format if provided (2 characters)
    if (state && state.length !== 2) {
      console.log('Invalid state format:', state);
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
        console.log('Invalid coordinates:', { latitude, longitude });
        return NextResponse.json(
          { error: 'Invalid latitude or longitude values' },
          { status: 400 }
        );
      }
    }

    console.log('Attempting to insert into product_submissions table...');
    
    // First, let's test if we can access the table
    const { data: testData, error: testError } = await supabase
      .from('product_submissions')
      .select('id')
      .limit(1);
    
    if (testError) {
      console.error('Error accessing product_submissions table:', testError);
      return NextResponse.json(
        { error: `Cannot access product_submissions table: ${testError.message}` },
        { status: 500 }
      );
    }
    
    console.log('Table access test successful');
    
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
          location_address: location_address || null,
          city: city || null,
          state: state || null,
          zip_code: zip_code || null,
          latitude: latitude ? parseFloat(latitude) : null,
          longitude: longitude ? parseFloat(longitude) : null,
          is_verified_gentle_care,
          image_url,
          status: 'pending' // Set status to pending for review
        }
      ])
      .select()
      .single();

    if (productError) {
      console.error('Database error inserting product:', productError);
      return NextResponse.json(
        { error: `Failed to create product submission: ${productError.message}` },
        { status: 500 }
      );
    }

    console.log('Product inserted successfully:', product);

    // Create category mappings if categories are selected
    if (selectedCategories.length > 0 && product) {
      console.log('Creating category mappings for categories:', selectedCategories);
      
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
      } else {
        console.log('Category mappings created successfully');
      }
    }

    return NextResponse.json({
      message: 'Product submission created successfully and is pending review',
      data: product
    }, { status: 201 });

  } catch (error) {
    console.error('Product submission error:', error);
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
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
