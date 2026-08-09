import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// No `timeZone` is passed to Intl.DateTimeFormat here on purpose: the API
// now sends a real UTC instant (see src/lib/database.ts, `date_time AT TIME
// ZONE 'Europe/Madrid'`), and omitting `timeZone` makes the browser render
// it in the visitor's own local timezone automatically -- no per-country
// logic needed. Forcing a timeZone here would undo that.
export function formatDate(date: string | Date, locale: string = 'en-US') {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatTime(date: string | Date, locale: string = 'en-US') {
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function formatPercentage(value: number | undefined | null, decimals: number = 1) {
  if (value === undefined || value === null || isNaN(value)) {
    return '0.0%';
  }
  return `${Number(value).toFixed(decimals)}%`;
}

export function getTeamLogo(teamName: string) {
  // Placeholder function - you can integrate with a sports API later
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(teamName)}&background=random&color=fff&size=40`
}

export function calculateAccuracy(predictions: any[], results: any[]) {
  if (!predictions.length || !results.length) return 0;
  
  let correct = 0;
  predictions.forEach(prediction => {
    const result = results.find(r => 
      r.homeTeam === prediction.homeTeam && 
      r.awayTeam === prediction.awayTeam &&
      r.matchDate === prediction.matchDate
    );
    
    if (result) {
      const predictedWinner = prediction.homeScore > prediction.awayScore ? 'home' : 
                            prediction.awayScore > prediction.homeScore ? 'away' : 'draw';
      const actualWinner = result.homeScore > result.awayScore ? 'home' : 
                          result.awayScore > result.homeScore ? 'away' : 'draw';
      
      if (predictedWinner === actualWinner) {
        correct++;
      }
    }
  });
  
  return (correct / predictions.length) * 100;
}