import { profile } from '../data/profile'
import { useProjects } from '../data/projectStore'

export function About() {
  const projects = useProjects()
  const live = projects.filter((p) => p.links?.live).length
  const photo = profile.photo

  return (
    <section id="about" className="on-light bg-paper py-24 md:py-36">
      <div className="wrap">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          {photo.src && (
            <div className="lg:col-span-4">
              <img
                src={`${import.meta.env.BASE_URL}${photo.src}`}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                loading="lazy"
                className="aspect-[10/11] w-full rounded-2xl object-cover lg:sticky lg:top-28"
              />
            </div>
          )}

          <div className={photo.src ? 'lg:col-span-8' : 'lg:col-span-12'}>
            <h2 className="display max-w-[16ch] text-[clamp(2.6rem,5.2vw,4.6rem)]">{profile.about.title}</h2>

            <div className="mt-10 max-w-[62ch] space-y-5 text-[1.12rem] leading-relaxed text-ink/90">
              {profile.about.intro.map((t) => (
                <p key={t}>
                  {t}
                </p>
              ))}
            </div>

            <p className="mt-8 max-w-[62ch] text-slate">
              Right now that means {projects.length} projects documented here, {live} of them live on the web, and a B.Tech in AI and machine learning in progress.
            </p>

            <h3 className="display mt-20 text-[clamp(1.8rem,3vw,2.6rem)]">How I work</h3>
            <dl className="m-0 mt-8 grid gap-x-12 gap-y-8 md:grid-cols-2">
              {profile.about.mindset.map((m) => (
                <div key={m.title} className="border-t border-ink/15 pt-5">
                  <dt className="display text-[1.35rem]">{m.title}</dt>
                  <dd className="m-0 mt-2 text-slate">{m.body}</dd>
                </div>
              ))}
            </dl>

            <h3 className="display mt-20 text-[clamp(1.8rem,3vw,2.6rem)]">How my work has grown</h3>
            <ol className="relative m-0 mt-8 list-none border-l-2 border-cobalt/25 p-0">
              {profile.journey.map((j) => (
                <li key={j.title} className="relative pb-9 pl-8 last:pb-0">
                  <span aria-hidden className="absolute -left-[7px] top-2 h-3 w-3 rounded-full bg-cobalt" />
                  <h4 className="display m-0 text-[1.3rem]">{j.title}</h4>
                  <p className="m-0 mt-1.5 max-w-[60ch] text-slate">{j.body}</p>
                </li>
              ))}
            </ol>

            {profile.education.length > 0 && (
              <>
                <h3 className="display mt-20 text-[clamp(1.8rem,3vw,2.6rem)]">Education</h3>
                <ul className="m-0 mt-6 list-none p-0">
                  {profile.education.map((e) => (
                    <li key={e.institution} className="border-t border-ink/15 py-5">
                      <p className="m-0 text-[1.15rem] font-semibold">{e.institution}</p>
                      <p className="m-0 mt-1 text-slate">
                        {e.program}
                        {e.period ? `, ${e.period}` : ''}
                      </p>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
