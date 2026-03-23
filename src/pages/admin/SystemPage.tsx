import { useEffect, useRef, useState, useCallback } from 'react'
import { RefreshCw, Cpu, MemoryStick, Clock, Server, Play, RotateCcw, Terminal, ChevronDown } from 'lucide-react'
import {
  getSystemMetrics, getContainers, getSystemLogs,
  restartContainer, deployBackend,
  type SystemMetrics, type Container,
} from '../../api/adminApi'

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtBytes(b: number) {
  const gb = b / 1024 ** 3
  return gb >= 1 ? `${gb.toFixed(1)} GB` : `${(b / 1024 ** 2).toFixed(0)} MB`
}

function getAdminLevel() {
  try { return JSON.parse(localStorage.getItem('admin_info') ?? '{}').level ?? 3 } catch { return 3 }
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ProgressBar({ value, color = '#4DBFB4' }: { value: number; color?: string }) {
  const pct = Math.min(100, Math.max(0, value))
  const barColor = pct > 85 ? '#ef4444' : pct > 70 ? '#f59e0b' : color
  return (
    <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: '#e8edf5' }}>
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: barColor }} />
    </div>
  )
}

function MetricCard({
  icon, title, mainValue, subText, progress, progressColor, extra
}: {
  icon: React.ReactNode; title: string; mainValue: string
  subText?: string; progress?: number; progressColor?: string; extra?: string
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-2 rounded-lg" style={{ background: '#f0fafa' }}>{icon}</div>
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</span>
      </div>
      <p className="text-2xl font-bold mb-1" style={{ color: '#1B3A6B' }}>{mainValue}</p>
      {subText && <p className="text-xs text-gray-400 mb-3">{subText}</p>}
      {progress !== undefined && (
        <>
          <ProgressBar value={progress} color={progressColor} />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0%</span>
            <span style={{ color: progress > 85 ? '#ef4444' : '#1B3A6B', fontWeight: 600 }}>{progress}%</span>
            <span>100%</span>
          </div>
        </>
      )}
      {extra && <p className="text-xs text-gray-400 mt-2">{extra}</p>}
    </div>
  )
}

function ContainerRow({
  c, isSuperAdmin, onRestart
}: {
  c: Container; isSuperAdmin: boolean; onRestart: (name: string) => void
}) {
  const running = c.State?.toLowerCase() === 'running'
  const name = c.Names?.replace(/^\//, '') ?? c.ID.slice(0, 12)
  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: running ? '#22c55e' : '#ef4444', boxShadow: running ? '0 0 6px #22c55e80' : 'none' }} />
          <span className="text-sm font-medium" style={{ color: '#1B3A6B' }}>{name}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-500 font-mono text-xs">{c.Image}</td>
      <td className="px-4 py-3">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          style={running
            ? { background: '#dcfce7', color: '#16a34a' }
            : { background: '#fee2e2', color: '#dc2626' }}>
          {c.Status ?? c.State}
        </span>
      </td>
      <td className="px-4 py-3 text-xs text-gray-400 font-mono">{c.Ports?.slice(0, 32) || '—'}</td>
      <td className="px-4 py-3 text-xs text-gray-400">{c.RunningFor ?? '—'}</td>
      <td className="px-4 py-3">
        {isSuperAdmin && (
          <button
            onClick={() => onRestart(name)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{ background: '#f0fafa', color: '#4DBFB4', border: '1px solid #4DBFB430' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#4DBFB4'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#f0fafa'; e.currentTarget.style.color = '#4DBFB4' }}
          >
            <RotateCcw size={11} /> 重启
          </button>
        )}
      </td>
    </tr>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function SystemPage() {
  const isSuperAdmin = getAdminLevel() === 1

  const [metrics, setMetrics] = useState<SystemMetrics | null>(null)
  const [containers, setContainers] = useState<Container[]>([])
  const [containerError, setContainerError] = useState('')
  const [logs, setLogs] = useState<string[]>([])
  const [logsFile, setLogsFile] = useState('')

  const [metricsLoading, setMetricsLoading] = useState(true)
  const [containersLoading, setContainersLoading] = useState(true)
  const [logsLoading, setLogsLoading] = useState(false)
  const [logsOpen, setLogsOpen] = useState(false)

  const [restartingName, setRestartingName] = useState('')
  const [restartMsg, setRestartMsg] = useState('')

  const [deploying, setDeploying] = useState(false)
  const [deployOutput, setDeployOutput] = useState('')
  const [deployError, setDeployError] = useState('')
  const [deployConfirm, setDeployConfirm] = useState(false)

  const logsRef = useRef<HTMLDivElement>(null)

  // ── Fetchers ──

  const fetchMetrics = useCallback(() => {
    setMetricsLoading(true)
    getSystemMetrics()
      .then(setMetrics)
      .catch(() => {})
      .finally(() => setMetricsLoading(false))
  }, [])

  const fetchContainers = useCallback(() => {
    setContainersLoading(true)
    getContainers()
      .then(d => { setContainers(d.containers); setContainerError(d.error ?? '') })
      .catch(e => setContainerError(e.message))
      .finally(() => setContainersLoading(false))
  }, [])

  const fetchLogs = useCallback(() => {
    setLogsLoading(true)
    getSystemLogs()
      .then(d => { setLogs(d.lines); setLogsFile(d.file ?? '') })
      .catch(() => {})
      .finally(() => {
        setLogsLoading(false)
        setTimeout(() => { logsRef.current?.scrollTo({ top: logsRef.current.scrollHeight, behavior: 'smooth' }) }, 100)
      })
  }, [])

  // Auto-refresh metrics every 30s
  useEffect(() => {
    fetchMetrics()
    fetchContainers()
    const timer = setInterval(fetchMetrics, 30000)
    return () => clearInterval(timer)
  }, [fetchMetrics, fetchContainers])

  async function handleRestart(name: string) {
    if (!confirm(`确认重启容器 ${name}？`)) return
    setRestartingName(name)
    setRestartMsg('')
    try {
      const r = await restartContainer(name)
      setRestartMsg(`✓ ${r.output || name + ' 已重启'}`)
      setTimeout(fetchContainers, 3000)
    } catch (e) {
      setRestartMsg(`✗ ${e instanceof Error ? e.message : '重启失败'}`)
    } finally {
      setRestartingName('')
      setTimeout(() => setRestartMsg(''), 5000)
    }
  }

  async function handleDeploy() {
    setDeployConfirm(false)
    setDeploying(true)
    setDeployOutput('')
    setDeployError('')
    try {
      const r = await deployBackend()
      setDeployOutput(r.output)
    } catch (e) {
      setDeployError(e instanceof Error ? e.message : '部署失败')
    } finally {
      setDeploying(false)
    }
  }

  // ── Render ──

  const m = metrics

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: '#1B3A6B', fontFamily: '"Ma Shan Zheng", serif', fontSize: '24px' }}>
            系统监控
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">每 30 秒自动刷新指标</p>
        </div>
        <button onClick={() => { fetchMetrics(); fetchContainers() }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all"
          style={{ background: '#4DBFB4', color: '#fff' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#3aada2')}
          onMouseLeave={e => (e.currentTarget.style.background = '#4DBFB4')}>
          <RefreshCw size={14} /> 刷新
        </button>
      </div>

      {/* ── Metrics Cards ── */}
      {metricsLoading ? (
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-36 rounded-2xl" style={{ background: '#f3f4f6', animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
      ) : m ? (
        <div className="grid grid-cols-4 gap-4">
          <MetricCard
            icon={<Cpu size={18} color="#4DBFB4" />}
            title="CPU 使用率"
            mainValue={`${m.cpu.usage}%`}
            subText={`${m.cpu.cores} 核 · 负载 ${m.cpu.loadAvg[0].toFixed(2)}`}
            progress={m.cpu.usage}
            extra={m.cpu.model.slice(0, 30)}
          />
          <MetricCard
            icon={<MemoryStick size={18} color="#C8529A" />}
            title="内存使用率"
            mainValue={`${m.memory.usagePercent}%`}
            subText={`已用 ${fmtBytes(m.memory.used)} / 共 ${fmtBytes(m.memory.total)}`}
            progress={m.memory.usagePercent}
            progressColor="#C8529A"
            extra={`空闲 ${fmtBytes(m.memory.free)}`}
          />
          <MetricCard
            icon={<Clock size={18} color="#1B3A6B" />}
            title="系统运行时间"
            mainValue={m.system.uptimeStr}
            subText={`${m.system.platform} · ${m.system.hostname}`}
          />
          <MetricCard
            icon={<Server size={18} color="#f59e0b" />}
            title="Node.js 运行时间"
            mainValue={m.system.nodeUptimeStr}
            subText="服务进程运行时长"
          />
        </div>
      ) : null}

      {/* ── Container Status ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-sm" style={{ color: '#1B3A6B' }}>容器状态</h2>
          <div className="flex items-center gap-3">
            {restartMsg && (
              <span className="text-xs px-3 py-1 rounded-full"
                style={restartMsg.startsWith('✓')
                  ? { background: '#dcfce7', color: '#16a34a' }
                  : { background: '#fee2e2', color: '#dc2626' }}>
                {restartMsg}
              </span>
            )}
            <button onClick={fetchContainers}
              className="text-xs px-3 py-1.5 rounded-lg transition-all"
              style={{ color: '#6b7280', border: '1px solid #e5e7eb' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#4DBFB4')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#e5e7eb')}>
              <RefreshCw size={12} className="inline mr-1" />刷新
            </button>
          </div>
        </div>

        {containerError && (
          <div className="mx-6 mt-4 px-4 py-3 rounded-lg text-xs" style={{ background: '#fef9c3', color: '#854d0e', border: '1px solid #fde047' }}>
            ⚠ {containerError}
          </div>
        )}

        {containersLoading ? (
          <div className="p-6 text-center text-sm text-gray-400">加载中...</div>
        ) : containers.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400">
            <div className="text-4xl mb-2">🐳</div>
            未获取到容器信息（需挂载 /var/run/docker.sock）
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                {['容器名称', '镜像', '状态', '端口', '运行时长', '操作'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {containers.map(c => (
                <ContainerRow
                  key={c.ID}
                  c={c}
                  isSuperAdmin={isSuperAdmin}
                  onRestart={restartingName ? () => {} : handleRestart}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Deploy Control ── */}
      {isSuperAdmin && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-sm" style={{ color: '#1B3A6B' }}>部署控制</h2>
          </div>
          <div className="p-6 space-y-4">
            {/* Warning */}
            <div className="flex items-start gap-3 px-4 py-3 rounded-xl"
              style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
              <span className="text-lg">⚠️</span>
              <div className="text-xs" style={{ color: '#92400e' }}>
                <p className="font-semibold mb-0.5">注意：此操作会重新构建并重启 backend_app 容器</p>
                <p>等同于运行 <code className="px-1 py-0.5 rounded" style={{ background: '#fef3c7' }}>start_docker.sh</code>，约需 1–3 分钟，期间服务会短暂中断。需要 COMPOSE_PROJECT_DIR 环境变量 和 docker socket 挂载。</p>
              </div>
            </div>

            <div className="flex gap-3">
              {deployConfirm ? (
                <>
                  <button onClick={handleDeploy}
                    disabled={deploying}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all"
                    style={{ background: deploying ? '#9ca3af' : '#ef4444', cursor: deploying ? 'not-allowed' : 'pointer' }}>
                    <Play size={14} /> {deploying ? '构建中，请耐心等待...' : '确认执行 Build & Deploy'}
                  </button>
                  <button onClick={() => setDeployConfirm(false)}
                    className="px-5 py-2.5 rounded-xl text-sm transition-all"
                    style={{ border: '1px solid #e5e7eb', color: '#6b7280' }}>
                    取消
                  </button>
                </>
              ) : (
                <button onClick={() => setDeployConfirm(true)}
                  disabled={deploying}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{ background: '#1B3A6B', color: '#fff', cursor: deploying ? 'not-allowed' : 'pointer' }}
                  onMouseEnter={e => { if (!deploying) e.currentTarget.style.background = '#142d56' }}
                  onMouseLeave={e => { if (!deploying) e.currentTarget.style.background = '#1B3A6B' }}>
                  <Play size={14} /> 🚀 Build &amp; Deploy Backend
                </button>
              )}
            </div>

            {/* Deploy output */}
            {(deployOutput || deployError || deploying) && (
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #1f2937' }}>
                <div className="flex items-center gap-2 px-4 py-2" style={{ background: '#111827' }}>
                  <Terminal size={13} color="#4DBFB4" />
                  <span className="text-xs font-mono" style={{ color: '#6b7280' }}>deploy output</span>
                  {deploying && <span className="ml-auto text-xs animate-pulse" style={{ color: '#f59e0b' }}>● running...</span>}
                </div>
                <div className="p-4 font-mono text-xs leading-relaxed overflow-auto max-h-64"
                  style={{ background: '#1a1a2e', color: deployError ? '#f87171' : '#a3e635' }}>
                  {deploying
                    ? <span className="animate-pulse">正在构建，请耐心等待（约 1–3 分钟）...</span>
                    : deployError || deployOutput}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Application Logs ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <button
          onClick={() => { setLogsOpen(v => !v); if (!logsOpen) fetchLogs() }}
          className="w-full flex items-center justify-between px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
          <h2 className="font-semibold text-sm" style={{ color: '#1B3A6B' }}>应用日志（最近 100 行）</h2>
          <div className="flex items-center gap-3">
            {logsFile && <span className="text-xs text-gray-400 font-mono">{logsFile.split('/').pop()}</span>}
            <button onClick={e => { e.stopPropagation(); fetchLogs() }}
              className="text-xs px-3 py-1.5 rounded-lg transition-all"
              style={{ color: '#6b7280', border: '1px solid #e5e7eb' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#4DBFB4')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#e5e7eb')}>
              <RefreshCw size={12} className="inline mr-1" />刷新
            </button>
            <ChevronDown size={16} color="#9ca3af"
              style={{ transition: 'transform .2s', transform: logsOpen ? 'rotate(180deg)' : '' }} />
          </div>
        </button>

        {logsOpen && (
          <div ref={logsRef} className="overflow-auto" style={{ maxHeight: '400px', background: '#0f172a' }}>
            {logsLoading ? (
              <p className="p-6 text-xs text-center animate-pulse" style={{ color: '#6b7280' }}>加载日志中...</p>
            ) : logs.length === 0 ? (
              <p className="p-6 text-xs text-center" style={{ color: '#6b7280' }}>暂无日志</p>
            ) : (
              <div className="p-4 space-y-0.5 font-mono text-xs leading-relaxed">
                {logs.map((line, i) => {
                  const isInfo = line.includes('[INFO]')
                  const isWarn = line.includes('[WARN]')
                  const isError = line.includes('[ERROR]')
                  const color = isError ? '#f87171' : isWarn ? '#fbbf24' : isInfo ? '#86efac' : '#94a3b8'
                  return (
                    <div key={i} style={{ color, wordBreak: 'break-all' }}>{line}</div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
