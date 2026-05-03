'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { WeeklyAccuracy, Match } from '@/types';
import { formatPercentage } from '@/lib/utils';

const mockWeeklyAccuracy: WeeklyAccuracy = {
  week: 'Week of October 28 - November 3, 2024',
  accuracy: 87.5,
  totalMatches: 10,
  correctPredictions: 8,
  topMatches: [
    {
      id: '1',
      homeTeam: 'Liverpool',
      awayTeam: 'Chelsea',
      homeScore: 2,
      awayScore: 1,
      predictedHomeScore: 2,
      predictedAwayScore: 1,
      matchDate: '2024-10-28',
      matchTime: '16:30',
      league: 'Premier League',
      confederation: 'UEFA',
      probability: 78.5,
      status: 'finished'
    },
    {
      id: '2',
      homeTeam: 'Inter Milan',
      awayTeam: 'Juventus',
      homeScore: 1,
      awayScore: 0,
      predictedHomeScore: 1,
      predictedAwayScore: 0,
      matchDate: '2024-10-29',
      matchTime: '20:45',
      league: 'Serie A',
      confederation: 'UEFA',
      probability: 72.3,
      status: 'finished'
    },
    {
      id: '3',
      homeTeam: 'Atletico Madrid',
      awayTeam: 'Real Madrid',
      homeScore: 1,
      awayScore: 3,
      predictedHomeScore: 0,
      predictedAwayScore: 2,
      matchDate: '2024-10-29',
      matchTime: '21:00',
      league: 'La Liga',
      confederation: 'UEFA',
      probability: 69.1,
      status: 'finished'
    },
  ]
};

const AccuracySection = () => {
  const [weeklyData, setWeeklyData] = useState<WeeklyAccuracy | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const t = useTranslations('accuracy');
  const locale = useLocale();

  useEffect(() => {
    const fetchAccuracyData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/matches/previous-week');
        const result = await response.json();

        if (result.success) {
          const matches: Match[] = result.data.map((match: any) => ({
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
            is_correct_prediction: match.is_correct_prediction,
            has_actual_result: match.has_actual_result,
          }));

          const top10 = matches.slice(0, 10);
          const top10Correct = top10.filter(m => m.is_correct_prediction).length;
          const accuracy = top10.length > 0 ? (top10Correct / top10.length) * 100 : 0;

          const dateLocale = locale === 'es' ? 'es-ES' : 'en-US';
          const weeklyAccuracy: WeeklyAccuracy = {
            week: `${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString(dateLocale, { month: 'short', day: 'numeric', year: 'numeric' })} - ${new Date().toLocaleDateString(dateLocale, { month: 'short', day: 'numeric', year: 'numeric' })}`,
            accuracy: Math.round(accuracy * 10) / 10,
            totalMatches: top10.length,
            correctPredictions: top10Correct,
            topMatches: top10,
          };

          setWeeklyData(weeklyAccuracy);
        } else {
          setWeeklyData(mockWeeklyAccuracy);
        }
      } catch (error) {
        setWeeklyData(mockWeeklyAccuracy);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccuracyData();
  }, [locale]);

  const checkPredictionAccuracy = (match: Match) => {
    return !!match.is_correct_prediction;
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="h-6 bg-muted rounded w-48 mx-auto mb-4"></div>
              <div className="h-10 bg-muted rounded w-96 mx-auto mb-4"></div>
              <div className="h-4 bg-muted rounded w-2/3 mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="match-card animate-pulse">
                  <div className="h-16 bg-muted rounded w-full mb-4"></div>
                  <div className="h-4 bg-muted rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!weeklyData) return null;

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-4">
              <span className="mr-2">🏆</span>
              {t('badge')}
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('title')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {weeklyData.week}
            </p>
          </div>

          {/* Overall Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <div className="text-3xl font-bold text-primary mb-2">
                {formatPercentage(weeklyData.accuracy)}
              </div>
              <div className="text-muted-foreground font-medium">{t('overallAccuracy')}</div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-win/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <div className="text-3xl font-bold text-win mb-2">
                {weeklyData.correctPredictions}
              </div>
              <div className="text-muted-foreground font-medium">{t('correctPredictions')}</div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-loss/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">❌</span>
              </div>
              <div className="text-3xl font-bold text-loss mb-2">
                {weeklyData.totalMatches - weeklyData.correctPredictions}
              </div>
              <div className="text-muted-foreground font-medium">{t('missedPredictions')}</div>
            </div>
          </div>

          {/* Match Results */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-display text-xl font-semibold text-foreground mb-6 flex items-center">
              <span className="mr-2">📈</span>
              {t('breakdownTitle')}
            </h3>

            <div className="space-y-4">
              {weeklyData.topMatches.slice(0, 10).map((match, index) => {
                const isCorrect = checkPredictionAccuracy(match);

                return (
                  <div
                    key={match.id}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 transition-colors ${
                      isCorrect
                        ? 'border-win/20 bg-win/5'
                        : 'border-loss/20 bg-loss/5'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCorrect ? 'bg-win text-white' : 'bg-loss text-white'
                      }`}>
                        {isCorrect ? <span>✅</span> : <span>❌</span>}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">
                          {match.homeTeam} vs {match.awayTeam}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {match.league} • {formatPercentage(match.probability || 0)} {t('confidence')}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-semibold text-foreground mb-1">
                        {match.homeScore} - {match.awayScore}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {t('predicted')} {match.predictedHomeScore} - {match.predictedAwayScore}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccuracySection;
