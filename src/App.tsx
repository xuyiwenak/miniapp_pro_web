import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import './index.css';
import './workspace.css';
import { AUTH_SESSION_EXPIRED_EVENT } from './api/client';
import { beginAnalysis, getAuthProfile, logoutWebSession, publishArtwork, waitForAnalysis } from './api/mandis';
import { SideNav } from './components/SideNav';
import type { ArtworkProgress } from './components/UploadCanvas';
import { LocaleToggle } from './components/LocaleToggle';
import { BrandMark } from './components/BrandMark';
import { WatercolorBackdrop } from './components/WatercolorBackdrop';
import { useLocale } from './hooks/useLocale';
import type { Locale } from './i18n/copy';
import HomePage from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';
import { ReportDetailPage } from './pages/ReportDetailPage';
import { ReportsPage } from './pages/ReportsPage';
import { UploadPage } from './pages/UploadPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminLayout from './pages/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import FeedbackPage from './pages/admin/FeedbackPage';
import ProtectedRoute from './pages/admin/ProtectedRoute';
import SystemPage from './pages/admin/SystemPage';
import UsersPage from './pages/admin/UsersPage';
import WorksPage from './pages/admin/WorksPage';

type AuthStatus = 'checking' | 'authenticated' | 'anonymous';
const COOKIE_AUTH_TOKEN = '';
const LEGACY_TOKEN_STORAGE_KEY = 'original-sense-web-token';

function takeLegacyToken(): string {
  try {
    const token = sessionStorage.getItem(LEGACY_TOKEN_STORAGE_KEY) ?? COOKIE_AUTH_TOKEN;
    sessionStorage.removeItem(LEGACY_TOKEN_STORAGE_KEY);
    return token;
  } catch {
    return COOKIE_AUTH_TOKEN;
  }
}

function useSessionStatus(): [AuthStatus, (status: AuthStatus) => void] {
  const [authStatus, setAuthStatus] = useState<AuthStatus>('checking');
  useEffect(() => {
    let active = true;
    void getAuthProfile(takeLegacyToken())
      .then(() => { if (active) setAuthStatus('authenticated'); })
      .catch(() => { if (active) setAuthStatus('anonymous'); });
    return () => { active = false; };
  }, []);
  useEffect(() => {
    const expireSession = () => setAuthStatus('anonymous');
    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, expireSession);
    return () => window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, expireSession);
  }, []);
  return [authStatus, setAuthStatus];
}

type MemberAreaProps = {
  authStatus: AuthStatus;
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  onSignOut: () => void;
};

function MemberArea({ authStatus, locale, onLocaleChange, onSignOut }: MemberAreaProps) {
  const location = useLocation();
  const navigate = useNavigate();
  if (authStatus === 'checking') return <SessionRestoreScreen locale={locale} />;
  if (authStatus === 'anonymous') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  async function submitArtwork(file: File, onProgress: (progress: ArtworkProgress) => void): Promise<void> {
    const work = await publishArtwork(file, COOKIE_AUTH_TOKEN, (percent) => {
      onProgress({ phase: 'uploading', percent });
    });
    onProgress({ phase: 'analyzing', percent: 0 });
    await beginAnalysis(work.workId, COOKIE_AUTH_TOKEN);
    await waitForAnalysis(work.workId, COOKIE_AUTH_TOKEN, (percent) => {
      onProgress({ phase: 'analyzing', percent });
    });
    navigate(`/reports/${work.workId}`);
  }
  return (
    <div className="app-frame">
      <SideNav locale={locale} onSignOut={onSignOut} />
      <div className="app-frame__content"><header className="workspace-header">
        <LocaleToggle locale={locale} onChange={onLocaleChange} />
      </header><Routes>
        <Route path="/upload" element={<UploadPage locale={locale} onSubmit={submitArtwork} />} />
        <Route path="/reports" element={<ReportsPage locale={locale} token={COOKIE_AUTH_TOKEN} />} />
        <Route path="/reports/:workId" element={<ReportDetailPage locale={locale} token={COOKIE_AUTH_TOKEN} />} />
        <Route path="/profile" element={<ProfilePage locale={locale} token={COOKIE_AUTH_TOKEN} />} />
      </Routes></div>
    </div>
  );
}

function SessionRestoreScreen({ locale }: { locale: Locale }) {
  return (
    <WatercolorBackdrop><main className="session-restore" aria-live="polite">
      <BrandMark locale={locale} /><span className="session-restore__spinner" aria-hidden="true" />
      <p>{locale === 'zh-CN' ? '正在恢复登录状态…' : 'Restoring your session…'}</p>
    </main></WatercolorBackdrop>
  );
}

type PublicPortalProps = {
  isAuthenticated: boolean;
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
};

function PublicPortal({ isAuthenticated, locale, onLocaleChange }: PublicPortalProps) {
  return (
    <>
      <HomePage isAuthenticated={isAuthenticated} locale={locale} onLocaleChange={onLocaleChange} />
      <Outlet />
    </>
  );
}

function ArtApp() {
  const [locale, setLocale] = useLocale();
  const [authStatus, setAuthStatus] = useSessionStatus();
  const navigate = useNavigate();
  const location = useLocation();
  const finishLogin = () => {
    setAuthStatus('authenticated');
    const state = location.state as { from?: string } | null;
    navigate(state?.from ?? '/upload', { replace: true });
  };
  const signOut = () => {
    setAuthStatus('anonymous');
    navigate('/');
    void logoutWebSession().catch(() => undefined);
  };
  const closeLogin = () => {
    const state = location.state as { loginOverlay?: boolean } | null;
    if (state?.loginOverlay) navigate(-1);
    else navigate('/', { replace: true });
  };
  const memberProps = { authStatus, locale, onLocaleChange: setLocale, onSignOut: signOut };
  return (
    <Routes>
      <Route element={<PublicPortal isAuthenticated={authStatus === 'authenticated'}
        locale={locale} onLocaleChange={setLocale} />}>
        <Route index element={null} />
        <Route path="/login" element={authStatus === 'authenticated' ? <Navigate to="/upload" replace /> :
          <LoginPage locale={locale} onClose={closeLogin} onLogin={finishLogin} />} />
      </Route>
      <Route path="/upload" element={<MemberArea {...memberProps} />} />
      <Route path="/reports" element={<MemberArea {...memberProps} />} />
      <Route path="/reports/:workId" element={<MemberArea {...memberProps} />} />
      <Route path="/profile" element={<MemberArea {...memberProps} />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} /><Route path="system" element={<SystemPage />} />
        <Route path="users" element={<UsersPage />} /><Route path="works" element={<WorksPage />} />
        <Route path="feedback" element={<FeedbackPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return <BrowserRouter><ArtApp /></BrowserRouter>;
}
