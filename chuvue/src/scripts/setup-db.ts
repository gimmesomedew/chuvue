#!/usr/bin/env tsx

import { sql } from '../lib/db'
import fs from 'fs'
import path from 'path'

async function setupDatabase() {
  try {
    console.log('🚀 Setting up ChuVue database...')
    
    // Clear existing database completely
    console.log('🗑️  Clearing existing database completely...')
    await sql`DROP TABLE IF EXISTS screen_interactions CASCADE`
    await sql`DROP TABLE IF EXISTS user_progress CASCADE`
    await sql`DROP TABLE IF EXISTS touchpoints CASCADE`
    await sql`DROP TABLE IF EXISTS chapters CASCADE`
    await sql`DROP TABLE IF EXISTS screens CASCADE`
    await sql`DROP TABLE IF EXISTS interactives CASCADE`
    await sql`DROP TABLE IF EXISTS categories CASCADE`
    await sql`DROP TABLE IF EXISTS users CASCADE`
    console.log('✅ All existing tables dropped successfully')
    
    // Read the schema file
    const schemaPath = path.join(process.cwd(), 'src/lib/schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')
    
    // Execute the schema
    console.log('📋 Creating database schema...')
    await sql(schema)
    console.log('✅ Database schema created successfully')
    
    // Check and add video_url column if it doesn't exist
    console.log('🔧 Checking for video_url column...')
    try {
      const checkColumn = await sql`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'touchpoints' AND column_name = 'video_url'
      `
      
      if (checkColumn.length === 0) {
        console.log('📝 Adding video_url column to touchpoints table...')
        await sql`ALTER TABLE touchpoints ADD COLUMN video_url VARCHAR(500)`
        console.log('✅ video_url column added successfully')
      } else {
        console.log('✅ video_url column already exists')
      }
    } catch (error) {
      console.log('⚠️  Could not add video_url column:', error)
    }
    
    // Database setup completed - no sample data
    console.log('🎉 Database setup completed successfully!')
    console.log('📊 You can now:')
    console.log('   - View the dashboard at http://localhost:3000')
    console.log('   - Create your own concepts from scratch')
    console.log('   - Build custom learning experiences')
    
  } catch (error) {
    console.error('❌ Database setup failed:', error)
    process.exit(1)
  }
}

// Run the setup
setupDatabase()
