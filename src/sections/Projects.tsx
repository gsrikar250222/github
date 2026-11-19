import { useRef, useState } from 'react'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowUpRight, PlayCircle } from 'lucide-react'
import { GithubIcon } from '../components/icons'
import type { Project, ProjectDomain } from '../data/projects'
import { useProjects } from '../data/projectStore'
import { ProjectCover } from '../components/ProjectCover'
import { Reveal } from '../components/Reveal'
import { SplitText } from '../components/SplitText'
import { ClipReveal, Hairline, Stagger, StaggerItem } from '../components/motion'
import { SectionHeader } from '../components/ui'
import { BookButton } from '../components/BookButton'
import { useFinePointer, useReducedMotion } from '../hooks/useEnv'
import { cn } from '../lib/utils'

const statusStyle: Record<NonNullable<Project['status']>, string> = {
  Completed: 'border-black bg-black text-white',
  'In Progress': 'border-black text-black',
  Prototype: 'border-metal text-charcoal',
  Concept: 'border-dashed border-metal text-metal',
}

function ProjectRow({ p, i }: { p: Project; i: number }) {
  const reduced = useReducedMotion()
  const fine = useFinePointer()
  const flip = i % 2 === 1
  const row = useRef<HTMLElement>(null)
  const frame = useRef<HTMLDivElement>(null)

  // scroll parallax inside the frame
  const { scrollYProgress } = useScroll({ target: row, offset: ['start end', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], reduced ? ['0%', '0%'] : ['-9%', '9%'])

  // 3D tilt
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [2.5, -2.5]), { stiffness: 140, damping: 16 })
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-3, 3]), { stiffness: 140, damping: 16 })
  const glare = useTransform(mx, [-0.5, 0.5], ['20%', '80%'])

  const onMove = (e: React.PointerEvent) => {
    if (!fine || reduced || !frame.current) return
    const r = frame.current.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const onLeave = () => {
    mx.set(0)
    my.set(0)
  }

  const hasLinks = p.links && (p.links.live || p.links.github || p.links.caseStudy)

  return (
    <article ref={row} aria-labelledby={`proj-${p.id}`} className="relative grid items-center gap-8 py-16 md:grid-cols-12 md:gap-10 md:py-28">
      <Hairline dark className="absolute inset-x-0 top-0" />
      <div className={cn('md:col-span-7', flip ? 'md:order-2 md:col-start-6' : 'md:col-start-1')}>
        <ClipReveal>
          <motion.div
            ref={frame}
            onPointerMove={onMove}
            onPointerLeave={onLeave}
            style={{ rotateX: rx, rotateY: ry, transformPerspective: 1300 }}
            data-cursor
            data-cursor-label="view"
            className="relative aspect-[4/3] overflow-hidden rounded-sm border border-white/10 bg-black shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)]"
          >
            <motion.div style={{ y: imgY, scale: 1.2 }} className="absolute inset-0">
              <ProjectCover project={p} index={i} />
            </motion.div>
            <motion.div
              aria-hidden
              style={{ background: useTransform(glare, (g) => `linear-gradient(115deg, transparent ${Number.parseFloat(g) - 25}%, rgba(255,255,255,0.1) ${g}, transparent ${Number.parseFloat(g) + 25}%)`) }}
              className="pointer-events-none absolute inset-0"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 [div:hover>&]:opacity-100"
              style={{ background: 'radial-gradient(320px circle at var(--sx,50%) var(--sy,50%), rgba(255,255,255,0.22), transparent 65%)', mixBlendMode: 'soft-light' }}
            />
            <span className="absolute left-4 top-4 font-mono text-[0.65rem] tracking-[0.2em] text-silver">{String(i + 1).padStart(2, '0')}</span>
          </motion.div>
        </ClipReveal>
      </div>

      <div className={cn('md:col-span-5', flip ? 'md:order-1 md:col-start-1 md:pr-6' : 'md:col-start-8 md:pl-2')}>
        <Reveal delay={0.1}>
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="eyebrow !text-silver">{p.category}</span>
            {p.status && (
              <span className={cn('rounded-full border px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.14em]', statusStyle[p.status])}>
                {p.status}
              </span>
            )}
          </div>
          <h3 id={`proj-${p.id}`} className="display text-[clamp(2rem,4.6vw,4.2rem)] leading-[0.95] text-white">
            <SplitText text={p.name} by="word" stagger={0.08} />
          </h3>
          <p className="mt-6 max-w-md leading-relaxed text-silver">{p.description}</p>
          <Stagger className="mt-7 flex flex-wrap gap-2" gap={0.05}>
            {p.tech.map((t) => (
              <StaggerItem key={t} className="rounded-full border border-white/15 px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.08em] text-silver transition-colors hover:border-white hover:text-white">
                {t}
              </StaggerItem>
            ))}
          </Stagger>

          {/* actions render only when a real link/media has been configured */}
          {(hasLinks || p.media?.video) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {p.links?.live && (
                <a href={p.links.live} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-black transition-colors hover:bg-silver">
                  View live project <ArrowUpRight size={14} />
                </a>
              )}
              {p.links?.github && (
                <a href={p.links.github} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-3 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-white transition-colors hover:bg-white hover:text-black">
                  <GithubIcon /> View GitHub
                </a>
              )}
              {p.links?.caseStudy && (
                <a href={p.links.caseStudy} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-3 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-white transition-colors hover:bg-white hover:text-black">
                  <PlayCircle size={14} /> View case study
                </a>
              )}
            </div>
          )}
        </Reveal>
      </div>
    </article>
  )
}

const filters: { id: 'all' | ProjectDomain; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'ai', label: 'AI & ML' },
  { id: 'fullstack', label: 'Full Stack' },
]

export function Projects() {
  const [filter, setFilter] = useState<'all' | ProjectDomain>('all')
  const projects = useProjects()
  const list = projects.filter((p) => filter === 'all' || p.domain === filter)

  return (
    <section id="projects" aria-label="Projects — Engineering in action" className="relative bg-black py-28 text-white md:py-44">
      <div className="mx-auto max-w-[1600px] px-[var(--pad)]">
        <div className="[&_.eyebrow]:!text-metal [&_.eyebrow:first-child]:!text-white">
          <SectionHeader
            index="03"
            label="Projects · Engineering in action"
            title="Ideas are easy. Engineering makes them real."
            sub={<span className="text-silver">Systems, agents and products — each labelled by what it really is: built, in progress, a prototype, or a concept.</span>}
          />
        </div>

        <div role="group" aria-label="Filter projects" className="mb-4 flex flex-wrap items-center gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={cn(
                'rounded-full border px-5 py-2.5 font-mono text-[0.66rem] uppercase tracking-[0.14em] transition-colors',
                filter === f.id ? 'border-white bg-white text-black' : 'border-white/20 text-silver hover:border-white hover:text-white',
              )}
            >
              {f.label}
            </button>
          ))}
          <span className="ml-2 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-metal" aria-live="polite">
            {list.length} {list.length === 1 ? 'project' : 'projects'}
          </span>
        </div>

        <div>
          {list.map((p, i) => (
            <ProjectRow key={p.id} p={p} i={i} />
          ))}
        </div>

        <Reveal>
          <div className="mt-8 flex flex-col items-start justify-between gap-8 border-t border-white/15 pt-14 md:mt-16 md:flex-row md:items-center">
            <div>
              <p className="eyebrow !text-metal">Have something in mind?</p>
              <p className="display mt-3 max-w-[18ch] text-[clamp(2rem,4.5vw,4rem)] leading-[0.98] text-white">
                Let&rsquo;s build your next product.
              </p>
            </div>
            <BookButton onDark label="Book a client project" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
