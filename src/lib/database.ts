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
  avg_home_odds?: number | null;
  avg_draw_odds?: number | null;
  avg_away_odds?: number | null;
}

export async function getCurrentWeekPredictions(): Promise<MatchWithAccuracy[]> {
  try {
    const query = `
      SELECT 
        fmp.match_id,
        dc.country_name,
        dc.flag_url,
        dl.league_name,
        fmp.date_time AT TIME ZONE 'Europe/Madrid' AS date_time,
        dth.team_name as home_team,
        fmp.phg,
        fmp.pag,
        dta.team_name as away_team,
        fmr.goals_home,
        fmr.goals_away,
        db.bet_name,
        fmp.max_prob,
        dtl.liability_name,
        odds_agg.avg_home_odds,
        odds_agg.avg_draw_odds,
        odds_agg.avg_away_odds
      FROM marts.fact_match_predictions fmp
      LEFT JOIN marts.dim_leagues dl ON fmp.league_id = dl.league_id 
      LEFT JOIN marts.dim_countries dc ON dl.country_id = dc.country_id 
      LEFT JOIN marts.dim_teams dth ON fmp.home_team_id = dth.team_id AND fmp.league_id = dth.league_id
      LEFT JOIN marts.dim_teams dta ON fmp.away_team_id = dta.team_id AND fmp.league_id = dta.league_id 
      LEFT JOIN marts.dim_bet db ON fmp.bet_id = db.bet_id 
      LEFT JOIN marts.dim_team_liability dtl ON fmp.liability_id = dtl.liability_id 
      LEFT JOIN marts.fact_match_results fmr ON fmp.match_id = fmr.match_id
      LEFT JOIN (
        SELECT match_id,
          ROUND(AVG(home_odds)::numeric, 2) AS avg_home_odds,
          ROUND(AVG(draw_odds)::numeric, 2) AS avg_draw_odds,
          ROUND(AVG(away_odds)::numeric, 2)  AS avg_away_odds
        FROM marts.fact_bookmakers_odds
        GROUP BY match_id
      ) odds_agg ON fmp.match_id = odds_agg.match_id
      WHERE fmp.date_time::date BETWEEN date_trunc('week', now() AT TIME ZONE 'Europe/Madrid')::date AND (date_trunc('week', now() AT TIME ZONE 'Europe/Madrid') + '6 days'::interval)::date
      ORDER BY fmp.liability_id DESC, fmp.max_prob DESC;
    `;

    const result = await pool.query(query);
    return result.rows.map((row: any) => {
      const hasActualResult = row.goals_home !== null && row.goals_away !== null;
      const predictionType: 'home_win' | 'away_win' | 'draw' = row.phg > row.pag ? 'home_win' : row.pag > row.phg ? 'away_win' : 'draw';
      let actualResult: 'home_win' | 'away_win' | 'draw' | 'pending' = 'pending';
      let isCorrect = false;
      
      if (hasActualResult) {
        actualResult = row.goals_home > row.goals_away ? 'home_win' : 
                       row.goals_away > row.goals_home ? 'away_win' : 'draw';
        isCorrect = predictionType === actualResult;
      }
      
      return {
        match_id: row.match_id,
        country_name: row.country_name,
        flag_url: row.flag_url,
        league_name: row.league_name,
        home_team: row.home_team,
        away_team: row.away_team,
        date_time: row.date_time,
        phg: row.phg,
        pag: row.pag,
        goals_home: row.goals_home,
        goals_away: row.goals_away,
        is_correct_prediction: isCorrect,
        prediction_type: predictionType,
        actual_result: actualResult,
        has_actual_result: hasActualResult,
        bet_name: row.bet_name,
        max_prob: row.max_prob,
        liability_name: row.liability_name,
        avg_home_odds: row.avg_home_odds != null ? parseFloat(row.avg_home_odds) : null,
        avg_draw_odds: row.avg_draw_odds != null ? parseFloat(row.avg_draw_odds) : null,
        avg_away_odds: row.avg_away_odds != null ? parseFloat(row.avg_away_odds) : null,
      };
    });
  } catch (error) {
    console.error('Error fetching current week predictions:', error);
    throw new Error('Failed to fetch current week predictions');
  }
}

export async function getResultsByWeek(weeksAgo: number = 1): Promise<MatchWithAccuracy[]> {
  try {
    const query = `
      SELECT 
        fmr.match_id,
        dc.country_name,
        dc.flag_url,
        dl.league_name,
        fmr.date_time AT TIME ZONE 'Europe/Madrid' AS date_time,
        dth.team_name as home_team,
        fmr.goals_home,
        fmr.goals_away,
        dta.team_name as away_team,
        fmr.phg as prediction_goals_home,
        fmr.pag as prediction_goals_away,
        db.bet_name as actual_result,
        fmr.prediction_is_correct,
        fmr.max_prob,
        dtl.liability_name
      FROM marts.fact_match_results fmr
      LEFT JOIN marts.dim_leagues dl ON fmr.league_id = dl.league_id 
      LEFT JOIN marts.dim_countries dc ON dl.country_id = dc.country_id 
      LEFT JOIN marts.dim_teams dth ON fmr.home_team_id = dth.team_id AND fmr.league_id = dth.league_id
      LEFT JOIN marts.dim_teams dta ON fmr.away_team_id = dta.team_id AND fmr.league_id = dta.league_id 
      LEFT JOIN marts.dim_bet db ON db.bet_id = fmr.actual_result_id
      LEFT JOIN marts.dim_team_liability dtl ON dtl.liability_id = fmr.liability_id
      WHERE fmr.date_time::date BETWEEN
        (date_trunc('week', now() AT TIME ZONE 'Europe/Madrid') - ($1 + 6)::text::interval)::date
        AND (date_trunc('week', now() AT TIME ZONE 'Europe/Madrid') - $1::text::interval)::date
        AND fmr.prediction_is_correct IS NOT NULL
      ORDER BY fmr.liability_id DESC, fmr.max_prob DESC;
    `;

    const result = await pool.query(query, [`${weeksAgo} days`]);
    return result.rows.map((row: any) => ({
      match_id: row.match_id,
      country_name: row.country_name,
      flag_url: row.flag_url,
      league_name: row.league_name,
      home_team: row.home_team,
      away_team: row.away_team,
      date_time: row.date_time,
      phg: row.prediction_goals_home,
      pag: row.prediction_goals_away,
      goals_home: row.goals_home,
      goals_away: row.goals_away,
      is_correct_prediction: row.prediction_is_correct,
      prediction_type: row.prediction_goals_home > row.prediction_goals_away ? 'home_win' : 
                      row.prediction_goals_away > row.prediction_goals_home ? 'away_win' : 'draw',
      actual_result: row.goals_home > row.goals_away ? 'home_win' : 
                    row.goals_away > row.goals_home ? 'away_win' : 'draw',
      has_actual_result: true,
      bet_name: row.actual_result,
      max_prob: row.max_prob,
      liability_name: row.liability_name,
    }));
  } catch (error) {
    console.error('Error fetching results by week:', error);
    throw new Error('Failed to fetch results');
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
        fmr.max_prob,
        fmr.date_time AT TIME ZONE 'Europe/Madrid' AS date_time,
        db.bet_name,
        fmr.prediction_is_correct
      FROM marts.fact_match_results fmr
      LEFT JOIN marts.dim_leagues dl ON fmr.league_id = dl.league_id 
      LEFT JOIN marts.dim_countries dc ON dl.country_id = dc.country_id 
      LEFT JOIN marts.dim_teams dth ON fmr.home_team_id = dth.team_id AND fmr.league_id = dth.league_id
      LEFT JOIN marts.dim_teams dta ON fmr.away_team_id = dta.team_id AND fmr.league_id = dta.league_id 
      LEFT JOIN marts.dim_bet db ON db.bet_id = fmr.actual_result_id
      WHERE fmr.date_time::date BETWEEN (date_trunc('week', now() AT TIME ZONE 'Europe/Madrid') - '7 days'::interval)::date AND (date_trunc('week', now() AT TIME ZONE 'Europe/Madrid') - '1 days'::interval)::date
        AND fmr.prediction_is_correct IS NOT NULL
      ORDER BY fmr.liability_id DESC, fmr.max_prob DESC;
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
      max_prob: row.max_prob,
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

export async function getMatchOdds(matchId: string): Promise<any[]> {
  try {
    const query = `
      SELECT 
        fbo.match_id,
        dc.country_name,
        dc.flag_url,
        dl.league_name,
        dth.team_name as home_team,
        dta.team_name as away_team,
        db.bookmaker_name,
        fbo.home_odds,
        fbo.draw_odds,
        fbo.away_odds 
      FROM marts.fact_bookmakers_odds fbo 
      LEFT JOIN marts.dim_leagues dl ON fbo.league_id = dl.league_id 
      LEFT JOIN marts.dim_countries dc ON dl.country_id = dc.country_id 
      LEFT JOIN marts.dim_teams dth ON fbo.home_team_id = dth.team_id AND fbo.league_id = dth.league_id
      LEFT JOIN marts.dim_teams dta ON fbo.away_team_id = dta.team_id AND fbo.league_id = dta.league_id 
      LEFT JOIN marts.dim_bookmakers db ON fbo.bookmaker_id = db.bookmaker_id 
      WHERE fbo.match_id = $1
      ORDER BY fbo.home_odds ASC;
    `;

    const result = await pool.query(query, [matchId]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching match odds:', error);
    throw new Error('Failed to fetch match odds');
  }
}

export interface MatchResult {
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

export async function getMatchResults(weekOffset: number = 7): Promise<MatchResult[]> {
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
        db.bet_name as actual_result,
        fmr.prediction_is_correct,
        fmr.max_prob,
        dtl.liability_name,
        fmr.date_time AT TIME ZONE 'Europe/Madrid' AS date_time
      FROM marts.fact_match_results fmr
      LEFT JOIN marts.dim_leagues dl ON fmr.league_id = dl.league_id 
      LEFT JOIN marts.dim_countries dc ON dl.country_id = dc.country_id 
      LEFT JOIN marts.dim_teams dth ON fmr.home_team_id = dth.team_id AND fmr.league_id = dth.league_id
      LEFT JOIN marts.dim_teams dta ON fmr.away_team_id = dta.team_id AND fmr.league_id = dta.league_id 
      LEFT JOIN marts.dim_bet db ON db.bet_id = fmr.actual_result_id
      LEFT JOIN marts.dim_team_liability dtl ON dtl.liability_id = fmr.liability_id
      WHERE fmr.date_time::date BETWEEN (date_trunc('week', now() AT TIME ZONE 'Europe/Madrid') - make_interval(days => $1))::date
        AND (date_trunc('week', now() AT TIME ZONE 'Europe/Madrid') - make_interval(days => 1) - make_interval(days => $1 - 7))::date
        AND fmr.prediction_is_correct IS NOT NULL
      ORDER BY fmr.liability_id DESC, fmr.max_prob DESC;
    `;

    const result = await pool.query(query, [weekOffset]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching match results:', error);
    throw new Error('Failed to fetch match results');
  }
}

export interface MatchDetails {
  match_id: string;
  country_name: string;
  flag_url: string | null;
  league_name: string;
  home_team: string;
  away_team: string;
  home_team_id: number;
  away_team_id: number;
  league_id: number;
  date_time: string;
  phg: number;
  pag: number;
  goals_home: number | null;
  goals_away: number | null;
  max_prob: number;
  bet_name: string;
  liability_name: string;
  prediction_type: 'home_win' | 'away_win' | 'draw';
  actual_result: 'home_win' | 'away_win' | 'draw' | 'pending';
  has_actual_result: boolean;
  is_correct_prediction: boolean;
}

export interface TeamLastGame {
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

export async function getMatchDetails(matchId: string): Promise<MatchDetails | null> {
  try {
    const query = `
      SELECT 
        fmp.match_id,
        dc.country_name,
        dc.flag_url,
        dl.league_name,
        dth.team_name as home_team,
        dta.team_name as away_team,
        fmp.home_team_id,
        fmp.away_team_id,
        fmp.league_id,
        fmp.date_time AT TIME ZONE 'Europe/Madrid' AS date_time,
        fmp.phg,
        fmp.pag,
        fmr.goals_home,
        fmr.goals_away,
        fmp.max_prob,
        db.bet_name,
        dtl.liability_name
      FROM marts.fact_match_predictions fmp 
      LEFT JOIN marts.dim_leagues dl ON fmp.league_id = dl.league_id 
      LEFT JOIN marts.dim_countries dc ON dl.country_id = dc.country_id 
      LEFT JOIN marts.dim_teams dth ON fmp.home_team_id = dth.team_id AND fmp.league_id = dth.league_id
      LEFT JOIN marts.dim_teams dta ON fmp.away_team_id = dta.team_id AND fmp.league_id = dta.league_id 
      LEFT JOIN marts.dim_bet db ON fmp.bet_id = db.bet_id 
      LEFT JOIN marts.dim_team_liability dtl ON fmp.liability_id = dtl.liability_id 
      LEFT JOIN marts.fact_match_results fmr ON fmp.match_id = fmr.match_id
      WHERE fmp.match_id = $1;
    `;

    const result = await pool.query(query, [matchId]);
    
    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    const hasActualResult = row.goals_home !== null && row.goals_away !== null;
    const predictionType: 'home_win' | 'away_win' | 'draw' = row.phg > row.pag ? 'home_win' : row.pag > row.phg ? 'away_win' : 'draw';
    let actualResult: 'home_win' | 'away_win' | 'draw' | 'pending' = 'pending';
    let isCorrect = false;
    
    if (hasActualResult) {
      actualResult = row.goals_home > row.goals_away ? 'home_win' : 
                     row.goals_away > row.goals_home ? 'away_win' : 'draw';
      isCorrect = predictionType === actualResult;
    }

    return {
      match_id: row.match_id,
      country_name: row.country_name,
      flag_url: row.flag_url,
      league_name: row.league_name,
      home_team: row.home_team,
      away_team: row.away_team,
      home_team_id: row.home_team_id,
      away_team_id: row.away_team_id,
      league_id: row.league_id,
      date_time: row.date_time,
      phg: row.phg,
      pag: row.pag,
      goals_home: row.goals_home,
      goals_away: row.goals_away,
      max_prob: row.max_prob,
      bet_name: row.bet_name,
      liability_name: row.liability_name,
      prediction_type: predictionType,
      actual_result: actualResult,
      has_actual_result: hasActualResult,
      is_correct_prediction: isCorrect,
    };
  } catch (error) {
    console.error('Error fetching match details:', error);
    throw new Error('Failed to fetch match details');
  }
}

export async function getTeamLastGames(teamId: number, leagueId: number, limit: number = 5): Promise<TeamLastGame[]> {
  try {
    const query = `
      SELECT *
      FROM (
        SELECT 
          fmr.match_id,
          dl.league_name,
          dc.country_name,
          fmr.date_time AT TIME ZONE 'Europe/Madrid' AS date_time,
          dth.team_name as home_team,
          dta.team_name as away_team,
          fmr.goals_home,
          fmr.goals_away,
          fmr.prediction_is_correct,
          row_number() over (order by fmr.date_time desc) as rn
        FROM marts.fact_match_results fmr
        LEFT JOIN marts.dim_leagues dl ON fmr.league_id = dl.league_id 
        LEFT JOIN marts.dim_countries dc ON dl.country_id = dc.country_id 
        LEFT JOIN marts.dim_teams dth ON fmr.home_team_id = dth.team_id AND fmr.league_id = dth.league_id
        LEFT JOIN marts.dim_teams dta ON fmr.away_team_id = dta.team_id AND fmr.league_id = dta.league_id 
        WHERE (fmr.home_team_id = $1 OR fmr.away_team_id = $1)
          AND fmr.league_id = $2
          AND fmr.date_time::date <= (date_trunc('week', now() AT TIME ZONE 'Europe/Madrid')::date - 1)
      ) t
      WHERE rn <= $3
      ORDER BY date_time DESC;
    `;

    const result = await pool.query(query, [teamId, leagueId, limit]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching team last games:', error);
    throw new Error('Failed to fetch team last games');
  }
}

export async function getLeagueAccuracyStats(minMatches: number = 10, limit: number = 15): Promise<any[]> {
  try {
    const query = `
      WITH matches_rank as (
	select dl.league_name,
		dc.country_name,
		fmr.*,
		row_number() over (partition by fmr.league_id order by fmr.liability_id desc, max_prob desc) as rank_prediction
	FROM marts.fact_match_results fmr 
        LEFT JOIN marts.dim_leagues dl ON fmr.league_id = dl.league_id 
        LEFT JOIN marts.dim_countries dc ON dl.country_id = dc.country_id 
        WHERE fmr.date_time::date >= (CURRENT_DATE - INTERVAL '30 days')::date
        AND fmr.prediction_is_correct is not null
        ),
	match_results AS (
        SELECT 
          league_name,
          country_name,
          prediction_is_correct,
          rank_prediction,
          CASE WHEN goals_home IS NOT NULL AND goals_away IS NOT NULL THEN 1 ELSE 0 END as has_result
        FROM matches_rank
      )
      SELECT 
        league_name,
        country_name,
        COUNT(*) as total_matches,
        sum(case when rank_prediction <= 10 then 1 else 0 end) as top10_matches,
        SUM(has_result) as completed_matches,
        SUM(CASE WHEN prediction_is_correct = 1 AND has_result = 1 THEN 1 ELSE 0 END) as correct_predictions,
        SUM(CASE WHEN prediction_is_correct = 1 AND has_result = 1 and rank_prediction <= 10 THEN 1 ELSE 0 END) as top10_correct_predictions,
        CASE WHEN SUM(has_result) > 0 THEN 
          ROUND((SUM(CASE WHEN prediction_is_correct = 1 AND has_result = 1 THEN 1 ELSE 0 END)::numeric / SUM(has_result)::numeric) * 100, 1)
        ELSE 0 END as accuracy_percentage,
        CASE WHEN SUM(has_result) > 0 THEN 
          ROUND((SUM(CASE WHEN prediction_is_correct = 1 AND has_result = 1 and rank_prediction <= 10 THEN 1 ELSE 0 END)::numeric / 
          	SUM(case when rank_prediction <= 10 then has_result end)::numeric) * 100, 1)
        ELSE 0 END as top10_accuracy_percentage
      FROM match_results
      WHERE league_name IS NOT NULL
      GROUP BY league_name, country_name
      HAVING SUM(has_result) >= ${minMatches}
      ORDER BY top10_accuracy_percentage DESC, accuracy_percentage desc
      LIMIT ${limit};
    `;

    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error('Error fetching league accuracy stats:', error);
    throw new Error('Failed to fetch league accuracy stats');
  }
}

export async function getOverallKpiStats(): Promise<{ overall_accuracy: number; top10_accuracy: number; total_matches: number; total_correct: number; total_leagues: number }> {
  try {
    const query = `
      WITH ranked AS (
        SELECT
          fmr.prediction_is_correct,
          fmr.league_id,
          row_number() OVER (ORDER BY fmr.liability_id DESC, fmr.max_prob DESC) AS rank_global
        FROM marts.fact_match_results fmr
        WHERE fmr.date_time::date >= (CURRENT_DATE - INTERVAL '30 days')::date
          AND fmr.prediction_is_correct IS NOT NULL
          AND fmr.goals_home IS NOT NULL
          AND fmr.goals_away IS NOT NULL
      )
      SELECT
        COUNT(*) AS total_matches,
        SUM(CASE WHEN prediction_is_correct = 1 THEN 1 ELSE 0 END) AS total_correct,
        SUM(CASE WHEN rank_global <= 10 THEN 1 ELSE 0 END) AS top10_matches,
        SUM(CASE WHEN rank_global <= 10 AND prediction_is_correct = 1 THEN 1 ELSE 0 END) AS top10_correct,
        COUNT(DISTINCT league_id) AS total_leagues
      FROM ranked;
    `;
    const result = await pool.query(query);
    const row = result.rows[0];
    const totalMatches = Number(row.total_matches || 0);
    const totalCorrect = Number(row.total_correct || 0);
    const top10Matches = Number(row.top10_matches || 0);
    const top10Correct = Number(row.top10_correct || 0);
    return {
      overall_accuracy: totalMatches > 0 ? Math.round((totalCorrect / totalMatches) * 1000) / 10 : 0,
      top10_accuracy: top10Matches > 0 ? Math.round((top10Correct / top10Matches) * 1000) / 10 : 0,
      total_matches: totalMatches,
      total_correct: totalCorrect,
      total_leagues: Number(row.total_leagues || 0),
    };
  } catch (error) {
    console.error('Error fetching overall KPI stats:', error);
    throw new Error('Failed to fetch overall KPI stats');
  }
}