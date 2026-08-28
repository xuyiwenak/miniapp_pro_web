import { apiRequest, apiUploadRequest } from "./client";

const ANALYSIS_POLL_INTERVAL_MS = 1000;
const ANALYSIS_TIMEOUT_MS = 3 * 60 * 1000;
const DEFAULT_ANALYSIS_ESTIMATE_SECONDS = 10;
const MAX_PENDING_ANALYSIS_PERCENT = 95;

export type AuthResult = { userId: string };

export type AuthProfile = {
  userId: string;
  nickname?: string;
  phone?: string;
  email?: string;
};

export type ReportItem = {
  workId: string;
  coverUrl: string;
  desc: string;
  dominantEmotionLabel: string;
  createdAt: string;
  isPublic?: boolean;
};

export type WorkItem = {
  workId: string;
  desc: string;
  tags: string[];
  coverUrl: string;
  status: "draft" | "published";
  onWall: boolean;
  createdAt: string;
};

export type PublicWorkItem = {
  workId?: string;
  url: string;
  desc: string;
  nickname?: string;
};

type AnalysisStatus = {
  status: "none" | "pending" | "success" | "failed";
  estimatedSeconds?: number;
  failReason?: string | null;
};

export function requestSms(
  phone: string,
): Promise<{ expiresInSeconds: number }> {
  return apiRequest("/web-auth/sms/send", {
    method: "POST",
    body: JSON.stringify({ phone }),
  });
}

export function verifySms(phone: string, code: string): Promise<AuthResult> {
  return apiRequest("/web-auth/sms/verify", {
    method: "POST",
    body: JSON.stringify({ phone, code }),
  });
}

export function requestRegistrationEmailCode(
  email: string,
  locale: string,
): Promise<{ expiresInSeconds: number }> {
  return apiRequest("/web-auth/email/register/send", {
    method: "POST",
    body: JSON.stringify({ email, locale }),
  });
}

export function requestRegistrationPhoneCode(
  phone: string,
): Promise<{ expiresInSeconds: number }> {
  return apiRequest("/web-auth/phone/register/send", {
    method: "POST",
    body: JSON.stringify({ phone }),
  });
}

type RegistrationInput = {
  email: string;
  emailCode: string;
  password: string;
  phone?: string;
  phoneCode?: string;
};

export function registerWithEmail(
  input: RegistrationInput,
): Promise<AuthResult> {
  return apiRequest("/web-auth/email/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function loginWithEmailPassword(
  email: string,
  password: string,
): Promise<AuthResult> {
  return apiRequest("/web-auth/email/password/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function requestPasswordReset(
  email: string,
  locale: string,
): Promise<{ expiresInSeconds: number }> {
  return apiRequest("/web-auth/email/password/reset/send", {
    method: "POST",
    body: JSON.stringify({ email, locale }),
  });
}

export function resetEmailPassword(
  email: string,
  code: string,
  password: string,
): Promise<{ reset: boolean }> {
  return apiRequest("/web-auth/email/password/reset", {
    method: "POST",
    body: JSON.stringify({ email, code, password }),
  });
}

export function getAuthProfile(token: string): Promise<AuthProfile> {
  return apiRequest("/web-auth/profile", {}, token);
}

export function logoutWebSession(): Promise<{ signedOut: boolean }> {
  return apiRequest("/web-auth/logout", { method: "POST" });
}

export function requestBoundPhone(
  phone: string,
  token: string,
): Promise<{ expiresInSeconds: number }> {
  return apiRequest(
    "/web-auth/profile/phone/send",
    {
      method: "POST",
      body: JSON.stringify({ phone }),
    },
    token,
  );
}

export function bindPhone(
  phone: string,
  code: string,
  token: string,
): Promise<unknown> {
  return apiRequest(
    "/web-auth/profile/phone/bind",
    {
      method: "POST",
      body: JSON.stringify({ phone, code }),
    },
    token,
  );
}

export function requestBoundEmail(
  email: string,
  locale: string,
  token: string,
): Promise<{ expiresInSeconds: number }> {
  return apiRequest(
    "/web-auth/profile/email/send",
    {
      method: "POST",
      body: JSON.stringify({ email, locale }),
    },
    token,
  );
}

export function bindEmail(
  email: string,
  code: string,
  token: string,
): Promise<unknown> {
  return apiRequest(
    "/web-auth/profile/email/bind",
    {
      method: "POST",
      body: JSON.stringify({ email, code }),
    },
    token,
  );
}

export function publishArtwork(
  file: File,
  description: string,
  token: string,
  onProgress: (percent: number) => void,
): Promise<{ workId: string }> {
  return readFileAsDataUrl(file).then((data) =>
    apiUploadRequest(
      "/work/publish",
      {
        desc: description,
        images: [{ name: file.name, type: file.type, data }],
        status: "published",
      },
      token,
      onProgress,
    ),
  );
}

export function listWorks(token: string): Promise<WorkItem[]> {
  return apiRequest("/work/list?status=published", {}, token);
}

export function listPublicWorks(token: string): Promise<PublicWorkItem[]> {
  return apiRequest("/home/cards", {}, token);
}

export function getTodayTip(token: string): Promise<{ content: string }> {
  return apiRequest("/userTips/today", {}, token);
}

export function beginAnalysis(
  workId: string,
  token: string,
): Promise<{ workId: string }> {
  return apiRequest(
    "/healing/analyze",
    {
      method: "POST",
      body: JSON.stringify({ workId }),
    },
    token,
  );
}

export async function waitForAnalysis(
  workId: string,
  token: string,
  onProgress: (percent: number) => void,
): Promise<void> {
  const startedAt = Date.now();
  let estimateSeconds = DEFAULT_ANALYSIS_ESTIMATE_SECONDS;
  while (true) {
    const status = await apiRequest<AnalysisStatus>(
      `/healing/status?workId=${encodeURIComponent(workId)}`,
      {},
      token,
    );
    if (status.status === "success") return onProgress(100);
    if (status.status === "failed")
      throw new Error(status.failReason ?? "Analysis failed");
    estimateSeconds = status.estimatedSeconds ?? estimateSeconds;
    const elapsedMs = Date.now() - startedAt;
    if (elapsedMs >= ANALYSIS_TIMEOUT_MS) throw new Error("Analysis timed out");
    const elapsedSeconds = elapsedMs / 1000;
    const percent = Math.min(
      MAX_PENDING_ANALYSIS_PERCENT,
      Math.round((elapsedSeconds / estimateSeconds) * 100),
    );
    onProgress(percent);
    await delay(ANALYSIS_POLL_INTERVAL_MS);
  }
}

export function listReports(token: string): Promise<ReportItem[]> {
  return apiRequest("/healing/list", {}, token);
}

export type ReportDetail = ReportItem & {
  title?: string;
  summary?: string;
  colorAnalysis?: string;
  compositionReport?: string;
  lineAnalysis?: string | { interpretation?: string; style?: string };
  suggestion?: string;
  keyColors?: string[];
};

export function getReport(
  workId: string,
  token: string,
): Promise<ReportDetail> {
  return apiRequest(
    `/healing/report?workId=${encodeURIComponent(workId)}`,
    {},
    token,
  );
}

export function updateReportPrivacy(
  workId: string,
  isPublic: boolean,
  token: string,
): Promise<{ workId: string; isPublic: boolean }> {
  return apiRequest(
    "/healing/privacy",
    {
      method: "POST",
      body: JSON.stringify({ workId, isPublic }),
    },
    token,
  );
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read image file"));
    reader.readAsDataURL(file);
  });
}

function delay(durationMs: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, durationMs));
}
