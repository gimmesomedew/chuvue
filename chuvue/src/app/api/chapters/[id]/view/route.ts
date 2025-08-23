import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const chapterId = params.id
    
    // Increment the view count for this chapter
    const result = await sql`
      UPDATE chapters 
      SET views = COALESCE(views, 0) + 1
      WHERE id = ${chapterId}
      RETURNING views
    `
    
    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      )
    }
    
    const newViewCount = result[0].views
    
    return NextResponse.json({
      success: true,
      views: newViewCount,
      message: 'View tracked successfully'
    })
    
  } catch (error) {
    console.error('Error tracking chapter view:', error)
    return NextResponse.json(
      { error: 'Failed to track view' },
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
      SELECT views FROM chapters WHERE id = ${chapterId}
    `
    
    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      )
    }
    
    const viewCount = result[0].views || 0
    
    return NextResponse.json({
      success: true,
      views: viewCount
    })
    
  } catch (error) {
    console.error('Error getting chapter views:', error)
    return NextResponse.json(
      { error: 'Failed to get view count' },
      { status: 500 }
    )
  }
}
