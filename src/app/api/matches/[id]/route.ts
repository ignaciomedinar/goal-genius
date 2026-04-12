import { NextResponse } from 'next/server';
import { getMatchDetails } from '@/lib/database';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: matchId } = await params;
    const match = await getMatchDetails(matchId);
    
    if (!match) {
      return NextResponse.json(
        { success: false, error: 'Match not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: match,
    });
  } catch (error) {
    console.error('Error fetching match details:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch match details' },
      { status: 500 }
    );
  }
}