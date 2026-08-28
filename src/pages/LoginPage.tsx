import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type MouseEvent,
} from "react";
import { LockKeyhole, X } from "lucide-react";
import type { Locale } from "../i18n/copy";
import { COPY } from "../i18n/copy";
import {
  loginWithEmailPassword,
  registerWithEmail,
  requestPasswordReset,
  requestRegistrationEmailCode,
  requestRegistrationPhoneCode,
  requestSms,
  resetEmailPassword,
  verifySms,
} from "../api/mandis";

type LoginMethod = "email" | "phone";
type EmailView = "login" | "reset" | "register";

type LoginPageProps = {
  locale: Locale;
  onClose: () => void;
  onLogin: () => void;
};

type EmailFormProps = {
  locale: Locale;
  isBusy: boolean;
  onLogin: (email: string, password: string) => Promise<void>;
  onShowReset: (email: string) => void;
  onShowRegister: () => void;
};

type PasswordResetFormProps = {
  initialEmail: string;
  locale: Locale;
  isBusy: boolean;
  onBack: () => void;
  onReset: (email: string, code: string, password: string) => Promise<void>;
  onSendCode: (email: string) => Promise<void>;
};

type RegisterFormProps = {
  locale: Locale;
  isBusy: boolean;
  onBack: () => void;
  onRegister: (input: RegistrationInput) => Promise<void>;
  onSendEmailCode: (email: string) => Promise<void>;
  onSendPhoneCode: (phone: string) => Promise<void>;
};

type RegistrationInput = {
  email: string;
  emailCode: string;
  password: string;
  phone?: string;
  phoneCode?: string;
};

type PhoneFormProps = {
  locale: Locale;
  isBusy: boolean;
  onLogin: (phone: string, code: string) => Promise<void>;
  onSendCode: (phone: string) => Promise<void>;
};

function EmailLoginForm({
  locale,
  isBusy,
  onLogin,
  onShowReset,
  onShowRegister,
}: EmailFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function submit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    void onLogin(email, password);
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
        {COPY[locale].passwordLabel}
        <input
          autoComplete="current-password"
          minLength={8}
          required
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>
      <div className="login-form__actions">
        <button
          className="login-text-action"
          type="button"
          onClick={() => onShowReset(email)}
        >
          {COPY[locale].forgotOrSetPassword}
        </button>
        <button
          className="login-text-action"
          type="button"
          onClick={onShowRegister}
        >
          {COPY[locale].registerAccount}
        </button>
      </div>
      <button
        className="primary-button login-submit"
        disabled={isBusy}
        type="submit"
      >
        {isBusy ? COPY[locale].signingIn : COPY[locale].login}
      </button>
      <p className="login-method-hint">{COPY[locale].emailHint}</p>
    </form>
  );
}

function PasswordResetForm(props: PasswordResetFormProps) {
  const { initialEmail, locale, isBusy, onBack, onReset, onSendCode } = props;
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const passwordsMatch = password === confirmation;

  function submit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (passwordsMatch) void onReset(email, code, password);
  }

  return (
    <form className="login-form login-form--reset" onSubmit={submit}>
      <button className="login-back-action" type="button" onClick={onBack}>
        ← {COPY[locale].backToLogin}
      </button>
      <label>
        {COPY[locale].emailLabel}
        <input
          autoComplete="email"
          inputMode="email"
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>
      <CodeField
        code={code}
        disabled={isBusy || !email}
        label={COPY[locale].verificationCode}
        onChange={setCode}
        onSend={() => void onSendCode(email)}
        locale={locale}
      />
      <PasswordFields
        confirmation={confirmation}
        locale={locale}
        password={password}
        onConfirmation={setConfirmation}
        onPassword={setPassword}
      />
      {!passwordsMatch && confirmation && (
        <p className="field-error">{COPY[locale].passwordMismatch}</p>
      )}
      <button
        className="primary-button login-submit"
        disabled={isBusy || !passwordsMatch}
        type="submit"
      >
        {COPY[locale].setPassword}
      </button>
    </form>
  );
}

function CodeField({
  code,
  disabled,
  label,
  locale,
  onChange,
  onSend,
}: {
  code: string;
  disabled: boolean;
  label: string;
  locale: Locale;
  onChange: (value: string) => void;
  onSend: () => void;
}) {
  return (
    <label>
      {label}
      <span className="verification-row">
        <input
          autoComplete="one-time-code"
          inputMode="numeric"
          maxLength={6}
          pattern="[0-9]{6}"
          required
          value={code}
          onChange={(event) => onChange(event.target.value)}
        />
        <button disabled={disabled} type="button" onClick={onSend}>
          {COPY[locale].sendCode}
        </button>
      </span>
    </label>
  );
}

function PasswordFields({
  confirmation,
  locale,
  password,
  onConfirmation,
  onPassword,
}: {
  confirmation: string;
  locale: Locale;
  password: string;
  onConfirmation: (value: string) => void;
  onPassword: (value: string) => void;
}) {
  return (
    <div className="password-pair">
      <label>
        {COPY[locale].newPassword}
        <input
          autoComplete="new-password"
          minLength={8}
          required
          type="password"
          value={password}
          onChange={(event) => onPassword(event.target.value)}
        />
      </label>
      <label>
        {COPY[locale].confirmPassword}
        <input
          autoComplete="new-password"
          minLength={8}
          required
          type="password"
          value={confirmation}
          onChange={(event) => onConfirmation(event.target.value)}
        />
      </label>
    </div>
  );
}

function RegisterForm(props: RegisterFormProps) {
  const {
    locale,
    isBusy,
    onBack,
    onRegister,
    onSendEmailCode,
    onSendPhoneCode,
  } = props;
  const [email, setEmail] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const passwordsMatch = password === confirmation;
  const hasPhone = Boolean(phone || phoneCode);

  function submit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (!passwordsMatch || (hasPhone && !phoneCode)) return;
    void onRegister({
      email,
      emailCode,
      password,
      ...(phone ? { phone, phoneCode } : {}),
    });
  }

  return (
    <form className="login-form login-form--register" onSubmit={submit}>
      <button className="login-back-action" type="button" onClick={onBack}>
        ← {COPY[locale].backToLogin}
      </button>
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
      <CodeField
        code={emailCode}
        disabled={isBusy || !email}
        label={COPY[locale].verificationCode}
        onChange={setEmailCode}
        onSend={() => void onSendEmailCode(email)}
        locale={locale}
      />
      <PasswordFields
        confirmation={confirmation}
        locale={locale}
        password={password}
        onConfirmation={setConfirmation}
        onPassword={setPassword}
      />
      <p className="login-method-hint">{COPY[locale].phoneOptionalHint}</p>
      <label>
        {COPY[locale].phoneLabel}
        <input
          autoComplete="tel"
          inputMode="tel"
          pattern="1[0-9]{10}"
          placeholder="138 0000 0000"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
        />
      </label>
      {hasPhone && (
        <CodeField
          code={phoneCode}
          disabled={isBusy || !phone}
          label={COPY[locale].verificationCode}
          onChange={setPhoneCode}
          onSend={() => void onSendPhoneCode(phone)}
          locale={locale}
        />
      )}
      {!passwordsMatch && confirmation && (
        <p className="field-error">{COPY[locale].passwordMismatch}</p>
      )}
      <button
        className="primary-button login-submit"
        disabled={
          isBusy || !passwordsMatch || !emailCode || (hasPhone && !phoneCode)
        }
        type="submit"
      >
        {COPY[locale].registerAndLogin}
      </button>
    </form>
  );
}

function PhoneLoginForm({
  locale,
  isBusy,
  onLogin,
  onSendCode,
}: PhoneFormProps) {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");

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
          <button
            disabled={isBusy || !phone}
            type="button"
            onClick={() => void onSendCode(phone)}
          >
            {COPY[locale].sendCode}
          </button>
        </span>
      </label>
      <button
        className="primary-button login-submit"
        disabled={isBusy}
        type="submit"
      >
        {isBusy ? COPY[locale].signingIn : COPY[locale].login}
      </button>
      <p className="login-method-hint">{COPY[locale].phoneHint}</p>
    </form>
  );
}

export function LoginPage({ locale, onClose, onLogin }: LoginPageProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [method, setMethod] = useState<LoginMethod>("email");
  const [emailView, setEmailView] = useState<EmailView>("login");
  const [resetEmail, setResetEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    document.body.classList.add("login-modal-open");
    const focusFrame = window.requestAnimationFrame(() =>
      dialog.querySelector("input")?.focus(),
    );
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.classList.remove("login-modal-open");
      if (dialog.open) dialog.close();
    };
  }, []);

  function changeMethod(nextMethod: LoginMethod): void {
    setMethod(nextMethod);
    setEmailView("login");
    setMessage("");
  }

  async function runAction(action: () => Promise<void>): Promise<void> {
    setIsBusy(true);
    setMessage("");
    try {
      await action();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : COPY[locale].genericError,
      );
    } finally {
      setIsBusy(false);
    }
  }

  function completeEmailLogin(email: string, password: string): Promise<void> {
    return runAction(async () => {
      await loginWithEmailPassword(email, password);
      onLogin();
    });
  }

  function completePhoneLogin(phone: string, code: string): Promise<void> {
    return runAction(async () => {
      await verifySms(phone, code);
      onLogin();
    });
  }

  function sendResetCode(email: string): Promise<void> {
    return runAction(async () => {
      await requestPasswordReset(email, locale);
      setMessage(COPY[locale].codeSent);
    });
  }

  function completePasswordReset(
    email: string,
    code: string,
    password: string,
  ): Promise<void> {
    return runAction(async () => {
      await resetEmailPassword(email, code, password);
      setEmailView("login");
      setMessage(COPY[locale].passwordUpdated);
    });
  }

  function register(input: RegistrationInput): Promise<void> {
    return runAction(async () => {
      await registerWithEmail(input);
      onLogin();
    });
  }

  function sendRegistrationEmailCode(email: string): Promise<void> {
    return runAction(async () => {
      await requestRegistrationEmailCode(email, locale);
      setMessage(COPY[locale].codeSent);
    });
  }

  function sendRegistrationPhoneCode(phone: string): Promise<void> {
    return runAction(async () => {
      await requestRegistrationPhoneCode(phone);
      setMessage(COPY[locale].codeSent);
    });
  }

  function showPasswordReset(email: string): void {
    setResetEmail(email);
    setEmailView("reset");
    setMessage("");
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
    <dialog
      ref={dialogRef}
      className="login-dialog"
      aria-labelledby="login-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onKeyDown={(event) => {
        if (event.key !== "Escape") return;
        event.preventDefault();
        onClose();
      }}
    >
      <div className="login-dialog__stage" onClick={closeFromBackdrop}>
        <p className="login-dialog__whisper">
          <span>
            {locale === "zh-CN" ? "从一幅画开始，" : "Begin with one image."}
          </span>
          <span>
            {locale === "zh-CN" ? "慢慢看见自己。" : "See yourself gently."}
          </span>
        </p>
        <section
          className={`login-panel${emailView !== "login" ? " login-panel--reset" : ""}`}
        >
          <button
            className="login-dialog__close"
            type="button"
            onClick={onClose}
            aria-label={
              locale === "zh-CN" ? "关闭登录窗口" : "Close sign-in dialog"
            }
          >
            <X aria-hidden="true" size={21} />
          </button>
          <h1 id="login-title">
            {emailView === "login"
              ? COPY[locale].loginTitle
              : emailView === "reset"
                ? COPY[locale].resetPasswordTitle
                : COPY[locale].registerAccount}
          </h1>
          <p className="login-panel__subtitle">
            {locale === "zh-CN"
              ? "继续你的创作与自我观察"
              : "Continue creating and observing your inner world"}
          </p>
          <div
            className="login-tabs"
            role="tablist"
            aria-label={COPY[locale].loginTitle}
          >
            <button
              aria-selected={method === "email"}
              className={method === "email" ? "is-active" : ""}
              role="tab"
              type="button"
              onClick={() => changeMethod("email")}
            >
              {COPY[locale].emailLogin}
            </button>
            <button
              aria-selected={method === "phone"}
              className={method === "phone" ? "is-active" : ""}
              role="tab"
              type="button"
              onClick={() => changeMethod("phone")}
            >
              {COPY[locale].phoneLogin}
            </button>
          </div>
          <div className="login-panel__body" role="tabpanel">
            {method === "email" && emailView === "login" && (
              <EmailLoginForm
                isBusy={isBusy}
                locale={locale}
                onLogin={completeEmailLogin}
                onShowReset={showPasswordReset}
                onShowRegister={() => {
                  setEmailView("register");
                  setMessage("");
                }}
              />
            )}
            {method === "email" && emailView === "reset" && (
              <PasswordResetForm
                initialEmail={resetEmail}
                isBusy={isBusy}
                locale={locale}
                onBack={() => setEmailView("login")}
                onReset={completePasswordReset}
                onSendCode={sendResetCode}
              />
            )}
            {method === "email" && emailView === "register" && (
              <RegisterForm
                isBusy={isBusy}
                locale={locale}
                onBack={() => setEmailView("login")}
                onRegister={register}
                onSendEmailCode={sendRegistrationEmailCode}
                onSendPhoneCode={sendRegistrationPhoneCode}
              />
            )}
            {method === "phone" && (
              <PhoneLoginForm
                isBusy={isBusy}
                locale={locale}
                onLogin={completePhoneLogin}
                onSendCode={sendPhoneCode}
              />
            )}
          </div>
          <p className="form-message" aria-live="polite">
            {message}
          </p>
          <p className="login-panel__legal">
            <LockKeyhole aria-hidden="true" size={16} />
            {locale === "zh-CN"
              ? "你的作品与记录仅对你可见"
              : "Your artwork and records remain private to you."}
          </p>
        </section>
      </div>
    </dialog>
  );
}
