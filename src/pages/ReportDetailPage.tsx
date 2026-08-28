import { useEffect, useState } from 'react';
import { LayoutPanelTop, LockKeyhole, MessageSquareText, MoreHorizontal, Palette, PencilLine } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { getReport, updateReportPrivacy, type ReportDetail } from '../api/mandis';
import type { Locale } from '../i18n/copy';

type ReportDetailPageProps = { locale: Locale; token: string };

export function ReportDetailPage({ locale, token }: ReportDetailPageProps) {
  const { workId } = useParams();
  const [report, setReport] = useState<ReportDetail | null>(null);
  const [error, setError] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [responseOpen, setResponseOpen] = useState(false);
  const [response, setResponse] = useState('');

  useEffect(() => {
    if (!workId) return;
    getReport(workId, token).then(setReport).catch(() => {
      setError(locale === 'zh-CN' ? '暂时无法打开这份报告。' : 'This reflection is unavailable right now.');
    });
  }, [locale, token, workId]);

  if (error) return <main className="workspace"><p className="form-error">{error}</p></main>;
  if (!report) return <main className="workspace"><p>{locale === 'zh-CN' ? '正在打开报告…' : 'Opening reflection…'}</p></main>;
  const currentReport = report;
  const lineText = typeof currentReport.lineAnalysis === 'string'
    ? currentReport.lineAnalysis
    : currentReport.lineAnalysis?.interpretation ?? currentReport.lineAnalysis?.style;
  const sections = [
    { title: locale === 'zh-CN' ? '色彩' : 'Colour', content: currentReport.colorAnalysis, icon: Palette },
    { title: locale === 'zh-CN' ? '线条' : 'Line', content: lineText, icon: PencilLine },
    { title: locale === 'zh-CN' ? '空间' : 'Space', content: currentReport.compositionReport ?? currentReport.summary,
      icon: LayoutPanelTop },
  ].filter((section) => Boolean(section.content));

  async function togglePrivacy(): Promise<void> {
    const nextValue = !currentReport.isPublic;
    await updateReportPrivacy(currentReport.workId, nextValue, token);
    setReport({ ...currentReport, isPublic: nextValue });
    setMenuOpen(false);
  }

  return (
    <main className="workspace report-detail-page">
      <header className="report-meta"><img src={report.coverUrl} alt="" /><h1>{report.desc || report.dominantEmotionLabel}</h1><span>·</span><time>{new Date(report.createdAt).toLocaleDateString()}</time>{!report.isPublic && <LockKeyhole aria-label={locale === 'zh-CN' ? '仅自己可见' : 'Private'} />}
        <div className="report-menu"><button className="icon-button" type="button" aria-label="More" onClick={() => setMenuOpen((open) => !open)}><MoreHorizontal /></button>{menuOpen && <div><button type="button" onClick={togglePrivacy}>{report.isPublic ? (locale === 'zh-CN' ? '设为私密' : 'Make private') : (locale === 'zh-CN' ? '公开分享' : 'Share publicly')}</button></div>}</div>
      </header>
      <div className="reflection-layout"><section className="observation"><h2>{locale === 'zh-CN' ? '我看见的' : 'What I notice'}</h2>{sections.map(({ title, content, icon: Icon }) => <article key={title}><Icon aria-hidden="true" /><div><h3>{title}</h3><p>{content}</p></div></article>)}</section>
        <aside className="self-response"><h2>{locale === 'zh-CN' ? '你的感受' : 'Your response'}</h2><p>{locale === 'zh-CN' ? '这段观察像你吗？' : 'Does this reflection feel like you?'}</p>{responseOpen ? <label><span className="sr-only">Response</span><textarea autoFocus value={response} onChange={(event) => setResponse(event.target.value)} /><button type="button" onClick={() => setResponseOpen(false)}>{locale === 'zh-CN' ? '保存' : 'Save'}</button></label> : <button className="response-action" type="button" onClick={() => setResponseOpen(true)}><MessageSquareText />{locale === 'zh-CN' ? '写下回应' : 'Write a response'}</button>}</aside>
      </div>
    </main>
  );
}
