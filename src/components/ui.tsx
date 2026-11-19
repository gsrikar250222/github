import type { ReactNode, ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '../lib/utils'
import { Magnetic } from './Magnetic'
import { SplitText } from './SplitText'
import { Reveal } from './Reveal'
import { Ghost } from './Ghost'
import { Hairline } from './motion'

type Variant = 'solid' | 'outline'

const base =
  'group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-7 py-4 font-mono text-[0.72rem] uppercase tracking-[0.16em] transition-colors duration-500 select-none'
const variants: Record<Variant, string> = {
  solid: 'bg-black text-white hover:bg-charcoal',
  outline: 'border border-silver text-black hover:border-black hover:bg-black hover:text-white',
}

export function ButtonLink({
  variant = 'solid',
  children,
  arrow = true,
  className,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant; arrow?: boolean }) {
  return (
    <Magnetic>
      <a className={cn(base, variants[variant], className)} {...rest}>
        <span>{children}</span>
        {arrow && <ArrowUpRight size={15} className="transition-transform duration-500 group-hover:rotate-45" />}
      </a>
    </Magnetic>
  )
}

export function Button({
  variant = 'solid',
  children,
  arrow = false,
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; arrow?: boolean }) {
  return (
    <Magnetic>
      <button className={cn(base, variants[variant], 'disabled:opacity-50', className)} {...rest}>
        <span className="inline-flex items-center gap-2 whitespace-nowrap">{children}</span>
        {arrow && <ArrowUpRight size={15} className="transition-transform duration-500 group-hover:rotate-45" />}
      </button>
    </Magnetic>
  )
}

export function SectionHeader({
  index,
  label,
  title,
  sub,
  className,
}: {
  index: string
  label: string
  title: string
  sub?: ReactNode
  className?: string
}) {
  return (
    <header className={cn('relative mb-14 md:mb-24', className)}>
      <Ghost>{index}</Ghost>
      <Reveal>
        <div className="mb-8 flex items-center gap-4">
          <span className="eyebrow !text-black">{index}</span>
          <Hairline className="!w-12 !bg-silver" />
          <span className="eyebrow">{label}</span>
        </div>
      </Reveal>
      <SplitText
        as="h2"
        by="word"
        text={title}
        className="display block max-w-[16ch] text-[clamp(2.4rem,7.2vw,6.5rem)] md:max-w-[18ch]"
      />
      {sub && (
        <Reveal delay={0.15} className="mt-8 max-w-xl text-base leading-relaxed text-metal md:text-lg">
          {sub}
        </Reveal>
      )}
    </header>
  )
}
