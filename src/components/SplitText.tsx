import { motion, useInView, type Variants } from 'framer-motion'
import { useMemo, useRef, type ElementType } from 'react'
import { useReducedMotion } from '../hooks/useEnv'

interface Props {
  text: string
  as?: ElementType
  className?: string
  /** Wait for this to be true before animating (e.g. after the loader). */
  play?: boolean
  delay?: number
  stagger?: number
  /** 'char' reveals character by character; 'word' reveals word by word. */
  by?: 'char' | 'word'
  once?: boolean
}

const container = (stagger: number, delay: number): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
})
const unit: Variants = {
  hidden: { y: '115%', rotate: 4, opacity: 0 },
  show: { y: '0%', rotate: 0, opacity: 1, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
}

export function SplitText({
  text,
  as: Tag = 'span',
  className,
  play = true,
  delay = 0,
  stagger,
  by = 'char',
  once = true,
}: Props) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once, margin: '0px 0px -12% 0px' })
  const reduced = useReducedMotion()
  const MotionTag = useMemo(() => motion.create(Tag as 'span'), [Tag])
  const words = text.split(' ')
  const st = stagger ?? (by === 'char' ? 0.028 : 0.07)

  if (reduced) {
    return <Tag className={className}>{text}</Tag>
  }

  return (
    <MotionTag
      ref={ref as never}
      className={className}
      aria-label={text}
      variants={container(st, delay)}
      initial="hidden"
      animate={play && inView ? 'show' : 'hidden'}
    >
      {words.map((w, wi) => (
        <span key={wi} aria-hidden className="inline-block whitespace-nowrap">
          {by === 'word' ? (
            <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
              <motion.span variants={unit} className="inline-block will-change-transform">
                {w}
              </motion.span>
            </span>
          ) : (
            w.split('').map((c, ci) => (
              <span key={ci} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
                <motion.span variants={unit} className="inline-block will-change-transform">
                  {c}
                </motion.span>
              </span>
            ))
          )}
          {wi < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </MotionTag>
  )
}
