import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, ImageIcon, Eye, FileText, MessageSquare, Clock } from 'lucide-react'
import { getStats, type Stats } from '../../api/adminApi'

const QUICK = [
  { label: '系统监控', desc: 'CPU · 内存 · 容器', to: '/admin/system', color: '#4DBFB4' },
  { label: '用户管理', desc: '查看 / 管理用户', to: '/admin/users', color: '#1B3A6B' },
  { label: '作品审核', desc: '发布 / 下架作品', to: '/admin/works', color: '#C8529A' },
  { label: '反馈处理', desc: '回复用户反馈', to: '/admin/feedback', color: '#f59e0b' },
]

export default function DashboardPage() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const info = (() => { try { return JSON.parse(localStorage.getItem('admin_info') ?? '{}') } catch { return {} } })()
  const now = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })

  const cards = [
    { label: '总用户数',   value: stats?.totalUsers,     icon: <Users size={22} color="#1B3A6B" />,    accent: '#1B3A6B', to: '/admin/users' },
    { label: '全部作品',   value: stats?.totalWorks,     icon: <ImageIcon size={22} color="#4DBFB4" />, accent: '#4DBFB4', to: '/admin/works' },
    { label: '已发布作品', value: stats?.publishedWorks, icon: <Eye size={22} color="#4DBFB4" />,       accent: '#4DBFB4', sub: `草稿 ${stats?.draftWorks ?? 0} 件`, to: '/admin/works' },
    { label: '草稿作品',   value: stats?.draftWorks,     icon: <FileText size={22} color="#6b7280" />,  accent: '#6b7280', to: '/admin/works' },
    { label: '总反馈数',   value: stats?.totalFeedback,  icon: <MessageSquare size={22} color="#C8529A" />, accent: '#C8529A', to: '/admin/feedback' },
    { label: '待处理反馈', value: stats?.pendingFeedback, icon: <Clock size={22} color="#f59e0b" />,    accent: '#f59e0b', sub: '需要及时响应', to: '/admin/feedback' },
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-bold mb-1" style={{ color: '#1B3A6B', fontFamily: '"Ma Shan Zheng", serif', fontSize: '28px' }}>
          你好，{info.nickname ?? info.account ?? '管理员'} 👋
        </h1>
        <p className="text-gray-400 text-sm">{now}</p>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-lg text-sm" style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
          {error}
        </div>
      )}

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl h-28" style={{ background: '#f3f4f6', animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-5">
          {cards.map(({ label, value, icon, accent, sub, to }) => (
            <div key={label}
              onClick={() => navigate(to)}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md"
              style={{ borderLeft: `4px solid ${accent}` }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{label}</p>
                  <p className="text-3xl font-bold" style={{ color: '#1B3A6B' }}>{value ?? '—'}</p>
                  {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
                </div>
                <div className="p-3 rounded-xl" style={{ background: `${accent}18` }}>{icon}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick actions */}
      <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="font-semibold mb-4 text-sm" style={{ color: '#1B3A6B' }}>快捷入口</h2>
        <div className="grid grid-cols-4 gap-3">
          {QUICK.map(({ label, desc, to, color }) => (
            <button key={label} onClick={() => navigate(to)}
              className="p-4 rounded-xl text-left transition-all hover:shadow-md"
              style={{ border: `1.5px solid ${color}20`, background: `${color}08` }}>
              <p className="font-medium text-sm mb-1" style={{ color }}>{label}</p>
              <p className="text-xs text-gray-400">{desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
