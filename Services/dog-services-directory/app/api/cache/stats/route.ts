import { NextRequest, NextResponse } from 'next/server';
import { searchCache } from '@/lib/cache';

export async function GET(request: NextRequest) {
  try {
    // Get cache statistics
    const stats = await searchCache.getStats();
    
    return NextResponse.json({
      success: true,
      data: {
        ...stats,
        timestamp: new Date().toISOString(),
        cacheType: 'memory'
      }
    });
  } catch (error) {
    console.error('Error getting cache stats:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get cache statistics' 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Clear all cache
    await searchCache.clear();
    
    return NextResponse.json({
      success: true,
      message: 'Cache cleared successfully'
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to clear cache' 
      },
      { status: 500 }
    );
  }
} 