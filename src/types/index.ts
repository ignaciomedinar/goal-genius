export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  predictedHomeScore?: number;
  predictedAwayScore?: number;
  matchDate: string;
  matchTime: string;
  // Raw ISO instant from the API, kept alongside matchDate/matchTime so
  // display code can format date+time from a single source instead of
  // splitting into separate UTC-date/local-time strings and reformatting
  // each -- that split is what causes the calendar day to shift near
  // midnight for visitors on either side of UTC.
  date_time?: string;
  league: string;
  confederation: string;
  probability?: number;
  status: 'upcoming' | 'live' | 'finished';
  // New fields for real data
  country_name?: string;
  flag_url?: string;
  is_correct_prediction?: boolean;
  prediction_type?: 'home_win' | 'away_win' | 'draw';
  actual_result?: 'home_win' | 'away_win' | 'draw' | 'pending';
  has_actual_result?: boolean;
}

export interface Team {
  id: string;
  name: string;
  logo?: string;
  confederation: string;
  league: string;
  recentMatches?: Match[];
}

export interface Prediction {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  probability: number;
  league: string;
  confederation: string;
  matchDate: string;
  matchTime: string;
}

export interface BookmakerOdds {
  bookmaker: string;
  homeWin: number;
  draw: number;
  awayWin: number;
  over25: number;
  under25: number;
}

export interface MatchDetails extends Match {
  homeTeamRecentMatches: Match[];
  awayTeamRecentMatches: Match[];
  bookmakerOdds: BookmakerOdds[];
  headToHead: Match[];
}

export interface LeagueAccuracy {
  league: string;
  confederation: string;
  accuracy: number;
  totalMatches: number;
  correctPredictions: number;
  top10Accuracy?: number;
  top10Correct?: number;
}

export interface WeeklyAccuracy {
  week: string;
  accuracy: number;
  totalMatches: number;
  correctPredictions: number;
  topMatches: Match[];
}

export interface Confederation {
  name: string;
  code: string;
  description: string;
  topTeams: string[];
  leagues: string[];
}