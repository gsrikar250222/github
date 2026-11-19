import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useFinePointer, useReducedMotion } from '../hooks/useEnv'

/** Subtle two-part cursor: a precise dot and a lagging ring that expands over interactive targets. */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const fine = useFinePointer()
  const reduced = useReducedMotion()
  const active = fine && !reduced

  useEffect(() => {
    if (!active) return
    document.documentElement.classList.add('has-cursor')
    const d = dot.current!
    const r = ring.current!
    gsap.set([d, r], { xPercent: -50, yPercent: -50, opacity: 0 })
    const dx = gsap.quickTo(d, 'x', { duration: 0.08, ease: 'none' })
    const dy = gsap.quickTo(d, 'y', { duration: 0.08, ease: 'none' })
    const rx = gsap.quickTo(r, 'x', { duration: 0.45, ease: 'power3' })
    const ry = gsap.quickTo(r, 'y', { duration: 0.45, ease: 'power3' })
    let shown = false
    const move = (e: PointerEvent) => {
      if (!shown) {
        shown = true
        gsap.to([d, r], { opacity: 1, duration: 0.3 })
      }
      dx(e.clientX)
      dy(e.clientY)
      rx(e.clientX)
      ry(e.clientY)
    }
    const over = (e: PointerEvent) => {
      const t = (e.target as HTMLElement | null)?.closest('a,button,[data-cursor],input,textarea,label')
      const label = t?.getAttribute('data-cursor-label')
      gsap.to(r, {
        scale: t ? (label ? 3.2 : 1.9) : 1,
        backgroundColor: t ? 'rgba(8,8,8,0.06)' : 'rgba(8,8,8,0)',
        duration: 0.35,
        ease: 'power3.out',
      })
      gsap.to(d, { scale: t ? 0.4 : 1, duration: 0.25 })
      r.dataset.label = label ?? ''
    }
    const leave = () => gsap.to([d, r], { opacity: 0, duration: 0.2 })
    const enter = () => shown && gsap.to([d, r], { opacity: 1, duration: 0.2 })
    const pulse = (e: PointerEvent) => {
      const el = document.createElement('span')
      el.setAttribute('aria-hidden', 'true')
      el.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;width:14px;height:14px;margin:-7px 0 0 -7px;border:1px solid rgba(8,8,8,.55);border-radius:9999px;pointer-events:none;z-index:9998`
      document.body.appendChild(el)
      gsap.to(el, { scale: 7, opacity: 0, duration: 0.8, ease: 'power3.out', onComplete: () => el.remove() })
    }
    window.addEventListener('pointerdown', pulse)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerover', over)
    document.documentElement.addEventListener('pointerleave', leave)
    document.documentElement.addEventListener('pointerenter', enter)
    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', pulse)
      window.removeEventListener('pointerover', over)
      document.documentElement.removeEventListener('pointerleave', leave)
      document.documentElement.removeEventListener('pointerenter', enter)
    }
  }, [active])

  if (!active) return null
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[150] mix-blend-difference">
      <div ref={ring} className="absolute left-0 top-0 h-9 w-9 rounded-full border border-white" />
      <div ref={dot} className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-white" />
    </div>
  )
}
