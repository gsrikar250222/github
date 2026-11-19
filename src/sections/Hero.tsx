import { lazy, Suspense, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { profile } from '../data/profile'
import { social } from '../data/social'
import { SplitText } from '../components/SplitText'
import { Reveal } from '../components/Reveal'
import { ButtonLink } from '../components/ui'
import { BookButton } from '../components/BookButton'
import { scrollToId, useLenis } from '../hooks/useSmoothScroll'
import { useNearViewport, useReducedMotion, useWebGL } from '../hooks/useEnv'

const ChromeScene = lazy(() => import('../scenes/ChromeScene'))

/** CSS-only stand-in: used while the 3D chunk loads and when WebGL is unavailable. */
function RippleFallback() {
  return (
    <div
      aria-hidden
      className="absolute inset-0"
      style={{
        background:
          'radial-gradient(circle at 50% 38%, #ffffff 0 7%, transparent 7.2%),' +
          'repeating-radial-gradient(ellipse 120% 80% at 50% 38%, #f4f5f7 0 5%, #c9cbd1 9%, #98a0aa 12%, #c9cbd1 15%, #f4f5f7 19%)',
      }}
    />
  )
}

export function Hero({ ready }: { ready: boolean }) {
  const lenis = useLenis()
  const webgl = useWebGL()
  const reduced = useReducedMotion()
  const { ref, near, visible } = useNearViewport<HTMLDivElement>('0px')
  const root = useRef<HTMLElement>(null)
  const scene = useRef<HTMLDivElement>(null)
  const copy = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      gsap.to(scene.current, {
        scale: 1.12,
        yPercent: 8,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to(copy.current, {
        yPercent: -10,
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: '25% top', end: '85% top', scrub: true },
      })
    }, root)
    return () => ctx.revert()
  }, [reduced])

  useEffect(() => {
    ScrollTrigger.refresh()
  }, [ready])

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    scrollToId(lenis.current, id)
  }

  return (
    <section id="hero" ref={root} aria-labelledby="hero-title" className="relative min-h-[100svh] overflow-hidden bg-off">
      {/* ripple surface + chrome sphere */}
      <div ref={scene} className="absolute inset-0">
        <div ref={ref} className="relative h-full w-full">
          <RippleFallback />
          {webgl && near && ready && (
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.4, ease: 'easeOut' }}
            >
              <Suspense fallback={null}>
                <ChromeScene active={visible} />
              </Suspense>
            </motion.div>
          )}
        </div>
      </div>

      {/* soft floor so type always has contrast */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-off/55 via-off/15 to-transparent" />

      <div
        ref={copy}
        className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1600px] flex-col justify-end px-[var(--pad)] pb-8 pt-28 md:pb-10"
      >
        <h1 id="hero-title" className="text-center">
          <motion.span
            className="block text-[clamp(2.7rem,10.6vw,10.5rem)] leading-none text-black"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
            initial={{ letterSpacing: '1.1em', paddingLeft: '1.1em', opacity: 0 }}
            animate={ready ? { letterSpacing: '0.36em', paddingLeft: '0.36em', opacity: 1 } : {}}
            transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          >
            <SplitText text={profile.brand} play={ready} delay={0.2} stagger={0.09} />
          </motion.span>
        </h1>

        <div className="mt-5 text-center md:mt-7">
          <SplitText
            as="p"
            by="word"
            text={profile.tagline}
            play={ready}
            delay={1.1}
            className="block font-mono text-[0.72rem] uppercase tracking-[0.34em] text-charcoal md:text-sm"
          />
          <Reveal play={ready} delay={1.3} className="eyebrow mt-3 !tracking-[0.2em]">
            {profile.heroRoles.map((r) => r.replace('.', '')).join(' · ').toUpperCase()}
          </Reveal>
        </div>

        <div className="mt-8 grid items-end gap-6 md:mt-10 md:grid-cols-12">
          <Reveal play={ready} delay={1.45} className="md:col-span-5">
            <p className="max-w-md text-sm leading-relaxed text-charcoal md:text-base">“{profile.heroStatement}”</p>
          </Reveal>
          <Reveal play={ready} delay={1.6} className="flex flex-wrap items-center gap-3 md:col-span-7 md:justify-end">
            <ButtonLink href="#projects" onClick={go('projects')}>
              Explore my work
            </ButtonLink>
            <BookButton />
            {social.resumeUrl && (
              <>
                <ButtonLink href={social.resumeUrl} target="_blank" rel="noreferrer noopener" variant="outline" arrow={false}>
                  View Resume
                </ButtonLink>
                <a
                  href={social.resumeUrl}
                  download
                  className="font-mono text-[0.68rem] uppercase tracking-[0.16em] underline decoration-silver underline-offset-4 transition-colors hover:decoration-black"
                >
                  Download Resume
                </a>
              </>
            )}
          </Reveal>
        </div>

        <Reveal play={ready} delay={1.8} className="mt-8 flex flex-col items-center gap-3">
          <span className="font-mono text-[0.58rem] uppercase tracking-[0.6em] text-charcoal">Scroll down</span>
          <span aria-hidden className="relative h-8 w-px overflow-hidden bg-silver">
            <motion.span
              className="absolute inset-x-0 top-0 h-3 bg-black"
              animate={{ y: ['-100%', '260%'] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </span>
        </Reveal>
      </div>
    </section>
  )
}
