import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

const baseUrl = 'https://www.goal-genius.net';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations('about');
  const isEs = locale === 'es';
  const canonical = isEs ? `${baseUrl}/es/about` : `${baseUrl}/about`;

  return {
    title: t('badge') + ' — Goal Genius',
    description: t('description'),
    alternates: {
      canonical,
      languages: {
        en: `${baseUrl}/about`,
        es: `${baseUrl}/es/about`,
        'x-default': `${baseUrl}/about`,
      },
    },
  };
}

export default async function AboutPage() {
  const t = await getTranslations('about');

  const features = [
    { icon: '🤖', title: t('feature1Title'), description: t('feature1Desc') },
    { icon: '📊', title: t('feature2Title'), description: t('feature2Desc') },
    { icon: '🔄', title: t('feature3Title'), description: t('feature3Desc') },
    { icon: '🌍', title: t('feature4Title'), description: t('feature4Desc') },
    { icon: '🎯', title: t('feature5Title'), description: t('feature5Desc') },
    { icon: '⚡', title: t('feature6Title'), description: t('feature6Desc') },
  ];

  const stats = [
    { value: '85%+', label: t('statAvgAccuracy') },
    { value: '500+', label: t('statMatchesPerWeek') },
    { value: '50+',  label: t('statLeaguesCovered') },
    { value: '6',    label: t('statConfederations') },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/5 py-20 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-6">
            <span className="mr-2">⚽</span>
            {t('badge')}
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            {t('title')}
            <span className="block text-primary">{t('titleHighlight')}</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t('description')}
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="py-12 border-b border-border bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-primary font-display mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-6">
              <span className="mr-2">📖</span>
              {t('storyBadge')}
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              {t('storyTitle')}
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
              <p>{t('storyP1')}</p>
              <p>{t('storyP2')}</p>
              <p>{t('storyP3')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-20 bg-muted/20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-4">
              <span className="mr-2">🏆</span>
              {t('diffBadge')}
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('diffTitle')}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {t('diffDescription')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-card border border-border rounded-xl p-6 hover:border-primary/40 transition-colors"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-2xl">
                  {feature.icon}
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-10 bg-background border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 text-center">
            <div className="text-2xl mb-2">⚠️</div>
            <h3 className="font-semibold text-foreground mb-2">{t('disclaimerTitle')}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('disclaimerText')}{' '}
              <a href="https://www.begambleaware.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                BeGambleAware.org
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/5 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">{t('ctaTitle')}</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">{t('ctaDescription')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/predictions"
              className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-lg"
            >
              {t('ctaPredictions')} <span className="ml-2">→</span>
            </Link>
            <Link
              href="/accuracy"
              className="inline-flex items-center px-8 py-4 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/80 transition-colors"
            >
              {t('ctaAccuracy')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
