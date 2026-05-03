import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

const Footer = async () => {
  const t = await getTranslations('footer');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted border-t border-border">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold">⚽</span>
              </div>
              <h3 className="font-display font-bold text-lg">Goal Genius</h3>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              {t('description')}
            </p>
            <p className="text-sm text-muted-foreground">
              © {currentYear} Goal Genius. {t('allRightsReserved')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">{t('quickLinks')}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link href="/predictions" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('predictions')}
                </Link>
              </li>
              <li>
                <Link href="/results" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('results')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="font-semibold mb-4">{t('information')}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('aboutUs')}
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('howItWorks')}
                </Link>
              </li>
              <li>
                <Link href="/accuracy" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('ourAccuracy')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              {t('disclaimer')}
            </p>
            <div className="flex space-x-4">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {t('privacyPolicy')}
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {t('termsOfService')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
