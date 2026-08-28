import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from 'react';
import { LockKeyhole, X } from 'lucide-react';
import type { Locale } from '../i18n/copy';
import { COPY } from '../i18n/copy';
import {
  requestEmailLoginCode,
  requestSms,
  verifyEmailLogin,
  verifySms,
} from '../api/mandis';

type LoginMethod = 'email' | 'phone';

type LoginPageProps = {
  locale: Locale;
  onClose: () => void;
  onLogin: () => void;
};

type EmailFormProps = {
  locale: Locale;
  isBusy: boolean;
  onLogin: (email: string, code: string) => Promise<void>;
  onSendCode: (email: string) => Promise<void>;
};

type PhoneFormProps = {
  locale: Locale;
  isBusy: boolean;
  onLogin: (phone: string, code: string) => Promise<void>;
  onSendCode: (phone: string) => Promise<void>;
};

function EmailLoginForm({ locale, isBusy, onLogin, onSendCode }: EmailFormProps) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');

  function submit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    void onLogin(email, code);
  }

  return (
    <form className="login-form" onSubmit={submit}>
      <label>
        {COPY[locale].emailLabel}
        <input
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>
      <label>
        {COPY[locale].verificationCode}
        <span className="verification-row">
          <input autoComplete="one-time-code" inputMode="numeric" maxLength={6}
            pattern="[0-9]{6}" required value={code} onChange={(event) => setCode(event.target.value)} />
          <button disabled={isBusy || !email} type="button" onClick={() => void onSendCode(email)}>
            {COPY[locale].sendCode}
          </button>
        </span>
      </label>
      <button className="primary-button login-submit" disabled={isBusy} type="submit">
        {isBusy ? COPY[locale].signingIn : COPY[locale].login}
      </button>
      <p className="login-method-hint">{locale === 'zh-CN' ? '使用邮箱验证码登录或注册' : 'Sign in or create an account with an email code'}</p>
    </form>
  );
}

function PhoneLoginForm({ locale, isBusy, onLogin, onSendCode }: PhoneFormProps) {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');

  function submit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    void onLogin(phone, code);
  }

  return (
    <form className="login-form" onSubmit={submit}>
      <label>
        {COPY[locale].phoneLabel}
        <input
          autoComplete="tel"
          inputMode="tel"
          pattern="1[0-9]{10}"
          placeholder="138 0000 0000"
          required
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
        />
      </label>
      <label>
        {COPY[locale].verificationCode}
        <span className="verification-row">
          <input
            autoComplete="one-time-code"
            inputMode="numeric"
            maxLength={6}
            pattern="[0-9]{6}"
            required
            value={code}
            onChange={(event) => setCode(event.target.value)}
          />
          <button disabled={isBusy || !phone} type="button" onClick={() => void onSendCode(phone)}>
            {COPY[locale].sendCode}
          </button>
        </span>
      </label>
      <button className="primary-button login-submit" disabled={isBusy} type="submit">
        {isBusy ? COPY[locale].signingIn : COPY[locale].login}
      </button>
      <p className="login-method-hint">{COPY[locale].phoneHint}</p>
    </form>
  );
}

export function LoginPage({ locale, onClose, onLogin }: LoginPageProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [method, setMethod] = useState<LoginMethod>('email');
  const [message, setMessage] = useState('');
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    document.body.classList.add('login-modal-open');
    const focusFrame = window.requestAnimationFrame(() => dialog.querySelector('input')?.focus());
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.classList.remove('login-modal-open');
      if (dialog.open) dialog.close();
    };
  }, []);

  function changeMethod(nextMethod: LoginMethod): void {
    setMethod(nextMethod);
    setMessage('');
  }

  async function runAction(action: () => Promise<void>): Promise<void> {
    setIsBusy(true);
    setMessage('');
    try {
      await action();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : COPY[locale].genericError);
    } finally {
      setIsBusy(false);
    }
  }

  function completeEmailLogin(email: string, code: string): Promise<void> {
    return runAction(async () => {
      await verifyEmailLogin(email, code);
      onLogin();
    });
  }

  function completePhoneLogin(phone: string, code: string): Promise<void> {
    return runAction(async () => {
      await verifySms(phone, code);
      onLogin();
    });
  }

  function sendEmailCode(email: string): Promise<void> {
    return runAction(async () => {
      await requestEmailLoginCode(email, locale);
      setMessage(COPY[locale].codeSent);
    });
  }

  function sendPhoneCode(phone: string): Promise<void> {
    return runAction(async () => {
      await requestSms(phone);
      setMessage(COPY[locale].codeSent);
    });
  }

  function closeFromBackdrop(event: MouseEvent<HTMLDivElement>): void {
    if (event.target === event.currentTarget) onClose();
  }

  return (
    <dialog ref={dialogRef} className="login-dialog" aria-labelledby="login-title"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onKeyDown={(event) => {
        if (event.key !== 'Escape') return;
        event.preventDefault();
        onClose();
      }}>
      <div className="login-dialog__stage" onClick={closeFromBackdrop}>
        <p className="login-dialog__whisper">
          <span>{locale === 'zh-CN' ? '从一幅画开始，' : 'Begin with one image.'}</span>
          <span>{locale === 'zh-CN' ? '慢慢看见自己。' : 'See yourself gently.'}</span>
        </p>
        <section className="login-panel">
          <button className="login-dialog__close" type="button" onClick={onClose}
            aria-label={locale === 'zh-CN' ? '关闭登录窗口' : 'Close sign-in dialog'}>
            <X aria-hidden="true" size={21} />
          </button>
          <h1 id="login-title">
            {COPY[locale].loginTitle}
          </h1>
          <p className="login-panel__subtitle">
            {locale === 'zh-CN' ? '继续你的创作与自我观察' : 'Continue creating and observing your inner world'}
          </p>
          <div className="login-tabs" role="tablist" aria-label={COPY[locale].loginTitle}>
            <button
              aria-selected={method === 'email'}
              className={method === 'email' ? 'is-active' : ''}
              role="tab"
              type="button"
              onClick={() => changeMethod('email')}
            >
              {COPY[locale].emailLogin}
            </button>
            <button
              aria-selected={method === 'phone'}
              className={method === 'phone' ? 'is-active' : ''}
              role="tab"
              type="button"
              onClick={() => changeMethod('phone')}
            >
              {COPY[locale].phoneLogin}
            </button>
          </div>
          <div className="login-panel__body" role="tabpanel">
            {method === 'email' && (
              <EmailLoginForm
                isBusy={isBusy}
                locale={locale}
                onLogin={completeEmailLogin}
                onSendCode={sendEmailCode}
              />
            )}
            {method === 'phone' && (
              <PhoneLoginForm
                isBusy={isBusy}
                locale={locale}
                onLogin={completePhoneLogin}
                onSendCode={sendPhoneCode}
              />
            )}
          </div>
          <p className="form-message" aria-live="polite">{message}</p>
          <p className="login-panel__legal">
            <LockKeyhole aria-hidden="true" size={16} />
            {locale === 'zh-CN'
              ? '你的作品与记录仅对你可见'
              : 'Your artwork and records remain private to you.'}
          </p>
        </section>
      </div>
    </dialog>
  );
}
