#!/usr/bin/env tsx

import { sql } from '../lib/db'
import fs from 'fs'
import path from 'path'

async function setupDatabase() {
  try {
    console.log('🚀 Setting up ChuVue database...')
    
    // Read the schema file
    const schemaPath = path.join(process.cwd(), 'src/lib/schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')
    
    // Execute the schema
    console.log('📋 Creating database schema...')
    await sql.unsafe(schema)
    console.log('✅ Database schema created successfully')
    
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
