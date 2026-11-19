import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUp, Download, Eye, Lock, Pencil, Plus, RotateCcw, Trash2, Upload } from 'lucide-react'
import type { Project, ProjectStatus } from '../data/projects'
import { isCustomised, resetProjects, saveProjects, useProjects } from '../data/projectStore'

/**
 * Admin panel — add / edit / reorder / delete projects.
 * Data is saved in THIS browser (localStorage) and the site reads it live.
 * Use Export to back up, and Import to restore or move edits to another browser.
 * The passcode is a local convenience lock, not server security.
 */

const PASS_KEY = 'srikar.admin.pass.v1'
const SESSION_KEY = 'srikar.admin.session'
const MOTIFS: Project['motif'][] = ['orbit', 'wave', 'glyph', 'grid', 'lens', 'terrain', 'stack', 'leaf', 'bars']
const STATUSES: (ProjectStatus | '')[] = ['', 'Completed', 'In Progress', 'Prototype', 'Concept']

async function hash(s: string) {
  try {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s))
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('')
  } catch {
    return btoa(unescape(encodeURIComponent(s)))
  }
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'project'

const blank = (): Project => ({
  id: '',
  name: '',
  category: '',
  domain: 'fullstack',
  description: '',
  tech: [],
  motif: 'grid',
})

const input = 'w-full rounded-lg border border-line bg-white px-4 py-3 text-[0.95rem] outline-none transition-colors focus:border-black'
const labelCls = 'mb-2 block font-mono text-[0.66rem] uppercase tracking-[0.14em] text-metal'
const btn = 'inline-flex items-center gap-2 rounded-full border border-line px-4 py-2.5 font-mono text-[0.66rem] uppercase tracking-[0.12em] transition-colors hover:border-black'
const btnDark = 'inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 font-mono text-[0.66rem] uppercase tracking-[0.12em] text-white transition-colors hover:bg-charcoal'

function Gate({ onOk }: { onOk: () => void }) {
  const [has] = useState(() => !!localStorage.getItem(PASS_KEY))
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [err, setErr] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr('')
    if (has) {
      if ((await hash(pw)) === localStorage.getItem(PASS_KEY)) {
        sessionStorage.setItem(SESSION_KEY, '1')
        onOk()
      } else setErr('Wrong passcode.')
    } else {
      if (pw.length < 6) return setErr('Use at least 6 characters.')
      if (pw !== pw2) return setErr('Passcodes do not match.')
      localStorage.setItem(PASS_KEY, await hash(pw))
      sessionStorage.setItem(SESSION_KEY, '1')
      onOk()
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-[#f7f7f7] p-6">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl border border-line bg-white p-8 shadow-[0_30px_80px_-40px_rgba(0,0,0,.35)]">
        <span className="mb-6 grid h-11 w-11 place-items-center rounded-full bg-black text-white">
          <Lock size={18} />
        </span>
        <h1 className="display text-3xl">{has ? 'Admin sign in' : 'Set an admin passcode'}</h1>
        <p className="mt-2 text-sm text-metal">
          {has ? 'Enter your passcode to manage projects.' : 'First visit — choose a passcode. It is stored (hashed) in this browser only.'}
        </p>
        <div className="mt-6 space-y-4">
          <input autoFocus type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Passcode" className={input} />
          {!has && <input type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} placeholder="Repeat passcode" className={input} />}
        </div>
        {err && <p role="alert" className="mt-3 text-sm text-black underline decoration-wavy">{err}</p>}
        <button className={btnDark + ' mt-6 w-full justify-center'}>{has ? 'Sign in' : 'Create passcode'}</button>
        <a href="#" className="mt-5 block text-center font-mono text-[0.66rem] uppercase tracking-[0.14em] text-metal hover:text-black">← Back to site</a>
      </form>
    </div>
  )
}

function Editor({ initial, existingIds, onSave, onCancel }: { initial: Project; existingIds: string[]; onSave: (p: Project) => void; onCancel: () => void }) {
  const isNew = !initial.id
  const [p, setP] = useState<Project>(initial)
  const [tech, setTech] = useState(initial.tech.join(', '))
  const [err, setErr] = useState('')
  const set = <K extends keyof Project>(k: K, v: Project[K]) => setP((x) => ({ ...x, [k]: v }))
  const setLink = (k: 'live' | 'github' | 'caseStudy', v: string) => setP((x) => ({ ...x, links: { ...x.links, [k]: v } }))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!p.name.trim()) return setErr('Name is required.')
    if (!p.description.trim()) return setErr('Add a short description.')
    for (const u of [p.links?.live, p.links?.github, p.links?.caseStudy, p.media?.image, p.media?.video]) {
      if (u && !/^(https?:\/\/|\/)/i.test(u)) return setErr('Links must start with https:// (or / for files on your site).')
    }
    let id = p.id || slug(p.name)
    if (isNew) {
      const base = id
      let n = 2
      while (existingIds.includes(id)) id = `${base}-${n++}`
    }
    const clean: Project = {
      ...p,
      id,
      name: p.name.trim(),
      category: p.category.trim() || (p.domain === 'ai' ? 'AI / Machine Learning' : 'Full Stack'),
      description: p.description.trim(),
      tech: tech.split(',').map((t) => t.trim()).filter(Boolean),
      status: p.status || undefined,
      featured: p.featured || undefined,
      links: Object.fromEntries(Object.entries(p.links ?? {}).filter(([, v]) => v)) as Project['links'],
      media: p.media?.image || p.media?.video ? p.media : undefined,
    }
    if (clean.links && !Object.keys(clean.links).length) delete clean.links
    onSave(clean)
  }

  return (
    <form onSubmit={submit} className="space-y-6 rounded-3xl border border-line bg-white p-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="display text-2xl">{isNew ? 'Add project' : `Edit — ${initial.name}`}</h2>
        <button type="button" onClick={onCancel} className={btn}>Cancel</button>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <label><span className={labelCls}>Name *</span><input className={input} value={p.name} onChange={(e) => set('name', e.target.value)} /></label>
        <label><span className={labelCls}>Category</span><input className={input} value={p.category} onChange={(e) => set('category', e.target.value)} placeholder="e.g. Full Stack / E-commerce" /></label>
        <label><span className={labelCls}>Type</span>
          <select className={input} value={p.domain} onChange={(e) => set('domain', e.target.value as Project['domain'])}>
            <option value="ai">AI &amp; ML</option><option value="fullstack">Full Stack</option>
          </select></label>
        <label><span className={labelCls}>Status (shown as a badge)</span>
          <select className={input} value={p.status ?? ''} onChange={(e) => set('status', (e.target.value || undefined) as ProjectStatus | undefined)}>
            {STATUSES.map((s) => <option key={s} value={s}>{s || '— none —'}</option>)}
          </select></label>
      </div>
      <label className="block"><span className={labelCls}>Description *</span><textarea rows={4} className={input} value={p.description} onChange={(e) => set('description', e.target.value)} /></label>
      <label className="block"><span className={labelCls}>Tech (comma separated)</span><input className={input} value={tech} onChange={(e) => setTech(e.target.value)} placeholder="React, Node.js, MongoDB" /></label>
      <div className="grid gap-6 md:grid-cols-3">
        <label><span className={labelCls}>Live URL</span><input className={input} value={p.links?.live ?? ''} onChange={(e) => setLink('live', e.target.value.trim())} placeholder="https://…" /></label>
        <label><span className={labelCls}>GitHub URL</span><input className={input} value={p.links?.github ?? ''} onChange={(e) => setLink('github', e.target.value.trim())} placeholder="https://github.com/…" /></label>
        <label><span className={labelCls}>Case study URL</span><input className={input} value={p.links?.caseStudy ?? ''} onChange={(e) => setLink('caseStudy', e.target.value.trim())} placeholder="https://…" /></label>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <label><span className={labelCls}>Cover image URL (optional)</span><input className={input} value={p.media?.image ?? ''} onChange={(e) => set('media', { ...p.media, image: e.target.value.trim() })} placeholder="https://… or /projects/x.webp" /></label>
        <label><span className={labelCls}>Generated cover style</span>
          <select className={input} value={p.motif} onChange={(e) => set('motif', e.target.value as Project['motif'])}>{MOTIFS.map((m) => <option key={m}>{m}</option>)}</select></label>
        <label className="flex items-end gap-3 pb-3"><input type="checkbox" checked={!!p.featured} onChange={(e) => set('featured', e.target.checked)} className="h-4 w-4 accent-black" /><span className="text-sm">Featured</span></label>
      </div>
      {err && <p role="alert" className="text-sm text-black underline decoration-wavy">{err}</p>}
      <div className="flex gap-3"><button className={btnDark}>{isNew ? 'Add project' : 'Save changes'}</button><button type="button" onClick={onCancel} className={btn}>Cancel</button></div>
    </form>
  )
}

function Panel() {
  const projects = useProjects()
  const [editing, setEditing] = useState<Project | null>(null)
  const [toast, setToast] = useState('')
  const file = useRef<HTMLInputElement>(null)
  const say = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2800) }

  const move = (i: number, d: -1 | 1) => {
    const j = i + d
    if (j < 0 || j >= projects.length) return
    const next = [...projects]
    ;[next[i], next[j]] = [next[j], next[i]]
    saveProjects(next)
  }
  const upsert = (p: Project) => {
    const i = projects.findIndex((x) => x.id === p.id)
    saveProjects(i >= 0 ? projects.map((x, k) => (k === i ? p : x)) : [...projects, p])
    setEditing(null)
    say(i >= 0 ? 'Saved.' : 'Project added.')
  }
  const del = (p: Project) => {
    if (confirm(`Delete "${p.name}"? This cannot be undone (except via Reset).`)) {
      saveProjects(projects.filter((x) => x.id !== p.id))
      say('Deleted.')
    }
  }
  const exportJson = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(projects, null, 2)], { type: 'application/json' }))
    const a = document.createElement('a')
    a.href = url; a.download = 'projects-backup.json'; a.click()
    URL.revokeObjectURL(url)
  }
  const importJson = async (f: File) => {
    try {
      const data = JSON.parse(await f.text())
      if (!Array.isArray(data) || data.some((p) => !p || typeof p.id !== 'string' || typeof p.name !== 'string' || !Array.isArray(p.tech)))
        throw new Error('shape')
      saveProjects(data as Project[])
      say(`Imported ${data.length} projects.`)
    } catch {
      say('That file is not a valid projects backup.')
    }
  }

  useEffect(() => { window.scrollTo(0, 0) }, [editing])

  return (
    <div className="min-h-screen bg-[#f7f7f7] text-black">
      <header className="sticky top-0 z-20 border-b border-line bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-4">
          <p className="display text-xl">SRIKAR. <span className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-metal">/ admin</span></p>
          <div className="flex flex-wrap gap-2">
            <a href="#" className={btn}><Eye size={14} /> View site</a>
            <button onClick={() => { sessionStorage.removeItem(SESSION_KEY); location.reload() }} className={btn}>Sign out</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-5 py-8">
        {editing ? (
          <Editor initial={editing} existingIds={projects.map((p) => p.id)} onSave={upsert} onCancel={() => setEditing(null)} />
        ) : (
          <>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="display text-4xl">Projects <span className="text-metal">({projects.length})</span></h1>
                <p className="mt-2 max-w-xl text-sm text-metal">
                  Changes appear on the site instantly in this browser. Export a backup after editing; Import restores it or moves it to another browser.
                  {isCustomised() ? ' (Showing your edited list.)' : ' (Showing the built-in list.)'}
                </p>
              </div>
              <button onClick={() => setEditing(blank())} className={btnDark}><Plus size={14} /> Add project</button>
            </div>

            <ul className="divide-y divide-line overflow-hidden rounded-3xl border border-line bg-white">
              {projects.map((p, i) => (
                <li key={p.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
                  <span className="w-7 font-mono text-[0.7rem] text-metal">{String(i + 1).padStart(2, '0')}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{p.name}</p>
                    <p className="truncate text-sm text-metal">
                      {p.domain === 'ai' ? 'AI & ML' : 'Full Stack'}{p.status ? ` · ${p.status}` : ''}{p.links?.live ? ' · live link' : ''}{p.links?.github ? ' · GitHub' : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)} className="rounded-full p-2 hover:bg-[#f7f7f7] disabled:opacity-30"><ArrowUp size={16} /></button>
                    <button aria-label="Move down" disabled={i === projects.length - 1} onClick={() => move(i, 1)} className="rounded-full p-2 hover:bg-[#f7f7f7] disabled:opacity-30"><ArrowDown size={16} /></button>
                    <button onClick={() => setEditing(p)} className={btn}><Pencil size={13} /> Edit</button>
                    <button aria-label={`Delete ${p.name}`} onClick={() => del(p)} className="rounded-full p-2 text-metal hover:bg-[#f7f7f7] hover:text-black"><Trash2 size={16} /></button>
                  </div>
                </li>
              ))}
              {!projects.length && <li className="px-5 py-10 text-center text-metal">No projects. Add one, or Reset to defaults.</li>}
            </ul>

            <div className="flex flex-wrap gap-2">
              <button onClick={exportJson} className={btn}><Download size={14} /> Export backup</button>
              <button onClick={() => file.current?.click()} className={btn}><Upload size={14} /> Import backup</button>
              <input ref={file} type="file" accept="application/json" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) importJson(f); e.target.value = '' }} />
              <button onClick={() => { if (confirm('Discard all edits and restore the built-in project list?')) { resetProjects(); say('Restored defaults.') } }} className={btn}><RotateCcw size={14} /> Reset to defaults</button>
            </div>
          </>
        )}
      </main>
      {toast && <div role="status" className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black px-5 py-3 text-sm text-white">{toast}</div>}
    </div>
  )
}

export default function Admin() {
  const [ok, setOk] = useState(() => sessionStorage.getItem(SESSION_KEY) === '1')
  useEffect(() => {
    document.title = 'Admin — SRIKAR.'
    document.documentElement.style.overflow = ''
  }, [])
  return ok ? <Panel /> : <Gate onOk={() => setOk(true)} />
}
