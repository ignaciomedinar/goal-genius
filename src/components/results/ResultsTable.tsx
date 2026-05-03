'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { formatDate, formatTime, formatPercentage } from '@/lib/utils';

interface MatchResult {
  match_id: string;
  country_name: string;
  flag_url: string | null;
  league_name: string;
  home_team: string;
  goals_home: number;
  goals_away: number;
  away_team: string;
  prediction_goals_home: number;
  prediction_goals_away: number;
  actual_result: string;
  prediction_is_correct: boolean;
  max_prob: number;
  liability_name: string;
  date_time: string;
}

type SortField = 'date' | 'confidence' | 'league' | 'homeTeam' | 'status' | 'liability';
type SortDirection = 'asc' | 'desc';

interface ResultsTableProps {
  initialLeague?: string;
}

const ResultsTable = ({ initialLeague = 'all' }: ResultsTableProps) => {
  const t = useTranslations('resultsTable');
  const [results, setResults] = useState<MatchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeague, setSelectedLeague] = useState<string>(initialLeague);
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedWeek, setSelectedWeek] = useState<number>(7);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [copiedText, setCopiedText] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(50);

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/matches/results?weekOffset=${selectedWeek}`);
        const result = await response.json();
        if (result.success) {
          setResults(result.data);
        } else {
          setResults([]);
        }
      } catch (error) {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResults();
  }, [selectedWeek]);

  const leagues = useMemo(() => [...new Set(results.map(r => r.league_name).filter(Boolean))].sort(), [results]);
  const countries = useMemo(() => [...new Set(results.map(r => r.country_name).filter(Boolean))].sort(), [results]);

  const filteredAndSortedResults = useMemo(() => {
    let filtered = results.filter(result => {
      const matchesSearch = searchTerm === '' ||
        result.home_team?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.away_team?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.league_name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLeague = selectedLeague === 'all' || result.league_name === selectedLeague;
      const matchesCountry = selectedCountry === 'all' || result.country_name === selectedCountry;
      return matchesSearch && matchesLeague && matchesCountry;
    });

    if (sortField !== null) {
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
            aValue = a.prediction_is_correct ? 1 : 0;
            bValue = b.prediction_is_correct ? 1 : 0;
            break;
          case 'liability':
            const liabilityMap: Record<string, number> = { 'high': 3, 'mid': 2, 'medium': 2, 'low': 1 };
            aValue = liabilityMap[a.liability_name?.toLowerCase()] || 0;
            bValue = liabilityMap[b.liability_name?.toLowerCase()] || 0;
            break;
          default:
            return 0;
        }
        return sortDirection === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
      });
    }
    return filtered;
  }, [results, searchTerm, selectedLeague, selectedCountry, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredAndSortedResults.length / itemsPerPage);
  const paginatedResults = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedResults.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedResults, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedLeague, selectedCountry, selectedWeek, itemsPerPage]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const exportToCSV = () => {
    const headers = [t('colMatch'), t('colLeague'), 'Country', 'Date', 'Time', t('colPrediction'), t('colResult'), t('colStatus'), t('colConfidence')];
    const csvData = filteredAndSortedResults.map(result => [
      `${result.home_team} vs ${result.away_team}`,
      result.league_name, result.country_name,
      formatDate(result.date_time), formatTime(result.date_time),
      `${result.prediction_goals_home}-${result.prediction_goals_away}`,
      `${result.goals_home}-${result.goals_away}`,
      result.prediction_is_correct ? t('correct') : t('wrong'),
      formatPercentage(result.max_prob * 100),
    ]);
    const csv = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `match-results-week-${selectedWeek}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const weekOptions = [
    { value: 7, label: t('previousWeek') },
    { value: 14, label: t('2WeeksAgo') },
    { value: 21, label: t('3WeeksAgo') },
    { value: 28, label: t('4WeeksAgo') },
    { value: 35, label: t('5WeeksAgo') },
    { value: 42, label: t('6WeeksAgo') },
  ];

  const correctCount = filteredAndSortedResults.filter(r => r.prediction_is_correct).length;
  const totalCount = filteredAndSortedResults.length;
  const accuracy = totalCount > 0 ? (correctCount / totalCount * 100).toFixed(1) : '0.0';

  const top10Results = filteredAndSortedResults.slice(0, 10);
  const top10CorrectCount = top10Results.filter(r => r.prediction_is_correct).length;
  const top10TotalCount = top10Results.length;
  const top10Accuracy = top10TotalCount > 0 ? (top10CorrectCount / top10TotalCount * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-6">
      {/* Filters and Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-foreground">{t('week')}</label>
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(parseInt(e.target.value))}
              className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {weekOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
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

        <div className="ml-auto flex flex-col gap-2">
          <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg">
            <span className="text-sm text-muted-foreground">{t('top10Accuracy')}</span>
            <span className="font-bold text-lg text-primary">{top10Accuracy}%</span>
            <span className="text-sm text-muted-foreground">({top10CorrectCount}/{top10TotalCount})</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg">
            <span className="text-sm text-muted-foreground">{t('accuracy')}</span>
            <span className="font-bold text-lg text-primary">{accuracy}%</span>
            <span className="text-sm text-muted-foreground">({correctCount}/{totalCount})</span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="text-4xl mb-2">⏳</div>
            <p className="text-muted-foreground">{t('loading')}</p>
          </div>
        </div>
      ) : filteredAndSortedResults.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-2">🔍</div>
          <p className="text-muted-foreground">{t('noResults')}</p>
        </div>
      ) : (
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
                <th className="px-4 py-3 text-center">{t('colResult')}</th>
                <th className="px-4 py-3 text-center">{t('colPrediction')}</th>
                <th className="px-4 py-3 text-left">
                  <button onClick={() => handleSort('date')} className="flex items-center gap-2 hover:text-primary transition-colors">
                    {t('colDateTime')}
                    {sortField === 'date' && <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                  </button>
                </th>
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
                <th className="px-4 py-3 text-center">
                  <button onClick={() => handleSort('status')} className="flex items-center gap-2 hover:text-primary transition-colors">
                    {t('colStatus')}
                    {sortField === 'status' && <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedResults.map((result, index) => (
                <tr key={result.match_id || index} className="border-b border-border hover:bg-card/50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      {result.flag_url && (
                        <img src={result.flag_url} alt={result.country_name} className="w-5 h-4 object-cover rounded" />
                      )}
                      <div>
                        <div className="text-sm font-medium">{result.league_name}</div>
                        <div className="text-xs text-muted-foreground">{result.country_name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <Link href={`/match/${result.match_id}`} className="hover:text-primary transition-colors">
                      <div className="font-medium">{result.home_team}</div>
                      <div className="text-sm text-muted-foreground">{result.away_team}</div>
                    </Link>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="font-mono font-bold text-lg whitespace-nowrap">
                      {result.goals_home} - {result.goals_away}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{result.actual_result}</div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="font-mono font-bold text-lg whitespace-nowrap">
                      {result.prediction_goals_home} - {result.prediction_goals_away}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {result.prediction_goals_home > result.prediction_goals_away ? t('home') :
                       result.prediction_goals_away > result.prediction_goals_home ? t('away') : t('draw')}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 text-sm">
                        <span>📅</span>
                        <span>{formatDate(result.date_time)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <span>🕒</span>
                        <span>{formatTime(result.date_time)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="font-bold text-primary">
                      {formatPercentage(result.max_prob * 100)}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                      result.liability_name?.toLowerCase() === 'high'
                        ? 'bg-green-500/10 text-green-500'
                        : result.liability_name?.toLowerCase() === 'mid' || result.liability_name?.toLowerCase() === 'medium'
                        ? 'bg-yellow-500/10 text-yellow-500'
                        : 'bg-red-500/10 text-red-500'
                    }`}>
                      {result.liability_name || 'N/A'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    {result.prediction_is_correct ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-500/10 text-green-500">
                        {t('correct')}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-500/10 text-red-500">
                        {t('wrong')}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && filteredAndSortedResults.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
          <div className="text-sm text-muted-foreground">
            {t('showing', {
              from: ((currentPage - 1) * itemsPerPage) + 1,
              to: Math.min(currentPage * itemsPerPage, filteredAndSortedResults.length),
              total: filteredAndSortedResults.length,
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
      )}

      {copiedText && (
        <div className="fixed bottom-4 right-4 px-4 py-2 bg-primary text-white rounded-lg shadow-lg animate-fade-in">
          ✅ Copied {copiedText}!
        </div>
      )}
    </div>
  );
};

export default ResultsTable;
