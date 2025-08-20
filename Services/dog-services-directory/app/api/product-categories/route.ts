import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: categories, error } = await supabase
      .from('product_categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching product categories:', error);
      return NextResponse.json({ error: 'Failed to fetch product categories' }, { status: 500 });
    }

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
