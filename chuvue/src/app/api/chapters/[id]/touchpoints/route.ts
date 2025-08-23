import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const chapterId = params.id
    
    // Get touchpoints for this chapter
    const result = await sql`
      SELECT 
        id,
        title,
        description,
        duration,
        type,
        video_url,
        order_index,
        animation_effect,
        animation_speed,
        animation_delay,
        animation_easing,
        animation_duration,
        created_at,
        updated_at
      FROM touchpoints 
      WHERE chapter_id = ${chapterId}
      ORDER BY order_index
    `
    
    return NextResponse.json({
      success: true,
      touchpoints: result
    })
    
  } catch (error) {
    console.error('Error fetching touchpoints:', error)
    return NextResponse.json(
      { error: 'Failed to fetch touchpoints' },
      { status: 500 }
    )
  }
}
