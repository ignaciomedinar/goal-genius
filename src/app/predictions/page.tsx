import { Metadata } from 'next';
import PredictionsTable from '@/components/predictions/PredictionsTable';
import PredictionsHeader from '@/components/predictions/PredictionsHeader';

export const metadata: Metadata = {
  title: 'Football Predictions - Goal Genius',
  description: 'View current week football match predictions with detailed analysis, probability scores, and exportable data for all major leagues.',
  keywords: 'football predictions, match predictions, soccer betting tips, football analysis',
};

export default function PredictionsPage() {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <PredictionsHeader />
        <PredictionsTable />
      </div>
    </div>
  );
}