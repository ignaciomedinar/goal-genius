import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getMatchDetails, getMatchOdds, getTeamLastGames } from '@/lib/database';
import { formatDate, formatTime, formatPercentage } from '@/lib/utils';

const baseUrl = 'https://www.goal-genius.net';

type Props = { params: Promise<{ locale: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const match = await getMatchDetails(id);

  if (!match) {
    return { title: 'Match Not Found - Goal Genius' };
  }

  const isEs = locale === 'es';
  const predictionLabel =
    match.prediction_type === 'home_win'
      ? `${match.home_team} win`
      : match.prediction_type === 'away_win'
      ? `${match.away_team} win`
      : 'Draw';

  const canonical = isEs ? `${baseUrl}/es/match/${id}` : `${baseUrl}/match/${id}`;

  return {
    title: `${match.home_team} vs ${match.away_team} Prediction - ${match.league_name} | Goal Genius`,
    description: `AI prediction for ${match.home_team} vs ${match.away_team} (${match.league_name}): ${predictionLabel} with ${formatPercentage(match.max_prob * 100)} confidence. View bookmaker odds and recent form.`,
    alternates: {
      canonical,
      languages: {
        en: `${baseUrl}/match/${id}`,
        es: `${baseUrl}/es/match/${id}`,
        'x-default': `${baseUrl}/match/${id}`,
      },
    },
    openGraph: {
      title: `${match.home_team} vs ${match.away_team} - ${match.league_name} Prediction`,
      description: `Predicted result: ${predictionLabel} · ${formatPercentage(match.max_prob * 100)} confidence · ${formatDate(match.date_time)}`,
      url: canonical,
    },
  };
}

export default async function MatchDetailPage({ params }: Props) {
  const { id: matchId } = await params;
  const t = await getTranslations('match');

  const [match, odds] = await Promise.all([
    getMatchDetails(matchId),
    getMatchOdds(matchId),
  ]);

  if (!match) {
    notFound();
  }

  const [resolvedHomeGames, resolvedAwayGames] = await Promise.all([
    getTeamLastGames(match.home_team_id, match.league_id, 5),
    getTeamLastGames(match.away_team_id, match.league_id, 5),
  ]);

  const predictionLabel =
    match.prediction_type === 'home_win'
      ? `${match.home_team} ${t('homeWin')}`
      : match.prediction_type === 'away_win'
      ? `${match.away_team} ${t('awayWin')}`
      : t('draw');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: `${match.home_team} vs ${match.away_team}`,
    startDate: match.date_time,
    location: {
      '@type': 'Place',
      name: match.league_name,
      address: { '@type': 'PostalAddress', addressCountry: match.country_name },
    },
    competitor: [
      { '@type': 'SportsTeam', name: match.home_team },
      { '@type': 'SportsTeam', name: match.away_team },
    ],
    description: `${match.league_name} match prediction: ${predictionLabel} with ${formatPercentage(match.max_prob * 100)} confidence.`,
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/predictions" className="inline-flex items-center text-primary hover:underline mb-6">
            {t('backToPredictions')}
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
                <h1 className="text-2xl font-bold text-foreground">{match.home_team}</h1>
              </div>

              <div className="text-center mx-8">
                <div className="text-4xl font-bold text-foreground mb-2">
                  {match.phg} - {match.pag}
                </div>
                <div className="text-sm text-muted-foreground">{t('prediction')}</div>
                {match.goals_home !== null && match.goals_away !== null && (
                  <div className="mt-4">
                    <div className="text-2xl font-semibold text-muted-foreground">
                      {match.goals_home} - {match.goals_away}
                    </div>
                    <div className="text-xs text-muted-foreground">{t('actual')}</div>
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
              <div>📈 {formatPercentage(match.max_prob * 100)} {t('confidence')}</div>
            </div>

            <div className="flex justify-center gap-4 mt-4">
              <span
                className={`inline-flex px-3 py-1 rounded text-xs font-medium ${
                  match.liability_name?.toLowerCase() === 'high'
                    ? 'bg-green-500/10 text-green-500'
                    : match.liability_name?.toLowerCase() === 'mid' ||
                      match.liability_name?.toLowerCase() === 'medium'
                    ? 'bg-yellow-500/10 text-yellow-500'
                    : 'bg-red-500/10 text-red-500'
                }`}
              >
                {t('liability')} {match.liability_name || 'N/A'}
              </span>

              {match.has_actual_result ? (
                match.is_correct_prediction ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-500/10 text-green-500">
                    ✅ {t('correctPrediction')}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-500/10 text-red-500">
                    ❌ {t('wrongPrediction')}
                  </span>
                )
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-500/10 text-blue-500">
                  ⏳ {t('pending')}
                </span>
              )}
            </div>
          </div>

          {/* Bookmaker Odds */}
          <div className="bg-card border border-border rounded-xl p-6 mb-6">
            <h3 className="text-xl font-bold text-foreground mb-4">{t('bookmakerOdds')}</h3>
            {odds.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-3 font-semibold">{t('bookmaker')}</th>
                      <th className="text-center p-3 font-semibold">{t('homeWin')}</th>
                      <th className="text-center p-3 font-semibold">{t('draw')}</th>
                      <th className="text-center p-3 font-semibold">{t('awayWin')}</th>
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
              <p className="text-muted-foreground text-sm">{t('noOdds')}</p>
            )}
          </div>

          {/* Recent Form */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-xl font-bold text-foreground mb-4">{t('recentForm')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TeamForm teamName={match.home_team} games={resolvedHomeGames} noRecentGamesLabel={t('noRecentGames')} />
              <TeamForm teamName={match.away_team} games={resolvedAwayGames} noRecentGamesLabel={t('noRecentGames')} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TeamForm({
  teamName,
  games,
  noRecentGamesLabel,
}: {
  teamName: string;
  games: Awaited<ReturnType<typeof getTeamLastGames>>;
  noRecentGamesLabel: string;
}) {
  return (
    <div>
      <h4 className="font-semibold text-foreground mb-3">{teamName}</h4>
      {games.length > 0 ? (
        <div className="space-y-3">
          {games.map((game, index) => {
            const isHome = game.home_team === teamName;
            const teamGoals = isHome ? game.goals_home : game.goals_away;
            const opponentGoals = isHome ? game.goals_away : game.goals_home;
            const result = teamGoals > opponentGoals ? 'W' : teamGoals < opponentGoals ? 'L' : 'D';
            const resultColor =
              result === 'W'
                ? 'bg-green-500/10 text-green-500'
                : result === 'L'
                ? 'bg-red-500/10 text-red-500'
                : 'bg-yellow-500/10 text-yellow-500';

            return (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex-1">
                  <div className="text-sm font-medium">
                    {game.home_team} vs {game.away_team}
                  </div>
                  <div className="text-xs text-muted-foreground">{formatDate(game.date_time)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold">
                    {game.goals_home} - {game.goals_away}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${resultColor}`}>{result}</span>
                  {game.prediction_is_correct !== null && (
                    <span title={game.prediction_is_correct ? 'Prediction correct' : 'Prediction wrong'}>
                      {game.prediction_is_correct ? '✅' : '❌'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">{noRecentGamesLabel}</p>
      )}
    </div>
  );
}
