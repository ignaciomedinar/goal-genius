'use client';

import Script from 'next/script';
import { useConsent } from '@/components/CookieConsent';

export default function ConsentScripts() {
  const consent = useConsent();

  if (consent !== 'accepted') return null;

  return (
    <>
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
    </>
  );
}
