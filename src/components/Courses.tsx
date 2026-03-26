const COURSES = [
  {
    title: '水彩花卉',
    subtitle: '适合初学者',
    description: '学习湿碰湿与湿碰干两种水彩技法，描绘出光彩流动的花朵。零基础也能轻松上手。',
    gradient: 'linear-gradient(135deg, #C8529A 0%, #e891c9 40%, #4DBFB4 100%)',
    accent: '#C8529A',
    sessions: '共 8 节课',
    level: '入门级',
  },
  {
    title: '艺术日记',
    subtitle: '综合媒材',
    description: '融合拼贴、绘画与文字，搭建一套可视化的日记创作习惯，深化自我觉察与创意流动。',
    gradient: 'linear-gradient(135deg, #1B3A6B 0%, #2d5fa0 50%, #C8529A 100%)',
    accent: '#4DBFB4',
    sessions: '共 6 节课',
    level: '全程适合',
  },
  {
    title: '笔触',
    subtitle: '冥想与艺术',
    description: '放慢节奏，用有意识的笔触重新连接自我。每节课以呼吸练习开场，温柔疗愈。',
    gradient: 'linear-gradient(135deg, #0d2a58 0%, #1B3A6B 50%, #4DBFB4 80%)',
    accent: '#C8529A',
    sessions: '共 4 节课',
    level: '全程适合',
  },
  {
    title: '植物插画',
    subtitle: '钢笔与墨水',
    description: '从写生中培养细致的观察力，用精细的线条描绘叶脉、花瓣与茎干，感受自然的静谧。',
    gradient: 'linear-gradient(135deg, #2a5230 0%, #4a8c55 50%, #9fd8a2 100%)',
    accent: '#4DBFB4',
    sessions: '共 10 节课',
    level: '进阶级',
  },
  {
    title: '抽象表现',
    subtitle: '丙烯与肌理',
    description: '放下对完美的执念，探索大胆的色彩、充满张力的笔触与丰富的肌理层次，尽情表达。',
    gradient: 'linear-gradient(135deg, #8b1a5e 0%, #C8529A 50%, #f5b8dc 100%)',
    accent: '#C8529A',
    sessions: '共 6 节课',
    level: '全程适合',
  },
  {
    title: '共创集会',
    subtitle: '每月直播课',
    description: '加入温暖的小群体直播交流——在这里分享作品、接收反馈、彼此陪伴，共同成长。',
    gradient: 'linear-gradient(135deg, #1a2f5e 0%, #1B3A6B 40%, #3a6b9e 100%)',
    accent: '#4DBFB4',
    sessions: '每月直播',
    level: '仅限会员',
  },
]

export default function Courses() {
  return (
    <section
      id="classes"
      style={{
        background: 'linear-gradient(180deg, #0d1f45 0%, #1B3A6B 100%)',
        padding: '96px 48px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle background texture */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.04,
        backgroundImage: `radial-gradient(circle, #C8529A 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
        {/* Section header */}
        <div style={{ marginBottom: '64px' }}>
          <p style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '12px',
            letterSpacing: '0.2em',
            color: '#4DBFB4',
            marginBottom: '12px',
            textTransform: 'uppercase',
          }}>
            在线课程
          </p>
          <h2 style={{
            fontFamily: '"Ma Shan Zheng", serif',
            fontSize: 'clamp(36px, 5vw, 56px)',
            fontWeight: 400,
            color: '#fff',
            lineHeight: 1.3,
            maxWidth: '520px',
          }}>
            用心创作，<br />
            <span style={{ color: '#C8529A' }}>以笔传神</span>
          </h2>
        </div>

        {/* Course grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '28px',
        }}>
          {COURSES.map((course) => (
            <article
              key={course.title}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                overflow: 'hidden',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.transform = 'translateY(-4px)'
                el.style.boxShadow = '0 16px 48px rgba(0,0,0,0.4)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.transform = 'translateY(0)'
                el.style.boxShadow = 'none'
              }}
            >
              {/* Thumbnail — watercolor gradient */}
              <div style={{
                height: '180px',
                background: course.gradient,
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* Decorative SVG overlay */}
                <svg viewBox="0 0 320 180" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.3 }} aria-hidden="true">
                  <defs>
                    <filter id={`thumb-${course.title.replace(/\s/g, '')}`}>
                      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" />
                      <feDisplacementMap in="SourceGraphic" scale="12" />
                    </filter>
                  </defs>
                  <ellipse cx="80" cy="90" rx="70" ry="80" fill="rgba(255,255,255,0.25)" filter={`url(#thumb-${course.title.replace(/\s/g, '')})`} />
                  <ellipse cx="240" cy="100" rx="60" ry="70" fill="rgba(255,255,255,0.15)" filter={`url(#thumb-${course.title.replace(/\s/g, '')})`} />
                </svg>
                {/* Level badge */}
                <span style={{
                  position: 'absolute', top: '12px', right: '12px',
                  background: 'rgba(0,0,0,0.35)',
                  backdropFilter: 'blur(8px)',
                  color: '#fff',
                  fontSize: '10px',
                  letterSpacing: '0.08em',
                  padding: '4px 10px',
                  borderRadius: '2px',
                  fontFamily: '"DM Sans", sans-serif',
                }}>
                  {course.level}
                </span>
              </div>

              {/* Card body */}
              <div style={{ padding: '24px 28px 28px' }}>
                <p style={{
                  fontFamily: '"Noto Sans SC", sans-serif',
                  fontSize: '11px',
                  letterSpacing: '0.12em',
                  color: course.accent,
                  marginBottom: '6px',
                }}>
                  {course.subtitle}
                </p>
                <h3 style={{
                  fontFamily: '"ZCOOL XiaoWei", serif',
                  fontSize: '22px',
                  fontWeight: 400,
                  color: '#fff',
                  marginBottom: '12px',
                  lineHeight: 1.3,
                }}>
                  {course.title}
                </h3>
                <p style={{
                  fontFamily: '"Noto Sans SC", sans-serif',
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.65)',
                  lineHeight: 1.9,
                  marginBottom: '24px',
                  fontWeight: 300,
                }}>
                  {course.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.45)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    {course.sessions}
                  </span>
                  <button style={{
                    background: 'transparent',
                    border: `1px solid ${course.accent}`,
                    color: course.accent,
                    padding: '8px 20px',
                    borderRadius: '2px',
                    fontSize: '11px',
                    fontFamily: '"DM Sans", sans-serif',
                    letterSpacing: '0.1em',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'background 0.2s, color 0.2s',
                  }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = course.accent
                      e.currentTarget.style.color = '#fff'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = course.accent
                    }}>
                    探索 →
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA row */}
        <div style={{ textAlign: 'center', marginTop: '64px' }}>
          <a href="#membership" style={{
            display: 'inline-block',
            padding: '16px 48px',
            background: '#4DBFB4',
            color: '#fff',
            textDecoration: 'none',
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '13px',
            fontWeight: 600,
            letterSpacing: '0.12em',
            borderRadius: '3px',
            transition: 'background 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.background = '#3aada2')}
            onMouseLeave={e => (e.currentTarget.style.background = '#4DBFB4')}>
            查看全部课程
          </a>
          <p style={{
            marginTop: '16px',
            fontFamily: '"Noto Sans SC", sans-serif',
            fontSize: '13px',
            color: 'rgba(255,255,255,0.4)',
            fontWeight: 300,
          }}>
            成为会员，解锁全部课程 + 每月直播
          </p>
        </div>
      </div>
    </section>
  )
}
