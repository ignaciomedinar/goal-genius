'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { formatDate, formatTime, formatPercentage } from '@/lib/utils';

interface Prediction {
  match_id: string;
  country_name: string;
  flag_url: string | null;
  league_name: string;
  home_team: string;
  away_team: string;
  date_time: string;
  phg: number;
  pag: number;
  goals_home: number | null;
  goals_away: number | null;
  is_correct_prediction: boolean;
  prediction_type: 'home_win' | 'away_win' | 'draw';
  actual_result: 'home_win' | 'away_win' | 'draw' | 'pending';
  has_actual_result: boolean;
  bet_name?: string;
  max_prob: number;
  liability_name: string;
  avg_home_odds: number | null;
  avg_draw_odds: number | null;
  avg_away_odds: number | null;
}

type SortField = 'date' | 'confidence' | 'league' | 'homeTeam' | 'status' | 'liability';
type SortDirection = 'asc' | 'desc';

const PredictionsTable = () => {
  const router = useRouter();
  const t = useTranslations('predictionsTable');
  const locale = useLocale();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeague, setSelectedLeague] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(50);

  useEffect(() => {
    const fetchPredictions = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/matches/current-week');
        const result = await response.json();
        if (result.success) {
          setPredictions(result.data);
        } else {
          setPredictions([]);
        }
      } catch (error) {
        setPredictions([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPredictions();
  }, []);

  const leagues = useMemo(() => [...new Set(predictions.map(p => p.league_name).filter(Boolean))].sort(), [predictions]);
  const countries = useMemo(() => [...new Set(predictions.map(p => p.country_name).filter(Boolean))].sort(), [predictions]);

  const availableDates = useMemo(() => {
    const dateKeys = predictions
      .map(p => p.date_time ? new Date(p.date_time).toISOString().slice(0, 10) : null)
      .filter((d): d is string => d !== null);
    const unique = [...new Set(dateKeys)].sort();
    const firstMonday = unique.find(d => new Date(d + 'T12:00:00').getDay() === 1);
    return firstMonday ? unique.filter(d => d >= firstMonday) : unique;
  }, [predictions]);

  const toggleDate = (dateKey: string) => {
    setSelectedDates(prev => {
      const next = new Set(prev);
      if (next.has(dateKey)) next.delete(dateKey);
      else next.add(dateKey);
      return next;
    });
  };

  const liabilityOrder = (name: string) => {
    const key = name?.toLowerCase();
    if (key === 'high') return 3;
    if (key === 'mid' || key === 'medium') return 2;
    if (key === 'low') return 1;
    return 0;
  };

  const filteredAndSortedPredictions = useMemo(() => {
    let filtered = predictions.filter(prediction => {
      if (!prediction.home_team || !prediction.away_team) return false;
      const matchesSearch = searchTerm === '' ||
        prediction.home_team?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prediction.away_team?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prediction.league_name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLeague = selectedLeague === 'all' || prediction.league_name === selectedLeague;
      const matchesCountry = selectedCountry === 'all' || prediction.country_name === selectedCountry;
      const matchesDate = selectedDates.size === 0 || (
        prediction.date_time
          ? selectedDates.has(new Date(prediction.date_time).toISOString().slice(0, 10))
          : false
      );
      return matchesSearch && matchesLeague && matchesCountry && matchesDate;
    });

    if (sortField === null) {
      filtered.sort((a, b) => {
        const liabilityDiff = liabilityOrder(b.liability_name) - liabilityOrder(a.liability_name);
        if (liabilityDiff !== 0) return liabilityDiff;
        return (b.max_prob || 0) - (a.max_prob || 0);
      });
    } else {
      filtered.sort((a, b) => {
        let aValue: any, bValue: any;
        switch (sortField) {
          case 'date':
            aValue = new Date(a.date_time);
            bValue = new Date(b.date_time);
            break;
          case 'confidence':
            aValue = a.max_prob || 0;
            bValue = b.max_prob || 0;
            break;
          case 'league':
            aValue = a.league_name || '';
            bValue = b.league_name || '';
            break;
          case 'homeTeam':
            aValue = a.home_team || '';
            bValue = b.home_team || '';
            break;
          case 'status':
            aValue = a.has_actual_result ? (a.is_correct_prediction ? 1 : 0) : -1;
            bValue = b.has_actual_result ? (b.is_correct_prediction ? 1 : 0) : -1;
            break;
          case 'liability':
            aValue = liabilityOrder(a.liability_name);
            bValue = liabilityOrder(b.liability_name);
            break;
          default:
            return 0;
        }
        return sortDirection === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
      });
    }
    return filtered;
  }, [predictions, searchTerm, selectedLeague, selectedCountry, selectedDates, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredAndSortedPredictions.length / itemsPerPage);
  const paginatedResults = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedPredictions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedPredictions, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedLeague, selectedCountry, selectedDates, itemsPerPage]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const exportToCSV = () => {
    const formatDateTimeCSV = (dt: string) => {
      const d = new Date(dt);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const hh = String(d.getHours()).padStart(2, '0');
      const min = String(d.getMinutes()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
    };
    const predictedVictor = (pred: Prediction) => {
      if (pred.phg > pred.pag) return t('home');
      if (pred.pag > pred.phg) return t('away');
      return t('draw');
    };
    const headers = [
      t('colLeague'), t('colMatch'), t('colDateTime'),
      'Home Predicted Goals', 'Away Predicted Goals',
      'Predicted Victor', t('colConfidence'), t('colLiability'),
    ];
    const csvData = filteredAndSortedPredictions.map(pred => [
      pred.country_name, pred.league_name,
      pred.date_time ? formatDateTimeCSV(pred.date_time) : '',
      pred.home_team, pred.phg, pred.pag, pred.away_team,
      predictedVictor(pred),
      formatPercentage(pred.max_prob * 100),
      pred.liability_name,
    ]);
    const csv = [headers, ...csvData]
      .map(row => row.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `predictions-current-week.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const dateLocale = locale === 'es' ? 'es-ES' : 'en-GB';

  return (
    <div className="space-y-6">
      {/* Filters and Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex items-center gap-4">
          {sortField !== null && (
            <button
              onClick={() => setSortField(null)}
              className="px-3 py-2 border border-border rounded-lg bg-background text-foreground hover:bg-card transition-colors flex items-center gap-2 text-sm"
            >
              {t('resetSort')}
            </button>
          )}
        </div>

        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">🔍</span>
          </div>
        </div>

        <button
          onClick={exportToCSV}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <span>⬇️</span>
          {t('exportCsv')}
        </button>
      </div>

      <div className="flex flex-wrap gap-4">
        <select
          value={selectedLeague}
          onChange={(e) => setSelectedLeague(e.target.value)}
          className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">{t('allLeagues')}</option>
          {leagues.map(league => (
            <option key={league} value={league}>{league}</option>
          ))}
        </select>

        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">{t('allCountries')}</option>
          {countries.map(country => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">{t('show')}</label>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
            className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-sm text-muted-foreground">{t('perPage')}</span>
        </div>

        <div className="ml-auto flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg">
          <span className="text-sm text-muted-foreground">{t('total')}</span>
          <span className="font-bold text-lg text-primary">{filteredAndSortedPredictions.length}</span>
          <span className="text-sm text-muted-foreground">{t('predictions')}</span>
        </div>
      </div>

      {/* Date chips */}
      {availableDates.length > 1 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">{t('dateFilter')}</span>
          {availableDates.map(dateKey => {
            const label = new Date(dateKey + 'T12:00:00').toLocaleDateString(dateLocale, {
              weekday: 'short', month: 'short', day: 'numeric',
            });
            const active = selectedDates.has(dateKey);
            return (
              <button
                key={dateKey}
                onClick={() => toggleDate(dateKey)}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                  active
                    ? 'bg-primary text-white border-primary'
                    : 'bg-background text-foreground border-border hover:bg-card'
                }`}
              >
                {label}
              </button>
            );
          })}
          {selectedDates.size > 0 && (
            <button
              onClick={() => setSelectedDates(new Set())}
              className="px-3 py-1 rounded-full text-sm border border-border bg-background text-muted-foreground hover:bg-card transition-colors"
            >
              {t('clear')}
            </button>
          )}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="text-4xl mb-2">⏳</div>
            <p className="text-muted-foreground">{t('loading')}</p>
          </div>
        </div>
      ) : filteredAndSortedPredictions.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-2">🔍</div>
          <p className="text-muted-foreground">{t('noResults')}</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-card border-b border-border">
                  <th className="px-4 py-3 text-left">
                    <button onClick={() => handleSort('league')} className="flex items-center gap-2 hover:text-primary transition-colors">
                      {t('colLeague')}
                      {sortField === 'league' && <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button onClick={() => handleSort('homeTeam')} className="flex items-center gap-2 hover:text-primary transition-colors">
                      {t('colMatch')}
                      {sortField === 'homeTeam' && <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button onClick={() => handleSort('date')} className="flex items-center gap-2 hover:text-primary transition-colors">
                      {t('colDateTime')}
                      {sortField === 'date' && <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-center">{t('colPrediction')}</th>
                  <th className="px-4 py-3 text-center">{t('colActual')}</th>
                  <th className="px-4 py-3 text-center">
                    <button onClick={() => handleSort('confidence')} className="flex items-center gap-2 hover:text-primary transition-colors">
                      {t('colConfidence')}
                      {sortField === 'confidence' && <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-center">
                    <button onClick={() => handleSort('liability')} className="flex items-center gap-2 hover:text-primary transition-colors">
                      {t('colLiability')}
                      {sortField === 'liability' && <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-center">{t('colAvgOdds')}</th>
                  <th className="px-4 py-3 text-center">
                    <button onClick={() => handleSort('status')} className="flex items-center gap-2 hover:text-primary transition-colors">
                      {t('colStatus')}
                      {sortField === 'status' && <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedResults.map((prediction, index) => (
                  <tr
                    key={prediction.match_id || index}
                    onClick={() => router.push(`/match/${prediction.match_id}`)}
                    className="border-b border-border hover:bg-card/50 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {prediction.flag_url && (
                          <img src={prediction.flag_url} alt={prediction.country_name} className="w-5 h-4 object-cover rounded" />
                        )}
                        <div>
                          <div className="text-sm font-medium">{prediction.league_name}</div>
                          <div className="text-xs text-muted-foreground">{prediction.country_name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="hover:text-primary transition-colors">
                        <div className="font-medium">{prediction.home_team}</div>
                        <div className="text-sm text-muted-foreground">{prediction.away_team}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-sm">
                          <span>📅</span>
                          <span>{formatDate(prediction.date_time)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <span>🕒</span>
                          <span>{formatTime(prediction.date_time)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="font-mono font-bold text-lg whitespace-nowrap">
                        {prediction.phg} - {prediction.pag}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {prediction.phg > prediction.pag ? t('home') :
                         prediction.pag > prediction.phg ? t('away') : t('draw')}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      {prediction.has_actual_result ? (
                        <>
                          <div className="font-mono font-bold text-lg whitespace-nowrap">
                            {prediction.goals_home} - {prediction.goals_away}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {prediction.bet_name ||
                             (prediction.goals_home! > prediction.goals_away! ? t('home') :
                              prediction.goals_away! > prediction.goals_home! ? t('away') : t('draw'))}
                          </div>
                        </>
                      ) : (
                        <div className="text-sm text-muted-foreground">{t('notPlayed')}</div>
                      )}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="font-bold text-primary">
                        {formatPercentage(prediction.max_prob * 100)}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                        prediction.liability_name?.toLowerCase() === 'high'
                          ? 'bg-green-500/10 text-green-500'
                          : prediction.liability_name?.toLowerCase() === 'mid' || prediction.liability_name?.toLowerCase() === 'medium'
                          ? 'bg-yellow-500/10 text-yellow-500'
                          : 'bg-red-500/10 text-red-500'
                      }`}>
                        {prediction.liability_name || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      {prediction.avg_home_odds != null || prediction.avg_draw_odds != null || prediction.avg_away_odds != null ? (
                        <div className="flex flex-col gap-0.5 text-xs font-mono">
                          <span><span className="text-muted-foreground">H</span> {prediction.avg_home_odds?.toFixed(2) ?? '—'}</span>
                          <span><span className="text-muted-foreground">X</span> {prediction.avg_draw_odds?.toFixed(2) ?? '—'}</span>
                          <span><span className="text-muted-foreground">A</span> {prediction.avg_away_odds?.toFixed(2) ?? '—'}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-center">
                      {prediction.has_actual_result ? (
                        prediction.is_correct_prediction ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-500/10 text-green-500">
                            ✅ {t('correct')}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-500/10 text-red-500">
                            ❌ {t('wrong')}
                          </span>
                        )
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-500/10 text-blue-500">
                          ⏳ {t('pending')}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              {t('showing', {
                from: ((currentPage - 1) * itemsPerPage) + 1,
                to: Math.min(currentPage * itemsPerPage, filteredAndSortedPredictions.length),
                total: filteredAndSortedPredictions.length,
              })}
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground hover:bg-card transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {t('first')}
              </button>
              <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground hover:bg-card transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {t('previous')}
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) pageNum = i + 1;
                  else if (currentPage <= 3) pageNum = i + 1;
                  else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                  else pageNum = currentPage - 2 + i;
                  return (
                    <button key={pageNum} onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 border rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? 'bg-primary text-white border-primary'
                          : 'bg-background text-foreground border-border hover:bg-card'
                      }`}>
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground hover:bg-card transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {t('next')}
              </button>
              <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground hover:bg-card transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {t('last')}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PredictionsTable;
