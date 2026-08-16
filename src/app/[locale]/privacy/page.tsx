import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

const baseUrl = 'https://www.goal-genius.net';

const sectionsByLocale = {
  en: [
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

**Advertising cookies**: Used by Google AdSense to show relevant ads and measure ad performance.

Analytics and advertising cookies are only set after you give consent via the cookie banner shown on your first visit. You can change your choice at any time by clearing your browser's site data for this website. You can also instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, some parts of the Service may not function properly if cookies are disabled.`,
    },
    {
      id: 'third-party',
      title: '5. Third-Party Services',
      content: `We may use third-party services that collect, monitor, and analyse data to improve our Service:

• **Analytics providers** (e.g. Google Analytics): Help us understand site traffic and user behaviour through anonymised, aggregated data.
• **Advertising providers** (e.g. Google AdSense): Show ads and measure their performance.
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
• **Right to withdraw consent**: Withdraw your cookie consent at any time, as described in Section 4.

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
  ],
  es: [
    {
      id: 'introduction',
      title: '1. Introducción',
      content: `Goal Genius ("nosotros", "nos" o "nuestro") opera el sitio web www.goal-genius.net (el "Servicio"). Esta Política de Privacidad explica cómo recopilamos, usamos, divulgamos y protegemos tu información cuando visitas nuestro sitio web. Por favor, lee esta política con atención. Si no estás de acuerdo con sus términos, te pedimos que dejes de usar el Servicio.`,
    },
    {
      id: 'information-collected',
      title: '2. Información que Recopilamos',
      content: `Recopilamos información de las siguientes formas:

**Datos recopilados automáticamente**: Cuando visitas nuestro sitio web, nuestros servidores pueden registrar automáticamente información técnica estándar como tu dirección IP (anonimizada), tipo de navegador, sistema operativo, URLs de referencia, páginas visitadas y tiempo de permanencia en las páginas. Esta información se utiliza únicamente con fines analíticos y para mejorar el Servicio.

**Sin cuentas personales**: Goal Genius no requiere que crees una cuenta ni que proporciones información personal (como nombre, correo electrónico o datos de pago) para acceder a las predicciones y resultados. No recopilamos ni almacenamos información de identificación personal (PII) a menos que la envíes voluntariamente (por ejemplo, a través de un formulario de contacto, si está disponible).

**Cookies**: Podemos usar cookies y tecnologías de seguimiento similares, tal como se describe en la Sección 4 a continuación.`,
    },
    {
      id: 'how-we-use',
      title: '3. Cómo Usamos tu Información',
      content: `La información que recopilamos se utiliza para:

• Operar y mantener el Servicio
• Monitorizar y analizar patrones de uso para mejorar el rendimiento y la experiencia del usuario
• Detectar, prevenir y solucionar problemas técnicos
• Cumplir con obligaciones legales

No vendemos, intercambiamos ni alquilamos tu información a terceros con fines de marketing.`,
    },
    {
      id: 'cookies',
      title: '4. Cookies',
      content: `Utilizamos cookies y tecnologías similares para mejorar tu experiencia en nuestro sitio web. Las cookies son pequeños archivos de datos almacenados en tu dispositivo. Usamos:

**Cookies esenciales**: Necesarias para que el sitio web funcione correctamente (por ejemplo, gestión de sesión).

**Cookies analíticas**: Utilizadas para entender cómo interactúan los visitantes con nuestro sitio web (por ejemplo, Google Analytics o similar). Estas cookies recopilan datos agregados y anonimizados.

**Cookies publicitarias**: Utilizadas por Google AdSense para mostrar anuncios relevantes y medir su rendimiento.

Las cookies analíticas y publicitarias solo se activan después de que das tu consentimiento a través del banner de cookies que se muestra en tu primera visita. Puedes cambiar tu elección en cualquier momento borrando los datos del sitio en tu navegador. También puedes configurar tu navegador para rechazar todas las cookies o para que te avise cuando se envíe una cookie. Sin embargo, algunas partes del Servicio pueden no funcionar correctamente si las cookies están deshabilitadas.`,
    },
    {
      id: 'third-party',
      title: '5. Servicios de Terceros',
      content: `Podemos utilizar servicios de terceros que recopilan, monitorizan y analizan datos para mejorar nuestro Servicio:

• **Proveedores de análisis** (por ejemplo, Google Analytics): Nos ayudan a entender el tráfico del sitio y el comportamiento de los usuarios mediante datos agregados y anonimizados.
• **Proveedores de publicidad** (por ejemplo, Google AdSense): Muestran anuncios y miden su rendimiento.
• **Proveedores de hosting**: Nuestro sitio web está alojado en infraestructura proporcionada por servicios de hosting de terceros. Tus datos de uso pueden pasar por sus servidores.
• **Proveedores de CDN**: Podemos usar redes de distribución de contenido para mejorar los tiempos de carga.

Estos terceros tienen sus propias políticas de privacidad que rigen el uso de los datos. Te animamos a revisar sus políticas.`,
    },
    {
      id: 'data-security',
      title: '6. Seguridad de los Datos',
      content: `Tomamos medidas técnicas y organizativas razonables para proteger cualquier información recopilada frente a accesos no autorizados, alteración, divulgación o destrucción. Sin embargo, ningún método de transmisión por internet ni de almacenamiento electrónico es 100% seguro, por lo que no podemos garantizar una seguridad absoluta.

No almacenamos información personal o financiera sensible. Nuestra base de datos de predicciones contiene únicamente datos públicos de partidos de fútbol.`,
    },
    {
      id: 'childrens-privacy',
      title: '7. Privacidad de los Menores',
      content: `Nuestro Servicio no está dirigido a personas menores de 18 años. No recopilamos conscientemente información de identificación personal de menores de 18 años. Si eres madre, padre o tutor y crees que tu hijo/a nos ha proporcionado datos personales, contáctanos para que podamos tomar las medidas adecuadas.`,
    },
    {
      id: 'your-rights',
      title: '8. Tus Derechos (RGPD)',
      content: `Si te encuentras en el Espacio Económico Europeo (EEE), tienes ciertos derechos de protección de datos conforme al Reglamento General de Protección de Datos (RGPD):

• **Derecho de acceso**: Solicitar una copia de los datos personales que tenemos sobre ti.
• **Derecho de rectificación**: Solicitar la corrección de datos personales inexactos.
• **Derecho de supresión**: Solicitar la eliminación de tus datos personales cuando no exista base legal para conservarlos.
• **Derecho de oposición**: Oponerte al tratamiento de tus datos personales.
• **Derecho a la portabilidad de los datos**: Solicitar la transferencia de tus datos en un formato legible por máquina.
• **Derecho a retirar el consentimiento**: Retirar tu consentimiento de cookies en cualquier momento, tal como se describe en la Sección 4.

Como recopilamos datos mínimos y no requerimos registro, la mayoría de estos derechos ya están satisfechos por la propia naturaleza de nuestro Servicio. Si tienes solicitudes específicas, contáctanos con los datos que aparecen a continuación.`,
    },
    {
      id: 'changes',
      title: '9. Cambios en esta Política',
      content: `Podemos actualizar esta Política de Privacidad de vez en cuando. Te notificaremos cualquier cambio actualizando la fecha de "Última actualización" en la parte superior de esta página. El uso continuado del Servicio después de cualquier cambio constituye tu aceptación de la nueva Política de Privacidad. Te animamos a revisar esta página periódicamente.`,
    },
    {
      id: 'contact',
      title: '10. Contáctanos',
      content: `Si tienes alguna pregunta sobre esta Política de Privacidad, contáctanos en:

**Goal Genius**
Email: ignaciomedinar@gmail.com
Sitio web: www.goal-genius.net`,
    },
  ],
} as const;

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

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('privacy');
  const sections = sectionsByLocale[locale === 'es' ? 'es' : 'en'];

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
