import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter, Poppins } from 'next/font/google';
import Script from 'next/script';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';
import '../globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
});

type Props = { params: Promise<{ locale: string }>; children: ReactNode };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === 'es';
  const baseUrl = 'https://www.goal-genius.net';

  return {
    metadataBase: new URL(baseUrl),
    title: isEs
      ? 'Goal Genius - Predicciones Avanzadas de Fútbol'
      : 'Goal Genius - Advanced Football Match Predictions',
    description: isEs
      ? 'Obtén predicciones precisas de partidos de fútbol con análisis de IA. Sigue nuestra precisión y accede a estadísticas completas para todos los torneos principales.'
      : 'Get accurate football match predictions with AI-powered analysis. Track accuracy, view detailed team statistics, and access comprehensive match insights for all major tournaments.',
    keywords: isEs
      ? 'predicciones de fútbol hoy, predicciones de partidos de fútbol, predicciones Premier League, predicciones Champions League, consejos de apuestas de fútbol, predicciones gratis, análisis de fútbol IA'
      : 'football predictions today, soccer match predictions, Premier League predictions, Champions League predictions, football betting tips, free football predictions, AI football analysis',
    authors: [{ name: 'Goal Genius' }],
    creator: 'Goal Genius',
    publisher: 'Goal Genius',
    alternates: {
      canonical: baseUrl,
      languages: {
        en: baseUrl,
        es: `${baseUrl}/es`,
        'x-default': baseUrl,
      },
    },
    openGraph: {
      title: isEs
        ? 'Goal Genius - Predicciones Avanzadas de Fútbol'
        : 'Goal Genius - Advanced Football Match Predictions',
      description: isEs
        ? 'Obtén predicciones precisas de partidos de fútbol con análisis de IA'
        : 'Get accurate football match predictions with AI-powered analysis',
      url: isEs ? `${baseUrl}/es` : baseUrl,
      siteName: 'Goal Genius',
      images: [{ url: '/logo.png', width: 800, height: 600, alt: 'Goal Genius Logo' }],
      locale: isEs ? 'es_ES' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: isEs
        ? 'Goal Genius - Predicciones Avanzadas de Fútbol'
        : 'Goal Genius - Advanced Football Match Predictions',
      description: isEs
        ? 'Obtén predicciones precisas de partidos de fútbol con análisis de IA'
        : 'Get accurate football match predictions with AI-powered analysis',
      images: ['/logo.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${inter.variable} ${poppins.variable} antialiased min-h-screen bg-background`}
        suppressHydrationWarning={true}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Goal Genius',
              url: 'https://www.goal-genius.net',
              description: 'AI-powered football match predictions with accuracy tracking for all major leagues worldwide.',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://www.goal-genius.net/predictions',
              },
            }),
          }}
        />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7649332633911489"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-WRCQ41KVM8" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WRCQ41KVM8');
          `}
        </Script>

        <NextIntlClientProvider messages={messages}>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
