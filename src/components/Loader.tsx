import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { profile } from '../data/profile'
import { useReducedMotion } from '../hooks/useEnv'

/** Cinematic loading transition: counter + brand, then the curtain lifts. */
export function Loader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLDivElement>(null)
  const [n, setN] = useState(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    const counter = { v: 0 }
    const tl = gsap.timeline({ onComplete: onDone })
    const dur = reduced ? 0.2 : 1.7
    tl.to(counter, { v: 100, duration: dur, ease: 'power2.inOut', onUpdate: () => setN(Math.round(counter.v)) })
    tl.to(bar.current, { scaleX: 1, duration: dur, ease: 'power2.inOut' }, 0)
    tl.to('[data-loader-in]', { yPercent: -110, opacity: 0, duration: 0.5, ease: 'power3.in', stagger: 0.04 }, '>0.1')
    tl.to(root.current, { yPercent: -100, duration: reduced ? 0.01 : 0.95, ease: 'expo.inOut' }, '>-0.05')
    return () => {
      tl.kill()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      ref={root}
      role="status"
      aria-label="Loading portfolio"
      className="fixed inset-0 z-[300] flex flex-col justify-between bg-black p-[var(--pad)] text-white"
    >
      <div className="flex items-center justify-between overflow-hidden">
        <span data-loader-in className="eyebrow !text-silver">
          Initialising
        </span>
        <span data-loader-in className="eyebrow !text-silver">
          AI · Full Stack · Agents
        </span>
      </div>
      <div className="overflow-hidden">
        <div data-loader-in className="display text-[clamp(3.5rem,14vw,12rem)]">
          {profile.brand}
        </div>
      </div>
      <div>
        <div className="mb-4 flex items-end justify-between overflow-hidden">
          <span data-loader-in className="eyebrow !text-silver">
            {profile.tagline}
          </span>
          <span data-loader-in className="font-mono text-5xl tabular-nums text-silver md:text-7xl">
            {String(n).padStart(3, '0')}
          </span>
        </div>
        <div className="h-px w-full bg-white/15">
          <div ref={bar} className="h-px origin-left scale-x-0 bg-white" />
        </div>
      </div>
    </div>
  )
}
