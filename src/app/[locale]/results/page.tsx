import type { Metadata } from 'next';
import ResultsTable from '@/components/results/ResultsTable';
import ResultsHeader from '@/components/results/ResultsHeader';

const baseUrl = 'https://www.goal-genius.net';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ league?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === 'es';
  const canonical = isEs ? `${baseUrl}/es/results` : `${baseUrl}/results`;

  return {
    title: isEs
      ? 'Resultados e Historial de Precisión de Predicciones - Goal Genius'
      : 'Football Prediction Results & Accuracy History - Goal Genius',
    description: isEs
      ? 'Consulta nuestros resultados históricos de predicciones de fútbol. Filtra por liga y semana para ver el rendimiento de nuestro modelo de IA — transparencia total, sin selección arbitraria.'
      : 'Check our historical football prediction results. Filter by league and week to see how our AI model performed — full transparency, no cherry-picking.',
    alternates: {
      canonical,
      languages: {
        en: `${baseUrl}/results`,
        es: `${baseUrl}/es/results`,
        'x-default': `${baseUrl}/results`,
      },
    },
  };
}

export default async function ResultsPage({ searchParams }: Props) {
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
