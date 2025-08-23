import { neon } from '@neondatabase/serverless'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

async function addTestData() {
  try {
    console.log('🚀 Adding test data to ChuVue database...')
    
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set. Please check your .env.local file.')
    }
    
    console.log('✅ Database URL found')
    
    // Create database connection
    const sql = neon(process.env.DATABASE_URL)
    
    // Test connection
    console.log('🔌 Testing database connection...')
    const testResult = await sql`SELECT version()`
    console.log('✅ Database connection successful:', testResult[0])
    
    // Create a test user
    console.log('👤 Creating test user...')
    const userResult = await sql`
      INSERT INTO users (email, name, role) 
      VALUES ('test@example.com', 'Test User', 'creator')
      ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
      RETURNING id
    `
    const userId = userResult[0].id
    console.log('✅ Test user created:', userId)
    
    // Create a test category
    console.log('📂 Creating test category...')
    const categoryResult = await sql`
      INSERT INTO categories (name, description, color, icon) 
      VALUES ('Test Category', 'A test category for development', '#8b5cf6', 'test')
      ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description
      RETURNING id
    `
    const categoryId = categoryResult[0].id
    console.log('✅ Test category created:', categoryId)
    
    // Create a test interactive
    console.log('🎯 Creating test interactive...')
    const interactiveResult = await sql`
      INSERT INTO interactives (title, description, category_id, status, created_by) 
      VALUES ('Test Interactive', 'A test interactive for development', ${categoryId}, 'published', ${userId})
      RETURNING id
    `
    const interactiveId = interactiveResult[0].id
    console.log('✅ Test interactive created:', interactiveId)
    
    // Create a test chapter
    console.log('📖 Creating test chapter...')
    const chapterResult = await sql`
      INSERT INTO chapters (interactive_id, title, description, duration, difficulty, status, order_index) 
      VALUES (${interactiveId}, 'Test Chapter', 'A test chapter with touchpoints', '15 mins', 'Beginner', 'published', 1)
      RETURNING id
    `
    const chapterId = chapterResult[0].id
    console.log('✅ Test chapter created:', chapterId)
    
    // Create test touchpoints
    console.log('🎯 Creating test touchpoints...')
    const touchpoints = [
      {
        title: 'Introduction to Coachability',
        description: 'Learn the fundamentals of coachability and why it matters in professional development.',
        duration: '5 mins',
        type: 'Content',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        order_index: 1,
        animation_effect: 'typewriter',
        animation_speed: 90,
        animation_delay: 1400,
        animation_easing: 'easeOut',
        animation_duration: 3000
      },
      {
        title: 'Active Listening Skills',
        description: 'Practice active listening techniques that demonstrate coachability and openness to feedback.',
        duration: '7 mins',
        type: 'Interactive',
        video_url: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
        order_index: 2,
        animation_effect: 'slide-up',
        animation_speed: 80,
        animation_delay: 800,
        animation_easing: 'easeOut',
        animation_duration: 2000
      },
      {
        title: 'Receiving Feedback Gracefully',
        description: 'Learn how to receive constructive feedback with grace and use it for growth.',
        duration: '3 mins',
        type: 'Video',
        video_url: 'https://www.youtube.com/watch?v=oHg5SJYRHA0',
        order_index: 3,
        animation_effect: 'zoom',
        animation_speed: 60,
        animation_delay: 600,
        animation_easing: 'easeOut',
        animation_duration: 1500
      }
    ]
    
    for (const tp of touchpoints) {
      await sql`
        INSERT INTO touchpoints (chapter_id, title, description, duration, type, video_url, order_index)
        VALUES (${chapterId}, ${tp.title}, ${tp.description}, ${tp.duration}, ${tp.type}, ${tp.video_url}, ${tp.order_index})
      `
    }
    console.log('✅ Test touchpoints created')
    
    console.log('🎉 Test data added successfully!')
    console.log('📊 Test data summary:')
    console.log(`   - Interactive ID: ${interactiveId}`)
    console.log(`   - Chapter ID: ${chapterId}`)
    console.log(`   - Touchpoints: ${touchpoints.length}`)
    console.log('🌐 You can now test the preview functionality at:')
    console.log(`   http://localhost:3000/interactives/${interactiveId}`)
    
  } catch (error) {
    console.error('❌ Failed to add test data:', error)
    process.exit(1)
  }
}

// Run the function
addTestData()
