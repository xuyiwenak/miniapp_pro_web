/**
 * Hero: 2-row mosaic photo wall with asymmetric column spans.
 *
 * Layout — 4-column grid:
 *   Row 1 (360px): b1 ×2col  |  b2 ×1col  |  b3 ×1col
 *   Row 2 (280px): b4 ×1col  |  b5 ×1col  |  b6 ×2col
 */

const BASE = import.meta.env.BASE_URL  // '/app/' in both dev and prod

const MOSAIC = [
  // Row 1
  { src: `${BASE}images/b1.jpg`, alt: '彩色铅笔特写', cols: 2 },
  { src: `${BASE}images/b2.jpg`, alt: '儿童蜡笔涂鸦', cols: 1 },
  { src: `${BASE}images/b3.png`, alt: '水彩植物花卉', cols: 1 },
  // Row 2
  { src: `${BASE}images/b4.jpg`, alt: '彩色动物插画', cols: 1 },
  { src: `${BASE}images/b5.jpg`, alt: '双手触碰色彩', cols: 1 },
  { src: `${BASE}images/b6.jpg`, alt: '水墨风车插画', cols: 2 },
]

export default function Hero() {
  return (
    <section id="hero" style={{ background: '#fff', position: 'relative', overflow: 'hidden' }}>

      {/* ── Photo Wall ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: '360px 280px',
        gap: '4px',
        background: '#e8e2da',
        lineHeight: 0,
      }}>
        {MOSAIC.map((img, i) => (
          <div
            key={i}
            style={{
              gridColumn: `span ${img.cols}`,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <img
              src={img.src}
              alt={img.alt}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            />
          </div>
        ))}
      </div>

      {/* ── Tagline Section ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        background: '#fff',
        padding: '0 24px',
      }}>
        <div style={{
          width: 'min(640px, 100%)',
          padding: '56px 0 64px',
          textAlign: 'center',
        }}>

          {/* Eyebrow label */}
          <p style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '11px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#4DBFB4',
            margin: '0 0 20px',
          }}>
            正念艺术工作室
          </p>

          {/* Main headline */}
          <h1 style={{
            fontFamily: '"Ma Shan Zheng", serif',
            fontWeight: 400,
            fontSize: 'clamp(34px, 5.5vw, 58px)',
            color: '#1a1a1a',
            letterSpacing: '0.04em',
            lineHeight: 1.25,
            margin: '0 0 20px',
          }}>
            指尖流转色彩，<br />心中自有繁花
          </h1>

          {/* Divider accent */}
          <div style={{
            width: '40px',
            height: '2px',
            background: '#C8529A',
            margin: '0 auto 24px',
            borderRadius: '1px',
          }} />

          {/* Subtitle */}
          <p style={{
            fontFamily: '"Noto Sans SC", sans-serif',
            fontSize: '15px',
            color: '#777',
            lineHeight: 1.95,
            margin: '0 0 36px',
            fontWeight: 300,
          }}>
            一个温暖的在线艺术工作室，让创意与正念在此相遇。<br />
            与千位学员一起，建立充满喜悦的可持续艺术创作习惯。
          </p>

          {/* CTA buttons */}
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}>
            <a
              href="#classes"
              style={{
                background: '#4DBFB4',
                color: '#fff',
                textDecoration: 'none',
                padding: '14px 40px',
                fontFamily: '"Noto Sans SC", sans-serif',
                fontSize: '13px',
                fontWeight: 500,
                letterSpacing: '0.12em',
                borderRadius: '2px',
                transition: 'background 0.2s',
                display: 'inline-block',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#3aada2')}
              onMouseLeave={e => (e.currentTarget.style.background = '#4DBFB4')}
            >
              浏览课程
            </a>
            <a
              href="#membership"
              style={{
                background: 'transparent',
                color: '#C8529A',
                textDecoration: 'none',
                padding: '14px 40px',
                fontFamily: '"Noto Sans SC", sans-serif',
                fontSize: '13px',
                fontWeight: 500,
                letterSpacing: '0.12em',
                borderRadius: '2px',
                border: '1.5px solid #C8529A',
                transition: 'background 0.2s, color 0.2s',
                display: 'inline-block',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#C8529A'
                e.currentTarget.style.color = '#fff'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = '#C8529A'
              }}
            >
              加入共创集会
            </a>
          </div>
        </div>
      </div>

    </section>
  )
}
