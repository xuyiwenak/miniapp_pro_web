import { useState } from 'react'

interface Props {
  onBack: () => void
}

export default function LoginPage({ onBack }: Props) {
  const [form, setForm] = useState({ username: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      fontFamily: '"Noto Sans SC", sans-serif',
    }}>
      {/* ── 左侧：温暖句子 + 水彩装饰 ── */}
      <div style={{
        flex: '0 0 55%',
        background: 'linear-gradient(150deg, #0d1f45 0%, #1B3A6B 55%, #1e4a7a 100%)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '64px 72px',
      }}>
        {/* 水彩花卉装饰 SVG */}
        <svg
          viewBox="0 0 600 700"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            <filter id="lp-soft">
              <feGaussianBlur stdDeviation="10" />
            </filter>
            <filter id="lp-wc">
              <feTurbulence type="fractalNoise" baseFrequency="0.025" numOctaves="4" seed="3" result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="20" />
            </filter>
          </defs>

          {/* 大粉色水彩晕染 */}
          <ellipse cx="480" cy="140" rx="180" ry="160" fill="rgba(200,82,154,0.22)" filter="url(#lp-soft)" />
          <ellipse cx="100" cy="580" rx="160" ry="140" fill="rgba(200,82,154,0.18)" filter="url(#lp-soft)" />
          <ellipse cx="320" cy="380" rx="120" ry="100" fill="rgba(77,191,180,0.12)" filter="url(#lp-soft)" />

          {/* 右上角大花 */}
          <g filter="url(#lp-wc)" opacity="0.7">
            {[0, 60, 120, 180, 240, 300].map((a, i) => {
              const r = (a * Math.PI) / 180
              return (
                <ellipse key={i}
                  cx={490 + Math.cos(r) * 65} cy={110 + Math.sin(r) * 65}
                  rx="55" ry="34"
                  fill={i % 2 === 0 ? '#C8529A' : '#d96ab0'}
                  opacity="0.75"
                  transform={`rotate(${a + 90}, ${490 + Math.cos(r) * 65}, ${110 + Math.sin(r) * 65})`}
                />
              )
            })}
            <circle cx="490" cy="110" r="22" fill="#e8a0d0" />
            <circle cx="490" cy="110" r="10" fill="#fff" opacity="0.6" />
          </g>

          {/* 左下角花 */}
          <g filter="url(#lp-wc)" opacity="0.6">
            {[0, 72, 144, 216, 288].map((a, i) => {
              const r = (a * Math.PI) / 180
              return (
                <ellipse key={i}
                  cx={80 + Math.cos(r) * 48} cy={590 + Math.sin(r) * 48}
                  rx="40" ry="25"
                  fill={i % 2 === 0 ? '#C8529A' : '#b03080'}
                  opacity="0.7"
                  transform={`rotate(${a + 90}, ${80 + Math.cos(r) * 48}, ${590 + Math.sin(r) * 48})`}
                />
              )
            })}
            <circle cx="80" cy="590" r="16" fill="#e8a0d0" opacity="0.8" />
          </g>

          {/* 白色线描花朵 */}
          <g stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" fill="none">
            <g transform="translate(180, 200)">
              {[0, 72, 144, 216, 288].map((a, i) => {
                const r = (a * Math.PI) / 180
                return (
                  <ellipse key={i}
                    cx={Math.cos(r) * 26} cy={Math.sin(r) * 26}
                    rx="15" ry="9"
                    transform={`rotate(${a + 90}, ${Math.cos(r) * 26}, ${Math.sin(r) * 26})`}
                  />
                )
              })}
              <circle cx="0" cy="0" r="8" />
              <line x1="0" y1="35" x2="0" y2="110" />
              <path d="M0,70 Q28,55 40,38" />
              <path d="M0,85 Q-28,70 -38,54" />
            </g>
            <g transform="translate(400, 480)">
              {[0, 60, 120, 180, 240, 300].map((a, i) => {
                const r = (a * Math.PI) / 180
                return (
                  <ellipse key={i}
                    cx={Math.cos(r) * 18} cy={Math.sin(r) * 18}
                    rx="11" ry="7"
                    transform={`rotate(${a + 90}, ${Math.cos(r) * 18}, ${Math.sin(r) * 18})`}
                  />
                )
              })}
              <circle cx="0" cy="0" r="6" />
            </g>
            {/* 散点 */}
            {[...Array(10)].map((_, i) => (
              <circle key={i}
                cx={30 + i * 55} cy={300 + (i % 3) * 60}
                r="2" fill="rgba(255,255,255,0.3)" stroke="none"
              />
            ))}
          </g>
        </svg>

        {/* 返回首页 */}
        <button
          onClick={onBack}
          style={{
            position: 'absolute', top: '24px', left: '32px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '20px',
            color: 'rgba(255,255,255,0.8)',
            fontSize: '12px',
            fontFamily: '"Noto Sans SC", sans-serif',
            padding: '6px 16px',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.18)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m15 18-6-6 6-6" />
          </svg>
          返回首页
        </button>

        {/* Logo */}
        <div style={{ marginBottom: '56px', position: 'relative' }}>
          <p style={{
            fontFamily: '"Ma Shan Zheng", serif',
            fontSize: '20px',
            color: '#4DBFB4',
            letterSpacing: '0.08em',
            marginBottom: '2px',
          }}>正念艺术工作室</p>
          <div style={{ width: '36px', height: '2px', background: 'rgba(200,82,154,0.6)', borderRadius: '1px' }} />
        </div>

        {/* 温暖句子 */}
        <div style={{ position: 'relative', maxWidth: '420px' }}>
          {/* 装饰引号 */}
          <div style={{
            fontFamily: '"Ma Shan Zheng", serif',
            fontSize: '96px',
            color: 'rgba(200,82,154,0.2)',
            lineHeight: 1,
            marginBottom: '-24px',
            userSelect: 'none',
          }}>「</div>

          <blockquote style={{ margin: 0, padding: '0 0 0 8px' }}>
            <p style={{
              fontFamily: '"Ma Shan Zheng", serif',
              fontSize: 'clamp(26px, 3vw, 38px)',
              color: '#fff',
              lineHeight: 1.65,
              letterSpacing: '0.06em',
              marginBottom: '24px',
            }}>
              每一笔落下，<br />
              都是与自己<br />
              <span style={{ color: '#C8529A' }}>温柔相遇</span>的时刻。
            </p>
            <p style={{
              fontFamily: '"Noto Sans SC", sans-serif',
              fontSize: '14px',
              color: 'rgba(255,255,255,0.55)',
              lineHeight: 1.9,
              fontWeight: 300,
              marginBottom: '32px',
            }}>
              艺术不是逃避现实，<br />
              而是找到回家的路。<br />
              拿起画笔，让内心的声音轻声说话。
            </p>
          </blockquote>

          {/* 关闭引号 */}
          <div style={{
            fontFamily: '"Ma Shan Zheng", serif',
            fontSize: '96px',
            color: 'rgba(200,82,154,0.2)',
            lineHeight: 1,
            textAlign: 'right',
            marginTop: '-32px',
            userSelect: 'none',
          }}>」</div>
        </div>

        {/* 底部装饰标语 */}
        <div style={{
          position: 'absolute', bottom: '36px', left: '72px',
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <div style={{ width: '32px', height: '1px', background: 'rgba(77,191,180,0.5)' }} />
          <span style={{
            fontFamily: '"Noto Sans SC", sans-serif',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.35)',
            letterSpacing: '0.15em',
          }}>以艺为道，疗愈身心</span>
          <div style={{ width: '32px', height: '1px', background: 'rgba(77,191,180,0.5)' }} />
        </div>
      </div>

      {/* ── 右侧：登录表单 ── */}
      <div style={{
        flex: 1,
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 40px',
      }}>
        <div style={{ width: '100%', maxWidth: '360px' }}>
          {/* 标题 */}
          <h1 style={{
            fontFamily: '"Ma Shan Zheng", serif',
            fontSize: '40px',
            color: '#1B3A6B',
            marginBottom: '6px',
            lineHeight: 1.2,
          }}>
            欢迎回来
          </h1>
          <p style={{
            fontFamily: '"Noto Sans SC", sans-serif',
            fontSize: '13px',
            color: '#999',
            marginBottom: '40px',
            fontWeight: 300,
          }}>
            登录你的艺术创作空间
          </p>

          {/* 用户名 */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontFamily: '"Noto Sans SC", sans-serif',
              fontSize: '12px',
              color: '#555',
              marginBottom: '6px',
              letterSpacing: '0.04em',
            }}>用户名 / 邮箱</label>
            <input
              type="text"
              placeholder="请输入用户名或邮箱"
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1.5px solid #e8edf5',
                borderRadius: '4px',
                fontSize: '14px',
                fontFamily: '"Noto Sans SC", sans-serif',
                color: '#1B3A6B',
                outline: 'none',
                boxSizing: 'border-box',
                background: '#fafcff',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = '#4DBFB4')}
              onBlur={e => (e.currentTarget.style.borderColor = '#e8edf5')}
            />
          </div>

          {/* 密码 */}
          <div style={{ marginBottom: '10px' }}>
            <label style={{
              display: 'block',
              fontFamily: '"Noto Sans SC", sans-serif',
              fontSize: '12px',
              color: '#555',
              marginBottom: '6px',
              letterSpacing: '0.04em',
            }}>密码</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="请输入密码"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '12px 44px 12px 16px',
                  border: '1.5px solid #e8edf5',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontFamily: '"Noto Sans SC", sans-serif',
                  color: '#1B3A6B',
                  outline: 'none',
                  boxSizing: 'border-box',
                  background: '#fafcff',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = '#4DBFB4')}
                onBlur={e => (e.currentTarget.style.borderColor = '#e8edf5')}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '12px', top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#aab', padding: '4px',
                }}
                aria-label={showPassword ? '隐藏密码' : '显示密码'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {showPassword
                    ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></>
                    : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>
                  }
                </svg>
              </button>
            </div>
          </div>

          {/* 忘记密码 */}
          <div style={{ textAlign: 'right', marginBottom: '28px' }}>
            <a href="#" style={{
              fontFamily: '"Noto Sans SC", sans-serif',
              fontSize: '12px',
              color: '#4DBFB4',
              textDecoration: 'none',
            }}
              onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}>
              忘记密码？
            </a>
          </div>

          {/* 登录按钮 */}
          <button
            style={{
              width: '100%',
              padding: '14px',
              background: '#4DBFB4',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              fontFamily: '"Noto Sans SC", sans-serif',
              fontWeight: 500,
              letterSpacing: '0.1em',
              cursor: 'pointer',
              transition: 'background 0.2s, transform 0.1s',
              marginBottom: '16px',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#3aada2')}
            onMouseLeave={e => (e.currentTarget.style.background = '#4DBFB4')}
            onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.98)')}
            onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            登 录
          </button>

          {/* 分割线 */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            margin: '20px 0',
          }}>
            <div style={{ flex: 1, height: '1px', background: '#eee' }} />
            <span style={{ fontFamily: '"Noto Sans SC", sans-serif', fontSize: '11px', color: '#ccc' }}>或</span>
            <div style={{ flex: 1, height: '1px', background: '#eee' }} />
          </div>

          {/* 注册入口 */}
          <p style={{
            textAlign: 'center',
            fontFamily: '"Noto Sans SC", sans-serif',
            fontSize: '13px',
            color: '#888',
            fontWeight: 300,
          }}>
            还没有账号？{' '}
            <a href="#membership" style={{
              color: '#C8529A',
              textDecoration: 'none',
              fontWeight: 500,
            }}
              onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}>
              立即加入工作室 →
            </a>
          </p>

          {/* 底部版权 */}
          <p style={{
            textAlign: 'center',
            fontFamily: '"Noto Sans SC", sans-serif',
            fontSize: '11px',
            color: '#ccc',
            marginTop: '48px',
            fontWeight: 300,
          }}>
            © 正念艺术工作室 · 版权所有
          </p>
        </div>
      </div>
    </div>
  )
}
