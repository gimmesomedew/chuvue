import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const chapterId = params.id
    const body = await request.json()
    const { action } = body

    if (action === 'increment') {
      // Increment the views count for this chapter
      await sql`
        UPDATE chapters 
        SET views = COALESCE(views, 0) + 1 
        WHERE id = ${chapterId}
      `
      
      return NextResponse.json({
        success: true,
        message: 'View count incremented'
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Error updating chapter views:', error)
    return NextResponse.json(
      { error: 'Failed to update views' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const chapterId = params.id
    
    // Get the current view count for this chapter
    const result = await sql`
      SELECT COALESCE(views, 0) as views
      FROM chapters 
      WHERE id = ${chapterId}
    `
    
    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      views: result[0].views
    })

  } catch (error) {
    console.error('Error fetching chapter views:', error)
    return NextResponse.json(
      { error: 'Failed to fetch views' },
      { status: 500 }
    )
  }
}
