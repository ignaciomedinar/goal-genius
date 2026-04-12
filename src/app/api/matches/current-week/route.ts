import { NextResponse } from 'next/server';
import { getCurrentWeekPredictions } from '@/lib/database';

export async function GET() {
  try {
    const matches = await getCurrentWeekPredictions();
    return NextResponse.json({ 
      success: true, 
      data: matches,
      count: matches.length
    });
  } catch (error) {
    console.error('API Error - Current week predictions:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch current week predictions',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}