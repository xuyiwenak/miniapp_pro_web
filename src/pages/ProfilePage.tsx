import { useEffect, useState } from 'react';
import { Bell, ChevronRight, Download, Globe2, LogOut, Pencil, Share2, Shield, UserRound } from 'lucide-react';
import {
  bindEmail,
  bindPhone,
  getAuthProfile,
  requestBoundEmail,
  requestBoundPhone,
  type AuthProfile,
} from '../api/mandis';
import type { Locale } from '../i18n/copy';

type CredentialFormProps = {
  kind: 'email' | 'phone';
  locale: Locale;
  token: string;
  onComplete: () => void;
};

function mask(value: string, visible: number): string {
  if (value.length <= visible * 2) return value;
  return `${value.slice(0, visible)}•••${value.slice(-visible)}`;
}

function CredentialForm({ kind, locale, token, onComplete }: CredentialFormProps) {
  const [value, setValue] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const isEmail = kind === 'email';
  const label = isEmail ? (locale === 'zh-CN' ? '邮箱' : 'Email') : (locale === 'zh-CN' ? '手机号' : 'Phone');

  async function sendCode(): Promise<void> {
    try {
      if (isEmail) await requestBoundEmail(value, locale, token);
      else await requestBoundPhone(value, token);
      setMessage(locale === 'zh-CN' ? '验证码已发送。' : 'Verification code sent.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Request failed.');
    }
  }

  async function bind(): Promise<void> {
    try {
      if (isEmail) await bindEmail(value, code, token);
      else await bindPhone(value, code, token);
      setMessage(locale === 'zh-CN' ? '绑定成功。' : 'Linked successfully.');
      onComplete();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Binding failed.');
    }
  }

  return (
    <div className="credential-form">
      <label>
        {label}
        <input value={value} inputMode={isEmail ? 'email' : 'tel'} onChange={(event) => setValue(event.target.value)} />
      </label>
      <button type="button" onClick={sendCode}>{locale === 'zh-CN' ? '获取验证码' : 'Send code'}</button>
      <label>
        {locale === 'zh-CN' ? '验证码' : 'Code'}
        <input value={code} inputMode="numeric" onChange={(event) => setCode(event.target.value)} />
      </label>
      <button className="secondary-button" type="button" onClick={bind}>{locale === 'zh-CN' ? '确认绑定' : 'Confirm link'}</button>
      {message && <p className="form-message" role="status">{message}</p>}
    </div>
  );
}

type ProfilePageProps = { locale: Locale; token: string; onSignOut: () => void };

export function ProfilePage({ locale, token, onSignOut }: ProfilePageProps) {
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [activeForm, setActiveForm] = useState<'email' | 'phone' | null>(null);
  const [message, setMessage] = useState('');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [privateByDefault, setPrivateByDefault] = useState(() => {
    try {
      return localStorage.getItem('original-sense-private-default') !== 'false';
    } catch {
      return true;
    }
  });

  function togglePrivateDefault(): void {
    setPrivateByDefault((current) => {
      const next = !current;
      try {
        localStorage.setItem('original-sense-private-default', String(next));
      } catch {
        // The preference remains active for this session when storage is unavailable.
      }
      return next;
    });
  }

  function refreshProfile(): void {
    void getAuthProfile(token)
      .then(setProfile)
      .catch(() => setMessage(locale === 'zh-CN' ? '暂时无法读取账号信息。' : 'Account details are unavailable.'));
  }

  useEffect(() => {
    let active = true;
    void getAuthProfile(token)
      .then((nextProfile) => { if (active) setProfile(nextProfile); })
      .catch(() => {
        if (active) setMessage(locale === 'zh-CN' ? '暂时无法读取账号信息。' : 'Account details are unavailable.');
      });
    return () => { active = false; };
  }, [locale, token]);

  const cards = [
    { key: 'phone', title: locale === 'zh-CN' ? '手机号' : 'Phone', value: profile?.phone ? mask(profile.phone, 3) : null },
    { key: 'email', title: locale === 'zh-CN' ? '邮箱' : 'Email', value: profile?.email ? mask(profile.email, 2) : null },
  ] as const;

  return (
    <main className="workspace profile-page">
      <h1>{locale === 'zh-CN' ? '我的空间' : 'My space'}</h1>
      <section className="profile-identity"><div className="profile-avatar">{(profile?.nickname ?? '原').slice(0, 1)}</div><strong>{profile?.nickname || (locale === 'zh-CN' ? '原色旅人' : 'Original traveller')}</strong><button className="icon-button" type="button" aria-label={locale === 'zh-CN' ? '编辑资料' : 'Edit profile'}><Pencil /></button></section>
      {message && <p className="form-error" role="alert">{message}</p>}
      <section className="settings-section"><h2>{locale === 'zh-CN' ? '隐私' : 'Privacy'}</h2>
        <button className="settings-row" type="button" aria-pressed={privateByDefault}
          onClick={togglePrivateDefault}><Shield /><span>{locale === 'zh-CN' ? '新作品默认仅自己可见' : 'New artworks are private by default'}</span><span className={`settings-switch${privateByDefault ? ' is-on' : ''}`} aria-hidden="true" /></button>
        <a className="settings-row" href="/explore"><Share2 /><span>{locale === 'zh-CN' ? '公开分享的作品' : 'Publicly shared artworks'}</span><ChevronRight /></a>
      </section>
      <section className="settings-section"><h2>{locale === 'zh-CN' ? '账号' : 'Account'}</h2>
        <button className="settings-row" type="button" onClick={() => setDetailsOpen((open) => !open)}><UserRound /><span>{locale === 'zh-CN' ? '个人资料' : 'Profile details'}</span><ChevronRight /></button>
        <div className="settings-row"><Globe2 /><span>{locale === 'zh-CN' ? '语言' : 'Language'}</span><small>{locale === 'zh-CN' ? '简体中文' : 'English'}</small></div>
        <button className="settings-row" type="button"><Bell /><span>{locale === 'zh-CN' ? '通知' : 'Notifications'}</span><ChevronRight /></button>
        <button className="settings-row" type="button"><Download /><span>{locale === 'zh-CN' ? '数据导出' : 'Export data'}</span><ChevronRight /></button>
        <button className="settings-row settings-row--danger" type="button" onClick={onSignOut}><LogOut /><span>{locale === 'zh-CN' ? '退出登录' : 'Sign out'}</span></button>
      </section>
      {detailsOpen && <section className="credential-list" aria-label={locale === 'zh-CN' ? '登录方式' : 'Sign-in methods'}>{cards.map((card) => <article className="credential-row" key={card.key}><div><strong>{card.title}</strong><span>{card.value ?? (locale === 'zh-CN' ? '尚未绑定' : 'Not linked')}</span></div>{card.value ? <span className="credential-status">{locale === 'zh-CN' ? '已保护' : 'Protected'}</span> : <button type="button" onClick={() => setActiveForm(card.key)}>{locale === 'zh-CN' ? '绑定' : 'Link'}</button>}</article>)}</section>}
      {activeForm && <CredentialForm kind={activeForm} locale={locale} token={token}
        onComplete={() => { setActiveForm(null); refreshProfile(); }} />}
    </main>
  );
}
