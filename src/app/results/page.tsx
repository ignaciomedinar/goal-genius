import { Metadata } from 'next';
import ResultsTable from '@/components/results/ResultsTable';
import ResultsHeader from '@/components/results/ResultsHeader';

export const metadata: Metadata = {
  title: 'Match Results & Accuracy - Goal Genius',
  description: 'View historical football match results with prediction accuracy analysis. Filter by week, league, and track our performance over time.',
  keywords: 'football results, prediction accuracy, match outcomes, historical data',
};

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ league?: string }>;
}) {
  const { league } = await searchParams;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <ResultsHeader />
        <ResultsTable initialLeague={league ?? 'all'} />
      </div>
    </div>
  );
}