/**
 * Hero: 2-row photo wall mosaic.
 * Row 1 (tall): pencils×2col | baby×1col | botanical×1col
 * Row 2 (short): animals×1col | hands×1col | wind×2col
 */

// 确保 BASE 以 / 结尾，避免 /appimages/ 这种拼接错误
const BASE = import.meta.env.BASE_URL.replace(/\/?$/, '/')
const MOSAIC = [
  { src: `${BASE}images/b1.jpg`, alt: '彩色铅笔特写', cols: 2 },
  { src: `${BASE}images/b2.jpg`, alt: '儿童蜡笔涂鸦', cols: 1 },
  { src: `${BASE}images/b3.png`, alt: '水彩植物花卉', cols: 1 },
  { src: `${BASE}images/b4.jpg`, alt: '彩色动物插画', cols: 1 },
  { src: `${BASE}images/b5.jpg`, alt: '双手触碰色彩', cols: 1 },
  { src: `${BASE}images/b6.jpg`, alt: '水墨风车插画', cols: 2 },
]

export default function Hero() {
  return (
    <section id="hero" style={{ background: '#f0ebe2', position: 'relative', overflow: 'hidden' }}>
      {/* Photo wall — 2 rows, 4-column grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: '360px 280px',
        gap: '4px',
        background: '#d8d0c8',
        lineHeight: 0,
      }}>
        {MOSAIC.map((img, i) => (
          <div key={i} style={{ gridColumn: `span ${img.cols}`, overflow: 'hidden' }}>
            <img
              src={img.src}
              alt={img.alt}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                transition: 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            />
          </div>
        ))}
      </div>

      {/* Tagline box emerging from bottom of mosaic */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        background: '#fff',
      }}>
        <div style={{
          width: 'min(680px, 85%)',
          padding: '32px 48px 48px',
          textAlign: 'center',
        }}>
          <h1 style={{
            fontFamily: '"Ma Shan Zheng", serif',
            fontWeight: 400,
            fontSize: 'clamp(32px, 5vw, 56px)',
            color: '#1a1a1a',
            letterSpacing: '0.05em',
            margin: '0 0 16px',
            lineHeight: 1.2,
          }}>
            指尖流转色彩，心中自有繁花
          </h1>
          <p style={{
            fontFamily: '"Noto Sans SC", sans-serif',
            fontSize: '15px',
            color: '#666',
            lineHeight: 1.9,
            marginBottom: '28px',
            fontWeight: 300,
          }}>
            一个温暖的疗愈作品工作室。<br />
            与学员一起，建立充满喜悦的可持续艺术创作习惯。
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#classes" style={{
              background: '#4DBFB4',
              color: '#fff',
              textDecoration: 'none',
              padding: '13px 36px',
              fontFamily: '"Noto Sans SC", sans-serif',
              fontSize: '13px',
              fontWeight: 500,
              letterSpacing: '0.1em',
              borderRadius: '2px',
              transition: 'background 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = '#3aada2')}
              onMouseLeave={e => (e.currentTarget.style.background = '#4DBFB4')}>
              浏览课程
            </a>
            <a href="#membership" style={{
              background: 'transparent',
              color: '#C8529A',
              textDecoration: 'none',
              padding: '13px 36px',
              fontFamily: '"Noto Sans SC", sans-serif',
              fontSize: '13px',
              fontWeight: 500,
              letterSpacing: '0.1em',
              borderRadius: '2px',
              border: '1.5px solid #C8529A',
              transition: 'background 0.2s, color 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#C8529A'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#C8529A' }}>
              加入共创集会
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
