import { Metadata } from 'next';
import ResultsTable from '@/components/results/ResultsTable';
import ResultsHeader from '@/components/results/ResultsHeader';

export const metadata: Metadata = {
  title: "Football Prediction Results & Accuracy History - Goal Genius",
  description:
    "Check our historical football prediction results. Filter by league and week to see how our AI model performed — full transparency, no cherry-picking.",
  keywords:
    "football prediction results, soccer prediction accuracy, football tips history, prediction track record, AI football model accuracy, verified football predictions",
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