import { useState } from 'react'

interface NavbarProps {
  onLoginClick?: () => void
}

const NAV_LINKS = [
  { label: '会员计划', href: '#membership', active: false },
  { label: '关于我们', href: '#about', active: false },
  { label: '浏览课程', href: '#classes', active: false, hasDropdown: true },
  { label: '学习资源', href: '#resources', active: false, hasDropdown: true },
  { label: '首页', href: '#', active: true },
]

export default function Navbar({ onLoginClick }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header style={{ position: 'relative', zIndex: 50 }}>
      {/* Top utility bar — teal background */}
      <div style={{
        background: '#4DBFB4',
        padding: '7px 32px',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: '24px',
      }}>
        <a href="#" style={{
          color: '#fff',
          textDecoration: 'none',
          fontSize: '11px',
          letterSpacing: '0.06em',
          fontFamily: '"DM Sans", sans-serif',
          fontWeight: 500,
        }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
        </a>
        <a href="#" style={{
          color: '#fff',
          textDecoration: 'none',
          fontSize: '11px',
          letterSpacing: '0.06em',
          fontFamily: '"Noto Sans SC", sans-serif',
          fontWeight: 500,
        }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          onClick={e => { e.preventDefault(); onLoginClick?.() }}>
          登录
        </a>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 2px', color: '#fff', display: 'flex', alignItems: 'center' }}
          aria-label="Cart">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM7.8 13H17c.75 0 1.41-.41 1.75-1.03L21.7 5H5.21L4.27 2H1v2h2l3.6 7.59-1.35 2.44C4.52 14.37 5.48 16 7 16h12v-2H7.42l.38-1z" />
          </svg>
        </button>
      </div>

      {/* Main navbar — white background */}
      <nav style={{
        background: '#fff',
        padding: '12px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #eee',
      }}>
        {/* Logo */}
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', flexShrink: 0 }}>
          <svg width="64" height="64" viewBox="0 0 80 80">
            {/* Paint splash background */}
            <ellipse cx="38" cy="42" rx="32" ry="28" fill="rgba(200,82,154,0.12)" />
            {/* Colorful paint blobs */}
            <ellipse cx="28" cy="38" rx="14" ry="9" fill="#C8529A" opacity="0.9" transform="rotate(-25 28 38)" />
            <ellipse cx="42" cy="30" rx="12" ry="8" fill="#4DBFB4" opacity="0.9" transform="rotate(15 42 30)" />
            <ellipse cx="52" cy="44" rx="13" ry="8" fill="#f5a623" opacity="0.85" transform="rotate(40 52 44)" />
            <ellipse cx="36" cy="52" rx="10" ry="7" fill="#7ed321" opacity="0.8" transform="rotate(-10 36 52)" />
            <ellipse cx="22" cy="50" rx="9" ry="6" fill="#4a90d9" opacity="0.8" transform="rotate(20 22 50)" />
            {/* Brand text overlay */}
            <text x="6" y="38" fontFamily='"Ma Shan Zheng", serif' fontSize="12" fill="#fff" fontWeight="400">原色有感</text>
            <text x="8" y="52" fontFamily='"ZCOOL XiaoWei", serif' fontSize="9" fill="rgba(255,255,255,0.9)" letterSpacing="2">工作室</text>
          </svg>
        </a>

        {/* Desktop nav links */}
        <ul style={{
          display: 'flex',
          listStyle: 'none',
          gap: '28px',
          margin: 0,
          padding: 0,
          alignItems: 'center',
        }} className="hidden-mobile">
          {NAV_LINKS.map(link => (
            <li key={link.label} style={{ position: 'relative' }}>
              <a href={link.href} style={{
                color: link.active ? '#C8529A' : '#2a2a2a',
                textDecoration: 'none',
                fontSize: '13px',
                letterSpacing: '0.05em',
                fontFamily: '"Noto Sans SC", sans-serif',
                fontWeight: 400,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'color 0.2s',
              }}
                onMouseEnter={e => { if (!link.active) e.currentTarget.style.color = '#C8529A' }}
                onMouseLeave={e => { if (!link.active) e.currentTarget.style.color = '#2a2a2a' }}>
                {link.label}
                {link.hasDropdown && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                )}
              </a>
            </li>
          ))}
          <li>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#2a2a2a', display: 'flex', alignItems: 'center' }}
              aria-label="Search"
              onMouseEnter={e => (e.currentTarget.style.color = '#C8529A')}
              onMouseLeave={e => (e.currentTarget.style.color = '#2a2a2a')}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2a2a2a', display: 'none' }}
          className="show-mobile"
          aria-label="Toggle menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen
              ? <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>
              : <><path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" /></>}
          </svg>
        </button>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{
          background: '#fff',
          borderTop: '1px solid #eee',
          padding: '12px 24px',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {NAV_LINKS.map(link => (
            <a key={link.label} href={link.href} style={{
              color: link.active ? '#C8529A' : '#2a2a2a',
              textDecoration: 'none',
              fontSize: '13px',
              letterSpacing: '0.05em',
              padding: '12px 0',
              borderBottom: '1px solid #f0f0f0',
              fontFamily: '"Noto Sans SC", sans-serif',
            }}>
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  )
}
