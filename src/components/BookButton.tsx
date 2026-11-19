import { ArrowUpRight } from 'lucide-react'
import { Magnetic } from './Magnetic'
import { scrollToId, useLenis } from '../hooks/useSmoothScroll'
import { cn } from '../lib/utils'

/** The highlighted primary call-to-action. Scrolls to the contact form. */
export function BookButton({
  label = 'Book a client project',
  onDark,
  small,
  className,
}: {
  label?: string
  onDark?: boolean
  small?: boolean
  className?: string
}) {
  const lenis = useLenis()
  return (
    <Magnetic strength={0.25}>
      <a
        href="#contact"
        onClick={(e) => {
          e.preventDefault()
          scrollToId(lenis.current, 'contact')
        }}
        className={cn('book-btn', onDark && 'on-dark', small && 'sm', className)}
      >
        <span className="book-in">
          <span className="book-dot" aria-hidden />
          {label}
          <ArrowUpRight size={15} />
        </span>
      </a>
    </Magnetic>
  )
}
