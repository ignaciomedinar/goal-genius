'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
// Icons replaced with emojis for compatibility
import { Match } from '@/types';
import { formatDate, formatTime, formatPercentage } from '@/lib/utils';

// Mock data - replace with actual API calls
const mockMatches: Match[] = [
  {
    id: '1',
    homeTeam: 'Manchester City',
    awayTeam: 'Arsenal',
    predictedHomeScore: 2,
    predictedAwayScore: 1,
    matchDate: '2024-11-03',
    matchTime: '15:00',
    league: 'Premier League',
    confederation: 'UEFA',
    probability: 73.2,
    status: 'upcoming'
  },
  {
    id: '2',
    homeTeam: 'Real Madrid',
    awayTeam: 'Barcelona',
    predictedHomeScore: 1,
    predictedAwayScore: 2,
    matchDate: '2024-11-03',
    matchTime: '20:00',
    league: 'La Liga',
    confederation: 'UEFA',
    probability: 68.5,
    status: 'upcoming'
  },
  {
    id: '3',
    homeTeam: 'Bayern Munich',
    awayTeam: 'Borussia Dortmund',
    predictedHomeScore: 3,
    predictedAwayScore: 1,
    matchDate: '2024-11-04',
    matchTime: '18:30',
    league: 'Bundesliga',
    confederation: 'UEFA',
    probability: 71.8,
    status: 'upcoming'
  },
  {
    id: '4',
    homeTeam: 'PSG',
    awayTeam: 'Lyon',
    predictedHomeScore: 2,
    predictedAwayScore: 0,
    matchDate: '2024-11-04',
    matchTime: '21:00',
    league: 'Ligue 1',
    confederation: 'UEFA',
    probability: 79.3,
    status: 'upcoming'
  },
  {
    id: '5',
    homeTeam: 'Juventus',
    awayTeam: 'AC Milan',
    predictedHomeScore: 1,
    predictedAwayScore: 1,
    matchDate: '2024-11-05',
    matchTime: '19:45',
    league: 'Serie A',
    confederation: 'UEFA',
    probability: 65.7,
    status: 'upcoming'
  }
];

const TopMatchesSection = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/matches/top?limit=6');
        const result = await response.json();
        
        if (result.success) {
          // Convert database format to component format
          const formattedMatches: Match[] = result.data.map((match: any) => ({
            id: match.match_id || `${match.home_team}-${match.away_team}`,
            homeTeam: match.home_team,
            awayTeam: match.away_team,
            homeScore: match.goals_home,
            awayScore: match.goals_away,
            predictedHomeScore: match.phg ?? match.prediction_goals_home,
            predictedAwayScore: match.pag ?? match.prediction_goals_away,
            matchDate: match.date_time ? new Date(match.date_time).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            matchTime: match.date_time ? new Date(match.date_time).toTimeString().split(' ')[0].slice(0, 5) : '15:00',
            league: match.league_name,
            confederation: match.country_name || 'UEFA',
            probability: match.max_prob ? match.max_prob * 100 : 0,
            status: match.has_actual_result ? 'finished' : 'upcoming',
            country_name: match.country_name,
            flag_url: match.flag_url,
            is_correct_prediction: match.is_correct_prediction,
            prediction_type: match.prediction_type,
            actual_result: match.actual_result,
            has_actual_result: match.has_actual_result,
          }));
          setMatches(formattedMatches);
        } else {
          console.error('Failed to fetch matches:', result.error);
          // Fallback to mock data
          setMatches(mockMatches);
        }
      } catch (error) {
        console.error('Error fetching matches:', error);
        // Fallback to mock data
        setMatches(mockMatches);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const getPredictionResult = (homeScore: number, awayScore: number) => {
    if (homeScore > awayScore) return { result: 'Home Win', color: 'text-win' };
    if (awayScore > homeScore) return { result: 'Away Win', color: 'text-win' };
    return { result: 'Draw', color: 'text-draw' };
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-4">
            <span className="mr-2">📈</span>
            This Week's Highlights
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Top 6 Matches This Week
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our highest confidence predictions for the most anticipated matches this week. 
            These selections are based on advanced statistical analysis and team performance metrics.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="match-card animate-pulse">
                <div className="h-4 bg-muted rounded w-1/3 mb-4"></div>
                <div className="flex items-center justify-between mb-4">
                  <div className="h-6 bg-muted rounded w-1/4"></div>
                  <div className="h-8 bg-muted rounded w-16"></div>
                  <div className="h-6 bg-muted rounded w-1/4"></div>
                </div>
                <div className="h-4 bg-muted rounded w-full mb-2"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            {matches.map((match, index) => {
              const prediction = getPredictionResult(
                match.predictedHomeScore || 0, 
                match.predictedAwayScore || 0
              );
              
              return (
                <Link
                  key={match.id}
                  href={`/match/${match.id}`}
                  className="match-card card-hover group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                      #{index + 1}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">
                      {match.league}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    <div className="flex-1 text-right">
                      <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {match.homeTeam}
                      </div>
                    </div>
                    
                    <div className="mx-6 text-center">
                      <div className="text-2xl font-bold text-foreground mb-1">
                        {match.predictedHomeScore} - {match.predictedAwayScore}
                      </div>
                      <div className={`text-sm font-medium ${prediction.color}`}>
                        {prediction.result}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {match.awayTeam}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <span className="mr-1">📅</span>
                        {formatDate(match.matchDate)}
                      </div>
                      <div className="flex items-center">
                        <span className="mr-1">🕒</span>
                        {formatTime(match.matchDate + 'T' + match.matchTime)}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Confidence:</span>
                      <span className="text-sm font-semibold text-primary">
                        {formatPercentage(match.probability || 0)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm text-muted-foreground">View Details</span>
                    <span className="text-muted-foreground">↗</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="text-center">
          <Link
            href="/predictions"
            className="inline-flex items-center px-6 py-3 bg-secondary text-secondary-foreground font-medium rounded-lg hover:bg-secondary/80 transition-colors"
          >
            View All Predictions
            <span className="ml-2">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopMatchesSection;