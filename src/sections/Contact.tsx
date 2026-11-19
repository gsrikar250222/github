import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Check, LoaderCircle, Mail, Phone, Send } from 'lucide-react'
import { profile } from '../data/profile'
import { contactConfigured, phoneDisplay, social, whatsappLink } from '../data/social'
import { GithubIcon, LinkedinIcon, WhatsappIcon } from '../components/icons'
import { Reveal } from '../components/Reveal'
import { SplitText } from '../components/SplitText'
import { Button, SectionHeader } from '../components/ui'
import { Magnetic } from '../components/Magnetic'
import { scrollToId, useLenis } from '../hooks/useSmoothScroll'
import { useReducedMotion } from '../hooks/useEnv'
import { cn } from '../lib/utils'


type Status = 'idle' | 'sending' | 'sent' | 'error'

function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [msg, setMsg] = useState('')

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const d = Object.fromEntries(new FormData(form)) as Record<string, string>
    if (d.company) return // honeypot
    setStatus('sending')
    setMsg('')
    try {
      if (social.formEndpoint) {
        const r = await fetch(social.formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ name: d.name, email: d.email, subject: d.subject, message: d.message }),
        })
        if (!r.ok) throw new Error(String(r.status))
        form.reset()
        setStatus('sent')
        setMsg('Message sent — thank you. I’ll get back to you soon.')
      } else if (!social.email && social.whatsapp) {
        const text = `Hi Srikar, I'm ${d.name} (${d.email}).\n${d.subject}\n\n${d.message}`
        window.open(whatsappLink(text), '_blank', 'noopener')
        setStatus('sent')
        setMsg('WhatsApp should open with your message ready to send.')
      } else {
        const body = `${d.message}\n\n— ${d.name} (${d.email})`
        window.location.href = `mailto:${social.email}?subject=${encodeURIComponent(d.subject)}&body=${encodeURIComponent(body)}`
        setStatus('sent')
        setMsg('Your email app should open with the message ready to send.')
      }
    } catch {
      setStatus('error')
      setMsg('Something went wrong sending the message. Please try again' + (social.email ? ` or email ${social.email}.` : '.'))
    }
  }

  const field =
    'peer w-full border-0 border-b border-silver bg-transparent px-0 pb-3 pt-6 text-base outline-none transition-colors placeholder-transparent focus:border-black'
  const label =
    'pointer-events-none absolute left-0 top-6 origin-left font-mono text-[0.72rem] uppercase tracking-[0.14em] text-metal transition-all duration-300 peer-focus:-translate-y-5 peer-focus:scale-90 peer-focus:text-black peer-[:not(:placeholder-shown)]:-translate-y-5 peer-[:not(:placeholder-shown)]:scale-90'

  return (
    <form onSubmit={submit} className="space-y-4" noValidate={false}>
      <div className="grid gap-x-10 gap-y-2 md:grid-cols-2">
        <div className="relative">
          <input id="c-name" name="name" required autoComplete="name" placeholder="Name" className={field} />
          <label htmlFor="c-name" className={label}>Name</label>
        </div>
        <div className="relative">
          <input id="c-email" name="email" type="email" required autoComplete="email" placeholder="Email" className={field} />
          <label htmlFor="c-email" className={label}>Email</label>
        </div>
      </div>
      <div className="relative">
        <input id="c-subject" name="subject" required defaultValue="Client project enquiry" placeholder="Subject" className={field} />
        <label htmlFor="c-subject" className={label}>Subject</label>
      </div>
      <div className="relative">
        <textarea id="c-message" name="message" required rows={4} placeholder="Message" className={cn(field, 'resize-none')} />
        <label htmlFor="c-message" className={label}>Message</label>
      </div>
      {/* honeypot */}
      <input name="company" tabIndex={-1} autoComplete="off" aria-hidden className="absolute left-[-9999px] h-0 w-0 opacity-0" />

      <div className="flex flex-wrap items-center gap-5 pt-4">
        <Button type="submit" disabled={status === 'sending'} arrow={false}>
          {status === 'sending' ? <LoaderCircle size={15} className="animate-spin" /> : status === 'sent' ? <Check size={15} /> : <Send size={15} />}
          <span>{status === 'sending' ? 'Sending' : !social.formEndpoint && !social.email ? 'Send via WhatsApp' : 'Send message'}</span>
        </Button>
        <p role="status" aria-live="polite" className={cn('text-sm', status === 'error' ? 'text-black underline decoration-wavy' : 'text-metal')}>
          {msg}
        </p>
      </div>
    </form>
  )
}

function Links() {
  const items = [
    social.github && { label: 'GitHub', href: social.github, icon: <GithubIcon /> },
    social.linkedin && { label: 'LinkedIn', href: social.linkedin, icon: <LinkedinIcon /> },
    social.whatsapp && { label: 'WhatsApp', href: whatsappLink("Hi Srikar, "), icon: <WhatsappIcon />, text: 'Text me' },
    social.phone && { label: 'Call', href: `tel:+${social.phone}`, icon: <Phone size={16} />, text: phoneDisplay },
    social.email && { label: 'Email', href: `mailto:${social.email}`, icon: <Mail size={16} />, text: social.email },
  ].filter(Boolean) as { label: string; href: string; icon: React.ReactNode; text?: string }[]
  if (!items.length) return null
  return (
    <ul className="space-y-0 border-t border-line">
      {items.map((i) => (
        <li key={i.label} className="border-b border-line">
          <a
            href={i.href}
            target={i.href.startsWith('http') ? '_blank' : undefined}
            rel="noreferrer noopener"
            className="group flex items-center justify-between py-5 transition-colors hover:text-black"
          >
            <span className="flex items-center gap-4 text-metal transition-colors group-hover:text-black">
              {i.icon}
              <span className="font-mono text-[0.72rem] uppercase tracking-[0.14em]">{i.label}</span>
            </span>
            <span className="text-sm text-metal transition-transform duration-500 group-hover:translate-x-1 group-hover:text-black">{i.text ?? '↗'}</span>
          </a>
        </li>
      ))}
    </ul>
  )
}

function Marquee() {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const x = useTransform(scrollYProgress, [0, 1], reduced ? ['0%', '0%'] : ['8%', '-38%'])
  return (
    <div ref={ref} aria-hidden className="select-none overflow-hidden border-y border-line py-8 md:py-14">
      <motion.p style={{ x }} className="display whitespace-nowrap text-[clamp(4rem,15vw,14rem)] leading-none">
        <span className="chrome-text">LET’S CREATE WHAT’S NEXT.</span>
        <span className="mx-[0.3em] text-silver">—</span>
        <span className="text-transparent [-webkit-text-stroke:1.5px_#7a6f5c]">LET’S CREATE WHAT’S NEXT.</span>
      </motion.p>
    </div>
  )
}

export function Contact() {
  return (
    <section id="contact" aria-label="Contact — The next collaboration" className="relative bg-white pt-28 md:pt-44">
      <div className="mx-auto max-w-[1600px] px-[var(--pad)]">
        <SectionHeader
          index="05"
          label="Contact · The next collaboration"
          title="Let’s build something intelligent."
          sub="Have an ambitious idea, an interesting problem, or an opportunity to collaborate? Let’s make it happen."
        />
        <div className="grid gap-16 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-7">
            <Reveal>
              {contactConfigured ? (
                <ContactForm />
              ) : (
                <div className="border border-dashed border-silver p-8 text-metal">
                  <p className="display text-2xl text-black">Contact channels are being set up.</p>
                  <p className="mt-3 text-sm leading-relaxed">
                    {import.meta.env.DEV
                      ? 'Owner note: add your email and/or a form endpoint in src/data/social.ts and the contact form appears automatically.'
                      : 'Please check back shortly.'}
                  </p>
                </div>
              )}
            </Reveal>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <Reveal delay={0.1}>
              <Links />
              {social.whatsapp && (
                <a
                  href={whatsappLink('Hi Srikar, ')}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-8 flex items-center justify-between rounded-2xl bg-black px-6 py-5 text-white transition-transform hover:-translate-y-0.5"
                >
                  <span>
                    <span className="eyebrow !text-silver block">Any queries?</span>
                    <span className="display mt-1 block text-xl">Text me on WhatsApp</span>
                  </span>
                  <WhatsappIcon size={26} />
                </a>
              )}
              {profile.location && <p className="eyebrow mt-6">{profile.location}</p>}
            </Reveal>
          </div>
        </div>
      </div>

      <div className="mt-28 md:mt-44">
        <Marquee />
      </div>
      <Footer />
    </section>
  )
}

function Footer() {
  const lenis = useLenis()
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-10 px-[var(--pad)] py-14 md:flex-row md:items-end md:justify-between md:py-20">
        <div>
          <SplitText as="p" text={profile.brand} stagger={0.07} className="display block text-[clamp(3rem,9vw,8rem)]" />
          <Reveal delay={0.5}>
            <p className="eyebrow mt-4 !text-silver">BEYOND THE INTERFACE.</p>
          </Reveal>
        </div>
        <div className="flex flex-col gap-4 md:items-end">
          <Magnetic>
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault()
                scrollToId(lenis.current, 'hero')
              }}
              className="rounded-full border border-white/25 px-6 py-3 font-mono text-[0.66rem] uppercase tracking-[0.14em] transition-colors hover:bg-white hover:text-black"
            >
              Back to top ↑
            </a>
          </Magnetic>
          {social.resumeUrl && (
            <a href={social.resumeUrl} download className="eyebrow !text-silver underline underline-offset-4 hover:!text-white">
              Download Resume
            </a>
          )}
          <p className="eyebrow !text-metal">© {profile.copyrightYear}.</p>
        </div>
      </div>
    </footer>
  )
}
