import { profile } from '../data/profile'
import { social } from '../data/social'
import { BookButton } from '../components/BookButton'
import { Pipeline } from '../components/Pipeline'
import { scrollToId, useLenis } from '../hooks/useSmoothScroll'

export function Hero() {
  const lenis = useLenis()
  const resume = social.resumeUrl
  return (
    <section id="top" className="relative flex min-h-[100svh] items-center overflow-hidden bg-cobalt pb-20 pt-32 text-white md:pb-24">
      {/* quiet grid texture, no decoration beyond it */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'linear-gradient(to bottom, #000 0%, transparent 85%)',
          WebkitMaskImage: 'linear-gradient(to bottom, #000 0%, transparent 85%)',
        }}
      />
      <div className="wrap relative grid items-center gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <p className="rise mb-6 flex items-center gap-3 text-[0.95rem] text-white/85" style={{ ['--i' as string]: 0 }}>
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-signal" />
            </span>
            Taking on client projects
          </p>
          <h1 className="display rise max-w-[11ch] text-[clamp(3.4rem,8.4vw,7.6rem)]" style={{ ['--i' as string]: 1 }}>
            Ideas into working AI products.
          </h1>
          <p className="rise mt-8 max-w-[52ch] text-[1.2rem] leading-relaxed text-white/85" style={{ ['--i' as string]: 3 }}>
            {profile.heroStatement}
          </p>
          <div className="rise mt-10 flex flex-wrap items-center gap-4" style={{ ['--i' as string]: 4 }}>
            <BookButton />
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault()
                scrollToId(lenis.current, 'projects')
              }}
              className="inline-flex items-center rounded-full border border-white/50 px-7 py-4 font-semibold transition-colors hover:bg-white hover:text-ink"
            >
              See my work
            </a>
            {resume && (
              <a href={resume} target="_blank" rel="noreferrer noopener" className="px-2 py-4 font-semibold underline decoration-white/40 underline-offset-4 hover:decoration-white">
                Resume
              </a>
            )}
          </div>
          <p className="rise mt-10 text-[0.95rem] text-white/70" style={{ ['--i' as string]: 5 }}>
            {profile.fullName}, AI engineer and full-stack developer. B.Tech AIML student at PBRVITS.
          </p>
        </div>

        <div className="rise lg:col-span-5" style={{ ['--i' as string]: 4 }}>
          <Pipeline />
        </div>
      </div>
    </section>
  )
}
