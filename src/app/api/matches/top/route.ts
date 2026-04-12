import { NextResponse } from 'next/server';
import { getTopMatches } from '@/lib/database';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5');
    
    const matches = await getTopMatches(limit);
    return NextResponse.json({ 
      success: true, 
      data: matches,
      count: matches.length
    });
  } catch (error) {
    console.error('API Error - Top matches:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch top matches',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}