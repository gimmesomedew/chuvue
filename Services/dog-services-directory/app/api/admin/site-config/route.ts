import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Check if user is authenticated (optional for GET, but good for logging)
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.warn('⚠️ Unauthenticated access attempt to site-config GET API');
    } else {
      console.log('✅ Authenticated user accessing site-config GET API:', user.email);
    }

    const { data: configs, error } = await supabase
      .from('site_config')
      .select('*')
      .order('config_key');

    if (error) {
      console.error('Error fetching site config:', error);
      return NextResponse.json({ error: 'Failed to fetch configuration' }, { status: 500 });
    }

    return NextResponse.json({ configs });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Check if user is authenticated and has admin role
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.warn('⚠️ Unauthenticated access attempt to site-config API');
      // For development, allow unauthenticated access but log it
      // TODO: Remove this in production
      // return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    } else {
      console.log('✅ Authenticated user accessing site-config API:', user.email);
    }

    // TODO: Add admin role check here when you implement role-based access control
    // For now, we'll allow any authenticated user to update config

    const body = await request.json();
    const { configs } = body;

    if (!Array.isArray(configs)) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    // Update each configuration item
    const updatePromises = configs.map(async (config: any) => {
      const { error } = await supabase
        .from('site_config')
        .update({ config_value: config.config_value })
        .eq('config_key', config.config_key);

      if (error) {
        console.error(`Error updating ${config.config_key}:`, error);
        throw error;
      }
    });

    await Promise.all(updatePromises);

    return NextResponse.json({ success: true, message: 'Configuration updated successfully' });
  } catch (error) {
    console.error('Error updating site config:', error);
    return NextResponse.json({ error: 'Failed to update configuration' }, { status: 500 });
  }
}
