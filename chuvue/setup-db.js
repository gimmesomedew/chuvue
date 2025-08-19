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
    
    // Insert sample data
    console.log('📝 Inserting sample data...')
    
    // Create a default user
    const defaultUser = await sql`
      INSERT INTO users (id, email, name, role) 
      VALUES (
        '00000000-0000-0000-0000-000000000001',
        'admin@chuvue.com',
        'ChuVue Admin',
        'admin'
      )
      ON CONFLICT (id) DO NOTHING
      RETURNING id
    `
    
    // Get the default user ID
    const userId = defaultUser[0]?.id || '00000000-0000-0000-0000-000000000001'
    
    // Get the Personal Development category
    const category = await sql`
      SELECT id FROM categories WHERE name = 'Personal Development' LIMIT 1
    `
    
    if (category.length > 0) {
      // Create a sample interactive
      const interactive = await sql`
        INSERT INTO interactives (title, description, category_id, status, created_by)
        VALUES (
          'Master Coachability',
          'Develop your ability to receive feedback, adapt, and grow through interactive learning experiences designed for teens and young adults.',
          ${category[0].id},
          'published',
          ${userId}
        )
        RETURNING id
      `
      
      if (interactive.length > 0) {
        const interactiveId = interactive[0].id
        
        // Create sample screens
        const screens = [
          {
            type: 'start',
            title: 'Master Coachability',
            content: 'Develop your ability to receive feedback, adapt, and grow through interactive learning experiences designed for teens and young adults.',
            order_index: 1
          },
          {
            type: 'intro',
            title: 'Welcome to Your Learning Journey',
            content: 'In this module, you\'ll discover the key principles of coachability and how they can transform your personal and professional growth. Get ready to explore active listening, growth mindset, and practical strategies for receiving feedback effectively.',
            order_index: 2
          },
          {
            type: 'video',
            title: 'Understanding Coachability',
            content: 'Watch this short video to learn the fundamentals of coachability and why it\'s essential for success.',
            video_url: '',
            order_index: 3
          },
          {
            type: 'content',
            title: 'Key Principles',
            content: 'Coachability is built on three core principles: openness to feedback, willingness to change, and commitment to growth. These principles work together to create a mindset that embraces learning and development.',
            order_index: 4
          },
          {
            type: 'completion',
            title: 'Congratulations!',
            content: 'You\'ve successfully completed the Master Coachability module. You now have the foundation to become more coachable and open to growth opportunities.',
            quote: 'The only way to grow is to be coachable.',
            author: 'John Maxwell',
            order_index: 5
          }
        ]
        
        for (const screen of screens) {
          await sql`
            INSERT INTO screens (interactive_id, type, title, content, video_url, quote, author, order_index)
            VALUES (${interactiveId}, ${screen.type}, ${screen.title}, ${screen.content}, ${screen.video_url}, ${screen.quote}, ${screen.author}, ${screen.order_index})
          `
        }
        
        console.log('✅ Sample interactive "Master Coachability" created with 5 screens')
      }
    }
    
    console.log('🎉 Database setup completed successfully!')
    console.log('📊 You can now:')
    console.log('   - View the dashboard at http://localhost:3000')
    console.log('   - Edit the sample interactive at http://localhost:3000/editor/[id]')
    console.log('   - View the mobile experience at http://localhost:3000/interactive/[id]')
    
  } catch (error) {
    console.error('❌ Database setup failed:', error)
    process.exit(1)
  }
}

// Run the setup
setupDatabase()
