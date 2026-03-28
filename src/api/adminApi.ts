const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? ''

async function request<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('admin_token')
  const resp = await fetch(API_BASE + endpoint, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string> | undefined),
    },
  })
  const json = await resp.json()
  if (!json.success) throw new Error(json.message ?? 'Request failed')
  return json.data as T
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export interface AdminInfo {
  userId: string
  account: string
  nickname: string
  level: number
}

export async function loginAdmin(account: string, password: string): Promise<string> {
  const data = await request<{ token: string }>('/login/postPasswordLogin', {
    method: 'POST',
    body: JSON.stringify({ account, password }),
  })
  return data.token
}

export async function getAdminMe(): Promise<AdminInfo> {
  return request<AdminInfo>('/admin/me')
}

export async function logoutAdmin(): Promise<void> {
  await request('/login/logout', { method: 'POST' }).catch(() => {})
  localStorage.removeItem('admin_token')
  localStorage.removeItem('admin_info')
}

// ── Stats ─────────────────────────────────────────────────────────────────────

export interface Stats {
  totalUsers: number
  totalWorks: number
  publishedWorks: number
  draftWorks: number
  totalFeedback: number
  pendingFeedback: number
}

export const getStats = () => request<Stats>('/admin/stats')

// ── System Config ─────────────────────────────────────────────────────────────

export interface SystemConfig {
  healDailyLimit: number
}

export const getSystemConfig = () => request<SystemConfig>('/admin/system/config')

export const updateSystemConfig = (config: Partial<SystemConfig>) =>
  request<SystemConfig>('/admin/system/config', {
    method: 'PATCH',
    body: JSON.stringify(config),
  })

// ── System ────────────────────────────────────────────────────────────────────

export interface SystemMetrics {
  cpu: { usage: number; cores: number; model: string; loadAvg: number[] }
  memory: { total: number; used: number; free: number; usagePercent: number }
  system: { uptime: number; uptimeStr: string; nodeUptime: number; nodeUptimeStr: string; platform: string; hostname: string }
}

export interface Container {
  ID: string
  Names: string
  Image: string
  Status: string
  State: string
  Ports: string
  CreatedAt: string
  RunningFor: string
}

export const getSystemMetrics = () => request<SystemMetrics>('/admin/system/metrics')
export const getContainers = () => request<{ containers: Container[]; error?: string }>('/admin/system/containers')
export const restartContainer = (name: string) =>
  request<{ output: string }>('/admin/system/restart', { method: 'POST', body: JSON.stringify({ name }) })
export const deployBackend = () =>
  request<{ output: string }>('/admin/system/deploy', { method: 'POST' })
export const getSystemLogs = () =>
  request<{ lines: string[]; file?: string; error?: string }>('/admin/system/logs')

// ── Users ─────────────────────────────────────────────────────────────────────

export interface User {
  userId: string
  account: string
  nickname: string
  level: number
  createdAt: string
  healTodayUsage: number
}

export interface PageResult<T> {
  total: number
  page: number
  limit: number
  list: T[]
}

export const getUsers = (params: { page?: number; limit?: number; search?: string; level?: number } = {}) => {
  const q = new URLSearchParams()
  if (params.page) q.set('page', String(params.page))
  if (params.limit) q.set('limit', String(params.limit))
  if (params.search) q.set('search', params.search)
  if (params.level !== undefined) q.set('level', String(params.level))
  return request<PageResult<User>>(`/admin/users?${q}`)
}

export const changeUserLevel = (userId: string, level: number) =>
  request(`/admin/users/${userId}/level`, { method: 'PATCH', body: JSON.stringify({ level }) })

export const setUserHealUsage = (userId: string, usage: number) =>
  request<{ userId: string; healTodayUsage: number }>(`/admin/users/${userId}/heal-usage`, {
    method: 'PATCH',
    body: JSON.stringify({ usage }),
  })

export const deleteUser = (userId: string) =>
  request(`/admin/users/${userId}`, { method: 'DELETE' })

// ── Works ─────────────────────────────────────────────────────────────────────

export interface Work {
  workId: string
  authorId: string
  title: string
  status: 'draft' | 'published'
  featured?: boolean
  coverUrl?: string
  createdAt: string
}

export const getWorks = (params: { page?: number; limit?: number; status?: string } = {}) => {
  const q = new URLSearchParams()
  if (params.page) q.set('page', String(params.page))
  if (params.limit) q.set('limit', String(params.limit))
  if (params.status) q.set('status', params.status)
  return request<PageResult<Work>>(`/admin/works?${q}`)
}

export const updateWorkStatus = (workId: string, status: 'draft' | 'published') =>
  request(`/admin/works/${workId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })

export const updateWorkFeatured = (workId: string, featured: boolean) =>
  request(`/admin/works/${workId}/featured`, { method: 'PATCH', body: JSON.stringify({ featured }) })

export const deleteWork = (workId: string) =>
  request(`/admin/works/${workId}`, { method: 'DELETE' })

// ── Feedback ──────────────────────────────────────────────────────────────────

export interface Feedback {
  _id: string
  userId: string
  title: string
  content: string
  status: 'pending' | 'processing' | 'resolved'
  reply?: string
  createdAt: string
}

export const getFeedbackList = (params: { page?: number; limit?: number; status?: string } = {}) => {
  const q = new URLSearchParams()
  if (params.page) q.set('page', String(params.page))
  if (params.limit) q.set('limit', String(params.limit))
  if (params.status) q.set('status', params.status)
  return request<PageResult<Feedback>>(`/admin/feedback?${q}`)
}

export const updateFeedback = (id: string, update: { status?: string; reply?: string }) =>
  request(`/admin/feedback/${id}`, { method: 'PATCH', body: JSON.stringify(update) })
