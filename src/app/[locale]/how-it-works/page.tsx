import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

const baseUrl = 'https://www.goal-genius.net';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations('howItWorks');
  const isEs = locale === 'es';
  const canonical = isEs ? `${baseUrl}/es/how-it-works` : `${baseUrl}/how-it-works`;

  return {
    title: t('badge') + ' — Goal Genius',
    description: t('description'),
    alternates: {
      canonical,
      languages: {
        en: `${baseUrl}/how-it-works`,
        es: `${baseUrl}/es/how-it-works`,
        'x-default': `${baseUrl}/how-it-works`,
      },
    },
  };
}

export default async function HowItWorksPage() {
  const t = await getTranslations('howItWorks');

  const steps = [
    { number: '01', icon: '📡', title: t('step1Title'), description: t('step1Desc'), detail: t('step1Detail') },
    { number: '02', icon: '🤖', title: t('step2Title'), description: t('step2Desc'), detail: t('step2Detail') },
    { number: '03', icon: '🎯', title: t('step3Title'), description: t('step3Desc'), detail: t('step3Detail') },
    { number: '04', icon: '📊', title: t('step4Title'), description: t('step4Desc'), detail: t('step4Detail') },
    { number: '05', icon: '✅', title: t('step5Title'), description: t('step5Desc'), detail: t('step5Detail') },
  ];

  const faqs = [
    { question: t('faq1Q'), answer: t('faq1A') },
    { question: t('faq2Q'), answer: t('faq2A') },
    { question: t('faq3Q'), answer: t('faq3A') },
    { question: t('faq4Q'), answer: t('faq4A') },
    { question: t('faq5Q'), answer: t('faq5A') },
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
            <span className="mr-2">🔍</span>
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

      {/* Steps */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              {steps.map((step, index) => (
                <div key={step.number} className="flex gap-6 md:gap-10">
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-display font-bold text-lg shrink-0">
                      {step.icon}
                    </div>
                    {index < steps.length - 1 && (
                      <div className="w-px flex-1 bg-border mt-3 min-h-[3rem]" />
                    )}
                  </div>
                  <div className="pb-12">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded font-mono">
                        {t('step')} {step.number}
                      </span>
                    </div>
                    <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-3">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">{step.description}</p>
                    <div className="inline-flex items-center text-xs text-primary bg-primary/10 rounded px-3 py-1.5 font-mono">
                      {step.detail}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Liability tiers */}
      <section className="py-20 bg-muted/20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-4">
              <span className="mr-2">📊</span>
              {t('liabilityBadge')}
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">{t('liabilityTitle')}</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">{t('liabilityDescription')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-card border border-green-500/30 rounded-xl p-6 text-center">
              <div className="inline-flex px-3 py-1 bg-green-500/10 text-green-500 rounded text-sm font-semibold mb-4">{t('highLabel')}</div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">{t('highTitle')}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{t('highDesc')}</p>
            </div>
            <div className="bg-card border border-yellow-500/30 rounded-xl p-6 text-center">
              <div className="inline-flex px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded text-sm font-semibold mb-4">{t('midLabel')}</div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">{t('midTitle')}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{t('midDesc')}</p>
            </div>
            <div className="bg-card border border-red-500/30 rounded-xl p-6 text-center">
              <div className="inline-flex px-3 py-1 bg-red-500/10 text-red-500 rounded text-sm font-semibold mb-4">{t('lowLabel')}</div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">{t('lowTitle')}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{t('lowDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-background border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-4">
                <span className="mr-2">❓</span>
                {t('faqBadge')}
              </div>
              <h2 className="font-display text-3xl font-bold text-foreground">{t('faqTitle')}</h2>
            </div>
            <div className="space-y-6">
              {faqs.map((faq) => (
                <div key={faq.question} className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-colors">
                  <h3 className="font-display font-semibold text-foreground mb-3">{faq.question}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>
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
