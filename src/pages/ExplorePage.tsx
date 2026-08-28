import { Compass, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listPublicWorks, type PublicWorkItem } from '../api/mandis';
import type { Locale } from '../i18n/copy';

const FALLBACK_WORKS: PublicWorkItem[] = [
  { url: '/images/optimized/b2.webp', desc: '潮汐之间' },
  { url: '/images/optimized/b3.webp', desc: '水脉' },
  { url: '/images/optimized/b4.webp', desc: '远与近' },
  { url: '/images/optimized/b5.webp', desc: '无定之岸' },
  { url: '/images/optimized/b6.webp', desc: '雾中山脉' },
  { url: '/images/optimized/b7.webp', desc: '裂隙生长' },
];

type ExplorePageProps = { locale: Locale; token: string };

export function ExplorePage({ locale, token }: ExplorePageProps) {
  const [works, setWorks] = useState<PublicWorkItem[]>(FALLBACK_WORKS);
  const [liked, setLiked] = useState<Set<number>>(new Set());

  useEffect(() => {
    void listPublicWorks(token).then((items) => setWorks(items.length ? items.slice(0, 6) : FALLBACK_WORKS)).catch(() => undefined);
  }, [token]);

  function toggleLike(index: number): void {
    setLiked((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index); else next.add(index);
      return next;
    });
  }

  return (
    <main className="workspace explore-page">
      <header className="exhibition-header"><div><span>{locale === 'zh-CN' ? '本月公开作品展' : 'PUBLIC EXHIBITION'}</span><h1>{locale === 'zh-CN' ? '边界与流动' : 'Boundaries in motion'}</h1></div><Link to="/upload"><Compass />{locale === 'zh-CN' ? '参与主题' : 'Join theme'}</Link></header>
      <section className="public-art-grid">
        {works.map((work, index) => <article key={work.workId ?? `${work.url}-${index}`}><img src={work.url} alt={work.desc} /><footer><strong>{work.desc || (locale === 'zh-CN' ? '未命名' : 'Untitled')}</strong><button type="button" className={liked.has(index) ? 'is-liked' : ''} aria-pressed={liked.has(index)} onClick={() => toggleLike(index)}><Heart aria-hidden="true" />{liked.has(index) ? 1 : 0}</button></footer></article>)}
      </section>
    </main>
  );
}
