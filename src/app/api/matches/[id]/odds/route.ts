import { NextResponse } from 'next/server';
import { getMatchOdds } from '@/lib/database';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: matchId } = await params;
    const odds = await getMatchOdds(matchId);
    
    return NextResponse.json({ success: true, data: odds });
  } catch (error) {
    console.error('Error fetching match odds:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch odds' }, { status: 500 });
  }
}