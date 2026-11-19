import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import type { Project, ProjectDomain } from '../data/projects'
import { useProjects } from '../data/projectStore'
import { ProjectCover } from '../components/ProjectCover'
import { GithubIcon } from '../components/icons'
import { cn } from '../lib/utils'

const filters: { id: 'all' | ProjectDomain; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'ai', label: 'AI and ML' },
  { id: 'fullstack', label: 'Full stack' },
]

function Row({ p, i, open, toggle }: { p: Project; i: number; open: boolean; toggle: () => void }) {
  const hasLinks = p.links && (p.links.live || p.links.github || p.links.caseStudy)
  return (
    <li className="border-b border-white/15">
      <h3 className="m-0">
        <button
          onClick={toggle}
          aria-expanded={open}
          aria-controls={`proj-${p.id}`}
          className="group grid w-full grid-cols-[1fr_auto] items-center gap-6 py-7 text-left md:grid-cols-[minmax(0,1fr)_16rem_auto]"
        >
          <span className="min-w-0">
            <span className="display block text-[clamp(1.7rem,3.6vw,3rem)] transition-colors group-hover:text-signal">{p.name}</span>
            <span className="mt-1.5 block text-[0.95rem] text-white/60 md:hidden">{p.category}</span>
          </span>
          <span className="hidden text-[0.95rem] text-white/60 md:block">
            {p.category}
            {p.status && <span className="ml-3 rounded-full border border-white/30 px-2.5 py-0.5 text-[0.8rem] text-white/80">{p.status}</span>}
          </span>
          <span className={cn('grid h-11 w-11 place-items-center rounded-full border border-white/30 transition-colors', open && 'border-signal bg-signal text-ink')}>
            {open ? <Minus size={18} /> : <Plus size={18} />}
          </span>
        </button>
      </h3>
      <div id={`proj-${p.id}`} className={cn('grid transition-[grid-template-rows] duration-500 ease-out', open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
        <div className="overflow-hidden" inert={!open}>
          <div className="grid gap-8 pb-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <div className="aspect-[4/3] overflow-hidden rounded-xl border border-white/10 bg-ink">
                {p.media?.image ? (
                  <img src={p.media.image} alt={p.media.alt ?? `${p.name} screenshot`} loading="lazy" className="h-full w-full object-cover" />
                ) : (
                  <ProjectCover project={p} index={i} />
                )}
              </div>
            </div>
            <div className="md:col-span-7 md:pl-6">
              <p className="max-w-[58ch] text-[1.05rem] leading-relaxed text-white/90">{p.description}</p>
              <ul className="m-0 mt-6 flex list-none flex-wrap gap-2 p-0">
                {p.tech.map((t) => (
                  <li key={t} className="rounded-md bg-white/10 px-3 py-1 text-[0.85rem] text-white/90">
                    {t}
                  </li>
                ))}
              </ul>
              {hasLinks ? (
                <div className="mt-8 flex flex-wrap gap-3">
                  {p.links?.live && (
                    <a href={p.links.live} target="_blank" rel="noreferrer noopener" className="rounded-full bg-white px-6 py-3 text-[0.95rem] font-semibold text-ink transition-colors hover:bg-signal">
                      Visit live site
                    </a>
                  )}
                  {p.links?.github && (
                    <a href={p.links.github} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-[0.95rem] font-semibold transition-colors hover:bg-white hover:text-ink">
                      <GithubIcon size={16} /> View code
                    </a>
                  )}
                  {p.links?.caseStudy && (
                    <a href={p.links.caseStudy} target="_blank" rel="noreferrer noopener" className="rounded-full border border-white/40 px-6 py-3 text-[0.95rem] font-semibold transition-colors hover:bg-white hover:text-ink">
                      Read case study
                    </a>
                  )}
                </div>
              ) : (
                <p className="mt-8 text-[0.95rem] text-white/55">No public link yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </li>
  )
}

export function Projects() {
  const projects = useProjects()
  const [f, setF] = useState<'all' | ProjectDomain>('all')
  const [open, setOpen] = useState<string>(projects[0]?.id ?? '')
  const list = projects.filter((p) => f === 'all' || p.domain === f)

  return (
    <section id="projects" className="bg-ink py-24 text-white md:py-36">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <h2 className="display max-w-[14ch] text-[clamp(2.6rem,5.2vw,4.6rem)]">Things I&rsquo;ve built</h2>
          <div role="group" aria-label="Filter projects" className="flex flex-wrap items-center gap-2">
            {filters.map((x) => (
              <button
                key={x.id}
                aria-pressed={f === x.id}
                onClick={() => setF(x.id)}
                className={cn('rounded-full border px-5 py-2 text-[0.95rem] transition-colors', f === x.id ? 'border-white bg-white text-ink' : 'border-white/30 text-white/80 hover:border-white')}
              >
                {x.label}
              </button>
            ))}
            <span className="ml-2 text-[0.95rem] text-white/55" aria-live="polite">
              {list.length} projects
            </span>
          </div>
        </div>

        <ul className="m-0 mt-14 list-none border-t border-white/15 p-0">
          {list.map((p, i) => (
            <Row key={p.id} p={p} i={i} open={open === p.id} toggle={() => setOpen(open === p.id ? '' : p.id)} />
          ))}
        </ul>
      </div>
    </section>
  )
}
