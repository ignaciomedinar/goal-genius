'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import LanguageSwitcher from './LanguageSwitcher';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations('nav');

  return (
    <header className="border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-background/95">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">⚽</span>
            </div>
            <div>
              <h1 className="font-display font-bold text-xl text-foreground">Goal Genius</h1>
              <p className="text-xs text-muted-foreground">{t('tagline')}</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              {t('home')}
            </Link>
            <Link
              href="/predictions"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              {t('predictions')}
            </Link>
            <Link
              href="/results"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              {t('results')}
            </Link>
            <LanguageSwitcher />
          </nav>

          {/* Mobile: language switcher + menu button */}
          <div className="md:hidden flex items-center gap-3">
            <LanguageSwitcher />
            <button
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <span className="text-2xl">✕</span> : <span className="text-2xl">☰</span>}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border pt-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-foreground hover:text-primary transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('home')}
              </Link>
              <Link
                href="/predictions"
                className="text-foreground hover:text-primary transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('predictions')}
              </Link>
              <Link
                href="/results"
                className="text-foreground hover:text-primary transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('results')}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
