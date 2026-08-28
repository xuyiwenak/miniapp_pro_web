import { useRef, useState } from 'react';
import type { ChangeEvent, DragEvent, RefObject } from 'react';
import { ImagePlus, LockKeyhole } from 'lucide-react';
import type { Locale } from '../i18n/copy';
import { COPY } from '../i18n/copy';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const ACCEPTED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export type ArtworkProgress = {
  phase: 'uploading' | 'analyzing';
  percent: number;
};

type UploadCanvasProps = {
  locale: Locale;
  onSubmit: (
    file: File,
    description: string,
    onProgress: (progress: ArtworkProgress) => void,
  ) => Promise<void>;
};

type FilePickerProps = {
  disabled: boolean;
  file: File | null;
  inputRef: RefObject<HTMLInputElement | null>;
  locale: Locale;
  onSelect: (file: File | undefined) => void;
};

function getFileError(file: File, locale: Locale): string | null {
  if (ACCEPTED_TYPES.has(file.type) && file.size <= MAX_FILE_SIZE_BYTES) return null;
  return locale === 'zh-CN'
    ? '请选择 10MB 以内的 JPG、PNG 或 WEBP 图片。'
    : 'Choose a JPG, PNG, or WEBP image under 10 MB.';
}

function FilePicker({ disabled, file, inputRef, locale, onSelect }: FilePickerProps) {
  function handleDrop(event: DragEvent<HTMLButtonElement>): void {
    event.preventDefault();
    onSelect(event.dataTransfer.files[0]);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    onSelect(event.target.files?.[0]);
  }

  return (
    <>
      <input ref={inputRef} className="sr-only" type="file" accept="image/jpeg,image/png,image/webp"
        disabled={disabled} onChange={handleChange} />
      <button className="upload-canvas__zone" type="button" disabled={disabled}
        onClick={() => inputRef.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={handleDrop}>
        <ImagePlus className="upload-canvas__icon" aria-hidden="true" />
        <strong>{file?.name ?? COPY[locale].dropzoneTitle}</strong>
      </button>
    </>
  );
}

function ProgressFeedback({ locale, progress }: { locale: Locale; progress: ArtworkProgress }) {
  const isAnalyzing = progress.phase === 'analyzing';
  const label = isAnalyzing ? COPY[locale].analyzing : COPY[locale].uploading;
  const hint = isAnalyzing ? COPY[locale].analysisProgressHint : COPY[locale].uploadProgressHint;
  return (
    <div className="upload-progress" aria-live="polite" aria-busy="true">
      <div className="upload-progress__heading">
        <strong>{label}</strong>
        <span>{progress.percent}%</span>
      </div>
      <progress max="100" value={progress.percent} aria-label={label} />
      <p>{hint}</p>
    </div>
  );
}

export function UploadCanvas({ locale, onSubmit }: UploadCanvasProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [feeling, setFeeling] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<ArtworkProgress | null>(null);
  const isProcessing = progress !== null;

  function selectFile(nextFile: File | undefined): void {
    if (!nextFile) return;
    const nextError = getFileError(nextFile, locale);
    setError(nextError);
    if (!nextError) setFile(nextFile);
  }

  async function submitFile(): Promise<void> {
    if (!file) return;
    setError(null);
    setProgress({ phase: 'uploading', percent: 0 });
    try {
      await onSubmit(file, [title.trim(), feeling.trim()].filter(Boolean).join(' · '), setProgress);
    } catch {
      setProgress(null);
      setError(COPY[locale].processingError);
    }
  }

  const buttonLabel = progress?.phase === 'analyzing' ? COPY[locale].analyzing : COPY[locale].uploading;
  return (
    <section className="upload-canvas">
      <FilePicker disabled={isProcessing} file={file} inputRef={inputRef} locale={locale} onSelect={selectFile} />
      <div className="upload-canvas__fields">
        <label>
          <span>{locale === 'zh-CN' ? '标题（可选）' : 'Title (optional)'}</span>
          <input disabled={isProcessing} value={title} onChange={(event) => setTitle(event.target.value)} />
        </label>
        <label>
          <span>{locale === 'zh-CN' ? '此刻的感受（可选）' : 'How this moment feels (optional)'}</span>
          <input disabled={isProcessing} value={feeling} onChange={(event) => setFeeling(event.target.value)} />
        </label>
      </div>
      {progress && <ProgressFeedback locale={locale} progress={progress} />}
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="upload-canvas__footer">
        <span><LockKeyhole aria-hidden="true" />{locale === 'zh-CN' ? '仅自己可见' : 'Only you'}</span>
        <button className="primary-button" type="button" disabled={!file || isProcessing} onClick={submitFile}>
          {isProcessing ? buttonLabel : (locale === 'zh-CN' ? '保存并解读' : 'Save & reflect')}
        </button>
      </div>
    </section>
  );
}
