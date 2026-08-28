import { Languages } from 'lucide-react';
import type { Locale } from '../i18n/copy';
import { COPY } from '../i18n/copy';

type LocaleToggleProps = {
  locale: Locale;
  onChange: (locale: Locale) => void;
};

export function LocaleToggle({ locale, onChange }: LocaleToggleProps) {
  const nextLocale: Locale = locale === 'zh-CN' ? 'en' : 'zh-CN';
  return (
    <button className="locale-toggle" type="button" onClick={() => onChange(nextLocale)}>
      <Languages aria-hidden="true" />
      {COPY[locale].language}
    </button>
  );
}
