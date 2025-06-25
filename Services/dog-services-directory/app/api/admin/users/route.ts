import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: { autoRefreshToken: false, persistSession: false },
  }
);

const PAGE_SIZE = 25;

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page') || '0', 10);
  const roleFilter = url.searchParams.get('role');
  const excludeRole = url.searchParams.get('exclude_role');
  const from = page * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabaseAdmin
    .from('profiles')
    .select('id, pet_name, email, role, profile_photo, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (roleFilter) {
    query = query.eq('role', roleFilter);
  }
  if (excludeRole) {
    query = query.neq('role', excludeRole);
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, count, page, pageSize: PAGE_SIZE });
}

// Create new user (e.g., reviewer)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, pet_name, role } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const assignedRole = role || 'reviewer';

    // Create auth user
    const { data: createdUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { pet_name, role: assignedRole },
    });

    if (createError || !createdUser?.user) {
      return NextResponse.json({ error: createError?.message || 'Failed to create user' }, { status: 500 });
    }

    const userId = createdUser.user.id;

    // Insert profile row with role
    const { error: profileError } = await supabaseAdmin.from('profiles').insert({
      id: userId,
      pet_name,
      email,
      role: assignedRole,
    });

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, userId });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
} 