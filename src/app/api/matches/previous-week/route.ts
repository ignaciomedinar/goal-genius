import { NextResponse } from 'next/server';
import { getPreviousWeekMatches } from '@/lib/database';

export async function GET() {
  try {
    const matches = await getPreviousWeekMatches();
    return NextResponse.json({ 
      success: true, 
      data: matches,
      count: matches.length
    });
  } catch (error) {
    console.error('API Error - Previous week matches:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch previous week matches',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}