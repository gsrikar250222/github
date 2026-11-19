import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from './useEnv'

gsap.registerPlugin(ScrollTrigger)

const Ctx = createContext<React.RefObject<Lenis | null>>({ current: null })
export const useLenis = () => useContext(Ctx)

export function scrollToId(lenis: Lenis | null, id: string) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.4 })
  else el.scrollIntoView({ behavior: 'smooth' })
  history.replaceState(null, '', `#${id}`)
}

export function SmoothScroll({ children, locked }: { children: ReactNode; locked: boolean }) {
  const lenis = useRef<Lenis | null>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const l = new Lenis({ duration: 1.25, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true, wheelMultiplier: 0.9, touchMultiplier: 1.4 })
    lenis.current = l
    l.on('scroll', ScrollTrigger.update)
    const tick = (t: number) => l.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      l.destroy()
      lenis.current = null
    }
  }, [reduced])

  useEffect(() => {
    if (locked) lenis.current?.stop()
    else lenis.current?.start()
    document.documentElement.style.overflow = locked ? 'hidden' : ''
  }, [locked])

  return <Ctx.Provider value={lenis}>{children}</Ctx.Provider>
}
