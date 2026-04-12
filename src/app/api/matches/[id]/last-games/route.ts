import { NextRequest, NextResponse } from 'next/server';
import { getTeamLastGames } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: matchId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const teamId = parseInt(searchParams.get('teamId') || '0');
    const leagueId = parseInt(searchParams.get('leagueId') || '0');
    
    if (!teamId || !leagueId) {
      return NextResponse.json(
        { success: false, error: 'teamId and leagueId are required' },
        { status: 400 }
      );
    }
    
    const games = await getTeamLastGames(teamId, leagueId, 5);
    
    return NextResponse.json({
      success: true,
      data: games,
    });
  } catch (error) {
    console.error('Error fetching team last games:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch team last games', data: [] },
      { status: 500 }
    );
  }
}
