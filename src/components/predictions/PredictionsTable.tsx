'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeague, setSelectedLeague] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
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
          console.error('Failed to fetch predictions:', result.error);
          setPredictions([]);
        }
      } catch (error) {
        console.error('Error fetching predictions:', error);
        setPredictions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPredictions();
  }, []);

  const leagues = useMemo(() => [...new Set(predictions.map(p => p.league_name).filter(Boolean))].sort(), [predictions]);
  const countries = useMemo(() => [...new Set(predictions.map(p => p.country_name).filter(Boolean))].sort(), [predictions]);

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
      
      return matchesSearch && matchesLeague && matchesCountry;
    });

    if (sortField === null) {
      // Default: high → mid → low liability, then confidence desc within each group
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

        if (sortDirection === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    return filtered;
  }, [predictions, searchTerm, selectedLeague, selectedCountry, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredAndSortedPredictions.length / itemsPerPage);
  const paginatedResults = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedPredictions.slice(startIndex, endIndex);
  }, [filteredAndSortedPredictions, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedLeague, selectedCountry, itemsPerPage]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const exportToCSV = () => {
    const headers = ['League', 'Country', 'Match', 'Date', 'Time', 'Prediction', 'Actual', 'Status', 'Confidence', 'Liability', 'Avg H', 'Avg X', 'Avg A'];
    const csvData = filteredAndSortedPredictions.map(pred => [
      pred.league_name,
      pred.country_name,
      `${pred.home_team} vs ${pred.away_team}`,
      formatDate(pred.date_time),
      formatTime(pred.date_time),
      `${pred.phg}-${pred.pag}`,
      pred.has_actual_result ? `${pred.goals_home}-${pred.goals_away}` : 'Not played',
      pred.has_actual_result ? (pred.is_correct_prediction ? 'Correct' : 'Wrong') : 'Pending',
      formatPercentage(pred.max_prob * 100),
      pred.liability_name,
      pred.avg_home_odds?.toFixed(2) ?? '',
      pred.avg_draw_odds?.toFixed(2) ?? '',
      pred.avg_away_odds?.toFixed(2) ?? '',
    ]);

    const csv = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `predictions-current-week.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Filters and Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex items-center gap-4">
          {sortField !== null && (
            <button
              onClick={() => setSortField(null)}
              className="px-3 py-2 border border-border rounded-lg bg-background text-foreground hover:bg-card transition-colors flex items-center gap-2 text-sm"
              title="Reset to default sort (Liability & Confidence)"
            >
              🔄 Reset Sort
            </button>
          )}
        </div>

        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search matches, teams, or leagues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              🔍
            </span>
          </div>
        </div>

        <button
          onClick={exportToCSV}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <span>⬇️</span>
          Export CSV
        </button>
      </div>

      <div className="flex flex-wrap gap-4">
        <select
          value={selectedLeague}
          onChange={(e) => setSelectedLeague(e.target.value)}
          className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Leagues</option>
          {leagues.map(league => (
            <option key={league} value={league}>{league}</option>
          ))}
        </select>

        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Countries</option>
          {countries.map(country => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Show:</label>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
            className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-sm text-muted-foreground">per page</span>
        </div>

        <div className="ml-auto flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg">
          <span className="text-sm text-muted-foreground">Total:</span>
          <span className="font-bold text-lg text-primary">{filteredAndSortedPredictions.length}</span>
          <span className="text-sm text-muted-foreground">predictions</span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="text-4xl mb-2">⏳</div>
            <p className="text-muted-foreground">Loading predictions...</p>
          </div>
        </div>
      ) : filteredAndSortedPredictions.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-2">🔍</div>
          <p className="text-muted-foreground">No predictions found matching your filters.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-card border-b border-border">
                  <th className="px-4 py-3 text-left">
                    <button
                      onClick={() => handleSort('league')}
                      className="flex items-center gap-2 hover:text-primary transition-colors"
                    >
                      League
                      {sortField === 'league' && <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button
                      onClick={() => handleSort('homeTeam')}
                      className="flex items-center gap-2 hover:text-primary transition-colors"
                    >
                      Match
                      {sortField === 'homeTeam' && <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button
                      onClick={() => handleSort('date')}
                      className="flex items-center gap-2 hover:text-primary transition-colors"
                    >
                      Date & Time
                      {sortField === 'date' && <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-center">Prediction</th>
                  <th className="px-4 py-3 text-center">Actual</th>
                  <th className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleSort('confidence')}
                      className="flex items-center gap-2 hover:text-primary transition-colors"
                    >
                      Confidence
                      {sortField === 'confidence' && <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleSort('liability')}
                      className="flex items-center gap-2 hover:text-primary transition-colors"
                    >
                      Liability
                      {sortField === 'liability' && <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-center">Avg Odds</th>
                  <th className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleSort('status')}
                      className="flex items-center gap-2 hover:text-primary transition-colors"
                    >
                      Status
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
                          <img
                            src={prediction.flag_url}
                            alt={prediction.country_name}
                            className="w-5 h-4 object-cover rounded"
                          />
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
                        {prediction.phg > prediction.pag ? 'home' : 
                         prediction.pag > prediction.phg ? 'away' : 'draw'}
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
                             (prediction.goals_home! > prediction.goals_away! ? 'home' : 
                              prediction.goals_away! > prediction.goals_home! ? 'away' : 'draw')}
                          </div>
                        </>
                      ) : (
                        <div className="text-sm text-muted-foreground">Not played</div>
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
                            ✅ Correct
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-500/10 text-red-500">
                            ❌ Wrong
                          </span>
                        )
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-500/10 text-blue-500">
                          ⏳ Pending
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
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedPredictions.length)} of {filteredAndSortedPredictions.length} results
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground hover:bg-card transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                First
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground hover:bg-card transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 border rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? 'bg-primary text-white border-primary'
                          : 'bg-background text-foreground border-border hover:bg-card'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground hover:bg-card transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next →
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground hover:bg-card transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Last
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PredictionsTable;
