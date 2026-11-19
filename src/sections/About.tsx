import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useScroll, useTransform } from 'framer-motion'
import { profile } from '../data/profile'
import { achievements } from '../data/achievements'
import { useProjects } from '../data/projectStore'
import { skillCategories, uniqueSkillCount } from '../data/skills'
import { Reveal } from '../components/Reveal'
import { ClipReveal, Hairline, ScrubText, Stagger, StaggerItem } from '../components/motion'
import { SectionHeader } from '../components/ui'
import { useReducedMotion } from '../hooks/useEnv'

function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const reduced = useReducedMotion()
  const [v, setV] = useState(reduced ? to : 0)
  useEffect(() => {
    if (!inView || reduced) return
    const c = animate(0, to, { duration: 1.8, ease: [0.16, 1, 0.3, 1], onUpdate: (x) => setV(Math.round(x)) })
    return () => c.stop()
  }, [inView, to, reduced])
  return (
    <span ref={ref} aria-label={String(to)}>
      {v}
    </span>
  )
}

// Statistics are computed from the data files — nothing is hand-typed.
const makeStats = (projects: { domain: string }[]) => [
  { value: projects.length, label: 'Projects documented' },
  { value: projects.filter((p) => p.domain === 'ai').length, label: 'AI & ML projects' },
  { value: uniqueSkillCount, label: 'Technologies in the stack' },
  { value: skillCategories.length, label: 'Engineering disciplines' },
  ...(achievements.length ? [{ value: achievements.length, label: 'Hackathon & expo records' }] : []),
]

function Timeline() {
  const ref = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] })
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1])
  return (
    <ol ref={ref} className="relative">
      <span aria-hidden className="absolute left-[0.45rem] top-2 bottom-2 w-px bg-line md:left-[calc(25%-0.05rem)]" />
      <motion.span
        aria-hidden
        style={{ scaleY }}
        className="absolute left-[0.45rem] top-2 bottom-2 w-px origin-top bg-black md:left-[calc(25%-0.05rem)]"
      />
      {profile.journey.map((j) => (
        <li key={j.label} className="relative grid gap-3 py-8 pl-9 md:grid-cols-12 md:gap-8 md:py-12 md:pl-0">
          <span aria-hidden className="absolute left-0 top-10 h-[0.95rem] w-[0.95rem] rounded-full border border-black bg-off md:left-[calc(25%-0.5rem)] md:top-14" />
          <div className="md:col-span-3">
            <Reveal>
              <span className="display text-5xl text-silver md:text-7xl">{j.label}</span>
              {j.period && <p className="eyebrow mt-2">{j.period}</p>}
            </Reveal>
          </div>
          <div className="md:col-span-8 md:col-start-5">
            <Reveal delay={0.08}>
              <h4 className="display text-2xl leading-tight md:text-4xl">{j.title}</h4>
              <p className="mt-4 max-w-xl leading-relaxed text-metal md:text-lg">{j.body}</p>
            </Reveal>
          </div>
        </li>
      ))}
    </ol>
  )
}

export function About() {
  const stats = makeStats(useProjects())
  return (
    <section id="about" className="relative border-b border-line bg-white py-28 md:py-44">
      <div className="mx-auto max-w-[1600px] px-[var(--pad)]">
        <SectionHeader index="02" label="About me · The Engineer" title={profile.about.title} />

        {/* portrait + intro + interests */}
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          {profile.photo.src && (
            <div className="md:col-span-4">
              <figure className="relative mx-auto max-w-sm md:max-w-none">
                <span aria-hidden className="absolute -right-3 -top-3 h-full w-full border border-silver md:-right-5 md:-top-5" />
                <ClipReveal className="relative aspect-[4/5] w-full overflow-hidden">
                  <img
                    src={`${import.meta.env.BASE_URL}${profile.photo.src}`}
                    alt={profile.photo.alt}
                    width={profile.photo.width}
                    height={profile.photo.height}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover object-top"
                  />
                </ClipReveal>
                <figcaption className="eyebrow mt-4 flex justify-between">
                  <span>{profile.fullName}</span>
                  <span>AIML · Developer</span>
                </figcaption>
              </figure>
            </div>
          )}
          <div className={profile.photo.src ? 'md:col-span-7 md:col-start-6' : 'md:col-span-12'}>
            <div className="space-y-6">
              {profile.about.intro.map((p, i) =>
                i === 0 ? (
                  <ScrubText key={i} text={p} className="text-xl leading-relaxed md:text-2xl" />
                ) : (
                  <Reveal key={i} delay={0.1}>
                    <p className="leading-relaxed text-metal md:text-lg">{p}</p>
                  </Reveal>
                ),
              )}
            </div>
            <Reveal className="mt-12">
              <h3 className="eyebrow mb-5">Technical interests</h3>
              <Stagger className="flex flex-wrap gap-2" gap={0.07}>
                {profile.about.interests.map((t) => (
                  <StaggerItem key={t} className="rounded-full border border-silver px-4 py-2 font-mono text-[0.68rem] uppercase tracking-[0.1em] transition-colors hover:border-black hover:bg-black hover:text-white">
                    {t}
                  </StaggerItem>
                ))}
              </Stagger>
            </Reveal>
          </div>
        </div>

        {/* stats */}
        <Hairline className="mt-24 md:mt-32" />
        <dl className="grid grid-cols-2 border-b border-line md:grid-cols-4">
          {stats.slice(0, 4).map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="flex flex-col border-line px-0 py-8 odd:border-r md:border-r md:px-8 md:first:pl-0 md:last:border-r-0">
              <dt className="eyebrow order-2 mt-3">{s.label}</dt>
              <dd className="display m-0 text-6xl md:text-8xl">
                <Counter to={s.value} />
              </dd>
            </Reveal>
          ))}
        </dl>

        {/* journey */}
        <div className="mt-28 md:mt-44">
          <Reveal>
            <h3 className="eyebrow mb-4">Technical journey</h3>
          </Reveal>
          <Timeline />
        </div>

        {/* mindset */}
        <div className="mt-24 md:mt-40">
          <Reveal>
            <h3 className="eyebrow mb-10">Engineering mindset &amp; problem-solving approach</h3>
          </Reveal>
          <div className="grid border-l border-t border-line md:grid-cols-2">
            {profile.about.mindset.map((m, i) => (
              <Reveal key={m.title} delay={(i % 2) * 0.1} className="border-b border-r border-line p-8 md:p-12">
                <span className="eyebrow">0{i + 1}</span>
                <h4 className="display mt-6 text-2xl leading-tight md:text-3xl">{m.title}</h4>
                <p className="mt-4 max-w-md leading-relaxed text-metal">{m.body}</p>
              </Reveal>
            ))}
          </div>
        </div>

        {/* education — rendered only when configured */}
        {profile.education.length > 0 && (
          <div className="mt-24 md:mt-40">
            <h3 className="eyebrow mb-8">Education</h3>
            <ul className="divide-y divide-line border-y border-line">
              {profile.education.map((e) => (
                <li key={e.institution + e.program} className="grid gap-2 py-6 md:grid-cols-12">
                  <p className="display text-2xl md:col-span-6 md:text-3xl">{e.institution}</p>
                  <p className="text-metal md:col-span-4">{e.program}</p>
                  <p className="eyebrow md:col-span-2 md:text-right">{e.period}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* achievements — rendered only when verified entries exist */}
        {achievements.length > 0 && (
          <div className="mt-24 md:mt-40">
            <h3 className="eyebrow mb-8">Hackathons &amp; expos</h3>
            <ul className="divide-y divide-line border-y border-line">
              {achievements.map((a) => (
                <li key={a.title + a.year} className="grid gap-2 py-6 md:grid-cols-12">
                  <p className="display text-2xl md:col-span-6 md:text-3xl">{a.title}</p>
                  <p className="text-metal md:col-span-4">{a.event}</p>
                  <p className="eyebrow md:col-span-2 md:text-right">{a.year}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
