"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { formatPercentage } from "@/lib/utils";

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

const StatsSection = () => {
  const router = useRouter();
  const t = useTranslations('stats');
  const [leagueStats, setLeagueStats] = useState<LeagueStat[]>([]);
  const [kpiStats, setKpiStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      try {
        const [tableRes, kpiRes] = await Promise.all([
          fetch("/api/stats/leagues?minMatches=10&limit=15"),
          fetch("/api/stats/kpi"),
        ]);
        const [tableData, kpiData] = await Promise.all([tableRes.json(), kpiRes.json()]);
        if (tableData.success) setLeagueStats(tableData.data);
        if (kpiData.success) setKpiStats(kpiData.data);
      } catch (error) {
        console.error("Error fetching league stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, []);

  const overallAccuracy = kpiStats?.overall_accuracy ?? 0;
  const top10Accuracy = kpiStats?.top10_accuracy ?? 0;
  const totalMatches = kpiStats?.total_matches ?? 0;
  const totalCorrect = kpiStats?.total_correct ?? 0;

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-4">
              <span className="mr-2">📊</span>
              {t('badge')}
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('title')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('description')}
            </p>
          </div>

          {!isLoading && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
              <div className="bg-card border border-border rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4"><span className="text-2xl">🎯</span></div>
                <div className="text-2xl font-bold text-primary mb-2">{formatPercentage(overallAccuracy)}</div>
                <div className="text-sm text-muted-foreground font-medium">{t('overallAccuracy')}</div>
              </div>
              <div className="bg-card border border-border rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-4"><span className="text-2xl">🏆</span></div>
                <div className="text-2xl font-bold text-green-500 mb-2">{formatPercentage(top10Accuracy)}</div>
                <div className="text-sm text-muted-foreground font-medium">{t('top10Accuracy')}</div>
              </div>
              <div className="bg-card border border-border rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4"><span className="text-2xl">📅</span></div>
                <div className="text-2xl font-bold text-foreground mb-2">{totalMatches.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground font-medium">{t('totalMatches')}</div>
              </div>
              <div className="bg-card border border-border rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-4"><span className="text-2xl">✅</span></div>
                <div className="text-2xl font-bold text-green-500 mb-2">{totalCorrect.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground font-medium">{t('correctPredictions')}</div>
              </div>
              <div className="bg-card border border-border rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mx-auto mb-4"><span className="text-2xl">🌍</span></div>
                <div className="text-2xl font-bold text-orange-500 mb-2">{kpiStats?.total_leagues ?? leagueStats.length}</div>
                <div className="text-sm text-muted-foreground font-medium">{t('leaguesCovered')}</div>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="space-y-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 animate-pulse">
                    <div className="h-6 bg-muted rounded w-48"></div>
                    <div className="h-6 bg-muted rounded w-24"></div>
                    <div className="h-6 bg-muted rounded w-32"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : leagueStats.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">{t('noData')}</div>
          ) : (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-semibold text-foreground">#</th>
                      <th className="text-left p-4 font-semibold text-foreground">{t('tableHeaders.league')}</th>
                      <th className="text-left p-4 font-semibold text-foreground">{t('tableHeaders.country')}</th>
                      <th className="text-center p-4 font-semibold text-foreground">{t('tableHeaders.overall')}</th>
                      <th className="text-center p-4 font-semibold text-foreground">{t('tableHeaders.top10')}</th>
                      <th className="text-center p-4 font-semibold text-foreground">{t('tableHeaders.matches')}</th>
                      <th className="text-center p-4 font-semibold text-foreground">{t('tableHeaders.correct')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leagueStats.map((stat, index) => (
                      <tr
                        key={stat.league_name}
                        onClick={() => router.push(`/results?league=${encodeURIComponent(stat.league_name)}`)}
                        className="border-t border-border hover:bg-muted/30 transition-colors cursor-pointer"
                      >
                        <td className="p-4 text-muted-foreground text-sm">
                          {index < 3 ? (
                            <span className={`inline-flex w-6 h-6 rounded-full items-center justify-center text-xs font-bold text-white ${index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : "bg-orange-500"}`}>{index + 1}</span>
                          ) : index + 1}
                        </td>
                        <td className="p-4 font-semibold text-foreground">{stat.league_name}</td>
                        <td className="p-4 text-muted-foreground text-sm">{stat.country_name}</td>
                        <td className="p-4 text-center font-semibold text-primary">{formatPercentage(Number(stat.accuracy_percentage))}</td>
                        <td className="p-4 text-center font-semibold text-green-500">{formatPercentage(Number(stat.top10_accuracy_percentage))}</td>
                        <td className="p-4 text-center text-muted-foreground">{Number(stat.completed_matches)}</td>
                        <td className="p-4 text-center text-green-500 font-semibold">{Number(stat.correct_predictions)}</td>
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
  );
};

export default StatsSection;
