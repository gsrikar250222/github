import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { LEVELS, SHOW_SKILL_LEVELS, skillCategories, uniqueSkillCount, type Skill, type SkillLevel } from '../data/skills'
import { cn } from '../lib/utils'

/** Each classification has its own visual weight, so level is readable without a label. */
const chip: Record<SkillLevel, string> = {
  building: 'bg-cobalt text-white border-cobalt',
  working: 'bg-white text-cobalt border-cobalt',
  familiar: 'bg-mist text-ink border-mist',
  exploring: 'border-dashed border-slate text-slate bg-transparent',
}

export function Skills() {
  const [cat, setCat] = useState(skillCategories[0].id)
  const [q, setQ] = useState('')
  const [picked, setPicked] = useState<{ skill: Skill; cat: string } | null>(null)

  const query = q.trim().toLowerCase()
  const current = skillCategories.find((c) => c.id === cat)!

  const results = useMemo(() => {
    if (!query) return []
    return skillCategories
      .map((c) => ({ c, skills: c.skills.filter((s) => s.name.toLowerCase().split(/[\s/&(),.-]+/).some((w) => w.startsWith(query)) || s.name.toLowerCase().includes(query) && query.length > 2) }))
      .filter((r) => r.skills.length)
  }, [query])

  const style = (l: SkillLevel) => (SHOW_SKILL_LEVELS ? chip[l] : chip.working)
  const levelOf = (l: SkillLevel) => LEVELS.find((x) => x.id === l)!

  const renderSkills = (skills: Skill[], catId: string) => (
    <ul className="m-0 flex list-none flex-wrap gap-2.5 p-0">
      {skills.map((s) => (
        <li key={s.name}>
          <button
            onClick={() => setPicked({ skill: s, cat: catId })}
            aria-pressed={picked?.skill.name === s.name}
            className={cn('rounded-lg border-2 px-4 py-2 text-[0.95rem] font-medium transition-transform hover:-translate-y-0.5', style(s.level), picked?.skill.name === s.name && 'ring-2 ring-ink ring-offset-2 ring-offset-paper')}
          >
            {s.name}
          </button>
        </li>
      ))}
    </ul>
  )

  return (
    <section id="skills" className="on-light bg-[#eceefa] py-24 md:py-36">
      <div className="wrap">
        <h2 className="display max-w-[16ch] text-[clamp(2.6rem,5.2vw,4.6rem)]">What I work with</h2>
        <p className="mt-6 max-w-[56ch] text-slate">
          {uniqueSkillCount} technologies across {skillCategories.length} areas. I group them by how I actually use them, not by a score.
        </p>

        {SHOW_SKILL_LEVELS && (
          <ul className="m-0 mt-8 flex list-none flex-wrap gap-x-8 gap-y-3 p-0">
            {LEVELS.map((l) => (
              <li key={l.id} className="flex items-center gap-3">
                <span aria-hidden className={cn('inline-block h-5 w-9 rounded-md border-2', chip[l.id])} />
                <span className="text-[0.95rem]">
                  <span className="font-semibold">{l.label}</span>
                  <span className="text-slate">: {l.hint.toLowerCase()}</span>
                </span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-12 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <label className="relative block">
              <span className="sr-only">Search skills</span>
              <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search a technology"
                className="w-full rounded-xl border border-ink/20 bg-white py-3.5 pl-11 pr-4 outline-none transition-colors focus:border-cobalt"
              />
            </label>
            <ul className="m-0 mt-5 list-none p-0">
              {skillCategories.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => {
                      setCat(c.id)
                      setQ('')
                      setPicked(null)
                    }}
                    aria-current={!query && cat === c.id ? 'true' : undefined}
                    className={cn(
                      'flex w-full items-center justify-between border-b border-ink/10 py-3 text-left transition-colors hover:text-cobalt',
                      !query && cat === c.id ? 'font-semibold text-cobalt' : 'text-ink/80',
                    )}
                  >
                    <span>{c.title}</span>
                    <span className="text-[0.9rem] text-slate">{c.skills.length}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-8">
            {query ? (
              results.length ? (
                <div className="space-y-8">
                  {results.map((r) => (
                    <div key={r.c.id}>
                      <h3 className="display m-0 mb-3 text-[1.3rem]">{r.c.title}</h3>
                      {renderSkills(r.skills, r.c.id)}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="m-0 text-slate">Nothing matches &ldquo;{q}&rdquo;. Try a shorter word, like &ldquo;react&rdquo; or &ldquo;sql&rdquo;.</p>
              )
            ) : (
              <>
                <h3 className="display m-0 text-[clamp(1.8rem,3vw,2.5rem)]">{current.title}</h3>
                <p className="m-0 mb-7 mt-3 max-w-[56ch] text-slate">{current.summary}</p>
                {renderSkills(current.skills, current.id)}
              </>
            )}

            <div aria-live="polite" className="mt-8 min-h-[5.5rem] rounded-xl border border-ink/10 bg-white p-5">
              {picked ? (
                <>
                  <p className="m-0 font-semibold">
                    {picked.skill.name}
                    {SHOW_SKILL_LEVELS && <span className="font-normal text-slate"> — {levelOf(picked.skill.level).label}</span>}
                  </p>
                  <p className="m-0 mt-1 text-slate">{picked.skill.description}</p>
                </>
              ) : (
                <p className="m-0 text-slate">Select any technology to see what I use it for.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
