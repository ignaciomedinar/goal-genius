import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

const baseUrl = 'https://www.goal-genius.net';

const sections = [
  {
    id: 'introduction',
    title: '1. Introduction',
    content: `Goal Genius ("we", "us", or "our") operates the website www.goal-genius.net (the "Service"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website. Please read this policy carefully. If you disagree with its terms, please discontinue use of the Service.`,
  },
  {
    id: 'information-collected',
    title: '2. Information We Collect',
    content: `We collect information in the following ways:

**Automatically collected data**: When you visit our website, our servers may automatically log standard technical information such as your IP address (anonymised), browser type, operating system, referring URLs, pages visited, and time spent on pages. This information is used solely for analytics and to improve the Service.

**No personal accounts**: Goal Genius does not require you to create an account or provide any personal information (such as name, email, or payment details) to access predictions and results. We do not collect or store any personally identifiable information (PII) unless you voluntarily submit it (e.g. via a contact form, if available).

**Cookies**: We may use cookies and similar tracking technologies as described in Section 4 below.`,
  },
  {
    id: 'how-we-use',
    title: '3. How We Use Your Information',
    content: `Information we collect is used to:

• Operate and maintain the Service
• Monitor and analyse usage patterns to improve performance and user experience
• Detect, prevent, and address technical issues
• Comply with legal obligations

We do not sell, trade, or rent your information to third parties for marketing purposes.`,
  },
  {
    id: 'cookies',
    title: '4. Cookies',
    content: `We use cookies and similar technologies to enhance your experience on our website. Cookies are small data files stored on your device. We use:

**Essential cookies**: Required for the website to function correctly (e.g. session management).

**Analytics cookies**: Used to understand how visitors interact with our website (e.g. Google Analytics or similar). These cookies collect anonymised aggregate data.

You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, some parts of the Service may not function properly if cookies are disabled.`,
  },
  {
    id: 'third-party',
    title: '5. Third-Party Services',
    content: `We may use third-party services that collect, monitor, and analyse data to improve our Service:

• **Analytics providers** (e.g. Google Analytics): Help us understand site traffic and user behaviour through anonymised, aggregated data.
• **Hosting providers**: Our website is hosted on infrastructure provided by third-party hosting services. Your usage data may pass through their servers.
• **CDN providers**: We may use content delivery networks to improve load times.

These third parties have their own privacy policies governing the use of data. We encourage you to review their policies.`,
  },
  {
    id: 'data-security',
    title: '6. Data Security',
    content: `We take reasonable technical and organisational measures to protect any information collected against unauthorised access, alteration, disclosure, or destruction. However, no method of transmission over the internet or method of electronic storage is 100% secure, and we cannot guarantee absolute security.

We do not store sensitive personal or financial information. Our prediction database contains only public football match data.`,
  },
  {
    id: 'childrens-privacy',
    title: "7. Children's Privacy",
    content: `Our Service is not directed to individuals under the age of 18. We do not knowingly collect personally identifiable information from anyone under 18. If you are a parent or guardian and believe your child has provided us with personal data, please contact us so we can take appropriate action.`,
  },
  {
    id: 'your-rights',
    title: '8. Your Rights (GDPR)',
    content: `If you are located in the European Economic Area (EEA), you have certain data protection rights under the General Data Protection Regulation (GDPR):

• **Right of access**: Request a copy of the personal data we hold about you.
• **Right to rectification**: Request correction of inaccurate personal data.
• **Right to erasure**: Request deletion of your personal data where no legal basis for retention exists.
• **Right to object**: Object to processing of your personal data.
• **Right to data portability**: Request transfer of your data in a machine-readable format.

Since we collect minimal data and require no registration, most of these rights are satisfied by the nature of our Service. If you have specific requests, please contact us at the details below.`,
  },
  {
    id: 'changes',
    title: '9. Changes to This Policy',
    content: `We may update this Privacy Policy from time to time. We will notify you of any changes by updating the "Last Updated" date at the top of this page. Your continued use of the Service after any changes constitutes your acceptance of the new Privacy Policy. We encourage you to review this page periodically.`,
  },
  {
    id: 'contact',
    title: '10. Contact Us',
    content: `If you have any questions about this Privacy Policy, please contact us at:

**Goal Genius**
Email: ignaciomedinar@gmail.com
Website: www.goal-genius.net`,
  },
];

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations('privacy');
  const isEs = locale === 'es';
  const canonical = isEs ? `${baseUrl}/es/privacy` : `${baseUrl}/privacy`;

  return {
    title: t('title') + ' — Goal Genius',
    description: 'Read the Goal Genius Privacy Policy to understand how we collect, use, and protect your information.',
    alternates: {
      canonical,
      languages: {
        en: `${baseUrl}/privacy`,
        es: `${baseUrl}/es/privacy`,
        'x-default': `${baseUrl}/privacy`,
      },
    },
  };
}

export default async function PrivacyPage() {
  const t = await getTranslations('privacy');

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/5 py-16 border-b border-border">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-6">
            <span className="mr-2">🔒</span>
            {t('badge')}
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">{t('title')}</h1>
          <p className="text-muted-foreground text-sm">{t('lastUpdated')}</p>
        </div>
      </section>

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
                    <a href={`#${section.id}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </div>

            <div className="space-y-12">
              {sections.map((section) => (
                <div key={section.id} id={section.id} className="scroll-mt-24">
                  <h2 className="font-display text-xl font-bold text-foreground mb-4 pb-2 border-b border-border">
                    {section.title}
                  </h2>
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
