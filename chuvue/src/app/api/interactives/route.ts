import { NextResponse, NextRequest } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  try {
    const interactives = await sql`
      SELECT 
        i.id,
        i.title,
        i.description,
        i.status,
        i.created_at,
        i.updated_at,
        i.view_count,
        i.completion_count,
        c.name as category_name,
        c.color as category_color,
        c.icon as category_icon,
        COUNT(ch.id) as chapter_count,
        COALESCE(COUNT(up.id), 0) as student_count
      FROM interactives i
      LEFT JOIN categories c ON i.category_id = c.id
      LEFT JOIN chapters ch ON i.id = ch.interactive_id
      LEFT JOIN user_progress up ON i.id = up.interactive_id
      GROUP BY i.id, i.title, i.description, i.status, i.created_at, i.updated_at, i.view_count, i.completion_count, c.name, c.color, c.icon
      ORDER BY i.created_at DESC
    `

    return NextResponse.json({
      success: true,
      interactives: interactives
    })

  } catch (error) {
    console.error('Error fetching interactives:', error)
    return NextResponse.json(
      { error: 'Failed to fetch interactives' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, category } = body

    // Validate required fields
    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    // Get the category ID
    const categoryResult = await sql`
      SELECT id FROM categories WHERE name = ${category} LIMIT 1
    `

    if (categoryResult.length === 0) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      )
    }

    const categoryId = categoryResult[0].id

    // Create the interactive
    const result = await sql`
      INSERT INTO interactives (title, description, category_id, status, created_by)
      VALUES (
        ${title.trim()},
        ${description?.trim() || ''},
        ${categoryId},
        'draft',
        '00000000-0000-0000-0000-000000000001'
      )
      RETURNING id, title, description, status, created_at, updated_at
    `

    if (result.length === 0) {
      throw new Error('Failed to create interactive')
    }

    return NextResponse.json({
      success: true,
      interactive: result[0],
      message: 'Concept created successfully'
    })

  } catch (error) {
    console.error('Error creating interactive:', error)
    return NextResponse.json(
      { error: 'Failed to create concept' },
      { status: 500 }
    )
  }
}


