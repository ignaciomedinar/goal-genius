'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatDate, formatTime, formatPercentage } from '@/lib/utils';

interface MatchDetail {
  match_id: string;
  home_team: string;
  away_team: string;
  home_team_id: number;
  away_team_id: number;
  league_id: number;
  league_name: string;
  country_name: string;
  flag_url: string | null;
  phg: number;
  pag: number;
  goals_home: number | null;
  goals_away: number | null;
  date_time: string;
  max_prob: number;
  bet_name: string;
  liability_name: string;
  prediction_type: 'home_win' | 'away_win' | 'draw';
  actual_result: 'home_win' | 'away_win' | 'draw' | 'pending';
  has_actual_result: boolean;
  is_correct_prediction: boolean;
}

interface BookmakerOdds {
  bookmaker_name: string;
  home_odds: number;
  draw_odds: number;
  away_odds: number;
}

interface TeamLastGame {
  match_id: string;
  league_name: string;
  country_name: string;
  date_time: string;
  home_team: string;
  away_team: string;
  goals_home: number;
  goals_away: number;
  prediction_is_correct: boolean | null;
}

export default function MatchDetailPage() {
  const params = useParams();
  const matchId = params.id as string;
  const [match, setMatch] = useState<MatchDetail | null>(null);
  const [odds, setOdds] = useState<BookmakerOdds[]>([]);
  const [homeTeamGames, setHomeTeamGames] = useState<TeamLastGame[]>([]);
  const [awayTeamGames, setAwayTeamGames] = useState<TeamLastGame[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMatchDetails = async () => {
      setIsLoading(true);
      try {
        // Fetch match details
        const matchResponse = await fetch(`/api/matches/${matchId}`);
        if (matchResponse.ok) {
          const matchData = await matchResponse.json();
          setMatch(matchData.data);
          
          // Once we have match data, fetch last games for both teams
          const homeGamesResponse = await fetch(
            `/api/matches/${matchId}/last-games?teamId=${matchData.data.home_team_id}&leagueId=${matchData.data.league_id}`
          );
          if (homeGamesResponse.ok) {
            const homeGamesData = await homeGamesResponse.json();
            setHomeTeamGames(homeGamesData.data || []);
          }

          const awayGamesResponse = await fetch(
            `/api/matches/${matchId}/last-games?teamId=${matchData.data.away_team_id}&leagueId=${matchData.data.league_id}`
          );
          if (awayGamesResponse.ok) {
            const awayGamesData = await awayGamesResponse.json();
            setAwayTeamGames(awayGamesData.data || []);
          }
        }

        // Fetch bookmaker odds
        const oddsResponse = await fetch(`/api/matches/${matchId}/odds`);
        if (oddsResponse.ok) {
          const oddsData = await oddsResponse.json();
          console.log('Odds data:', oddsData);
          setOdds(oddsData.data || []);
        } else {
          console.error('Failed to fetch odds:', oddsResponse.status);
        }
      } catch (error) {
        console.error('Error fetching match details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (matchId) {
      fetchMatchDetails();
    }
  }, [matchId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="h-64 bg-muted rounded"></div>
              <div className="h-48 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Match Not Found</h1>
            <p className="text-muted-foreground mb-6">The match details could not be loaded.</p>
            <Link href="/predictions" className="text-primary hover:underline">
              ← Back to Predictions
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link href="/predictions" className="inline-flex items-center text-primary hover:underline mb-6">
            <span className="mr-2">←</span> Back to Predictions
          </Link>

          {/* Match Header */}
          <div className="bg-card border border-border rounded-xl p-8 mb-6">
            <div className="flex items-center justify-center mb-4">
              {match.flag_url && (
                <img src={match.flag_url} alt={match.country_name} className="w-6 h-4 mr-2" />
              )}
              <span className="text-muted-foreground">{match.league_name}</span>
            </div>
            
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              <div className="text-center flex-1">
                <h2 className="text-2xl font-bold text-foreground">{match.home_team}</h2>
              </div>
              
              <div className="text-center mx-8">
                <div className="text-4xl font-bold text-foreground mb-2">
                  {match.phg} - {match.pag}
                </div>
                <div className="text-sm text-muted-foreground">Prediction</div>
                {match.goals_home !== null && match.goals_away !== null && (
                  <div className="mt-4">
                    <div className="text-2xl font-semibold text-muted-foreground">
                      {match.goals_home} - {match.goals_away}
                    </div>
                    <div className="text-xs text-muted-foreground">Actual</div>
                  </div>
                )}
              </div>

              <div className="text-center flex-1">
                <h2 className="text-2xl font-bold text-foreground">{match.away_team}</h2>
              </div>
            </div>

            <div className="flex justify-center gap-8 mt-6 text-sm text-muted-foreground">
              <div>📅 {formatDate(match.date_time)}</div>
              <div>🕒 {formatTime(match.date_time)}</div>
              <div>📈 {formatPercentage(match.max_prob * 100)} confidence</div>
            </div>
            
            {/* Status and Liability */}
            <div className="flex justify-center gap-4 mt-4">
              <span className={`inline-flex px-3 py-1 rounded text-xs font-medium ${
                match.liability_name?.toLowerCase() === 'high' 
                  ? 'bg-green-500/10 text-green-500'
                  : match.liability_name?.toLowerCase() === 'mid' || match.liability_name?.toLowerCase() === 'medium'
                  ? 'bg-yellow-500/10 text-yellow-500'
                  : 'bg-red-500/10 text-red-500'
              }`}>
                Liability: {match.liability_name || 'N/A'}
              </span>
              
              {match.has_actual_result ? (
                match.is_correct_prediction ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-500/10 text-green-500">
                    ✅ Correct Prediction
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-500/10 text-red-500">
                    ❌ Wrong Prediction
                  </span>
                )
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-500/10 text-blue-500">
                  ⏳ Pending
                </span>
              )}
            </div>
          </div>

          {/* Bookmaker Odds */}
          <div className="bg-card border border-border rounded-xl p-6 mb-6">
            <h3 className="text-xl font-bold text-foreground mb-4">📊 Bookmaker Odds</h3>
            {odds.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-3 font-semibold">Bookmaker</th>
                      <th className="text-center p-3 font-semibold">Home Win</th>
                      <th className="text-center p-3 font-semibold">Draw</th>
                      <th className="text-center p-3 font-semibold">Away Win</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {odds.map((odd, index) => (
                      <tr key={index} className="hover:bg-muted/30">
                        <td className="p-3 font-medium">{odd.bookmaker_name}</td>
                        <td className="p-3 text-center">{Number(odd.home_odds).toFixed(2)}</td>
                        <td className="p-3 text-center">{Number(odd.draw_odds).toFixed(2)}</td>
                        <td className="p-3 text-center">{Number(odd.away_odds).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No bookmaker odds available for this match.</p>
            )}
          </div>

          {/* Last 5 Games */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-xl font-bold text-foreground mb-4">📋 Recent Form</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Home Team Last Games */}
              <div>
                <h4 className="font-semibold text-foreground mb-3">{match.home_team}</h4>
                {homeTeamGames.length > 0 ? (
                  <div className="space-y-3">
                    {homeTeamGames.map((game, index) => {
                      const isHome = game.home_team === match.home_team;
                      const teamGoals = isHome ? game.goals_home : game.goals_away;
                      const opponentGoals = isHome ? game.goals_away : game.goals_home;
                      const result = teamGoals > opponentGoals ? 'W' : teamGoals < opponentGoals ? 'L' : 'D';
                      const resultColor = result === 'W' ? 'bg-green-500/10 text-green-500' : 
                                         result === 'L' ? 'bg-red-500/10 text-red-500' : 
                                         'bg-yellow-500/10 text-yellow-500';
                      
                      return (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div className="flex-1">
                            <div className="text-sm font-medium">
                              {game.home_team} vs {game.away_team}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatDate(game.date_time)}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold">
                              {game.goals_home} - {game.goals_away}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-bold ${resultColor}`}>
                              {result}
                            </span>
                            {game.prediction_is_correct !== null && (
                              <span className="text-lg" title={game.prediction_is_correct ? 'Prediction correct' : 'Prediction wrong'}>
                                {game.prediction_is_correct ? '✅' : '❌'}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No recent games available</p>
                )}
              </div>

              {/* Away Team Last Games */}
              <div>
                <h4 className="font-semibold text-foreground mb-3">{match.away_team}</h4>
                {awayTeamGames.length > 0 ? (
                  <div className="space-y-3">
                    {awayTeamGames.map((game, index) => {
                      const isHome = game.home_team === match.away_team;
                      const teamGoals = isHome ? game.goals_home : game.goals_away;
                      const opponentGoals = isHome ? game.goals_away : game.goals_home;
                      const result = teamGoals > opponentGoals ? 'W' : teamGoals < opponentGoals ? 'L' : 'D';
                      const resultColor = result === 'W' ? 'bg-green-500/10 text-green-500' : 
                                         result === 'L' ? 'bg-red-500/10 text-red-500' : 
                                         'bg-yellow-500/10 text-yellow-500';
                      
                      return (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div className="flex-1">
                            <div className="text-sm font-medium">
                              {game.home_team} vs {game.away_team}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatDate(game.date_time)}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold">
                              {game.goals_home} - {game.goals_away}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-bold ${resultColor}`}>
                              {result}
                            </span>
                            {game.prediction_is_correct !== null && (
                              <span className="text-lg" title={game.prediction_is_correct ? 'Prediction correct' : 'Prediction wrong'}>
                                {game.prediction_is_correct ? '✅' : '❌'}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No recent games available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}