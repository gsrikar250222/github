import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react'
import Lenis from 'lenis'
import { useReducedMotion } from './useEnv'

const Ctx = createContext<React.RefObject<Lenis | null>>({ current: null })
export const useLenis = () => useContext(Ctx)

export function scrollToId(lenis: Lenis | null, id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const top = id === 'top' ? 0 : el.getBoundingClientRect().top + window.scrollY - 64
  if (lenis) lenis.scrollTo(top, { duration: 1.3 })
  else window.scrollTo({ top, behavior: 'smooth' })
  history.replaceState(null, '', id === 'top' ? '#' : `#${id}`)
}

/** Lenis smooth scrolling on its own rAF loop. Off when the visitor prefers reduced motion. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenis = useRef<Lenis | null>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const l = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
    })
    lenis.current = l
    let raf = 0
    const tick = (t: number) => {
      l.raf(t)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      l.destroy()
      lenis.current = null
    }
  }, [reduced])

  return <Ctx.Provider value={lenis}>{children}</Ctx.Provider>
}
