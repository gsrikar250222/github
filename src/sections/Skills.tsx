import { lazy, Suspense, useMemo, useState } from 'react'
import { ArrowLeft, Search, X } from 'lucide-react'
import {
  LEVELS,
  SHOW_SKILL_LEVELS,
  clusters,
  levelLabel,
  skillCategories,
  uniqueSkillCount,
  type ClusterId,
  type Skill,
  type SkillLevel,
} from '../data/skills'
import { Reveal } from '../components/Reveal'
import { ClipReveal, Hairline, Stagger, StaggerItem } from '../components/motion'
import { SectionHeader } from '../components/ui'
import { useIsMobile, useNearViewport, useWebGL } from '../hooks/useEnv'
import { MOBILE_PITCH } from '../scenes/constants'
import { cn } from '../lib/utils'

const TechnologyScene = lazy(() => import('../scenes/TechnologyScene'))

const dot: Record<SkillLevel, string> = {
  building: 'bg-black',
  working: 'bg-metal',
  familiar: 'border border-metal',
  exploring: 'border border-dashed border-metal',
}
const Dot = ({ l }: { l: SkillLevel }) => <span aria-hidden className={cn('inline-block h-2 w-2 shrink-0 rounded-full', dot[l])} />

/* ── constellation block ─────────────────────────────────── */

type Hovered = (Skill & { category: string }) | null

function Constellation() {
  const webgl = useWebGL()
  const mobile = useIsMobile()
  const { ref, near, visible } = useNearViewport<HTMLDivElement>('300px')
  const [cluster, setCluster] = useState<ClusterId | null>(null)
  const [category, setCategory] = useState<string | null>(null)
  const [hover, setHover] = useState<Hovered>(null)

  const cats = useMemo(() => skillCategories.filter((c) => c.cluster === cluster), [cluster])
  const info = clusters.find((c) => c.id === cluster)
  const mobileCount = !mobile || !cluster
    ? 0
    : cats.filter((c) => !category || c.id === category).reduce((n, c) => n + c.skills.length, 0)
  const mobileDetailHeight = mobileCount ? Math.max(480, mobileCount * MOBILE_PITCH + 110) : 0

  const select = (id: ClusterId) => {
    setCluster(id)
    setHover(null)
    setCategory(mobile ? (skillCategories.find((c) => c.cluster === id)?.id ?? null) : null)
  }
  const back = () => {
    setCluster(null)
    setCategory(null)
    setHover(null)
  }

  return (
    <div className="relative border border-line bg-white">
      {/* top bar */}
      <div className="flex min-h-14 flex-wrap items-center gap-3 border-b border-line px-4 py-3 md:px-6">
        {cluster ? (
          <button
            onClick={back}
            className="inline-flex items-center gap-2 rounded-full border border-silver px-4 py-2 font-mono text-[0.66rem] uppercase tracking-[0.14em] transition-colors hover:border-black hover:bg-black hover:text-white"
          >
            <ArrowLeft size={13} /> All ecosystems
          </button>
        ) : (
          <span className="eyebrow">Select a cluster to explore</span>
        )}
        {cluster && (
          <div role="group" aria-label="Focus a discipline" className="flex flex-wrap gap-2">
            {!mobile && (
              <button
                onClick={() => setCategory(null)}
                aria-pressed={category === null}
                className={cn(
                  'rounded-full border px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.1em] transition-colors',
                  category === null ? 'border-black bg-black text-white' : 'border-line text-metal hover:border-black hover:text-black',
                )}
              >
                All
              </button>
            )}
            {cats.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                aria-pressed={category === c.id}
                className={cn(
                  'rounded-full border px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.1em] transition-colors',
                  category === c.id ? 'border-black bg-black text-white' : 'border-line text-metal hover:border-black hover:text-black',
                )}
              >
                {c.title}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* canvas */}
      <div
        ref={ref}
        className={cn('relative overflow-hidden', !mobileDetailHeight && 'h-[68svh] min-h-[520px] max-h-[760px]')}
        style={mobileDetailHeight ? { height: mobileDetailHeight } : undefined}
      >
        <div aria-hidden className="grid-lines pointer-events-none absolute inset-0 opacity-50" />
        {webgl ? (
          near && (
            <Suspense fallback={<p className="absolute inset-0 grid place-items-center eyebrow">Loading ecosystem…</p>}>
              <TechnologyScene active={visible} cluster={cluster} category={category} onSelectCluster={select} onHover={setHover} />
            </Suspense>
          )
        ) : (
          <FlatFallback cluster={cluster} onSelect={select} />
        )}

      </div>

      {/* info strip */}
      <div className="min-h-[96px] border-t border-line px-4 py-4 md:px-6" aria-live="polite">
        {hover ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="display text-xl md:text-2xl">{hover.name}</p>
              {SHOW_SKILL_LEVELS && (
                <span className="inline-flex items-center gap-2 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-metal">
                  <Dot l={hover.level} />
                  {levelLabel(hover.level)}
                </span>
              )}
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-metal">{hover.description}</p>
          </>
        ) : info ? (
          <>
            <p className="display text-xl md:text-2xl">{info.label}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-metal">{info.blurb} Hover or focus a node for details.</p>
          </>
        ) : (
          <p className="text-sm leading-relaxed text-metal">
            Six clusters of one engineering mindset. Choose one to open its technologies as an interactive constellation.
          </p>
        )}
      </div>

      {SHOW_SKILL_LEVELS && (
        <ul className="flex flex-wrap gap-x-6 gap-y-2 border-t border-line px-4 py-4 md:px-6" aria-label="Skill classification legend">
          {LEVELS.map((l) => (
            <li key={l.id} className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-metal">
              <Dot l={l.id} />
              {l.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/** 2D fallback when WebGL is unavailable. */
function FlatFallback({ cluster, onSelect }: { cluster: ClusterId | null; onSelect: (c: ClusterId) => void }) {
  const cats = skillCategories.filter((c) => c.cluster === cluster)
  return (
    <div className="absolute inset-0 overflow-auto p-6">
      {!cluster ? (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {clusters.map((c) => (
            <li key={c.id}>
              <button onClick={() => onSelect(c.id)} className="w-full border border-silver bg-white p-5 text-left transition-colors hover:border-black">
                <span className="display block text-xl">{c.label}</span>
                <span className="mt-1 block text-sm text-metal">{c.blurb}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="space-y-6">
          {cats.map((c) => (
            <div key={c.id}>
              <h4 className="eyebrow mb-3">{c.title}</h4>
              <ul className="flex flex-wrap gap-2">
                {c.skills.map((s) => (
                  <li key={s.name} className="rounded-full border border-silver bg-white px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.08em]">
                    {s.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const wordStart = (hay: string, needle: string) => {
  const h = hay.toLowerCase()
  return h.startsWith(needle) || h.includes(' ' + needle) || h.includes('(' + needle) || h.includes('-' + needle)
}

/* ── searchable, accessible full list ────────────────────── */

function SkillsList() {
  const [q, setQ] = useState('')
  const [lvl, setLvl] = useState<SkillLevel | 'all'>('all')

  const groups = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return skillCategories
      .map((c) => ({
        ...c,
        skills: c.skills.filter(
          (s) =>
            (lvl === 'all' || s.level === lvl) &&
            (!needle || wordStart(s.name, needle) || wordStart(s.description, needle) || wordStart(c.title, needle)),
        ),
      }))
      .filter((c) => c.skills.length)
  }, [q, lvl])

  const total = groups.reduce((n, g) => n + g.skills.length, 0)

  return (
    <div id="skills-index" className="mt-28 md:mt-44">
      <Reveal>
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-3">Complete skills index</p>
            <h3 className="display text-[clamp(1.8rem,4vw,3.4rem)]">Every technology, searchable.</h3>
          </div>
          <p className="eyebrow" aria-live="polite">
            {total} of {skillCategories.reduce((n, c) => n + c.skills.length, 0)} entries · {uniqueSkillCount} unique technologies
          </p>
        </div>

        <div className="mb-10 grid gap-4 md:grid-cols-[1fr_auto]">
          <label className="relative block">
            <span className="sr-only">Search skills</span>
            <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-metal" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search technologies — e.g. RAG, FastAPI, Whisper"
              className="w-full border border-silver bg-white py-4 pl-11 pr-11 text-sm [&::-webkit-search-cancel-button]:hidden outline-none transition-colors placeholder:text-metal focus:border-black"
            />
            {q && (
              <button onClick={() => setQ('')} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-metal hover:text-black">
                <X size={15} />
              </button>
            )}
          </label>
          {SHOW_SKILL_LEVELS && (
            <div role="group" aria-label="Filter by classification" className="flex flex-wrap gap-2">
              {[{ id: 'all' as const, label: 'All' }, ...LEVELS].map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLvl(l.id)}
                  aria-pressed={lvl === l.id}
                  className={cn(
                    'rounded-full border px-4 py-2.5 font-mono text-[0.62rem] uppercase tracking-[0.1em] transition-colors',
                    lvl === l.id ? 'border-black bg-black text-white' : 'border-silver text-metal hover:border-black hover:text-black',
                  )}
                >
                  {l.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </Reveal>

      {groups.length === 0 ? (
        <p className="border-y border-line py-16 text-center text-metal">No technology matches “{q}”.</p>
      ) : (
        <div className="border-t border-line">
          {groups.map((c) => (
            <section key={c.id} aria-labelledby={`cat-${c.id}`} className="relative grid gap-6 py-8 md:grid-cols-12 md:gap-8 md:py-10">
              <Hairline className="absolute inset-x-0 bottom-0" />
              <header className="md:col-span-4">
                <p className="eyebrow">{c.index}</p>
                <h4 id={`cat-${c.id}`} className="display mt-2 text-2xl leading-tight md:text-3xl">
                  {c.title}
                </h4>
                <p className="mt-2 text-sm text-metal">{c.summary}</p>
              </header>
              <Stagger className="grid gap-x-8 gap-y-1 sm:grid-cols-2 md:col-span-8" gap={0.035}>
                {c.skills.map((s) => (
                  <StaggerItem key={s.name} className="group flex items-start justify-between gap-4 border-b border-line/70 py-3">
                    <div>
                      <p className="font-medium">{s.name}</p>
                      <p className="mt-0.5 text-[0.8rem] leading-snug text-metal">{s.description}</p>
                    </div>
                    {SHOW_SKILL_LEVELS && (
                      <span className="mt-1.5 inline-flex shrink-0 items-center gap-2 font-mono text-[0.55rem] uppercase tracking-[0.1em] text-metal" title={levelLabel(s.level)}>
                        <Dot l={s.level} />
                        <span className="hidden lg:inline">{levelLabel(s.level)}</span>
                        <span className="sr-only lg:hidden">{levelLabel(s.level)}</span>
                      </span>
                    )}
                  </StaggerItem>
                ))}
              </Stagger>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}

export function Skills() {
  return (
    <section id="skills" aria-label="Skills — The technology universe" className="relative border-b border-line bg-off py-28 md:py-44">
      <div className="mx-auto max-w-[1600px] px-[var(--pad)]">
        <SectionHeader
          index="04"
          label="Skills · The technology universe"
          title="An ecosystem of technologies. One engineering mindset."
          sub="Eleven disciplines, grouped into six clusters. Classifications are honest — what I’m actively building with versus what I’m still exploring."
        />
        <ClipReveal>
          <Constellation />
        </ClipReveal>
        <SkillsList />
      </div>
    </section>
  )
}
