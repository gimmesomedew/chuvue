import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const interactives = await sql`
      SELECT 
        id,
        title,
        description,
        status,
        created_at,
        updated_at
      FROM interactives
      ORDER BY created_at DESC
    `

    return NextResponse.json(interactives)
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


