import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

const baseUrl = 'https://www.goal-genius.net';

const sections = [
  {
    id: 'acceptance',
    title: '1. Acceptance of Terms',
    content: `By accessing or using the Goal Genius website at www.goal-genius.net (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please discontinue use of the Service immediately.

We reserve the right to update or modify these Terms at any time without prior notice. Your continued use of the Service following any changes constitutes acceptance of the revised Terms.`,
  },
  {
    id: 'use-of-service',
    title: '2. Use of Service',
    content: `Goal Genius provides football match predictions, accuracy statistics, and related analytical content for **informational and entertainment purposes only**. The Service is intended for users aged 18 and over.

You agree to use the Service only for lawful purposes and in a manner that does not infringe the rights of others. You must not:

• Attempt to gain unauthorised access to any part of the Service or its systems
• Use automated tools (bots, scrapers) to extract data at scale without prior written consent
• Reproduce or redistribute our predictions or data commercially without authorisation
• Use the Service in any way that could damage, disable, or impair its operation`,
  },
  {
    id: 'responsible-gambling',
    title: '3. Responsible Gambling Disclaimer',
    highlight: true,
    content: `**IMPORTANT — PLEASE READ CAREFULLY**

Goal Genius predictions are provided strictly for **informational and entertainment purposes only**. They do not constitute financial advice, betting advice, or any form of investment recommendation.

We do not encourage gambling. We strongly advise all users to:

• **Gamble only with money you can afford to lose**
• Set strict limits on the amount you spend on gambling
• Never chase losses
• Take regular breaks and set time limits
• Be aware of the signs of problem gambling

If you or someone you know is struggling with a gambling problem, free confidential support is available:

• **BeGambleAware**: www.begambleaware.org | 0808 8020 133
• **GamCare**: www.gamcare.org.uk | 0808 8020 133
• **Gambling Therapy**: www.gamblingtherapy.org

Goal Genius accepts no responsibility for any financial losses incurred as a result of acting upon predictions or information published on this Service.`,
  },
  {
    id: 'not-financial-advice',
    title: '4. Not Financial or Betting Advice',
    content: `The predictions, confidence scores, liability ratings, and accuracy metrics published on Goal Genius are the output of an AI model trained on historical football data. They represent statistical estimates, not guarantees of future outcomes.

Football matches are inherently unpredictable. Past accuracy does not guarantee future accuracy. Any decision to place a bet or wager based on information from this Service is made entirely at your own risk and discretion.

We are not licensed as a financial advisor, betting operator, or tipster service. No part of this Service should be construed as such.`,
  },
  {
    id: 'intellectual-property',
    title: '5. Intellectual Property',
    content: `All content on the Goal Genius website — including but not limited to prediction data, accuracy metrics, design, text, graphics, and software — is the property of Goal Genius and protected by applicable intellectual property laws.

You may access and view content on the Service for personal, non-commercial use. You may not reproduce, distribute, modify, or create derivative works without prior written permission from Goal Genius.

Football match data used as input to our model is sourced from publicly available databases. We assert no ownership over raw match data.`,
  },
  {
    id: 'disclaimer-of-warranties',
    title: '6. Disclaimer of Warranties',
    content: `The Service is provided on an "as is" and "as available" basis without warranties of any kind, either express or implied, including but not limited to:

• Warranties of merchantability or fitness for a particular purpose
• Warranties that the Service will be uninterrupted, error-free, or free of viruses
• Warranties regarding the accuracy, completeness, or reliability of predictions

We make no guarantee that the Service will be available at all times. Maintenance, updates, or technical issues may cause temporary downtime.`,
  },
  {
    id: 'limitation-of-liability',
    title: '7. Limitation of Liability',
    content: `To the fullest extent permitted by applicable law, Goal Genius and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages — including but not limited to loss of profits, loss of data, or financial losses — arising from:

• Your use or inability to use the Service
• Any reliance on predictions or information published on the Service
• Unauthorised access to or alteration of your data
• Any other matter relating to the Service

Our total liability to you for any claim arising under these Terms shall not exceed the amount you have paid us (if any) in the past 12 months.`,
  },
  {
    id: 'privacy',
    title: '8. Privacy Policy',
    content: `Your use of the Service is also governed by our Privacy Policy, which is incorporated by reference into these Terms. Please review our Privacy Policy at /privacy to understand our data practices.`,
  },
  {
    id: 'third-party-links',
    title: '9. Third-Party Links',
    content: `Our Service may contain links to third-party websites (including betting operators or responsible gambling resources). These links are provided for your convenience only. We have no control over the content or practices of third-party sites and accept no responsibility for them. Visiting third-party links is entirely at your own risk.`,
  },
  {
    id: 'governing-law',
    title: '10. Governing Law',
    content: `These Terms shall be governed by and construed in accordance with the laws of the European Union and the country in which Goal Genius is registered, without regard to conflict of law principles. Any disputes arising from these Terms or the use of the Service shall be subject to the exclusive jurisdiction of the courts of that jurisdiction.`,
  },
  {
    id: 'changes',
    title: '11. Changes to Terms',
    content: `We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting. We will update the "Last Updated" date at the top of this page. It is your responsibility to check these Terms periodically. Continued use of the Service constitutes acceptance of updated Terms.`,
  },
  {
    id: 'contact',
    title: '12. Contact Us',
    content: `If you have any questions about these Terms, please contact us at:

**Goal Genius**
Email: ignaciomedinar@gmail.com
Website: www.goal-genius.net`,
  },
];

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations('terms');
  const isEs = locale === 'es';
  const canonical = isEs ? `${baseUrl}/es/terms` : `${baseUrl}/terms`;

  return {
    title: t('title') + ' — Goal Genius',
    description: 'Read the Goal Genius Terms of Service before using our football predictions platform.',
    alternates: {
      canonical,
      languages: {
        en: `${baseUrl}/terms`,
        es: `${baseUrl}/es/terms`,
        'x-default': `${baseUrl}/terms`,
      },
    },
  };
}

export default async function TermsPage() {
  const t = await getTranslations('terms');

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/5 py-16 border-b border-border">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-6">
            <span className="mr-2">📋</span>
            {t('badge')}
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">{t('title')}</h1>
          <p className="text-muted-foreground text-sm">{t('lastUpdated')}</p>
        </div>
      </section>

      <div className="bg-amber-500/10 border-b border-amber-500/30">
        <div className="container mx-auto px-4 py-4 text-center">
          <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">
            ⚠️ {t('gamblingWarning')}{' '}
            <a href="https://www.begambleaware.org" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">
              BeGambleAware.org
            </a>
          </p>
        </div>
      </div>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-muted/30 border border-border rounded-xl p-6 mb-12">
              <h2 className="font-display font-semibold text-foreground mb-4 text-sm uppercase tracking-wide">
                {t('tableOfContents')}
              </h2>
              <ol className="space-y-2">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className={`text-sm transition-colors ${
                        section.highlight
                          ? 'text-amber-600 dark:text-amber-400 font-semibold hover:text-amber-700'
                          : 'text-muted-foreground hover:text-primary'
                      }`}
                    >
                      {section.title}
                      {section.highlight && ' ⚠️'}
                    </a>
                  </li>
                ))}
              </ol>
            </div>

            <div className="space-y-12">
              {sections.map((section) => (
                <div key={section.id} id={section.id} className="scroll-mt-24">
                  <h2
                    className={`font-display text-xl font-bold mb-4 pb-2 border-b ${
                      section.highlight
                        ? 'text-amber-600 dark:text-amber-400 border-amber-500/30'
                        : 'text-foreground border-border'
                    }`}
                  >
                    {section.title}
                  </h2>
                  {section.highlight && (
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-4">
                      <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold uppercase tracking-wide">
                        {t('importantWarning')}
                      </p>
                    </div>
                  )}
                  <div className="text-muted-foreground leading-relaxed text-sm whitespace-pre-line">
                    {section.content.split('\n').map((line, i) => {
                      const boldFormatted = line.replace(
                        /\*\*(.*?)\*\*/g,
                        '<strong class="text-foreground font-semibold">$1</strong>'
                      );
                      return (
                        <p
                          key={i}
                          className={line.startsWith('•') ? 'pl-4 my-1' : 'mb-3'}
                          dangerouslySetInnerHTML={{ __html: boldFormatted }}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
