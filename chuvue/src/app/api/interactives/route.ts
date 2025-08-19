import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

// GET /api/interactives - Fetch all interactives
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    
    // Simple query without complex joins for now
    let result
    
    if (status && status !== 'all') {
      result = await sql`
        SELECT 
          i.*,
          c.name as category_name,
          c.color as category_color,
          c.icon as category_icon
        FROM interactives i
        LEFT JOIN categories c ON i.category_id = c.id
        WHERE i.status = ${status}
        ORDER BY i.created_at DESC
      `
    } else if (category && category !== 'all') {
      result = await sql`
        SELECT 
          i.*,
          c.name as category_name,
          c.color as category_color,
          c.icon as category_icon
        FROM interactives i
        LEFT JOIN categories c ON i.category_id = c.id
        WHERE c.name = ${category}
        ORDER BY i.created_at DESC
      `
    } else {
      result = await sql`
        SELECT 
          i.*,
          c.name as category_name,
          c.color as category_color,
          c.icon as category_icon
        FROM interactives i
        LEFT JOIN categories c ON i.category_id = c.id
        ORDER BY i.created_at DESC
      `
    }
    
    // Get screen count for each interactive
    const interactivesWithScreens = await Promise.all(
      result.map(async (interactive) => {
        const screenCount = await sql`
          SELECT COUNT(*) as count FROM screens WHERE interactive_id = ${interactive.id}
        `
        return {
          ...interactive,
          screen_count: parseInt(screenCount[0].count)
        }
      })
    )
    
    return NextResponse.json({
      success: true,
      data: interactivesWithScreens
    })
    
  } catch (error) {
    console.error('Error fetching interactives:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch interactives' },
      { status: 500 }
    )
  }
}

// POST /api/interactives - Create new interactive
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, category_id, status = 'draft' } = body
    
    // For now, we'll use a default user ID (in real app, this would come from auth)
    const defaultUserId = '00000000-0000-0000-0000-000000000001'
    
    const result = await sql`
      INSERT INTO interactives (title, description, category_id, status, created_by)
      VALUES (${title}, ${description}, ${category_id}, ${status}, ${defaultUserId})
      RETURNING *
    `
    
    return NextResponse.json({
      success: true,
      data: result[0]
    })
    
  } catch (error) {
    console.error('Error creating interactive:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create interactive' },
      { status: 500 }
    )
  }
}
