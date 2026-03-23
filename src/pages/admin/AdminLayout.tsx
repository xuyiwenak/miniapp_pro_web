import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Monitor, Users, ImageIcon, MessageSquare,
  LogOut, ChevronRight, Flower
} from 'lucide-react'
import { logoutAdmin } from '../../api/adminApi'

const NAV = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: '仪表盘' },
  { to: '/admin/system',    icon: Monitor,          label: '系统监控' },
  { to: '/admin/users',     icon: Users,            label: '用户管理' },
  { to: '/admin/works',     icon: ImageIcon,        label: '作品管理' },
  { to: '/admin/feedback',  icon: MessageSquare,    label: '反馈管理' },
]

function getAdminInfo() {
  try { return JSON.parse(localStorage.getItem('admin_info') ?? '{}') } catch { return {} }
}

function levelLabel(level: number) {
  if (level === 1) return { text: '超级管理员', color: '#C8529A' }
  return { text: '管理员', color: '#4DBFB4' }
}

export default function AdminLayout() {
  const navigate = useNavigate()
  const info = getAdminInfo()
  const lv = levelLabel(info.level ?? 2)

  async function handleLogout() {
    await logoutAdmin()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#f4f6fa', fontFamily: '"Noto Sans SC", sans-serif' }}>

      {/* ── Sidebar ── */}
      <aside className="flex flex-col w-60 flex-shrink-0 h-full"
        style={{ background: '#1B3A6B', boxShadow: '2px 0 12px rgba(0,0,0,0.15)' }}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="flex items-center justify-center w-9 h-9 rounded-xl"
            style={{ background: 'rgba(77,191,180,0.2)', border: '1.5px solid rgba(77,191,180,0.4)' }}>
            <Flower size={18} color="#4DBFB4" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight" style={{ fontFamily: '"Ma Shan Zheng", serif', fontSize: '16px' }}>
              正念艺术
            </p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>管理后台</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group ${
                  isActive ? 'text-white' : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                }`
              }
              style={({ isActive }) => isActive ? {
                background: 'rgba(77,191,180,0.18)',
                border: '1px solid rgba(77,191,180,0.3)',
              } : {}}
            >
              {({ isActive }) => (
                <>
                  <Icon size={17} color={isActive ? '#4DBFB4' : undefined} />
                  <span>{label}</span>
                  {isActive && <ChevronRight size={14} className="ml-auto" color="#4DBFB4" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Admin info + logout */}
        <div className="px-4 py-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
              style={{ background: 'rgba(77,191,180,0.3)' }}>
              {(info.nickname ?? info.account ?? 'A')[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">{info.nickname ?? info.account ?? '管理员'}</p>
              <p className="text-xs truncate" style={{ color: lv.color }}>{lv.text}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm transition-all"
            style={{ color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)' }}
            onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
          >
            <LogOut size={14} /> 退出登录
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
