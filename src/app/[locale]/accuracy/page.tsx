'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { formatPercentage } from '@/lib/utils';

interface KpiStats {
  overall_accuracy: number;
  top10_accuracy: number;
  total_matches: number;
  total_correct: number;
}

interface LeagueStat {
  league_name: string;
  country_name: string;
  accuracy_percentage: number;
  top10_accuracy_percentage: number;
  completed_matches: number;
  correct_predictions: number;
  top10_matches: number;
  top10_correct_predictions: number;
}

const kpiCards = (stats: KpiStats) => [
  {
    icon: '🎯',
    label: 'Overall Accuracy',
    value: `${formatPercentage(Number(stats.overall_accuracy))}`,
    description: 'Across all predictions in the last 30 days',
    color: 'text-primary',
  },
  {
    icon: '🏆',
    label: 'Top 10 Accuracy',
    value: `${formatPercentage(Number(stats.top10_accuracy))}`,
    description: 'Highest-confidence picks only',
    color: 'text-green-500',
  },
  {
    icon: '⚽',
    label: 'Matches Analysed',
    value: Number(stats.total_matches).toLocaleString(),
    description: 'Completed matches tracked',
    color: 'text-blue-500',
  },
  {
    icon: '✅',
    label: 'Correct Predictions',
    value: Number(stats.total_correct).toLocaleString(),
    description: 'Outcomes correctly predicted',
    color: 'text-green-500',
  },
];

export default function AccuracyPage() {
  const [kpi, setKpi] = useState<KpiStats | null>(null);
  const [leagues, setLeagues] = useState<LeagueStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [kpiRes, leagueRes] = await Promise.all([
          fetch('/api/stats/kpi'),
          fetch('/api/stats/leagues?minMatches=5&limit=50'),
        ]);
        const [kpiData, leagueData] = await Promise.all([kpiRes.json(), leagueRes.json()]);
        if (kpiData.success) setKpi(kpiData.data);
        if (leagueData.success) setLeagues(leagueData.data);
      } catch {
        setError('Failed to load accuracy data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/5 py-20 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-6">
            <span className="mr-2">📈</span>
            Our Accuracy
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Transparency Is Our
            <span className="block text-primary">Core Value</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Every prediction we make is tracked. Every result is validated. Here&apos;s our full
            accuracy record — updated automatically, no cherry-picking.
          </p>
        </div>
      </section>

      {/* KPI Cards */}
      <section className="py-16 bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-card border border-border rounded-xl p-6 animate-pulse">
                    <div className="h-8 bg-muted rounded mb-2 w-1/2" />
                    <div className="h-10 bg-muted rounded mb-2" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12 text-muted-foreground">{error}</div>
            ) : kpi ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {kpiCards(kpi).map((card) => (
                  <div
                    key={card.label}
                    className="bg-card border border-border rounded-xl p-6 text-center hover:border-primary/40 transition-colors"
                  >
                    <div className="text-3xl mb-3">{card.icon}</div>
                    <div className={`text-3xl font-bold font-display mb-1 ${card.color}`}>
                      {card.value}
                    </div>
                    <div className="text-sm font-semibold text-foreground mb-1">{card.label}</div>
                    <div className="text-xs text-muted-foreground">{card.description}</div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* How we measure */}
      <section className="py-16 bg-muted/20 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-4">
                <span className="mr-2">🔍</span>
                Methodology
              </div>
              <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                How We Measure Accuracy
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">📊</span>
                  <h3 className="font-display font-semibold text-foreground">Overall Accuracy</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  The percentage of all completed predictions that matched the actual match
                  outcome (home win, draw, or away win). Calculated across every league and
                  liability tier over the last 30 days. This is our broadest accuracy metric.
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">🏆</span>
                  <h3 className="font-display font-semibold text-foreground">Top 10 Accuracy</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  The accuracy of only our highest-confidence picks — the top 10 predictions
                  sorted by confidence score (max_prob). This metric shows how reliable the model
                  is when it&apos;s most certain, and is the best indicator of actionable prediction
                  quality.
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">📅</span>
                  <h3 className="font-display font-semibold text-foreground">30-Day Window</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  All metrics are calculated on a rolling 30-day window. This keeps the data
                  recent and relevant, reflecting current model performance rather than
                  accumulated historical averages that may mask recent changes.
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">🔄</span>
                  <h3 className="font-display font-semibold text-foreground">Live Updates</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Results are validated automatically as matches finish. Accuracy figures update
                  daily — or faster when a batch of results comes in. You never need to refresh
                  manually for stale numbers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* League table */}
      <section className="py-16 bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-4">
                <span className="mr-2">🌍</span>
                League Breakdown
              </div>
              <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                Accuracy by League
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto text-sm">
                Last 30 days · Leagues with 5+ completed matches · Ranked by Top 10 accuracy
              </p>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-14 bg-muted rounded-lg animate-pulse" />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12 text-muted-foreground">{error}</div>
            ) : leagues.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No league data available yet.
              </div>
            ) : (
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50 border-b border-border">
                        <th className="text-left p-4 font-semibold text-foreground text-sm w-10">#</th>
                        <th className="text-left p-4 font-semibold text-foreground text-sm">League</th>
                        <th className="text-left p-4 font-semibold text-foreground text-sm">Country</th>
                        <th className="text-center p-4 font-semibold text-foreground text-sm">Overall</th>
                        <th className="text-center p-4 font-semibold text-foreground text-sm">Top 10 ▼</th>
                        <th className="text-center p-4 font-semibold text-foreground text-sm">Matches</th>
                        <th className="text-center p-4 font-semibold text-foreground text-sm">Correct</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leagues.map((stat, index) => (
                        <tr
                          key={`${stat.league_name}-${index}`}
                          className="border-t border-border hover:bg-muted/30 transition-colors"
                        >
                          <td className="p-4 text-sm">
                            {index < 3 ? (
                              <span
                                className={`inline-flex w-6 h-6 rounded-full items-center justify-center text-xs font-bold text-white ${
                                  index === 0
                                    ? 'bg-yellow-500'
                                    : index === 1
                                    ? 'bg-gray-400'
                                    : 'bg-orange-500'
                                }`}
                              >
                                {index + 1}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">{index + 1}</span>
                            )}
                          </td>
                          <td className="p-4 font-semibold text-foreground text-sm">{stat.league_name}</td>
                          <td className="p-4 text-muted-foreground text-sm">{stat.country_name}</td>
                          <td className="p-4 text-center font-semibold text-primary text-sm">
                            {formatPercentage(Number(stat.accuracy_percentage))}
                          </td>
                          <td className="p-4 text-center font-semibold text-green-500 text-sm">
                            {formatPercentage(Number(stat.top10_accuracy_percentage))}
                          </td>
                          <td className="p-4 text-center text-muted-foreground text-sm">
                            {Number(stat.completed_matches)}
                          </td>
                          <td className="p-4 text-center text-green-500 font-semibold text-sm">
                            {Number(stat.correct_predictions)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Liability tier accuracy note */}
      <section className="py-16 bg-muted/20 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-4">
                <span className="mr-2">📊</span>
                Liability Tiers
              </div>
              <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                Performance by Confidence Tier
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto text-sm">
                Accuracy generally increases as confidence rises. High-liability picks are our most reliable.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card border border-green-500/30 rounded-xl p-6 text-center">
                <div className="inline-flex px-3 py-1 bg-green-500/10 text-green-500 rounded text-sm font-semibold mb-3">High</div>
                <div className="text-4xl font-bold font-display text-green-500 mb-1">Best</div>
                <p className="text-sm text-muted-foreground">Highest model confidence. These picks historically land most often.</p>
              </div>
              <div className="bg-card border border-yellow-500/30 rounded-xl p-6 text-center">
                <div className="inline-flex px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded text-sm font-semibold mb-3">Mid</div>
                <div className="text-4xl font-bold font-display text-yellow-500 mb-1">Good</div>
                <p className="text-sm text-muted-foreground">Solid confidence with some variance. Worth considering but carry more uncertainty.</p>
              </div>
              <div className="bg-card border border-red-500/30 rounded-xl p-6 text-center">
                <div className="inline-flex px-3 py-1 bg-red-500/10 text-red-500 rounded text-sm font-semibold mb-3">Low</div>
                <div className="text-4xl font-bold font-display text-red-500 mb-1">Caution</div>
                <p className="text-sm text-muted-foreground">Lower confidence predictions. Higher variance outcomes. Treat with extra scepticism.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">
            Explore the full results archive
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Browse weekly results, filter by league or confidence tier, and export data for your own analysis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/results"
              className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-lg"
            >
              View Results <span className="ml-2">→</span>
            </Link>
            <Link
              href="/predictions"
              className="inline-flex items-center px-8 py-4 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/80 transition-colors"
            >
              This Week&apos;s Predictions
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
