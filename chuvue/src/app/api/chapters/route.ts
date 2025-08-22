import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { interactiveId, title, description, duration, difficulty, touchpoints } = body

    // Validate required fields
    if (!interactiveId || !title) {
      return NextResponse.json(
        { error: 'Interactive ID and title are required' },
        { status: 400 }
      )
    }

    // Start a transaction
    const result = await sql`
      WITH new_chapter AS (
        INSERT INTO chapters (interactive_id, title, description, duration, difficulty, order_index)
        VALUES (${interactiveId}, ${title}, ${description || ''}, ${duration || ''}, ${difficulty || 'Beginner'}, 
                (COALESCE((SELECT MAX(order_index) FROM chapters WHERE interactive_id = ${interactiveId}), 0) + 1))
        RETURNING id, order_index
      )
      SELECT id, order_index FROM new_chapter
    `

    if (result.length === 0) {
      throw new Error('Failed to create chapter')
    }

    const chapterId = result[0].id
    const chapterOrderIndex = result[0].order_index

          // Insert touchpoints if provided
      if (touchpoints && touchpoints.length > 0) {
        const touchpointValues = touchpoints.map((tp: any, index: number) => ({
          chapter_id: chapterId,
          title: tp.title,
          description: tp.description || '',
          duration: tp.duration || '',
          type: tp.type,
          video_url: tp.videoUrl || '',
          order_index: index + 1
        }))

        for (const tp of touchpointValues) {
          await sql`
            INSERT INTO touchpoints (chapter_id, title, description, duration, type, video_url, order_index)
            VALUES (${tp.chapter_id}, ${tp.title}, ${tp.description}, ${tp.duration}, ${tp.type}, ${tp.video_url}, ${tp.order_index})
          `
        }
      }

    return NextResponse.json({
      success: true,
      chapterId,
      message: 'Chapter draft saved successfully'
    })

  } catch (error) {
    console.error('Error saving chapter draft:', error)
    return NextResponse.json(
      { error: 'Failed to save chapter draft' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const interactiveId = searchParams.get('interactiveId')

    if (!interactiveId) {
      return NextResponse.json(
        { error: 'Interactive ID is required' },
        { status: 400 }
      )
    }

    const chapters = await sql`
      SELECT 
        c.id,
        c.title,
        c.description,
        c.duration,
        c.difficulty,
        c.status,
        c.order_index,
        c.created_at,
        c.updated_at,
        COUNT(t.id) as touchpoint_count
      FROM chapters c
      LEFT JOIN touchpoints t ON c.id = t.chapter_id
      WHERE c.interactive_id = ${interactiveId}
      GROUP BY c.id, c.title, c.description, c.duration, c.difficulty, c.status, c.order_index, c.created_at, c.updated_at
      ORDER BY c.order_index
    `

    return NextResponse.json({
      success: true,
      chapters: chapters
    })

  } catch (error) {
    console.error('Error fetching chapters:', error)
    return NextResponse.json(
      { error: 'Failed to fetch chapters' },
      { status: 500 }
    )
  }
}
