import { useCallback, useEffect, useState } from 'react'
import { Trash2, Eye, EyeOff, Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { getWorks, updateWorkStatus, updateWorkFeatured, deleteWork, type Work } from '../../api/adminApi'

export default function WorksPage() {
  const [list, setList] = useState<Work[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [actionMsg, setActionMsg] = useState('')

  const limit = 20
  const totalPages = Math.max(1, Math.ceil(total / limit))

  const fetchData = useCallback(() => {
    setLoading(true)
    getWorks({ page, limit, status: statusFilter || undefined })
      .then(d => { setList(d.list); setTotal(d.total) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [page, statusFilter])

  useEffect(() => { fetchData() }, [fetchData])

  function flash(msg: string) {
    setActionMsg(msg)
    setTimeout(() => setActionMsg(''), 3500)
  }

  async function toggleStatus(w: Work) {
    const next = w.status === 'published' ? 'draft' : 'published'
    try {
      await updateWorkStatus(w.workId, next)
      flash(`✓ 已${next === 'published' ? '发布' : '下架'}`)
      fetchData()
    } catch (e) {
      flash(`✗ ${e instanceof Error ? e.message : '操作失败'}`)
    }
  }

  async function toggleFeatured(w: Work) {
    try {
      await updateWorkFeatured(w.workId, !w.featured)
      flash(`✓ 已${w.featured ? '取消精选' : '设为精选'}`)
      fetchData()
    } catch (e) {
      flash(`✗ ${e instanceof Error ? e.message : '操作失败'}`)
    }
  }

  async function handleDelete(workId: string, title: string) {
    if (!confirm(`确认删除作品「${title}」？此操作不可恢复。`)) return
    try {
      await deleteWork(workId)
      flash('✓ 已删除')
      fetchData()
    } catch (e) {
      flash(`✗ ${e instanceof Error ? e.message : '删除失败'}`)
    }
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="font-bold mb-1" style={{ color: '#1B3A6B', fontFamily: '"Ma Shan Zheng", serif', fontSize: '24px' }}>
          作品管理
        </h1>
        <p className="text-sm text-gray-400">共 {total} 件作品</p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-5">
        {['', 'published', 'draft'].map(s => (
          <button key={s}
            onClick={() => { setStatusFilter(s); setPage(1) }}
            className="px-4 py-2 rounded-lg text-sm transition-all"
            style={statusFilter === s
              ? { background: '#1B3A6B', color: '#fff' }
              : { border: '1px solid #e5e7eb', color: '#6b7280' }}>
            {s === '' ? '全部' : s === 'published' ? '已发布' : '草稿'}
          </button>
        ))}
        {actionMsg && (
          <span className="ml-auto text-xs px-3 py-1.5 rounded-full"
            style={actionMsg.startsWith('✓')
              ? { background: '#dcfce7', color: '#16a34a' }
              : { background: '#fee2e2', color: '#dc2626' }}>
            {actionMsg}
          </span>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              {['封面', '标题', '作者ID', '状态', '分析', '精选', '创建时间', '操作'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-gray-50">
                  {[...Array(8)].map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 rounded" style={{ background: '#f3f4f6', width: j === 0 ? '40px' : '70%' }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : list.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-12 text-center text-sm text-gray-400">暂无作品</td></tr>
            ) : list.map(w => (
              <tr key={w.workId} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  {w.coverUrl
                    ? <img src={w.coverUrl} alt="" className="w-12 h-12 rounded-lg object-cover" />
                    : <div className="w-12 h-12 rounded-lg flex items-center justify-center text-gray-300"
                        style={{ background: '#f3f4f6' }}>🖼</div>
                  }
                </td>
                <td className="px-4 py-3 text-sm font-medium" style={{ color: '#1B3A6B', maxWidth: '200px' }}>
                  <span className="truncate block">{w.title || '无标题'}</span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-400 font-mono">{w.authorId?.slice(0, 12)}...</td>
                <td className="px-4 py-3">
                  <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium"
                    style={w.status === 'published'
                      ? { background: '#dcfce7', color: '#16a34a' }
                      : { background: '#f3f4f6', color: '#6b7280' }}>
                    {w.status === 'published' ? '已发布' : '草稿'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium"
                    style={w.healingAnalyzed
                      ? { background: '#ede9fe', color: '#7c3aed' }
                      : { background: '#f3f4f6', color: '#9ca3af' }}>
                    {w.healingAnalyzed ? '已分析' : '未分析'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleFeatured(w)}
                    title={w.featured ? '取消首页展示' : '设为首页展示'}
                    className="p-1.5 rounded-lg transition-all"
                    style={{ color: w.featured ? '#f59e0b' : '#d1d5db' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#fef9c3')}
                    onMouseLeave={e => (e.currentTarget.style.background = '')}>
                    <Star size={15} fill={w.featured ? '#f59e0b' : 'none'} />
                  </button>
                </td>
                <td className="px-4 py-3 text-xs text-gray-400">
                  {w.createdAt ? new Date(w.createdAt).toLocaleDateString('zh-CN') : '—'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleStatus(w)}
                      className="p-1.5 rounded-lg transition-all"
                      title={w.status === 'published' ? '下架' : '发布'}
                      style={{ color: w.status === 'published' ? '#f59e0b' : '#4DBFB4' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
                      onMouseLeave={e => (e.currentTarget.style.background = '')}>
                      {w.status === 'published' ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                    <button onClick={() => handleDelete(w.workId, w.title || '该作品')}
                      className="p-1.5 rounded-lg transition-all text-gray-400 hover:text-red-500 hover:bg-red-50">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

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
