import { scrollToId, useLenis } from '../hooks/useSmoothScroll'
import { cn } from '../lib/utils'

/** The primary call to action — the one yellow thing on the page. */
export function BookButton({ label = 'Book a client project', className, size = 'md' }: { label?: string; className?: string; size?: 'sm' | 'md' }) {
  const lenis = useLenis()
  return (
    <a
      href="#contact"
      onClick={(e) => {
        e.preventDefault()
        scrollToId(lenis.current, 'contact')
      }}
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-signal font-semibold text-ink transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-white active:translate-y-0',
        size === 'sm' ? 'px-5 py-2.5 text-[0.9rem]' : 'px-7 py-4 text-base',
        className,
      )}
    >
      {label}
    </a>
  )
}
