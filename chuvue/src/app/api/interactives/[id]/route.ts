import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

// GET /api/interactives/[id] - Fetch specific interactive with screens
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    // Fetch interactive details
    const interactiveResult = await sql`
      SELECT 
        i.*,
        c.name as category_name,
        c.color as category_color,
        c.icon as category_icon,
        u.name as creator_name
      FROM interactives i
      LEFT JOIN categories c ON i.category_id = c.id
      LEFT JOIN users u ON i.created_by = u.id
      WHERE i.id = ${id}
    `
    
    if (interactiveResult.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Interactive not found' },
        { status: 404 }
      )
    }
    
    // Fetch screens for this interactive
    const screensResult = await sql`
      SELECT * FROM screens 
      WHERE interactive_id = ${id} 
      ORDER BY order_index
    `
    
    const interactive = interactiveResult[0]
    interactive.screens = screensResult
    
    return NextResponse.json({
      success: true,
      data: interactive
    })
    
  } catch (error) {
    console.error('Error fetching interactive:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch interactive' },
      { status: 500 }
    )
  }
}

// PUT /api/interactives/[id] - Update interactive
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { title, description, category_id, status } = body
    
    const result = await sql`
      UPDATE interactives 
      SET 
        title = COALESCE(${title}, title),
        description = COALESCE(${description}, description),
        category_id = COALESCE(${category_id}, category_id),
        status = COALESCE(${status}, status),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `
    
    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Interactive not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: result[0]
    })
    
  } catch (error) {
    console.error('Error updating interactive:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update interactive' },
      { status: 500 }
    )
  }
}

// DELETE /api/interactives/[id] - Delete interactive
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    const result = await sql`
      DELETE FROM interactives WHERE id = ${id} RETURNING id
    `
    
    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Interactive not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Interactive deleted successfully'
    })
    
  } catch (error) {
    console.error('Error deleting interactive:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete interactive' },
      { status: 500 }
    )
  }
}
