import { BookButton } from './BookButton'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { profile } from '../data/profile'
import { social } from '../data/social'
import { scrollToId, useLenis } from '../hooks/useSmoothScroll'
import { cn } from '../lib/utils'

const LINKS = [
  { id: 'hero', n: '01', label: 'Home' },
  { id: 'about', n: '02', label: 'About' },
  { id: 'projects', n: '03', label: 'Projects' },
  { id: 'skills', n: '04', label: 'Skills' },
  { id: 'contact', n: '05', label: 'Contact' },
] as const

export function Nav({ ready }: { ready: boolean }) {
  const lenis = useLenis()
  const [active, setActive] = useState<string>('hero')
  const [open, setOpen] = useState(false)
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    LINKS.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  // the bar turns dark while it floats over the black Projects section
  useEffect(() => setDark(active === 'projects'), [active])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    setOpen(false)
    setTimeout(() => scrollToId(lenis.current, id), open ? 250 : 0)
  }

  return (
    <>
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={ready ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        className="fixed inset-x-0 top-0 z-[100] px-3 pt-3 md:px-6 md:pt-5"
      >
        <nav
          aria-label="Primary"
          className={cn(
            'mx-auto flex h-14 max-w-[1500px] items-center justify-between rounded-xl border px-4 backdrop-blur-xl transition-colors duration-500 md:h-[68px] md:px-6',
            dark ? 'border-white/10 bg-black/55 text-white' : 'border-white/70 bg-white/45 text-black shadow-[0_8px_30px_-18px_rgba(20,17,15,0.25)]',
          )}
        >
          <a href="#hero" onClick={go('hero')} className="flex items-center gap-2.5" aria-label="SRIKAR. — back to top">
            <span
              aria-hidden
              className="h-5 w-5 rounded-full"
              style={{ background: 'radial-gradient(circle at 32% 28%, #fffdf8 0, #e3d9c6 35%, #7a6f5c 80%, #2a2520 100%)' }}
            />
            <span className="display text-lg tracking-[-0.04em]">{profile.brand}</span>
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {LINKS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  onClick={go(s.id)}
                  aria-current={active === s.id ? 'true' : undefined}
                  className={cn(
                    'block rounded-lg px-4 py-2.5 text-[0.9rem] font-medium transition-colors duration-300',
                    active === s.id
                      ? dark
                        ? 'bg-white text-black'
                        : 'bg-white text-black shadow-sm'
                      : dark
                        ? 'text-white/75 hover:text-white'
                        : 'text-charcoal/80 hover:text-black',
                  )}
                >
                  {s.label}
                </a>
              </li>
            ))}
            {social.resumeUrl && (
              <li>
                <a
                  href={social.resumeUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={cn('block rounded-lg px-4 py-2.5 text-[0.9rem] font-medium', dark ? 'text-white/75 hover:text-white' : 'text-charcoal/80 hover:text-black')}
                >
                  Resume
                </a>
              </li>
            )}
          </ul>

          <div className="flex items-center gap-2">
            <span className="hidden md:block"><BookButton small label="Book a client project" onDark={dark} /></span>
            <button
              className="-mr-2 flex h-11 w-11 items-center justify-center md:hidden"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[90] flex flex-col justify-center bg-black px-[var(--pad)] text-white md:hidden"
          >
            <ul className="space-y-3">
              {LINKS.map((s, i) => (
                <motion.li key={s.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.25 + i * 0.07 } }}>
                  <a href={`#${s.id}`} onClick={go(s.id)} className="display flex items-baseline gap-4 text-5xl">
                    <span className="eyebrow !text-metal">{s.n}</span>
                    {s.label}
                  </a>
                </motion.li>
              ))}
              <motion.li initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.65 } }} className="pt-6">
                <a href="#contact" onClick={go('contact')} className="inline-block rounded-lg bg-white px-6 py-4 text-sm font-medium text-black">
                  Book a client project
                </a>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
