import { neon } from '@neondatabase/serverless'

// Get database URL from environment
const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set. Please check your .env.local file.')
}

// Database connection string - will be set via environment variable
const sql = neon(databaseUrl)

// Test database connection
export async function testConnection() {
  try {
    const result = await sql`SELECT version()`
    console.log('Database connected successfully:', result[0])
    return true
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
}

// Export the sql client for use in API routes
export { sql }
