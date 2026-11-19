import { useEffect, useRef, type ReactNode } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../hooks/useEnv'

gsap.registerPlugin(ScrollTrigger)

const EASE = [0.76, 0, 0.24, 1] as const

/** Words brighten from silver to full ink as the paragraph scrolls through the viewport. */
export function ScrubText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (reduced || !el) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll('[data-w]'),
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.12,
          scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 50%', scrub: true },
        },
      )
    }, el)
    return () => ctx.revert()
  }, [reduced])

  return (
    <p ref={ref} className={className} aria-label={text}>
      {text.split(' ').map((w, i) => (
        <span key={i} data-w aria-hidden className="inline-block">
          {w}
          {' '}
        </span>
      ))}
    </p>
  )
}

/** Curtain-wipe image reveal with a slow inner scale-down. */
export function ClipReveal({
  children,
  className,
  delay = 0,
  direction = 'up',
}: {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'left'
}) {
  const reduced = useReducedMotion()
  if (reduced) return <div className={className}>{children}</div>
  const from = direction === 'up' ? 'inset(100% 0% 0% 0%)' : 'inset(0% 100% 0% 0%)'
  return (
    <motion.div
      className={`overflow-hidden ${className ?? ''}`}
      initial={{ clipPath: from }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 1.3, ease: EASE, delay }}
    >
      <motion.div
        className="h-full w-full"
        initial={{ scale: 1.28 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: '0px 0px -12% 0px' }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

/** A hairline that draws itself in. */
export function Hairline({ className = '', delay = 0, dark = false }: { className?: string; delay?: number; dark?: boolean }) {
  const reduced = useReducedMotion()
  return (
    <motion.span
      aria-hidden
      className={`block h-px w-full origin-left ${dark ? 'bg-white/15' : 'bg-line'} ${className}`}
      initial={{ scaleX: reduced ? 1 : 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: '0px 0px -5% 0px' }}
      transition={{ duration: 1.4, ease: EASE, delay }}
    />
  )
}

/** Staggered child reveal — wrap list items in <Stagger> + <StaggerItem>. */
export function Stagger({ children, className, gap = 0.06, as = 'ul' }: { children: ReactNode; className?: string; gap?: number; as?: 'ul' | 'div' }) {
  const reduced = useReducedMotion()
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      initial={reduced ? 'show' : 'hidden'}
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}
    >
      {children}
    </Tag>
  )
}

export function StaggerItem({ children, className, as = 'li' }: { children: ReactNode; className?: string; as?: 'li' | 'div' }) {
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      variants={{
        hidden: { opacity: 0, y: 22 },
        show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
      }}
    >
      {children}
    </Tag>
  )
}

/** Thin silver reading-progress line fixed to the top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.3 })
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[120] h-[2px] origin-left bg-black mix-blend-difference [background:white]"
    />
  )
}
