import { useEffect, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Locale } from '../i18n/copy';
import { HOME_COPY } from '../i18n/homeCopy';

type NavbarProps = {
  isAuthenticated: boolean;
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
};

const NAV_TARGETS = ['philosophy', 'therapy', 'journey', 'gallery'] as const;

function BrandLink() {
  return (
    <a className="home-brand" href="#top" aria-label="原色有感首页">
      <strong>原色有感</strong>
      <span>ORIGINAL SENSE</span>
    </a>
  );
}

export default function Navbar({ isAuthenticated, locale, onLocaleChange }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const copy = HOME_COPY[locale];

  useEffect(() => {
    const updateHeader = () => setIsScrolled(window.scrollY > 24);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
    return () => window.removeEventListener('scroll', updateHeader);
  }, []);

  return (
    <header className={`home-header${isScrolled ? ' is-scrolled' : ''}`}>
      <div className="announcement"><span>{copy.announcement}</span><span aria-hidden="true">✦</span></div>
      <nav className="home-nav" aria-label="Primary navigation">
        <BrandLink />
        <div className={`home-nav__links${menuOpen ? ' is-open' : ''}`}>
          {NAV_TARGETS.map((target, index) => (
            <a key={target} href={`#${target}`} onClick={() => setMenuOpen(false)}>{copy.nav[index]}</a>
          ))}
        </div>
        <div className="home-nav__actions">
          <button className="language-switch" type="button"
            aria-label={locale === 'zh-CN' ? 'Switch to English' : '切换至中文'}
            onClick={() => onLocaleChange(locale === 'zh-CN' ? 'en' : 'zh-CN')}>
            <span className={locale === 'zh-CN' ? 'is-active' : ''}>中</span><i>/</i>
            <span className={locale === 'en' ? 'is-active' : ''}>EN</span>
          </button>
          <Link className="nav-login" to={isAuthenticated ? '/upload' : '/login'}>
            {isAuthenticated ? copy.enterStudio : copy.login}<ArrowUpRight size={16} />
          </Link>
          <button className="mobile-menu" type="button" aria-expanded={menuOpen}
            aria-label={copy.menu} onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>
    </header>
  );
}
