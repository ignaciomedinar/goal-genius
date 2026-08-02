import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'goal-genius.net' }],
        destination: 'https://www.goal-genius.net/:path*',
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
