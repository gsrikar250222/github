import type { Project } from '../data/projects'

/**
 * Generated silver-line covers. They are abstract motifs only — replace by setting
 * `media.image` / `media.video` on a project in data/projects.ts.
 */
const S = '#c7c9ce'
const M = '#92969e'
const W = '#ffffff'

function Motif({ kind }: { kind: Project['motif'] }) {
  switch (kind) {
    case 'orbit':
      return (
        <g fill="none" stroke={S} strokeWidth="1">
          {[40, 80, 120].map((r) => (
            <ellipse key={r} cx="200" cy="150" rx={r * 1.5} ry={r * 0.75} opacity={1 - r / 220} />
          ))}
          <ellipse cx="200" cy="150" rx="150" ry="150" opacity=".25" strokeDasharray="2 6" />
          <circle cx="200" cy="150" r="13" fill={W} stroke="none" />
          {[
            [320, 150],
            [110, 105],
            [250, 218],
            [152, 205],
            [276, 96],
          ].map(([x, y], i) => (
            <g key={i}>
              <line x1="200" y1="150" x2={x} y2={y} stroke={M} opacity=".55" />
              <circle cx={x} cy={y} r="6" fill={S} stroke="none" />
            </g>
          ))}
        </g>
      )
    case 'wave':
      return (
        <g stroke={S} strokeLinecap="round" strokeWidth="3">
          {Array.from({ length: 41 }, (_, i) => {
            const x = 30 + i * 8.5
            const h = 14 + Math.abs(Math.sin(i * 0.5) * 70 + Math.sin(i * 0.17) * 40) * (1 - Math.abs(i - 20) / 28)
            return <line key={i} x1={x} x2={x} y1={150 - h} y2={150 + h} opacity={0.35 + h / 160} />
          })}
        </g>
      )
    case 'glyph':
      return (
        <g fill={S} fontFamily="Georgia, serif" textAnchor="middle">
          {['A', 'अ', 'あ', 'த', 'ع', 'Ж', 'తె', 'ক', 'ß'].map((c, i) => (
            <text key={i} x={95 + (i % 3) * 105} y={110 + Math.floor(i / 3) * 70} fontSize={i === 4 ? 64 : 42} opacity={i === 4 ? 1 : 0.45} fill={i === 4 ? W : S}>
              {c}
            </text>
          ))}
        </g>
      )
    case 'grid':
      return (
        <g fill="none" stroke={S}>
          {Array.from({ length: 8 }, (_, i) => (
            <rect key={i} x={60 + (i % 4) * 70} y={70 + Math.floor(i / 4) * 85} width="58" height="72" rx="4" opacity={i === 5 ? 1 : 0.5} fill={i === 5 ? 'rgba(255,255,255,.12)' : 'none'} />
          ))}
          <path d="M60 238h280" opacity=".4" />
          <circle cx="330" cy="62" r="9" fill={W} stroke="none" />
        </g>
      )
    case 'lens':
      return (
        <g fill="none" stroke={S}>
          <circle cx="170" cy="140" r="70" />
          <circle cx="170" cy="140" r="44" opacity=".5" />
          <path d="M220 190l60 60" strokeWidth="6" strokeLinecap="round" stroke={W} />
          <path d="M100 140h140M170 70v140" opacity=".35" strokeDasharray="3 5" />
          {[0, 1, 2].map((i) => (
            <path key={i} d={`M290 ${80 + i * 18}h${70 - i * 12}`} opacity={0.6 - i * 0.15} strokeWidth="3" strokeLinecap="round" />
          ))}
        </g>
      )
    case 'terrain':
      return (
        <g stroke={S} fill="none">
          <path d="M20 220 90 140 150 190 220 90 290 170 380 110 380 280 20 280Z" fill="rgba(199,201,206,.12)" />
          <path d="M20 245 100 175 160 220 230 135 300 200 380 150" opacity=".6" />
          <path d="M20 268 110 215 170 250 240 185 310 238 380 200" opacity=".35" />
          <rect x="190" y="70" width="70" height="60" strokeDasharray="4 4" stroke={W} />
        </g>
      )
    case 'stack':
      return (
        <g fill="none" stroke={S}>
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={110 - i * 0} y={72 + i * 38} width={180 + (i % 2) * 40} height="28" rx="14" opacity={1 - i * 0.2} fill={i === 0 ? 'rgba(255,255,255,.14)' : 'none'} />
          ))}
          <circle cx="320" cy="86" r="10" fill={W} stroke="none" />
        </g>
      )
    case 'leaf':
      return (
        <g fill="none" stroke={S}>
          <path d="M200 250C120 200 110 110 200 50c90 60 80 150 0 200Z" />
          <path d="M200 250V70" opacity=".6" />
          {[100, 135, 170, 205].map((y, i) => (
            <g key={y} opacity={0.5}>
              <path d={`M200 ${y + 20}l${-28 + i * 3} ${-18}`} />
              <path d={`M200 ${y + 20}l${28 - i * 3} ${-18}`} />
            </g>
          ))}
          <circle cx="200" cy="150" r="108" opacity=".25" strokeDasharray="2 7" />
        </g>
      )
    case 'bars':
    default:
      return (
        <g fill="none" stroke={S}>
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i} opacity={1 - i * 0.12}>
              <rect x="60" y={70 + i * 40} width={290 - i * 40} height="14" rx="7" fill={i === 0 ? W : 'none'} stroke={i === 0 ? 'none' : S} />
            </g>
          ))}
          <path d="M60 290h290" opacity=".3" />
        </g>
      )
  }
}

export function ProjectCover({ project, index }: { project: Project; index: number }) {
  const { media } = project
  if (media?.video) {
    return (
      <video
        className="h-full w-full object-cover"
        src={media.video}
        poster={media.image}
        muted
        loop
        playsInline
        autoPlay
        aria-label={media.alt ?? `${project.name} preview video`}
      />
    )
  }
  if (media?.image) {
    return <img className="h-full w-full object-cover" src={media.image} alt={media.alt ?? `${project.name} preview`} loading="lazy" />
  }
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="h-full w-full" role="img" aria-label={`${project.name} generated cover artwork`}>
      <defs>
        <radialGradient id={`bg-${project.id}`} cx=".3" cy=".2" r="1">
          <stop offset="0" stopColor="#2a2c31" />
          <stop offset="1" stopColor="#080808" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#bg-${project.id})`} />
      <g stroke="#ffffff" strokeOpacity=".05">
        {Array.from({ length: 9 }, (_, i) => (
          <line key={i} x1={i * 50} x2={i * 50} y1="0" y2="300" />
        ))}
      </g>
      <Motif kind={project.motif} />
      <text x="20" y="284" fill={M} fontFamily="ui-monospace, monospace" fontSize="10" letterSpacing="2">
        {String(index + 1).padStart(2, '0')} / {project.category.split('/')[0].trim().toUpperCase()}
      </text>
    </svg>
  )
}
