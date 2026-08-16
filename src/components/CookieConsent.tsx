'use client';

import { useSyncExternalStore } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export const COOKIE_CONSENT_KEY = 'cookie-consent';
export const COOKIE_CONSENT_EVENT = 'cookie-consent-changed';

export type ConsentValue = 'accepted' | 'declined';

function readConsent(): ConsentValue | null {
  const value = window.localStorage.getItem(COOKIE_CONSENT_KEY);
  return value === 'accepted' || value === 'declined' ? value : null;
}

function subscribeToConsent(callback: () => void) {
  window.addEventListener(COOKIE_CONSENT_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(COOKIE_CONSENT_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}

function getServerConsent(): ConsentValue | null {
  return null;
}

export function useConsent(): ConsentValue | null {
  return useSyncExternalStore(subscribeToConsent, readConsent, getServerConsent);
}

function setStoredConsent(value: ConsentValue) {
  window.localStorage.setItem(COOKIE_CONSENT_KEY, value);
  window.dispatchEvent(new CustomEvent<ConsentValue>(COOKIE_CONSENT_EVENT, { detail: value }));
}

export default function CookieConsent() {
  const t = useTranslations('cookieConsent');
  const consent = useConsent();

  if (consent !== null) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/90 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center gap-4">
        <p className="text-sm text-muted-foreground flex-1">
          {t('message')}{' '}
          <Link href="/privacy" className="text-primary underline underline-offset-2 hover:text-primary/80">
            {t('learnMore')}
          </Link>
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setStoredConsent('declined')}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
          >
            {t('decline')}
          </button>
          <button
            type="button"
            onClick={() => setStoredConsent('accepted')}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {t('accept')}
          </button>
        </div>
      </div>
    </div>
  );
}
