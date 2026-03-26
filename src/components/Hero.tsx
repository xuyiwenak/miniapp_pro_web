/**
 * Hero: Photo wall mosaic using actual artwork images + "MAKE ART, FEEL BETTER." tagline.
 * Layout: 2-row CSS grid mosaic — 3 images top row, 4 images bottom row.
 */

// 8 images across 3 rows in a 4-column grid
// Row 1: pencils(2col) | baby(1col) | botanical(1col)
// Row 2: animals(2col) | hands(1col) | wind(1col)
// Row 3: orange-flowers(2col) | mandala(2col)
const ROWS = [
  [
    { src: '/images/b1.jpg', alt: 'Rainbow of sharpened colored pencils', cols: 2, rows: 1 },
    { src: '/images/b2.jpg', alt: 'Baby drawing with crayons', cols: 1, rows: 1 },
    { src: '/images/b3.png', alt: 'Soft watercolor botanical flowers', cols: 1, rows: 1 },
  ],
  [
    { src: '/images/b4.jpg', alt: 'Colorful crayon drawing of animals', cols: 2, rows: 1 },
    { src: '/images/b5.jpg', alt: 'Hands covered in colorful art writing', cols: 1, rows: 1 },
    { src: '/images/b6.jpg', alt: 'Ink illustration of offshore wind turbines', cols: 1, rows: 1 },
  ],
  [
    { src: '/images/b7.jpg', alt: 'Orange watercolor flowers with ink line art', cols: 2, rows: 1 },
    { src: '/images/b8.png', alt: 'Hands coloring a mandala with colored pencils', cols: 2, rows: 1 },
  ],
]

export default function Hero() {
  return (
    <section id="hero" style={{ background: '#f0ebe2', position: 'relative', overflow: 'hidden' }}>
      {/* Photo wall mosaic — 3 rows, 4-column grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: '260px 240px 220px',
        gap: '3px',
        background: '#d8d0c8',
        lineHeight: 0,
      }}>
        {ROWS.flat().map((img, i) => (
          <div key={i} style={{ gridColumn: `span ${img.cols}`, overflow: 'hidden' }}>
            <img
              src={img.src}
              alt={img.alt}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                transition: 'transform 0.5s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
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
            一个温暖的在线艺术工作室。<br />
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
