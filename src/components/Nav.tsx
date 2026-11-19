import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { profile } from '../data/profile'
import { BookButton } from './BookButton'
import { scrollToId, useLenis } from '../hooks/useSmoothScroll'
import { cn } from '../lib/utils'

const links = [
  { id: 'services', label: 'Services' },
  { id: 'projects', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
]

export function Nav() {
  const lenis = useLenis()
  const [active, setActive] = useState('')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const els = links.map((l) => document.getElementById(l.id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
  }, [open])

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    setOpen(false)
    scrollToId(lenis.current, id)
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-ink/95 text-white backdrop-blur-md">
      <div className="wrap flex h-16 items-center justify-between">
        <a href="#top" onClick={go('top')} className="display text-xl tracking-tight" aria-label={`${profile.name} — home`}>
          {profile.brand}
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={go(l.id)}
              aria-current={active === l.id ? 'true' : undefined}
              className={cn(
                'relative py-1 text-[0.95rem] text-white/70 transition-colors hover:text-white',
                active === l.id && 'text-white after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:bg-signal',
              )}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden sm:block">
            <BookButton size="sm" />
          </span>
          <button
            className="grid h-10 w-10 place-items-center rounded-full border border-white/25 md:hidden"
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-x-0 bottom-0 top-16 bg-ink px-[var(--pad)] pt-8 md:hidden">
          <ul className="space-y-1">
            {links.map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`} onClick={go(l.id)} className="display block border-b border-white/10 py-4 text-4xl">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <BookButton className="w-full" />
          </div>
        </div>
      )}
    </header>
  )
}
