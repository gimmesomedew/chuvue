import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { logServiceError } from '@/lib/errorLogging';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const serviceId = params.id;
  if (!serviceId) {
    return NextResponse.json({ error: 'Service ID is required' }, { status: 400 });
  }

  try {
    // Delete favorites
    const { error: favoritesError } = await supabaseAdmin
      .from('favorites')
      .delete()
      .eq('service_id', serviceId);

    if (favoritesError) {
      await logServiceError(favoritesError, 'delete_service_favorites', serviceId);
      throw favoritesError;
    }

    // Delete related analytics via RPC (if function exists)
    const { error: analyticsError } = await supabaseAdmin.rpc('delete_service_analytics', { service_id: serviceId });
    if (analyticsError) {
      await logServiceError(analyticsError, 'delete_service_analytics', serviceId);
      // not fatal, continue
    }

    // Delete the service record
    const { error: serviceError } = await supabaseAdmin
      .from('services')
      .delete()
      .eq('id', serviceId);

    if (serviceError) {
      await logServiceError(serviceError, 'delete_service', serviceId);
      throw serviceError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || 'Deletion failed' }, { status: 500 });
  }
} 