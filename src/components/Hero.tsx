import { ArrowDown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Locale } from '../i18n/copy';
import { HOME_COPY } from '../i18n/homeCopy';
import { ResponsiveImage } from './ResponsiveImage';

export default function Hero({ locale }: { locale: Locale }) {
  const copy = HOME_COPY[locale];

  return (
    <section className="home-hero" id="top">
      <ResponsiveImage className="home-hero__image" name="b1" fetchPriority="high"
        alt={locale === 'zh-CN' ? '一排色彩鲜艳的彩色铅笔' : 'A row of vivid coloured pencils'} />
      <div className="home-hero__veil" aria-hidden="true" />
      <div className="home-hero__content">
        <p className="eyebrow home-hero__eyebrow">{copy.heroEyebrow}</p>
        <h1>{copy.heroTitle}</h1>
        <p className="home-hero__body">{copy.heroBody}</p>
        <Link className="primary-cta" to="/login" preventScrollReset state={{ loginOverlay: true }}>
          {copy.primaryAction}<ArrowRight size={18} />
        </Link>
      </div>
      <a className="scroll-cue" href="#philosophy"><ArrowDown size={16} /><span>{copy.scroll}</span></a>
    </section>
  );
}
