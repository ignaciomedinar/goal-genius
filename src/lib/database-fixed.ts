import { pool } from './db';

export interface MatchWithAccuracy {
  match_id: string;
  country_name: string;
  flag_url: string | null;
  league_name: string;
  home_team: string;
  away_team: string;
  date_time: string;
  phg?: number;
  pag?: number;
  goals_home?: number | null;
  goals_away?: number | null;
  is_correct_prediction: boolean;
  prediction_type: 'home_win' | 'away_win' | 'draw';
  actual_result: 'home_win' | 'away_win' | 'draw' | 'pending';
  has_actual_result: boolean;
  bet_name?: string;
  max_prob?: number;
  liability_name?: string;
}

export async function getCurrentWeekPredictions(): Promise<MatchWithAccuracy[]> {
  try {
    const query = `
      SELECT 
        fmp.match_id,
        dc.country_name,
        dc.flag_url,
        dl.league_name,
        fmp.date_time,
        dth.team_name as home_team,
        fmp.phg,
        fmp.pag,
        dta.team_name as away_team,
        db.bet_name,
        fmp.max_prob,
        dtl.liability_name 
      FROM marts.fact_match_predictions fmp 
      LEFT JOIN marts.dim_leagues dl ON fmp.league_id = dl.league_id 
      LEFT JOIN marts.dim_countries dc ON dl.country_id = dc.country_id 
      LEFT JOIN marts.dim_teams dth ON fmp.home_team_id = dth.team_id AND fmp.league_id = dth.league_id
      LEFT JOIN marts.dim_teams dta ON fmp.away_team_id = dta.team_id AND fmp.league_id = dta.league_id 
      LEFT JOIN marts.dim_bet db ON fmp.bet_id = db.bet_id 
      LEFT JOIN marts.dim_team_liability dtl ON fmp.liability_id = dtl.liability_id 
      WHERE fmp.date_time::date BETWEEN date_trunc('week', now())::date AND (date_trunc('week', now()) + '6 days'::interval)::date
      ORDER BY fmp.liability_id DESC, fmp.max_prob DESC;
    `;

    const result = await pool.query(query);
    return result.rows.map((row: any) => ({
      match_id: row.match_id,
      country_name: row.country_name,
      flag_url: row.flag_url,
      league_name: row.league_name,
      home_team: row.home_team,
      away_team: row.away_team,
      date_time: row.date_time,
      phg: row.phg,
      pag: row.pag,
      goals_home: null,
      goals_away: null,
      is_correct_prediction: false,
      prediction_type: row.phg > row.pag ? 'home_win' : row.pag > row.phg ? 'away_win' : 'draw',
      actual_result: 'pending',
      has_actual_result: false,
      bet_name: row.bet_name,
      max_prob: row.max_prob,
      liability_name: row.liability_name,
    }));
  } catch (error) {
    console.error('Error fetching current week predictions:', error);
    throw new Error('Failed to fetch current week predictions');
  }
}

export async function getPreviousWeekMatches(): Promise<MatchWithAccuracy[]> {
  try {
    const query = `
      SELECT 
        fmr.match_id,
        dc.country_name,
        dc.flag_url,
        dl.league_name,
        dth.team_name as home_team,
        fmr.goals_home,
        fmr.goals_away,
        dta.team_name as away_team,
        fmr.phg as prediction_goals_home,
        fmr.pag as prediction_goals_away,
        db.bet_name,
        fmr.prediction_is_correct
      FROM marts.fact_match_results fmr 
      LEFT JOIN marts.dim_leagues dl ON fmr.league_id = dl.league_id 
      LEFT JOIN marts.dim_countries dc ON dl.country_id = dc.country_id 
      LEFT JOIN marts.dim_teams dth ON fmr.home_team_id = dth.team_id AND fmr.league_id = dth.league_id
      LEFT JOIN marts.dim_teams dta ON fmr.away_team_id = dta.team_id AND fmr.league_id = dta.league_id 
      LEFT JOIN marts.dim_bet db ON db.bet_id = fmr.actual_result
      WHERE fmr.date_time::date BETWEEN (date_trunc('week', now()) - '7 days'::interval)::date AND (date_trunc('week', now()) - '1 days'::interval)::date
      ORDER BY fmr.date_time DESC;
    `;

    const result = await pool.query(query);
    return result.rows.map((row: any) => ({
      match_id: row.match_id,
      country_name: row.country_name,
      flag_url: row.flag_url,
      league_name: row.league_name,
      home_team: row.home_team,
      away_team: row.away_team,
      date_time: row.date_time || new Date().toISOString(),
      phg: row.prediction_goals_home,
      pag: row.prediction_goals_away,
      goals_home: row.goals_home,
      goals_away: row.goals_away,
      is_correct_prediction: row.prediction_is_correct,
      prediction_type: row.prediction_goals_home > row.prediction_goals_away ? 'home_win' : 
                      row.prediction_goals_away > row.prediction_goals_home ? 'away_win' : 'draw',
      actual_result: row.goals_home === null || row.goals_away === null ? 'pending' :
                    row.goals_home > row.goals_away ? 'home_win' : 
                    row.goals_away > row.goals_home ? 'away_win' : 'draw',
      has_actual_result: row.goals_home !== null && row.goals_away !== null,
      bet_name: row.bet_name,
    }));
  } catch (error) {
    console.error('Error fetching previous week matches:', error);
    throw new Error('Failed to fetch previous week matches');
  }
}

export async function getTopMatches(limit: number = 5): Promise<MatchWithAccuracy[]> {
  try {
    const matches = await getCurrentWeekPredictions();
    return matches.slice(0, limit);
  } catch (error) {
    console.error('Error fetching top matches:', error);
    throw new Error('Failed to fetch top matches');
  }
}

export async function getLeagueAccuracyStats(): Promise<any[]> {
  try {
    const query = `
      WITH match_results AS (
        SELECT 
          dl.league_name,
          dc.country_name,
          fmr.prediction_is_correct,
          CASE WHEN fmr.goals_home IS NOT NULL AND fmr.goals_away IS NOT NULL THEN 1 ELSE 0 END as has_result
        FROM marts.fact_match_results fmr 
        LEFT JOIN marts.dim_leagues dl ON fmr.league_id = dl.league_id 
        LEFT JOIN marts.dim_countries dc ON dl.country_id = dc.country_id 
        WHERE fmr.date_time >= (CURRENT_DATE - INTERVAL '30 days')
      )
      SELECT 
        league_name,
        country_name,
        COUNT(*) as total_matches,
        SUM(has_result) as completed_matches,
        SUM(CASE WHEN prediction_is_correct = true AND has_result = 1 THEN 1 ELSE 0 END) as correct_predictions,
        CASE WHEN SUM(has_result) > 0 THEN 
          ROUND((SUM(CASE WHEN prediction_is_correct = true AND has_result = 1 THEN 1 ELSE 0 END)::numeric / SUM(has_result)::numeric) * 100, 1)
        ELSE 0 END as accuracy_percentage
      FROM match_results
      WHERE league_name IS NOT NULL
      GROUP BY league_name, country_name
      HAVING SUM(has_result) > 0
      ORDER BY accuracy_percentage DESC, completed_matches DESC;
    `;

    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error('Error fetching league accuracy stats:', error);
    throw new Error('Failed to fetch league accuracy stats');
  }
}