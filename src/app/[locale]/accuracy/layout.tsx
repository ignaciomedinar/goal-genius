import type { Metadata } from 'next';

const baseUrl = 'https://www.goal-genius.net';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === 'es';
  const canonical = isEs ? `${baseUrl}/es/accuracy` : `${baseUrl}/accuracy`;

  return {
    title: isEs
      ? 'Precisión de Predicciones de Fútbol por Liga - Goal Genius'
      : 'Football Prediction Accuracy by League - Goal Genius',
    description: isEs
      ? 'Ve la precisión real de las predicciones de Goal Genius en todas las ligas de fútbol. Precisión general, selecciones de mayor confianza y un desglose completo por liga — actualizado automáticamente.'
      : "See Goal Genius's real prediction accuracy across all football leagues. Overall accuracy, top-10 confidence picks, and a full breakdown by league — updated automatically.",
    alternates: {
      canonical,
      languages: {
        en: `${baseUrl}/accuracy`,
        es: `${baseUrl}/es/accuracy`,
        'x-default': `${baseUrl}/accuracy`,
      },
    },
  };
}

export default function AccuracyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
