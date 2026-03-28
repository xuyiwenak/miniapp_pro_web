import { useCallback, useEffect, useRef, useState } from 'react'
import { Search, ChevronLeft, ChevronRight, Shield, Trash2 } from 'lucide-react'
import { getUsers, changeUserLevel, deleteUser, setUserHealUsage, type User } from '../../api/adminApi'

function getAdminLevel() {
  try { return JSON.parse(localStorage.getItem('admin_info') ?? '{}').level ?? 3 } catch { return 3 }
}

const LEVEL_META: Record<number, { label: string; bg: string; color: string }> = {
  1: { label: '超级管理员', bg: '#fdf4ff', color: '#a21caf' },
  2: { label: '管理员',     bg: '#eff6ff', color: '#1d4ed8' },
  3: { label: '普通用户',   bg: '#f9fafb', color: '#6b7280' },
}

// Inline editable heal usage cell
function HealUsageCell({ user, onSaved }: { user: User; onSaved: (userId: string, usage: number) => void }) {
  const [editing, setEditing] = useState(false)
  const [inputVal, setInputVal] = useState(String(user.healTodayUsage ?? 0))
  const [saving, setSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function startEdit() {
    setInputVal(String(user.healTodayUsage ?? 0))
    setEditing(true)
    setTimeout(() => inputRef.current?.select(), 0)
  }

  async function commit() {
    const n = parseInt(inputVal, 10)
    if (isNaN(n) || n < 0) { setEditing(false); return }
    if (n === (user.healTodayUsage ?? 0)) { setEditing(false); return }
    setSaving(true)
    try {
      await setUserHealUsage(user.userId, n)
      onSaved(user.userId, n)
    } catch { /* ignore */ }
    setSaving(false)
    setEditing(false)
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        type="number"
        min={0}
        value={inputVal}
        disabled={saving}
        onChange={e => setInputVal(e.target.value)}
        onBlur={commit}
        onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEditing(false) }}
        className="w-16 px-2 py-1 text-xs text-center rounded outline-none"
        style={{ border: '1.5px solid #4DBFB4', color: '#1B3A6B' }}
      />
    )
  }

  return (
    <span
      onClick={startEdit}
      title="点击修改"
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded cursor-pointer transition-colors"
      style={{ background: '#f0fafa', color: '#1B3A6B', fontSize: '12px' }}
      onMouseEnter={e => (e.currentTarget.style.background = '#d1f5f2')}
      onMouseLeave={e => (e.currentTarget.style.background = '#f0fafa')}
    >
      {user.healTodayUsage ?? 0}
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ opacity: 0.5 }}>
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    </span>
  )
}

export default function UsersPage() {
  const isSuperAdmin = getAdminLevel() === 1

  const [list, setList] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [levelFilter, setLevelFilter] = useState<number | undefined>()
  const [loading, setLoading] = useState(true)
  const [actionMsg, setActionMsg] = useState('')

  const limit = 20
  const totalPages = Math.max(1, Math.ceil(total / limit))

  const fetchData = useCallback(() => {
    setLoading(true)
    getUsers({ page, limit, search: search || undefined, level: levelFilter })
      .then(d => { setList(d.list); setTotal(d.total) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [page, search, levelFilter])

  useEffect(() => { fetchData() }, [fetchData])

  function flash(msg: string) {
    setActionMsg(msg)
    setTimeout(() => setActionMsg(''), 3500)
  }

  function handleUsageSaved(userId: string, usage: number) {
    setList(prev => prev.map(u => u.userId === userId ? { ...u, healTodayUsage: usage } : u))
  }

  async function handleChangeLevel(userId: string, level: number) {
    try {
      await changeUserLevel(userId, level)
      flash(`✓ 角色已更新`)
      fetchData()
    } catch (e) {
      flash(`✗ ${e instanceof Error ? e.message : '操作失败'}`)
    }
  }

  async function handleDelete(userId: string, account: string) {
    if (!confirm(`确认删除用户 "${account}"？此操作不可恢复。`)) return
    try {
      await deleteUser(userId)
      flash(`✓ 用户已删除`)
      fetchData()
    } catch (e) {
      flash(`✗ ${e instanceof Error ? e.message : '删除失败'}`)
    }
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="font-bold mb-1" style={{ color: '#1B3A6B', fontFamily: '"Ma Shan Zheng", serif', fontSize: '24px' }}>
          用户管理
        </h1>
        <p className="text-sm text-gray-400">共 {total} 名用户</p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="搜索账号或昵称..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg outline-none"
            style={{ border: '1.5px solid #e8edf5', fontFamily: '"Noto Sans SC", sans-serif' }}
            onFocus={e => (e.currentTarget.style.borderColor = '#4DBFB4')}
            onBlur={e => (e.currentTarget.style.borderColor = '#e8edf5')}
          />
        </div>
        <select
          value={levelFilter ?? ''}
          onChange={e => { setLevelFilter(e.target.value ? Number(e.target.value) : undefined); setPage(1) }}
          className="px-3 py-2 text-sm rounded-lg outline-none"
          style={{ border: '1.5px solid #e8edf5', fontFamily: '"Noto Sans SC", sans-serif', color: '#555' }}>
          <option value="">全部角色</option>
          <option value="1">超级管理员</option>
          <option value="2">管理员</option>
          <option value="3">普通用户</option>
        </select>
        {actionMsg && (
          <span className="text-xs px-3 py-1.5 rounded-full"
            style={actionMsg.startsWith('✓')
              ? { background: '#dcfce7', color: '#16a34a' }
              : { background: '#fee2e2', color: '#dc2626' }}>
            {actionMsg}
          </span>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              {['账号', '昵称', '角色', '今日用量', '注册时间', ...(isSuperAdmin ? ['操作'] : [])].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-gray-50">
                  {[...Array(isSuperAdmin ? 6 : 5)].map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 rounded" style={{ background: '#f3f4f6', width: j === 0 ? '60%' : '80%' }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : list.length === 0 ? (
              <tr><td colSpan={isSuperAdmin ? 6 : 5} className="px-4 py-12 text-center text-sm text-gray-400">暂无数据</td></tr>
            ) : list.map(u => {
              const lv = LEVEL_META[u.level] ?? LEVEL_META[3]
              return (
                <tr key={u.userId} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium" style={{ color: '#1B3A6B' }}>{u.account}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{u.nickname || '—'}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium"
                      style={{ background: lv.bg, color: lv.color }}>
                      {u.level === 1 && <Shield size={10} />}{lv.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <HealUsageCell user={u} onSaved={handleUsageSaved} />
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString('zh-CN') : '—'}
                  </td>
                  {isSuperAdmin && (
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <select
                          value={u.level}
                          onChange={e => handleChangeLevel(u.userId, Number(e.target.value))}
                          className="text-xs px-2 py-1 rounded-lg outline-none"
                          style={{ border: '1px solid #e5e7eb', color: '#555', fontFamily: '"Noto Sans SC", sans-serif' }}>
                          <option value="1">超级管理员</option>
                          <option value="2">管理员</option>
                          <option value="3">普通用户</option>
                        </select>
                        <button onClick={() => handleDelete(u.userId, u.account)}
                          className="p-1.5 rounded-lg transition-all text-gray-400 hover:text-red-500 hover:bg-red-50">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <span className="text-xs text-gray-400">第 {page} / {totalPages} 页</span>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="p-1.5 rounded-lg transition-all disabled:opacity-40"
                style={{ border: '1px solid #e5e7eb' }}>
                <ChevronLeft size={14} />
              </button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="p-1.5 rounded-lg transition-all disabled:opacity-40"
                style={{ border: '1px solid #e5e7eb' }}>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
