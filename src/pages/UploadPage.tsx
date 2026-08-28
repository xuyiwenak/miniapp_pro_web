import type { Locale } from '../i18n/copy';
import type { ArtworkProgress } from '../components/UploadCanvas';
import { UploadCanvas } from '../components/UploadCanvas';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

type UploadPageProps = {
  locale: Locale;
  onSubmit: (
    file: File,
    description: string,
    onProgress: (progress: ArtworkProgress) => void,
  ) => Promise<void>;
};

export function UploadPage({ locale, onSubmit }: UploadPageProps) {
  return (
    <main className="workspace">
      <section className="workspace__heading workspace__heading--with-back">
        <Link className="icon-button" to="/today" aria-label={locale === 'zh-CN' ? '返回今天' : 'Back to today'}>
          <ArrowLeft aria-hidden="true" />
        </Link>
        <h1>{locale === 'zh-CN' ? '上传一幅作品' : 'Upload an artwork'}</h1>
      </section>
      <UploadCanvas locale={locale} onSubmit={onSubmit} />
    </main>
  );
}
