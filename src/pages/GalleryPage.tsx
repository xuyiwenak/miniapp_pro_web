import { Filter, Grid2X2, LockKeyhole, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { listWorks, type WorkItem } from '../api/mandis';
import type { Locale } from '../i18n/copy';

type GalleryPageProps = { locale: Locale; token: string };

function monthLabel(date: string, locale: Locale): string {
  const value = new Date(date);
  return locale === 'zh-CN'
    ? `${value.getFullYear()}年${value.getMonth() + 1}月`
    : value.toLocaleDateString('en', { month: 'long', year: 'numeric' });
}

export function GalleryPage({ locale, token }: GalleryPageProps) {
  const [works, setWorks] = useState<WorkItem[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [publicOnly, setPublicOnly] = useState(false);
  const [compactGrid, setCompactGrid] = useState(false);

  useEffect(() => { void listWorks(token).then(setWorks).catch(() => setWorks([])); }, [token]);

  const filteredWorks = useMemo(() => works.filter((work) => {
    const matchesQuery = work.desc.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (!publicOnly || work.onWall);
  }), [publicOnly, query, works]);
  const label = filteredWorks[0] ? monthLabel(filteredWorks[0].createdAt, locale) : '';

  return (
    <main className="workspace gallery-page">
      <header className="gallery-header"><h1>{locale === 'zh-CN' ? '我的画廊' : 'My gallery'}</h1><div>
        <button className="icon-button" type="button" onClick={() => setSearchOpen((open) => !open)} aria-label="Search"><Search /></button>
        <button className="icon-button" type="button" aria-label="Filter" aria-pressed={publicOnly}
          onClick={() => setPublicOnly((active) => !active)}><Filter /></button>
        <button className="icon-button" type="button" aria-label="Grid view" aria-pressed={compactGrid}
          onClick={() => setCompactGrid((active) => !active)}><Grid2X2 /></button>
      </div></header>
      {searchOpen && <input className="gallery-search" autoFocus value={query} placeholder={locale === 'zh-CN' ? '搜索作品' : 'Search artworks'} onChange={(event) => setQuery(event.target.value)} />}
      {label && <h2 className="gallery-month">{label}</h2>}
      <section className={`art-grid${compactGrid ? ' art-grid--compact' : ''}`}>
        {filteredWorks.map((work) => <Link className="art-tile" key={work.workId} to={`/reports/${work.workId}`}>
          <img src={work.coverUrl} alt={work.desc || (locale === 'zh-CN' ? '我的作品' : 'My artwork')} />
          <span><strong>{work.desc || (locale === 'zh-CN' ? '未命名作品' : 'Untitled')}</strong><small>{new Date(work.createdAt).toLocaleDateString()}</small><LockKeyhole /></span>
        </Link>)}
      </section>
      {filteredWorks.length === 0 && <p className="workspace-empty">{locale === 'zh-CN' ? '还没有作品，从今天开始留下一幅吧。' : 'No artworks yet. Begin with one today.'}</p>}
    </main>
  );
}
