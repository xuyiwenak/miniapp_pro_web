import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Locale } from '../i18n/copy';
import { HOME_COPY } from '../i18n/homeCopy';
import { ResponsiveImage } from './ResponsiveImage';

type FooterProps = {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
};

const SECTION_TARGETS = ['philosophy', 'therapy', 'journey', 'gallery'] as const;

function FooterBrand({ tagline }: { tagline: string }) {
  return (
    <div className="footer-brand"><strong>原色有感</strong><span>ORIGINAL SENSE</span><p>{tagline}</p></div>
  );
}

export default function Footer({ locale, onLocaleChange }: FooterProps) {
  const copy = HOME_COPY[locale];
  return (
    <footer className="site-footer">
      <section className="closing-cta">
        <ResponsiveImage className="closing-cta__art" name="b7" alt="" aria-hidden="true" />
        <p className="eyebrow">{copy.closingLabel}</p><h2>{copy.closingTitle}</h2>
        <Link className="primary-cta" to="/login">{copy.primaryAction}<ArrowRight size={18} /></Link>
        <p>{copy.closingBody}</p>
      </section>
      <div className="footer-grid">
        <FooterBrand tagline={copy.tagline} />
        <div><h3>{copy.explore}</h3>{SECTION_TARGETS.map((target, index) => (
          <a key={target} href={`#${target}`}>{copy.nav[index]}</a>
        ))}</div>
        <div><h3>{copy.support}</h3><a href="#privacy">{copy.privacyPolicy}</a>
          <a href="#terms">{copy.terms}</a><a href="mailto:contact@starryspark.com.cn">{copy.contact}</a></div>
        <div><h3>{copy.language}</h3><button type="button"
          onClick={() => onLocaleChange(locale === 'zh-CN' ? 'en' : 'zh-CN')}>中文 / ENGLISH</button></div>
      </div>
      <div className="footer-bottom"><span>© 2026 原色有感</span><span>arttherapy.starryspark.com.cn</span></div>
    </footer>
  );
}
