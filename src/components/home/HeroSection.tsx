import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

const HeroSection = async () => {
  const t = await getTranslations('hero');

  return (
    <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/5 py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <div className="mb-6">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-6">
              <span className="mr-2">🏆</span>
              {t('badge')}
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              {t('title')}
              <span className="block text-primary">{t('titleHighlight')}</span>
            </h1>
          </div>

          {/* Description */}
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            {t('description')}
          </p>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="flex flex-col items-center p-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">{t('features.accuracy.title')}</h3>
              <p className="text-sm text-muted-foreground text-center">
                {t('features.accuracy.description')}
              </p>
            </div>
            <div className="flex flex-col items-center p-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">{t('features.weekly.title')}</h3>
              <p className="text-sm text-muted-foreground text-center">
                {t('features.weekly.description')}
              </p>
            </div>
            <div className="flex flex-col items-center p-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">{t('features.coverage.title')}</h3>
              <p className="text-sm text-muted-foreground text-center">
                {t('features.coverage.description')}
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/predictions"
              className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-lg"
            >
              {t('ctaPredictions')}
              <span className="ml-2">→</span>
            </Link>
            <Link
              href="/results"
              className="inline-flex items-center px-8 py-4 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/80 transition-colors"
            >
              {t('ctaAccuracy')}
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">85%+</div>
              <div className="text-sm text-muted-foreground">{t('stats.avgAccuracy')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-sm text-muted-foreground">{t('stats.matchesPerWeek')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-sm text-muted-foreground">{t('stats.leaguesCovered')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
