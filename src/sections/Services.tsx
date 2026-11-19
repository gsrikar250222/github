import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { services } from '../data/services'
import { setEnquirySubject } from '../lib/enquiry'
import { scrollToId, useLenis } from '../hooks/useSmoothScroll'
import { cn } from '../lib/utils'

export function Services() {
  const lenis = useLenis()
  const [open, setOpen] = useState<string>(services[0].id)

  return (
    <section id="services" className="on-light bg-paper py-24 md:py-36">
      <div className="wrap grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 className="display max-w-[12ch] text-[clamp(2.6rem,5.2vw,4.6rem)]">What I can build for you</h2>
          <p className="mt-6 max-w-[40ch] text-slate">
            Four kinds of work, each backed by projects below. Pick the closest one and I&rsquo;ll reply with questions and a plan.
          </p>
        </div>

        <ul className="m-0 list-none border-t border-ink/15 p-0 lg:col-span-7">
          {services.map((s) => {
            const isOpen = open === s.id
            return (
              <li key={s.id} className="border-b border-ink/15">
                <h3 className="m-0">
                  <button
                    onClick={() => setOpen(isOpen ? '' : s.id)}
                    aria-expanded={isOpen}
                    aria-controls={`svc-${s.id}`}
                    className="group flex w-full items-center justify-between gap-6 py-7 text-left"
                  >
                    <span>
                      <span className="display block text-[clamp(1.6rem,3vw,2.4rem)] transition-colors group-hover:text-cobalt">{s.title}</span>
                      <span className="mt-2 block text-slate">{s.summary}</span>
                    </span>
                    <span className={cn('grid h-11 w-11 shrink-0 place-items-center rounded-full border border-ink/25 transition-colors', isOpen && 'border-cobalt bg-cobalt text-white')}>
                      {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                    </span>
                  </button>
                </h3>
                <div id={`svc-${s.id}`} className={cn('grid transition-[grid-template-rows] duration-500 ease-out', isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
                  <div className="overflow-hidden" inert={!isOpen}>
                    <p className="max-w-[58ch] pb-5 text-ink/85">{s.details}</p>
                    <p className="pb-6 text-[0.95rem] text-slate">
                      <span className="font-semibold text-ink">Built before: </span>
                      {s.examples.join(', ')}
                    </p>
                    <button
                      onClick={() => {
                        setEnquirySubject(`Project enquiry: ${s.title}`)
                        scrollToId(lenis.current, 'contact')
                      }}
                      className="mb-8 rounded-full bg-ink px-6 py-3 text-[0.95rem] font-semibold text-white transition-colors hover:bg-cobalt"
                    >
                      Start this project
                    </button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
