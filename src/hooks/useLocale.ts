import { useEffect, useState } from 'react';
import type { Locale } from '../i18n/copy';

const LOCALE_STORAGE_KEY = 'original-sense-locale';
const DEFAULT_LOCALE: Locale = 'zh-CN';

function readStoredLocale(): Locale {
  try {
    return localStorage.getItem(LOCALE_STORAGE_KEY) === 'en' ? 'en' : DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}

export function useLocale(): [Locale, (locale: Locale) => void] {
  const [locale, setLocale] = useState<Locale>(readStoredLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
      // The selected locale still applies for this session when storage is unavailable.
    }
  }, [locale]);

  return [locale, setLocale];
}
