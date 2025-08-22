#!/usr/bin/env node

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const { neon } = require('@neondatabase/serverless')
const fs = require('fs')
const path = require('path')

async function setupDatabase() {
  try {
    console.log('🚀 Setting up ChuVue database...')
    
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
    
    // Create tables one by one
    console.log('📋 Creating database schema...')
    
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'learner' CHECK (role IN ('admin', 'creator', 'learner')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `
    
    // Create categories table
    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        color VARCHAR(7) DEFAULT '#8b5cf6',
        icon VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `
    
    // Create interactives table
    await sql`
      CREATE TABLE IF NOT EXISTS interactives (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
        status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
        created_by UUID REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        published_at TIMESTAMP WITH TIME ZONE,
        view_count INTEGER DEFAULT 0,
        completion_count INTEGER DEFAULT 0
      )
    `
    
    // Create screens table
    await sql`
      CREATE TABLE IF NOT EXISTS screens (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        interactive_id UUID REFERENCES interactives(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL CHECK (type IN ('start', 'intro', 'video', 'content', 'completion')),
        title VARCHAR(255) NOT NULL,
        content TEXT,
        video_url VARCHAR(500),
        quote TEXT,
        author VARCHAR(255),
        order_index INTEGER NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(interactive_id, order_index)
      )
    `

    // Create chapters table
    await sql`
      CREATE TABLE IF NOT EXISTS chapters (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        interactive_id UUID REFERENCES interactives(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        duration VARCHAR(100),
        difficulty VARCHAR(50) DEFAULT 'Beginner' CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
        status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
        order_index INTEGER NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(interactive_id, order_index)
      )
    `

    // Create touchpoints table
    await sql`
      CREATE TABLE IF NOT EXISTS touchpoints (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        duration VARCHAR(100),
        type VARCHAR(50) NOT NULL CHECK (type IN ('Video', 'Interactive', 'Content')),
        video_url VARCHAR(500),
        order_index INTEGER NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(chapter_id, order_index)
      )
    `
    
    // Create user_progress table
    await sql`
      CREATE TABLE IF NOT EXISTS user_progress (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        interactive_id UUID REFERENCES interactives(id) ON DELETE CASCADE,
        current_screen INTEGER DEFAULT 1,
        completed BOOLEAN DEFAULT FALSE,
        started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        completed_at TIMESTAMP WITH TIME ZONE,
        time_spent INTEGER DEFAULT 0,
        UNIQUE(user_id, interactive_id)
      )
    `
    
    // Create screen_interactions table
    await sql`
      CREATE TABLE IF NOT EXISTS screen_interactions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        screen_id UUID REFERENCES screens(id) ON DELETE CASCADE,
        interactive_id UUID REFERENCES interactives(id) ON DELETE CASCADE,
        action VARCHAR(100) NOT NULL,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        metadata JSONB
      )
    `
    
    console.log('✅ Database schema created successfully')
    
    // Create triggers for updated_at columns
    console.log('🔧 Creating database triggers...')
    
    // Create updated_at trigger function
    await sql`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql'
    `
    
    // Apply updated_at trigger to tables
    await sql`
      DROP TRIGGER IF EXISTS update_interactives_updated_at ON interactives
    `
    await sql`
      CREATE TRIGGER update_interactives_updated_at BEFORE UPDATE ON interactives
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `
    
    await sql`
      DROP TRIGGER IF EXISTS update_screens_updated_at ON screens
    `
    await sql`
      CREATE TRIGGER update_screens_updated_at BEFORE UPDATE ON screens
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `
    
    await sql`
      DROP TRIGGER IF EXISTS update_chapters_updated_at ON chapters
    `
    await sql`
      CREATE TRIGGER update_chapters_updated_at BEFORE UPDATE ON chapters
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `
    
    await sql`
      DROP TRIGGER IF EXISTS update_touchpoints_updated_at ON touchpoints
    `
    await sql`
      CREATE TRIGGER update_touchpoints_updated_at BEFORE UPDATE ON touchpoints
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `
    
    console.log('✅ Database triggers created successfully')
    
    // Create indexes for better performance
    console.log('📊 Creating database indexes...')
    
    await sql`CREATE INDEX IF NOT EXISTS idx_interactives_category ON interactives(category_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_interactives_status ON interactives(status)`
    await sql`CREATE INDEX IF NOT EXISTS idx_interactives_created_by ON interactives(created_by)`
    await sql`CREATE INDEX IF NOT EXISTS idx_screens_interactive ON screens(interactive_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_screens_order ON screens(interactive_id, order_index)`
    await sql`CREATE INDEX IF NOT EXISTS idx_chapters_interactive ON chapters(interactive_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_chapters_order ON chapters(interactive_id, order_index)`
    await sql`CREATE INDEX IF NOT EXISTS idx_touchpoints_chapter ON touchpoints(chapter_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_touchpoints_order ON touchpoints(chapter_id, order_index)`
    await sql`CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_user_progress_interactive ON user_progress(interactive_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_screen_interactions_user ON screen_interactions(user_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_screen_interactions_screen ON screen_interactions(screen_id)`
    
    console.log('✅ Database indexes created successfully')
    
    // Insert default categories
    console.log('📝 Inserting default categories...')
    await sql`
      INSERT INTO categories (name, description, color, icon) VALUES
        ('Personal Development', 'Skills and mindset development', '#8b5cf6', 'brain'),
        ('Communication', 'Verbal and written communication skills', '#3b82f6', 'users'),
        ('Leadership', 'Leadership principles and practices', '#10b981', 'target'),
        ('Innovation', 'Creative thinking and problem solving', '#f59e0b', 'lightbulb')
      ON CONFLICT (name) DO NOTHING
    `
    
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
