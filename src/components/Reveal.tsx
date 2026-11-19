import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useReducedMotion } from '../hooks/useEnv'

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  play = true,
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  play?: boolean
}) {
  const reduced = useReducedMotion()
  if (reduced) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={play ? { opacity: 1, y: 0 } : undefined}
      animate={play ? undefined : { opacity: 0, y }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}
