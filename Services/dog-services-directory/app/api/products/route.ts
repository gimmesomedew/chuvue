import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const verified = searchParams.get('verified');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('products')
      .select(`
        *,
        categories:product_category_mappings(
          category:product_categories(*)
        )
      `)
      .range(offset, offset + limit - 1);

    // Apply filters
    if (category) {
      query = query.eq('product_category_mappings.category_id', category);
    }

    if (verified === 'true') {
      query = query.eq('is_verified_gentle_care', true);
    }

    const { data: products, error } = await query;

    if (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }

    // Transform the data to flatten the categories
    const transformedProducts = products?.map(product => ({
      ...product,
      categories: product.categories?.map((mapping: any) => mapping.category).filter(Boolean) || []
    })) || [];

    return NextResponse.json({ products: transformedProducts });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, website, contact_number, email, location_address, city, state, zip_code, latitude, longitude, is_verified_gentle_care, categories } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json({ error: 'Product name is required' }, { status: 400 });
    }

    // Insert product
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert({
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
        is_verified_gentle_care: is_verified_gentle_care || false
      })
      .select()
      .single();

    if (productError) {
      console.error('Error creating product:', productError);
      return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }

    // Insert category mappings if categories are provided
    if (categories && Array.isArray(categories) && categories.length > 0) {
      const categoryMappings = categories.map((categoryId: number) => ({
        product_id: product.id,
        category_id: categoryId
      }));

      const { error: mappingError } = await supabase
        .from('product_category_mappings')
        .insert(categoryMappings);

      if (mappingError) {
        console.error('Error creating category mappings:', mappingError);
        // Product was created but categories failed - we could handle this differently
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Product created successfully',
      product 
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
