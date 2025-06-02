#!/usr/bin/env node

/**
 * Script to run SQL migrations against a Supabase database
 * Usage: node scripts/run-migrations.js
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing Supabase environment variables.');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

// Create Supabase client with service role key for admin privileges
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigrations() {
  console.log('Starting database migrations...');
  
  // Get all migration files
  const migrationsDir = path.join(__dirname, '..', 'migrations');
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort(); // Sort to ensure migrations run in order
  
  if (migrationFiles.length === 0) {
    console.log('No migration files found.');
    return;
  }
  
  console.log(`Found ${migrationFiles.length} migration files.`);
  
  // Run each migration
  for (const file of migrationFiles) {
    console.log(`\nRunning migration: ${file}`);
    
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf8');
    
    try {
      // Execute the SQL using Supabase's rpc function
      const { error } = await supabase.rpc('exec_sql', { sql });
      
      if (error) {
        console.error(`Error running migration ${file}:`, error);
        console.log('\nYou may need to run this SQL manually in the Supabase SQL editor.');
        console.log('Migration file contents:');
        console.log('-------------------------------------------');
        console.log(sql);
        console.log('-------------------------------------------');
      } else {
        console.log(`Successfully ran migration: ${file}`);
      }
    } catch (err) {
      console.error(`Exception running migration ${file}:`, err);
      console.log('\nAlternative: Run this SQL manually in the Supabase SQL editor.');
      console.log('Migration file contents:');
      console.log('-------------------------------------------');
      console.log(sql);
      console.log('-------------------------------------------');
    }
  }
  
  console.log('\nMigration process completed.');
}

// Run the migrations
runMigrations().catch(err => {
  console.error('Unhandled error during migrations:', err);
  process.exit(1);
});
