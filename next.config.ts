import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // Exclude ads.txt/robots.txt/sitemap.xml: Google's site-ownership
        // verification fetches these directly and won't follow a redirect.
        source: '/:path((?!ads\\.txt|robots\\.txt|sitemap\\.xml).*)',
        has: [{ type: 'host', value: 'goal-genius.net' }],
        destination: 'https://www.goal-genius.net/:path',
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
