import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const chapterId = params.id
    const body = await request.json()
    const { title, description, duration, difficulty, touchpoints } = body

    console.log('PUT /api/chapters/[id] - Chapter ID:', chapterId)
    console.log('PUT /api/chapters/[id] - Body:', body)
    console.log('PUT /api/chapters/[id] - Touchpoints:', touchpoints)

    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    // Use a transaction to ensure data consistency
    await sql`BEGIN`

    try {
      // Update chapter
      await sql`
        UPDATE chapters 
        SET title = ${title}, description = ${description || ''}, duration = ${duration || ''}, difficulty = ${difficulty || 'Beginner'}
        WHERE id = ${chapterId}
      `

      // Update touchpoints if provided
      if (touchpoints && touchpoints.length > 0) {
        console.log('Deleting existing touchpoints for chapter:', chapterId)
        // Delete existing touchpoints
        await sql`DELETE FROM touchpoints WHERE chapter_id = ${chapterId}`

        console.log('Inserting new touchpoints:', touchpoints)
        // Insert new touchpoints
        for (let i = 0; i < touchpoints.length; i++) {
          const tp = touchpoints[i]
          console.log('Inserting touchpoint:', tp)
          await sql`
            INSERT INTO touchpoints (
              chapter_id, title, description, duration, type, video_url, order_index,
              animation_effect, animation_speed, animation_delay, animation_easing, animation_duration
            )
            VALUES (
              ${chapterId}, ${tp.title}, ${tp.description || ''}, ${tp.duration || ''}, ${tp.type}, ${tp.videoUrl || ''}, ${i + 1},
              ${tp.animation_effect || 'typewriter'}, ${tp.animation_speed || 90}, ${tp.animation_delay || 1400}, 
              ${tp.animation_easing || 'easeOut'}, ${tp.animation_duration || 3000}
            )
          `
        }
        console.log('Touchpoints updated successfully')
      } else {
        console.log('No touchpoints provided, skipping touchpoint update')
      }

      // Commit the transaction
      await sql`COMMIT`
      console.log('Transaction committed successfully')
    } catch (error) {
      // Rollback on error
      await sql`ROLLBACK`
      console.error('Transaction failed, rolling back:', error)
      throw error
    }

    return NextResponse.json({
      success: true,
      message: 'Chapter updated successfully'
    })

  } catch (error) {
    console.error('Error updating chapter:', error)
    return NextResponse.json(
      { error: 'Failed to update chapter' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const chapterId = params.id

    // Delete touchpoints first (due to foreign key constraint)
    await sql`DELETE FROM touchpoints WHERE chapter_id = ${chapterId}`
    
    // Delete chapter
    await sql`DELETE FROM chapters WHERE id = ${chapterId}`

    return NextResponse.json({
      success: true,
      message: 'Chapter deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting chapter:', error)
    return NextResponse.json(
      { error: 'Failed to delete chapter' },
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

    // Get chapter details
    const chapterResult = await sql`
      SELECT * FROM chapters WHERE id = ${chapterId}
    `

    if (chapterResult.length === 0) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      )
    }

    const chapter = chapterResult[0]

    // Get touchpoints for this chapter
    const touchpointsResult = await sql`
      SELECT * FROM touchpoints WHERE chapter_id = ${chapterId} ORDER BY order_index
    `

    return NextResponse.json({
      success: true,
      chapter: {
        ...chapter,
        touchpoints: touchpointsResult
      }
    })

  } catch (error) {
    console.error('Error fetching chapter:', error)
    return NextResponse.json(
      { error: 'Failed to fetch chapter' },
      { status: 500 }
    )
  }
}
