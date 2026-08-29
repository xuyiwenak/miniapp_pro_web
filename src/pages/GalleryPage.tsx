import { Filter, Grid2X2, LockKeyhole, Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { listWorks, type WorkItem } from '../api/mandis';
import type { Locale } from '../i18n/copy';

type GalleryPageProps = { locale: Locale; token: string };
type WorkGroup = { key: string; label: string; works: WorkItem[] };

const CARD_ANGLE_COUNT = 5;

function formatMonth(date: string, locale: Locale): string {
  const value = new Date(date);
  return locale === 'zh-CN'
    ? `${value.getFullYear()}年${value.getMonth() + 1}月`
    : value.toLocaleDateString('en', { month: 'long', year: 'numeric' });
}

function groupWorksByMonth(works: WorkItem[], locale: Locale): WorkGroup[] {
  const groups = new Map<string, WorkItem[]>();
  works.forEach((work) => {
    const date = new Date(work.createdAt);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    groups.set(key, [...(groups.get(key) ?? []), work]);
  });
  return Array.from(groups, ([key, groupedWorks]) => ({
    key,
    label: formatMonth(groupedWorks[0].createdAt, locale),
    works: groupedWorks,
  }));
}

function GalleryToolbar({ locale, publicOnly, compactGrid, onSearch, onFilter, onGrid }: {
  locale: Locale;
  publicOnly: boolean;
  compactGrid: boolean;
  onSearch: () => void;
  onFilter: () => void;
  onGrid: () => void;
}) {
  const isChinese = locale === 'zh-CN';
  return <div className="gallery-toolbar" aria-label={isChinese ? '画廊工具' : 'Gallery tools'}>
    <button className="icon-button" type="button" onClick={onSearch}
      aria-label={isChinese ? '搜索作品' : 'Search artworks'}><Search /></button>
    <button className="icon-button" type="button" onClick={onFilter} aria-pressed={publicOnly}
      aria-label={isChinese ? '只看公开作品' : 'Show public works only'}><Filter /></button>
    <button className="icon-button" type="button" onClick={onGrid} aria-pressed={compactGrid}
      aria-label={isChinese ? '紧凑视图' : 'Compact view'}><Grid2X2 /></button>
  </div>;
}

function ArtworkCard({ work, index, locale, featured = false }: {
  work: WorkItem;
  index: number;
  locale: Locale;
  featured?: boolean;
}) {
  const title = work.desc || (locale === 'zh-CN' ? '未命名作品' : 'Untitled');
  const date = new Date(work.createdAt).toLocaleDateString(locale, { month: 'short', day: 'numeric' });
  const classes = `art-tile art-tile--angle-${index % CARD_ANGLE_COUNT}${featured ? ' art-tile--featured' : ''}`;
  return <Link className={classes} to={`/reports/${work.workId}`}>
    <img className="art-tile__clip" src="/assets/gallery/acrylic-clip.png" alt="" aria-hidden="true" />
    <figure>
      <div className="art-tile__image"><img src={work.coverUrl} alt={title} loading="lazy" /></div>
      <figcaption><strong>{title}</strong><span>{date}</span>
        {!work.onWall && <LockKeyhole aria-label={locale === 'zh-CN' ? '仅自己可见' : 'Private'} />}
      </figcaption>
    </figure>
  </Link>;
}

function WallNote({ tone, children }: { tone: 'yellow' | 'pink'; children: string }) {
  return <aside className={`gallery-wall-note gallery-wall-note--${tone}`} aria-label={children}>
    <img src="/assets/gallery/masking-tape.png" alt="" aria-hidden="true" />
    <span>{children}</span>
  </aside>;
}

function MonthSection({ group, locale, compactGrid }: {
  group: WorkGroup;
  locale: Locale;
  compactGrid: boolean;
}) {
  const [featuredWork, ...otherWorks] = group.works;
  const firstNote = locale === 'zh-CN' ? '今天\n很开心 ♡' : 'A happy\nday ♡';
  const secondNote = locale === 'zh-CN' ? '慢慢\n看见自己' : 'Seeing myself\nmore clearly';
  return <section className="gallery-month-section" aria-labelledby={`month-${group.key}`}>
    <header className="gallery-month"><h2 id={`month-${group.key}`}>{group.label}</h2>
      <span>{locale === 'zh-CN' ? `${group.works.length} 幅作品` : `${group.works.length} works`}</span>
    </header>
    <div className={`art-grid${compactGrid ? ' art-grid--compact' : ''}`}>
      <ArtworkCard work={featuredWork} index={0} locale={locale} featured={!compactGrid} />
      {otherWorks.slice(0, 1).map((work, index) => <ArtworkCard key={work.workId} work={work}
        index={index + 1} locale={locale} />)}
      {!compactGrid && <WallNote tone="yellow">{firstNote}</WallNote>}
      {otherWorks.slice(1, 4).map((work, index) => <ArtworkCard key={work.workId} work={work}
        index={index + 2} locale={locale} />)}
      {!compactGrid && <WallNote tone="pink">{secondNote}</WallNote>}
      {otherWorks.slice(4).map((work, index) => <ArtworkCard key={work.workId} work={work}
        index={index + 5} locale={locale} />)}
    </div>
  </section>;
}

export function GalleryPage({ locale, token }: GalleryPageProps) {
  const [works, setWorks] = useState<WorkItem[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [publicOnly, setPublicOnly] = useState(false);
  const [compactGrid, setCompactGrid] = useState(false);
  const isChinese = locale === 'zh-CN';

  useEffect(() => { void listWorks(token).then(setWorks).catch(() => setWorks([])); }, [token]);
  const filteredWorks = useMemo(() => works.filter((work) => {
    const matchesQuery = work.desc.toLowerCase().includes(query.trim().toLowerCase());
    return matchesQuery && (!publicOnly || work.onWall);
  }), [publicOnly, query, works]);
  const groups = useMemo(() => groupWorksByMonth(filteredWorks, locale), [filteredWorks, locale]);

  return <main className="workspace gallery-page">
    <header className="gallery-header"><div><h1>{isChinese ? '我的画廊' : 'My gallery'}</h1>
      <p>{isChinese ? '把每一次表达，轻轻留在这里。' : 'A quiet place for every expression.'}</p>
    </div><GalleryToolbar locale={locale} publicOnly={publicOnly} compactGrid={compactGrid}
      onSearch={() => setSearchOpen((open) => !open)} onFilter={() => setPublicOnly((active) => !active)}
      onGrid={() => setCompactGrid((active) => !active)} /></header>
    {searchOpen && <label className="gallery-search"><Search aria-hidden="true" />
      <span className="sr-only">{isChinese ? '搜索作品' : 'Search artworks'}</span>
      <input autoFocus value={query} placeholder={isChinese ? '搜索作品里的文字…' : 'Search your notes…'}
        onChange={(event) => setQuery(event.target.value)} />
      {query && <button type="button" onClick={() => setQuery('')}
        aria-label={isChinese ? '清除搜索' : 'Clear search'}><X /></button>}</label>}
    <div className="gallery-wall">
      {groups.map((group) => <MonthSection key={group.key} group={group} locale={locale}
        compactGrid={compactGrid} />)}
      {filteredWorks.length === 0 && <p className="workspace-empty">{isChinese
        ? '这里还空着。完成一幅创作，就能把它夹上墙。'
        : 'This wall is waiting for your first creation.'}</p>}
    </div>
  </main>;
}
