import { useState } from 'react'
import { Check, LoaderCircle, Mail, Phone } from 'lucide-react'
import { profile } from '../data/profile'
import { contactConfigured, phoneDisplay, social, whatsappLink } from '../data/social'
import { GithubIcon, LinkedinIcon, WhatsappIcon } from '../components/icons'
import { useEnquirySubject } from '../lib/enquiry'
import { cn } from '../lib/utils'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const input =
  'w-full rounded-lg border border-ink/20 bg-white px-4 py-3.5 text-ink outline-none transition-colors placeholder:text-slate/70 focus:border-cobalt'
const label = 'mb-2 block text-[0.95rem] font-semibold'

function ContactForm() {
  const subject = useEnquirySubject()
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
        setMsg('Message sent. I’ll reply by email soon.')
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
      setMsg('The message did not send. Check your connection and try again' + (social.email ? `, or email ${social.email}.` : '.'))
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5 rounded-2xl bg-white p-6 text-ink shadow-[0_30px_60px_-30px_rgba(0,0,40,0.5)] md:p-9">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="c-name" className={label}>Your name</label>
          <input id="c-name" name="name" required autoComplete="name" className={input} />
        </div>
        <div>
          <label htmlFor="c-email" className={label}>Your email</label>
          <input id="c-email" name="email" type="email" required autoComplete="email" className={input} />
        </div>
      </div>
      <div>
        <label htmlFor="c-subject" className={label}>What is this about?</label>
        <input id="c-subject" key={subject} name="subject" required defaultValue={subject} className={input} />
      </div>
      <div>
        <label htmlFor="c-message" className={label}>Tell me about the project</label>
        <textarea id="c-message" name="message" required rows={5} placeholder="What do you want to build, and by when?" className={cn(input, 'resize-y')} />
      </div>
      <input name="company" tabIndex={-1} autoComplete="off" aria-hidden className="absolute left-[-9999px] h-0 w-0 opacity-0" />
      <div className="flex flex-wrap items-center gap-4 pt-1">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-4 font-semibold text-white transition-colors hover:bg-cobalt disabled:opacity-60"
        >
          {status === 'sending' && <LoaderCircle size={17} className="animate-spin" />}
          {status === 'sent' && <Check size={17} />}
          {status === 'sending' ? 'Sending' : !social.formEndpoint && !social.email ? 'Send on WhatsApp' : 'Send message'}
        </button>
        <p role="status" aria-live="polite" className={cn('m-0 max-w-[34ch] text-[0.95rem]', status === 'error' ? 'text-red-700' : 'text-slate')}>
          {msg}
        </p>
      </div>
    </form>
  )
}

export function Contact() {
  const rows = [
    social.whatsapp && { name: 'WhatsApp', value: 'Message me directly', href: whatsappLink('Hi Srikar, '), icon: <WhatsappIcon size={20} /> },
    social.phone && { name: 'Call', value: phoneDisplay, href: `tel:+${social.phone}`, icon: <Phone size={20} /> },
    social.email && { name: 'Email', value: social.email, href: `mailto:${social.email}`, icon: <Mail size={20} /> },
    social.linkedin && { name: 'LinkedIn', value: 'Connect with me', href: social.linkedin, icon: <LinkedinIcon size={20} /> },
    social.github && { name: 'GitHub', value: 'See the code', href: social.github, icon: <GithubIcon size={20} /> },
  ].filter(Boolean) as { name: string; value: string; href: string; icon: React.ReactNode }[]

  return (
    <>
      <section id="contact" className="bg-cobalt py-24 text-white md:py-36">
        <div className="wrap grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="display max-w-[11ch] text-[clamp(2.8rem,6vw,5.4rem)]">Have a project in mind?</h2>
            <p className="mt-6 max-w-[40ch] text-[1.12rem] text-white/85">
              Tell me what you want to build. I reply to every message, usually within a day.
            </p>
            <ul className="m-0 mt-10 list-none border-t border-white/25 p-0">
              {rows.map((r) => (
                <li key={r.name} className="border-b border-white/25">
                  <a
                    href={r.href}
                    target={r.href.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer noopener"
                    className="group flex items-center gap-4 py-4 transition-colors hover:text-signal"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/35 transition-colors group-hover:border-signal">{r.icon}</span>
                    <span className="font-semibold">{r.name}</span>
                    <span className="ml-auto text-right text-[0.95rem] text-white/75 group-hover:text-signal">{r.value}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-7">
            {contactConfigured ? (
              <ContactForm />
            ) : (
              <p className="rounded-2xl bg-white/10 p-8 text-white/85">The contact form isn’t set up yet. Use any of the links on the left.</p>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-ink py-12 text-white">
        <div className="wrap flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="display m-0 text-[2rem]">{profile.brand}</p>
            <p className="m-0 mt-1 text-white/60">{profile.fullName}, AI engineer and full-stack developer.</p>
          </div>
          <p className="m-0 text-[0.9rem] text-white/50">© {profile.copyrightYear} {profile.fullName}. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}
