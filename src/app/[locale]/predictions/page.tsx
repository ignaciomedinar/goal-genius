import type { Metadata } from 'next';
import PredictionsTable from '@/components/predictions/PredictionsTable';
import PredictionsHeader from '@/components/predictions/PredictionsHeader';

const baseUrl = 'https://www.goal-genius.net';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === 'es';
  const canonical = isEs ? `${baseUrl}/es/predictions` : `${baseUrl}/predictions`;

  return {
    title: isEs
      ? 'Predicciones de Fútbol Esta Semana - Goal Genius'
      : "This Week's Football Predictions - Goal Genius",
    description: isEs
      ? 'Predicciones gratuitas de fútbol con IA para esta semana. Premier League, Champions League, La Liga, Serie A y más — con puntuaciones de probabilidad y calificaciones de confianza.'
      : 'Free AI-powered football match predictions for this week. Premier League, Champions League, La Liga, Serie A and more — with probability scores and confidence ratings.',
    alternates: {
      canonical,
      languages: {
        en: `${baseUrl}/predictions`,
        es: `${baseUrl}/es/predictions`,
        'x-default': `${baseUrl}/predictions`,
      },
    },
  };
}

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
