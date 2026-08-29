import { Compass, Expand, Heart, X } from 'lucide-react';
import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { listPublicWorks, type PublicWorkItem } from '../api/mandis';
import type { Locale } from '../i18n/copy';

const ABOVE_FOLD_WORK_COUNT = 3;
const FALLBACK_WORKS: PublicWorkItem[] = [
  { url: '/images/optimized/b2.webp', desc: '潮汐之间' },
  { url: '/images/optimized/b3.webp', desc: '水脉' },
  { url: '/images/optimized/b4.webp', desc: '远与近' },
  { url: '/images/optimized/b5.webp', desc: '无定之岸' },
  { url: '/images/optimized/b6.webp', desc: '雾中山脉' },
  { url: '/images/optimized/b7.webp', desc: '裂隙生长' },
  { url: '/images/optimized/b8.webp', desc: '光落下的地方' },
];

type ExplorePageProps = { locale: Locale; token: string };

function shuffleWorks(items: PublicWorkItem[]): PublicWorkItem[] {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }
  return shuffled;
}

function getWorkKey(work: PublicWorkItem): string {
  return work.workId ?? `${work.url}-${work.desc}`;
}

function ArtworkCard({ work, index, locale, liked, onOpen, onLike }: {
  work: PublicWorkItem;
  index: number;
  locale: Locale;
  liked: boolean;
  onOpen: () => void;
  onLike: () => void;
}) {
  const isChinese = locale === 'zh-CN';
  const title = work.desc || (isChinese ? '未命名' : 'Untitled');
  const openLabel = isChinese ? `查看完整作品：${title}` : `View full artwork: ${title}`;
  return <article className="public-art-card">
    <button className="public-art-card__preview" type="button" onClick={onOpen} aria-label={openLabel}>
      <img src={work.url} alt={title} loading={index < ABOVE_FOLD_WORK_COUNT ? 'eager' : 'lazy'} />
      <span className="public-art-card__overlay" aria-hidden="true">
        <Expand />{isChinese ? '查看完整作品' : 'View full artwork'}
      </span>
      <Expand className="public-art-card__touch-hint" aria-hidden="true" />
    </button>
    <footer><strong>{title}</strong><button type="button" className={liked ? 'is-liked' : ''}
      aria-label={isChinese ? `共鸣于${title}` : `Resonate with ${title}`} aria-pressed={liked}
      onClick={onLike}><Heart aria-hidden="true" />{liked ? 1 : 0}</button></footer>
  </article>;
}

function ArtworkDialog({ work, locale, onClose }: {
  work: PublicWorkItem;
  locale: Locale;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const isChinese = locale === 'zh-CN';
  const title = work.desc || (isChinese ? '未命名' : 'Untitled');

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  function closeDialog(): void {
    dialogRef.current?.close();
  }

  function closeFromBackdrop(event: MouseEvent<HTMLDialogElement>): void {
    if (event.target === event.currentTarget) closeDialog();
  }

  return <dialog className="artwork-dialog" ref={dialogRef} onClose={onClose} onClick={closeFromBackdrop}>
    <figure><img src={work.url} alt={title} /><figcaption>{title}</figcaption></figure>
    <button className="artwork-dialog__close" type="button" onClick={closeDialog}
      aria-label={isChinese ? '关闭完整作品' : 'Close full artwork'}><X aria-hidden="true" /></button>
  </dialog>;
}

export function ExplorePage({ locale, token }: ExplorePageProps) {
  const [works, setWorks] = useState<PublicWorkItem[]>(() => shuffleWorks(FALLBACK_WORKS));
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [selectedWork, setSelectedWork] = useState<PublicWorkItem | null>(null);

  useEffect(() => {
    let active = true;
    void listPublicWorks(token).then((items) => {
      if (active && items.length) setWorks(shuffleWorks(items));
    }).catch(() => undefined);
    return () => { active = false; };
  }, [token]);

  function toggleLike(key: string): void {
    setLiked((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }

  const isChinese = locale === 'zh-CN';
  return <main className="workspace explore-page">
    <header className="exhibition-header"><div><span>{isChinese ? '本月公开作品展' : 'PUBLIC EXHIBITION'}</span>
      <h1>{isChinese ? '边界与流动' : 'Boundaries in motion'}</h1></div>
      <Link to="/upload"><Compass aria-hidden="true" />{isChinese ? '参与主题' : 'Join theme'}</Link></header>
    <section className="public-art-grid" aria-label={isChinese ? '随机公开作品' : 'Random public artworks'}>
      {works.map((work, index) => {
        const key = getWorkKey(work);
        return <ArtworkCard key={key} work={work} index={index} locale={locale} liked={liked.has(key)}
          onOpen={() => setSelectedWork(work)} onLike={() => toggleLike(key)} />;
      })}
    </section>
    {selectedWork && <ArtworkDialog work={selectedWork} locale={locale} onClose={() => setSelectedWork(null)} />}
  </main>;
}
