import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

const baseUrl = 'https://www.goal-genius.net';

// TODO: swap for a dedicated address (e.g. contact@goal-genius.net) once that inbox exists.
const CONTACT_EMAIL = 'ignaciomedinar@gmail.com';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations('contact');
  const isEs = locale === 'es';
  const canonical = isEs ? `${baseUrl}/es/contact` : `${baseUrl}/contact`;

  return {
    title: t('title') + ' ' + t('titleHighlight') + ' — Goal Genius',
    description: t('description'),
    alternates: {
      canonical,
      languages: {
        en: `${baseUrl}/contact`,
        es: `${baseUrl}/es/contact`,
        'x-default': `${baseUrl}/contact`,
      },
    },
  };
}

export default async function ContactPage() {
  const t = await getTranslations('contact');

  const topics = [t('topic1'), t('topic2'), t('topic3'), t('topic4')];

  return (
    <div className="min-h-screen bg-background">
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/5 py-20 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-6">
            <span className="mr-2">✉️</span>
            {t('badge')}
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            {t('title')} <span className="text-primary">{t('titleHighlight')}</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t('description')}
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-2xl mx-auto">
                📧
              </div>
              <h2 className="font-display font-semibold text-lg text-foreground mb-2">{t('emailLabel')}</h2>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-primary font-medium hover:underline break-all"
              >
                {CONTACT_EMAIL}
              </a>
              <p className="text-sm text-muted-foreground mt-4">{t('responseNote')}</p>
            </div>

            <div className="bg-muted/30 border border-border rounded-xl p-8">
              <h2 className="font-display font-semibold text-lg text-foreground mb-4">{t('topicsTitle')}</h2>
              <ul className="space-y-2 text-sm text-muted-foreground text-left">
                {topics.map((topic) => (
                  <li key={topic} className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
