import { FileImage, PenLine, StickyNote } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTodayTip, listWorks, type WorkItem } from '../api/mandis';
import type { Locale } from '../i18n/copy';

const DEFAULT_PROMPT = {
  'zh-CN': '如果情绪有颜色，它今天会是什么样的？',
  en: 'If your feelings had a colour, what would they look like today?',
} as const;

type TodayPageProps = { locale: Locale; token: string };

export function TodayPage({ locale, token }: TodayPageProps) {
  const [todayTip, setTodayTip] = useState('');
  const [latestWork, setLatestWork] = useState<WorkItem | null>(null);

  useEffect(() => {
    void Promise.all([getTodayTip(token), listWorks(token)])
      .then(([tip, works]) => {
        setTodayTip(tip.content);
        setLatestWork(works[0] ?? null);
      })
      .catch(() => undefined);
  }, [locale, token]);

  const actions = [
    { to: '/upload', icon: FileImage, label: locale === 'zh-CN' ? '上传作品' : 'Upload art' },
    { to: '/upload?mode=words', icon: PenLine, label: locale === 'zh-CN' ? '写一句话' : 'Write a line' },
    { to: '/upload?mode=card', icon: StickyNote, label: locale === 'zh-CN' ? '文字卡' : 'Text card' },
  ];

  return (
    <main className="workspace today-page">
      <section className="workspace__heading"><h1>{locale === 'zh-CN' ? '今天，留一点给自己' : 'Leave a little space for yourself'}</h1></section>
      <section className="today-prompt"><p>{todayTip || DEFAULT_PROMPT[locale]}</p></section>
      <nav className="today-actions" aria-label={locale === 'zh-CN' ? '创作方式' : 'Create'}>
        {actions.map(({ to, icon: Icon, label }) => <Link key={to} to={to}><Icon aria-hidden="true" />{label}</Link>)}
      </nav>
      {latestWork && <Link className="continue-work" to={`/reports/${latestWork.workId}`}>
        <span>{locale === 'zh-CN' ? '继续上次创作' : 'Continue your last creation'}</span>
        <img src={latestWork.coverUrl} alt="" />
        <strong aria-hidden="true">→</strong>
      </Link>}
    </main>
  );
}
