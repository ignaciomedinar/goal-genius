import { NextResponse } from 'next/server';
import { getResultsByWeek } from '@/lib/database';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const weeksAgo = parseInt(searchParams.get('weeks') || '1');
    
    const results = await getResultsByWeek(weeksAgo);
    
    return NextResponse.json({ 
      success: true, 
      data: results,
      count: results.length
    });
  } catch (error) {
    console.error('API Error - Results:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch results' 
    }, { status: 500 });
  }
}