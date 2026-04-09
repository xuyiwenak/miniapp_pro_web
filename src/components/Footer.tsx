const FOOTER_LINKS = [
  { label: '商店', href: '#' },
  { label: '我的账户', href: '#' },
  { label: '购物车', href: '#' },
  { label: '联系我们', href: '#' },
]

export default function Footer() {
  return (
    <footer style={{
      background: '#3D3D3D',
      borderTop: '1px solid rgba(255,255,255,0.06)',
    }}>
      {/* Main footer links */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '32px',
        padding: '20px 32px',
        flexWrap: 'wrap',
      }}>
        {FOOTER_LINKS.map((link, i) => (
          <span key={link.label} style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <a
              href={link.href}
              style={{
                color: 'rgba(255,255,255,0.6)',
                textDecoration: 'none',
                fontSize: '12px',
                letterSpacing: '0.06em',
                fontFamily: '"Noto Sans SC", sans-serif',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#4DBFB4')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}>
              {link.label}
            </a>
            {i < FOOTER_LINKS.length - 1 && (
              <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '10px' }}>·</span>
            )}
          </span>
        ))}
      </div>

      {/* Copyright */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '14px 32px',
        textAlign: 'center',
      }}>
        <p style={{
          fontFamily: '"Noto Sans SC", sans-serif',
          fontSize: '11px',
          color: 'rgba(255,255,255,0.35)',
          lineHeight: 1.7,
        }}>
          © &amp; ® 原色有感疗愈作品工作室 · 版权所有 ·{' '}
          <a href="#" style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'underline' }}>隐私政策</a>
          {' '}· 包容即爱
        </p>

        {/* 备案信息 */}
        <p style={{
          fontFamily: '"Noto Sans SC", sans-serif',
          fontSize: '11px',
          color: 'rgba(255,255,255,0.25)',
          lineHeight: 1.8,
          marginTop: '4px',
        }}>
          <a
            href="https://beian.miit.gov.cn"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'rgba(255,255,255,0.25)', textDecoration: 'none', marginRight: '16px' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.25)')}>
            京ICP备2026012130号
          </a>
          <a
            href="https://beian.mps.gov.cn/#/query/webSearch?code=11010502059947"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'rgba(255,255,255,0.25)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.25)')}>
            <img src="https://beian.mps.gov.cn/img/logo01.dd7ff50e.png" alt="公安备案" style={{ width: '14px', height: '14px', verticalAlign: 'middle' }} />
            京公网安备11010502059947号
          </a>
        </p>
      </div>
    </footer>
  )
}
