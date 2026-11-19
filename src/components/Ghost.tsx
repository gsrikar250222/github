import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useReducedMotion } from '../hooks/useEnv'

/** Oversized outlined section numeral that drifts slower than the page. */
export function Ghost({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [90, -110])
  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute -top-10 right-0 z-0 select-none md:-top-24">
      <motion.span
        style={{ y, WebkitTextStroke: '1px #92969e' }}
        className="display block text-[clamp(7rem,24vw,24rem)] leading-none text-transparent opacity-60"
      >
        {children}
      </motion.span>
    </div>
  )
}
