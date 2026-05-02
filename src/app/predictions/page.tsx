import { Metadata } from 'next';
import PredictionsTable from '@/components/predictions/PredictionsTable';
import PredictionsHeader from '@/components/predictions/PredictionsHeader';

export const metadata: Metadata = {
  title: "This Week's Football Predictions - Goal Genius",
  description:
    "Free AI-powered football match predictions for this week. Premier League, Champions League, La Liga, Serie A and more — with probability scores and confidence ratings.",
  keywords:
    "football predictions this week, soccer predictions today, Premier League predictions, Champions League predictions, La Liga predictions, free football tips, AI match predictions, soccer betting analysis",
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