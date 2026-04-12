import { NextRequest, NextResponse } from 'next/server';
import { getLeagueAccuracyStats } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const minMatches = parseInt(searchParams.get('minMatches') ?? '10', 10);
    const limit = parseInt(searchParams.get('limit') ?? '15', 10);

    const stats = await getLeagueAccuracyStats(minMatches, limit);
    return NextResponse.json({ 
      success: true, 
      data: stats,
      count: stats.length
    });
  } catch (error) {
    console.error('API Error - League stats:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch league accuracy stats',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}