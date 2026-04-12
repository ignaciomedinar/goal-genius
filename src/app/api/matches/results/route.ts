import { NextRequest, NextResponse } from 'next/server';
import { getMatchResults } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const weekOffset = parseInt(searchParams.get('weekOffset') || '7', 10);
    
    const results = await getMatchResults(weekOffset);
    
    return NextResponse.json({
      success: true,
      data: results,
      count: results.length,
    });
  } catch (error) {
    console.error('Error fetching match results:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch match results',
        data: [] 
      },
      { status: 500 }
    );
  }
}
