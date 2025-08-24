#!/usr/bin/env tsx

import { sql } from '../lib/db'

async function addMissingColumns() {
  try {
    console.log('🔧 Adding missing columns to database...')
    
    // Add views column to chapters table
    console.log('📊 Adding views column to chapters table...')
    try {
      await sql`ALTER TABLE chapters ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0`
      console.log('✅ views column added to chapters table')
    } catch (error) {
      console.log('⚠️  Could not add views column to chapters:', error)
    }
    
    // Add animation columns to touchpoints table
    console.log('🎬 Adding animation columns to touchpoints table...')
    try {
      await sql`ALTER TABLE touchpoints ADD COLUMN IF NOT EXISTS animation_effect VARCHAR(100)`
      await sql`ALTER TABLE touchpoints ADD COLUMN IF NOT EXISTS animation_speed INTEGER DEFAULT 90`
      await sql`ALTER TABLE touchpoints ADD COLUMN IF NOT EXISTS animation_delay INTEGER DEFAULT 1400`
      await sql`ALTER TABLE touchpoints ADD COLUMN IF NOT EXISTS animation_easing VARCHAR(50) DEFAULT 'easeOut'`
      await sql`ALTER TABLE touchpoints ADD COLUMN IF NOT EXISTS animation_duration INTEGER DEFAULT 3000`
      console.log('✅ Animation columns added to touchpoints table')
    } catch (error) {
      console.log('⚠️  Could not add animation columns to touchpoints:', error)
    }
    
    // Verify the columns were added
    console.log('🔍 Verifying column additions...')
    
    // Check chapters table
    const chaptersColumns = await sql`
      SELECT column_name, data_type, column_default, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'chapters' 
      ORDER BY ordinal_position
    `
    console.log('📋 Chapters table columns:')
    chaptersColumns.forEach(col => {
      console.log(`   - ${col.column_name}: ${col.data_type} (default: ${col.column_default || 'NULL'})`)
    })
    
    // Check touchpoints table
    const touchpointsColumns = await sql`
      SELECT column_name, data_type, column_default, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'touchpoints' 
      ORDER BY ordinal_position
    `
    console.log('📋 Touchpoints table columns:')
    touchpointsColumns.forEach(col => {
      console.log(`   - ${col.column_name}: ${col.data_type} (default: ${col.column_default || 'NULL'})`)
    })
    
    console.log('🎉 Database migration completed successfully!')
    
  } catch (error) {
    console.error('❌ Database migration failed:', error)
    process.exit(1)
  }
}

// Run the migration
addMissingColumns()
