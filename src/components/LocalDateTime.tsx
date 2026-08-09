'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { formatDate, formatTime } from '@/lib/utils';

// The API now sends a real UTC instant for every match date_time (see
// src/lib/database.ts). Formatting it happens here, client-side, because
// that's the only place the visitor's own timezone is known -- the server
// has no idea where the browser is. Rendering nothing until mount avoids a
// hydration mismatch between the server's timezone and the visitor's
// (same pattern as ClientWrapper.tsx elsewhere in this app).
function useHasMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

function useDateLocale() {
  const locale = useLocale();
  return locale === 'es' ? 'es-ES' : 'en-US';
}

export function LocalDate({ date }: { date: string | Date }) {
  const mounted = useHasMounted();
  const dateLocale = useDateLocale();
  if (!mounted) return null;
  return <>{formatDate(date, dateLocale)}</>;
}

export function LocalTime({ date }: { date: string | Date }) {
  const mounted = useHasMounted();
  const dateLocale = useDateLocale();
  if (!mounted) return null;
  return <>{formatTime(date, dateLocale)}</>;
}
