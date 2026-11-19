import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { skillCategories } from '../data/skills'
import { useReducedMotion } from '../hooks/useEnv'

gsap.registerPlugin(ScrollTrigger)

const names = Array.from(new Set(skillCategories.flatMap((c) => c.skills.filter((k) => k.level === 'building' || k.level === 'working').map((k) => k.name)))).slice(0, 28)

/** Two counter-moving tech rows. They glide on their own and speed up / skew with scroll velocity. */
export function TechStrip() {
  const root = useRef<HTMLDivElement>(null)
  const a = useRef<HTMLDivElement>(null)
  const b = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = root.current
    if (reduced || !el || !a.current || !b.current) return
    let pos = 0
    let boost = 0
    let visible = true
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: '100px' })
    io.observe(el)
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        boost = gsap.utils.clamp(-30, 30, self.getVelocity() / 120)
      },
    })
    const tick = (_t: number, dt: number) => {
      if (!visible) return
      boost *= 0.92
      const step = (dt / 1000) * (1.5 + Math.abs(boost) * 0.25)
      const dir = boost < 0 ? -1 : 1
      pos = (pos + step * dir + 50) % 50 // seamless period = one copy = 50%
      gsap.set(a.current, { xPercent: -pos })
      gsap.set(b.current, { xPercent: -50 + pos })
    }
    gsap.ticker.add(tick)
    return () => {
      gsap.ticker.remove(tick)
      st.kill()
      io.disconnect()
    }
  }, [reduced])

  const row = (ref: React.RefObject<HTMLDivElement | null>, outline: boolean) => (
    <div className="overflow-hidden">
      <div ref={ref} className="flex w-max whitespace-nowrap will-change-transform">
        {[0, 1].map((k) => (
          <div key={k} className="flex items-center" aria-hidden={k === 1}>
            {names.map((n) => (
              <span key={n + k} className="flex items-center">
                <span
                  className="display px-6 text-[clamp(2.2rem,6vw,5.5rem)] font-light leading-[1.2] tracking-tight md:px-10"
                  style={outline ? { color: 'transparent', WebkitTextStroke: '1px #b9ad96' } : { color: '#2a2520' }}
                >
                  {n}
                </span>
                <span className="h-2 w-2 rounded-full bg-silver" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div aria-label="Technologies I work with" role="region" className="select-none overflow-hidden border-y border-line bg-white py-8 md:py-12">
      <div ref={root} className="space-y-3 md:space-y-5">
        {row(a, false)}
        {row(b, true)}
      </div>
    </div>
  )
}
