import { neon } from '@neondatabase/serverless'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

async function updateSchema() {
  try {
    console.log('🚀 Updating ChuVue database schema...')
    
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
    
    // Add animation columns to touchpoints table
    console.log('📝 Adding animation columns to touchpoints table...')
    
    try {
      await sql`
        ALTER TABLE touchpoints 
        ADD COLUMN IF NOT EXISTS animation_effect VARCHAR(50) DEFAULT 'typewriter',
        ADD COLUMN IF NOT EXISTS animation_speed INTEGER DEFAULT 90,
        ADD COLUMN IF NOT EXISTS animation_delay INTEGER DEFAULT 1400,
        ADD COLUMN IF NOT EXISTS animation_easing VARCHAR(50) DEFAULT 'easeOut',
        ADD COLUMN IF NOT EXISTS animation_duration INTEGER DEFAULT 3000
      `
      console.log('✅ Animation columns added successfully')
    } catch (error) {
      console.log('⚠️ Some columns may already exist:', error)
    }
    
    // Update existing touchpoints with default animation settings
    console.log('🔄 Updating existing touchpoints with default animation settings...')
    await sql`
      UPDATE touchpoints 
      SET 
        animation_effect = COALESCE(animation_effect, 'typewriter'),
        animation_speed = COALESCE(animation_speed, 90),
        animation_delay = COALESCE(animation_delay, 1400),
        animation_easing = COALESCE(animation_easing, 'easeOut'),
        animation_duration = COALESCE(animation_duration, 3000)
      WHERE animation_effect IS NULL
    `
    console.log('✅ Existing touchpoints updated with default settings')
    
    console.log('🎉 Database schema updated successfully!')
    console.log('📊 New animation fields available:')
    console.log('   - animation_effect: Type of animation')
    console.log('   - animation_speed: Speed of animation')
    console.log('   - animation_delay: Initial delay before animation')
    console.log('   - animation_easing: Easing function for animation')
    console.log('   - animation_duration: Total duration of animation')
    
  } catch (error) {
    console.error('❌ Schema update failed:', error)
    process.exit(1)
  }
}

// Run the function
updateSchema()
