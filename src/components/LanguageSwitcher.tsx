'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleSwitch = (newLocale: string) => {
    if (newLocale === locale) return;
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center border border-border rounded-lg overflow-hidden text-xs font-medium">
      <button
        onClick={() => handleSwitch('en')}
        className={`px-2.5 py-1.5 transition-colors ${
          locale === 'en'
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => handleSwitch('es')}
        className={`px-2.5 py-1.5 transition-colors ${
          locale === 'es'
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
        }`}
      >
        ES
      </button>
    </div>
  );
}
