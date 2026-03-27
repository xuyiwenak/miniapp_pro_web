import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Shield } from 'lucide-react'
import { loginAdmin, getAdminMe } from '../../api/adminApi'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ account: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!form.account || !form.password) {
      setError('请填写账号和密码')
      return
    }
    setLoading(true)
    setError('')
    try {
      const token = await loginAdmin(form.account, form.password)
      localStorage.setItem('admin_token', token)
      const info = await getAdminMe()
      // level: 1=SuperAdmin, 2=Admin, 3=User — only <=2 can access
      if (info.level > 2) {
        localStorage.removeItem('admin_token')
        setError('当前账号没有管理员权限')
        setLoading(false)
        return
      }
      localStorage.setItem('admin_info', JSON.stringify(info))
      navigate('/admin/dashboard', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败，请检查账号或密码')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy"
      style={{ background: 'linear-gradient(135deg, #0d1f45 0%, #1B3A6B 60%, #1e4a7a 100%)' }}>

      {/* 水彩背景装饰 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #C8529A, transparent 70%)' }} />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #4DBFB4, transparent 70%)' }} />
      </div>

      <div className="relative w-full max-w-md mx-4">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-10 pb-8 text-center"
            style={{ background: 'linear-gradient(135deg, #1B3A6B 0%, #1e4a7a 100%)' }}>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
              style={{ background: 'rgba(77,191,180,0.2)', border: '2px solid rgba(77,191,180,0.5)' }}>
              <Shield size={28} color="#4DBFB4" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1"
              style={{ fontFamily: '"Ma Shan Zheng", serif' }}>
              管理后台
            </h1>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: '"Noto Sans SC", sans-serif' }}>
              原色有感艺术疗愈平台 · Admin Panel
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="px-8 py-8 space-y-5">
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm"
                style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', fontFamily: '"Noto Sans SC", sans-serif' }}>
                <span>⚠</span> {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium mb-2"
                style={{ color: '#555', fontFamily: '"Noto Sans SC", sans-serif', letterSpacing: '0.04em' }}>
                账号
              </label>
              <input
                type="text"
                autoComplete="username"
                placeholder="请输入管理员账号"
                value={form.account}
                onChange={e => setForm(f => ({ ...f, account: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all"
                style={{
                  border: '1.5px solid #e8edf5', background: '#fafcff',
                  color: '#1B3A6B', fontFamily: '"Noto Sans SC", sans-serif',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = '#4DBFB4')}
                onBlur={e => (e.currentTarget.style.borderColor = '#e8edf5')}
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-2"
                style={{ color: '#555', fontFamily: '"Noto Sans SC", sans-serif', letterSpacing: '0.04em' }}>
                密码
              </label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="请输入密码"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full px-4 py-3 pr-12 rounded-lg text-sm outline-none transition-all"
                  style={{
                    border: '1.5px solid #e8edf5', background: '#fafcff',
                    color: '#1B3A6B', fontFamily: '"Noto Sans SC", sans-serif',
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#4DBFB4')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#e8edf5')}
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-medium text-white text-sm transition-all"
              style={{
                background: loading ? '#9ca3af' : '#4DBFB4',
                letterSpacing: '0.1em',
                fontFamily: '"Noto Sans SC", sans-serif',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#3aada2' }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#4DBFB4' }}
            >
              {loading ? '登录中...' : '登 录'}
            </button>

            <p className="text-center text-xs pt-2" style={{ color: '#bbb', fontFamily: '"Noto Sans SC", sans-serif' }}>
              © 原色有感艺术疗愈平台管理系统
            </p>
          </form>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <a href="/" className="text-sm transition-colors"
            style={{ color: 'rgba(255,255,255,0.5)', fontFamily: '"Noto Sans SC", sans-serif' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}>
            ← 返回前台首页
          </a>
        </div>
      </div>
    </div>
  )
}
