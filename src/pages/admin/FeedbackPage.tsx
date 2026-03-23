import { useCallback, useEffect, useState } from 'react'
import { MessageSquare, ChevronLeft, ChevronRight, X, Send } from 'lucide-react'
import { getFeedbackList, updateFeedback, type Feedback } from '../../api/adminApi'

const STATUS_META: Record<string, { label: string; bg: string; color: string }> = {
  pending:    { label: '待处理', bg: '#fff7ed', color: '#ea580c' },
  processing: { label: '处理中', bg: '#eff6ff', color: '#1d4ed8' },
  resolved:   { label: '已解决', bg: '#f0fdf4', color: '#16a34a' },
}

interface ReplyModal {
  item: Feedback
  status: string
  reply: string
}

export default function FeedbackPage() {
  const [list, setList] = useState<Feedback[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [actionMsg, setActionMsg] = useState('')
  const [modal, setModal] = useState<ReplyModal | null>(null)
  const [saving, setSaving] = useState(false)

  const limit = 20
  const totalPages = Math.max(1, Math.ceil(total / limit))

  const fetchData = useCallback(() => {
    setLoading(true)
    getFeedbackList({ page, limit, status: statusFilter || undefined })
      .then(d => { setList(d.list); setTotal(d.total) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [page, statusFilter])

  useEffect(() => { fetchData() }, [fetchData])

  function flash(msg: string) {
    setActionMsg(msg)
    setTimeout(() => setActionMsg(''), 3500)
  }

  function openModal(item: Feedback) {
    setModal({ item, status: item.status, reply: item.reply ?? '' })
  }

  async function handleSave() {
    if (!modal) return
    setSaving(true)
    try {
      await updateFeedback(modal.item._id, { status: modal.status, reply: modal.reply })
      flash('✓ 已保存')
      setModal(null)
      fetchData()
    } catch (e) {
      flash(`✗ ${e instanceof Error ? e.message : '保存失败'}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="font-bold mb-1" style={{ color: '#1B3A6B', fontFamily: '"Ma Shan Zheng", serif', fontSize: '24px' }}>
          反馈管理
        </h1>
        <p className="text-sm text-gray-400">共 {total} 条反馈</p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-5">
        {['', 'pending', 'processing', 'resolved'].map(s => {
          const meta = s ? STATUS_META[s] : null
          return (
            <button key={s}
              onClick={() => { setStatusFilter(s); setPage(1) }}
              className="px-4 py-2 rounded-lg text-sm transition-all"
              style={statusFilter === s
                ? { background: '#1B3A6B', color: '#fff' }
                : { border: '1px solid #e5e7eb', color: '#6b7280' }}>
              {s === '' ? '全部' : meta?.label}
            </button>
          )
        })}
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
              {['用户ID', '标题', '内容', '状态', '时间', '操作'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-gray-50">
                  {[...Array(6)].map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 rounded" style={{ background: '#f3f4f6', width: '75%' }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : list.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-400">暂无反馈</td></tr>
            ) : list.map(f => {
              const meta = STATUS_META[f.status] ?? STATUS_META.pending
              return (
                <tr key={f._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-xs text-gray-400 font-mono">{f.userId?.slice(0, 12)}...</td>
                  <td className="px-4 py-3 text-sm font-medium" style={{ color: '#1B3A6B', maxWidth: '140px' }}>
                    <span className="truncate block">{f.title || '无标题'}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 max-w-xs">
                    <span className="truncate block">{f.content?.slice(0, 60)}{f.content?.length > 60 ? '...' : ''}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium"
                      style={{ background: meta.bg, color: meta.color }}>
                      {meta.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {f.createdAt ? new Date(f.createdAt).toLocaleDateString('zh-CN') : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => openModal(f)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                      style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#1d4ed8'; e.currentTarget.style.color = '#fff' }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.color = '#1d4ed8' }}>
                      <MessageSquare size={11} /> 回复
                    </button>
                  </td>
                </tr>
              )
            })}
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

      {/* Reply Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={e => { if (e.target === e.currentTarget) setModal(null) }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold" style={{ color: '#1B3A6B' }}>回复反馈</h3>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Original content */}
              <div className="rounded-xl p-4" style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}>
                <p className="text-xs text-gray-400 mb-1">用户反馈</p>
                <p className="text-sm font-medium mb-2" style={{ color: '#1B3A6B' }}>{modal.item.title}</p>
                <p className="text-sm text-gray-600">{modal.item.content}</p>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: '#555' }}>处理状态</label>
                <div className="flex gap-2">
                  {Object.entries(STATUS_META).map(([key, { label, bg, color }]) => (
                    <button key={key}
                      onClick={() => setModal(m => m ? { ...m, status: key } : m)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                      style={modal.status === key
                        ? { background: color, color: '#fff' }
                        : { background: bg, color }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reply */}
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: '#555' }}>回复内容</label>
                <textarea
                  rows={4}
                  value={modal.reply}
                  onChange={e => setModal(m => m ? { ...m, reply: e.target.value } : m)}
                  placeholder="输入回复内容..."
                  className="w-full px-4 py-3 text-sm rounded-lg outline-none resize-none"
                  style={{ border: '1.5px solid #e8edf5', fontFamily: '"Noto Sans SC", sans-serif' }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#4DBFB4')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#e8edf5')}
                />
              </div>

              <div className="flex justify-end gap-3">
                <button onClick={() => setModal(null)}
                  className="px-5 py-2.5 rounded-xl text-sm transition-all"
                  style={{ border: '1px solid #e5e7eb', color: '#6b7280' }}>
                  取消
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all"
                  style={{ background: saving ? '#9ca3af' : '#4DBFB4', cursor: saving ? 'not-allowed' : 'pointer' }}>
                  <Send size={14} /> {saving ? '保存中...' : '保存回复'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
