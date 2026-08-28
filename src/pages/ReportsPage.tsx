import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { listReports, type ReportItem } from '../api/mandis';
import type { Locale } from '../i18n/copy';

type ReportsPageProps = { locale: Locale; token: string };

export function ReportsPage({ locale, token }: ReportsPageProps) {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    listReports(token)
      .then(setReports)
      .catch(() => setError(locale === 'zh-CN' ? '暂时无法读取报告。' : 'Reports are unavailable right now.'));
  }, [locale, token]);

  if (reports[0]) return <Navigate to={`/reports/${reports[0].workId}`} replace />;
  return <main className="workspace report-empty"><h1>{locale === 'zh-CN' ? '作品解读' : 'Art reflections'}</h1>
    <p className={error ? 'form-error' : ''}>{error || (locale === 'zh-CN'
      ? '完成第一幅作品后，温和的观察会出现在这里。'
      : 'A gentle reflection will appear here after your first artwork.')}</p></main>;
}
