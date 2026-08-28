import { NavLink } from 'react-router-dom';
import { Compass, Flower2, Images, NotebookPen, PieChart, UserRound } from 'lucide-react';
import type { Locale } from '../i18n/copy';
import { BrandMark } from './BrandMark';

type SideNavProps = { locale: Locale };

const NAV_ITEMS = [
  { to: '/today', icon: Flower2, zh: '今天', en: 'Today' },
  { to: '/upload', icon: NotebookPen, zh: '创作', en: 'Create' },
  { to: '/gallery', icon: Images, zh: '画廊', en: 'Gallery' },
  { to: '/explore', icon: Compass, zh: '探索', en: 'Explore' },
  { to: '/reports', icon: PieChart, zh: '报告', en: 'Reports' },
  { to: '/profile', icon: UserRound, zh: '我的', en: 'Me' },
];

export function SideNav({ locale }: SideNavProps) {
  return (
    <aside className="side-nav">
      <div className="side-nav__brand"><BrandMark locale={locale} /><small>ORIGINAL SENSE</small></div>
      <nav className="side-nav__links" aria-label="Primary navigation">
        {NAV_ITEMS.map(({ to, icon: Icon, zh, en }) => (
          <NavLink key={to} className="side-nav__link" to={to} end={to !== '/reports'}>
            <Icon aria-hidden="true" />
            {locale === 'zh-CN' ? zh : en}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
