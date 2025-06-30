import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { logError } from '@/lib/errorLogging';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: { autoRefreshToken: false, persistSession: false },
  }
);

export async function POST(req: NextRequest) {
  try {
    const { userId, newPassword } = await req.json();

    if (!userId || !newPassword) {
      return NextResponse.json(
        { error: 'User ID and new password are required' },
        { status: 400 }
      );
    }

    // Get user by ID
    const { data: user, error: userError } = await supabaseAdmin
      .from('profiles')
      .select('email')
      .eq('id', userId)
      .single();

    if (userError || !user?.email) {
      await logError(
        userError || new Error('User not found'),
        'admin_reset_password',
        `Failed to find user: ${userId}`,
        { userId }
      );
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Reset password using admin API
    const { error: resetError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { password: newPassword }
    );

    if (resetError) {
      await logError(
        resetError,
        'admin_reset_password',
        `Failed to reset password for user: ${userId}`,
        { userId, userEmail: user.email }
      );
      return NextResponse.json(
        { error: 'Failed to reset password' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Password reset successfully' },
      { status: 200 }
    );
  } catch (error) {
    await logError(
      error as Error,
      'admin_reset_password',
      'Unexpected error in reset password endpoint',
      { error: (error as Error).message }
    );
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 