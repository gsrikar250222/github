import { lazy, Suspense, useEffect, useState } from 'react'
import { SmoothScroll } from './hooks/useSmoothScroll'
import { Loader } from './components/Loader'
import { Cursor } from './components/Cursor'
import { Nav } from './components/Nav'
import { ScrollProgress } from './components/motion'
import { Hero } from './sections/Hero'
import { About } from './sections/About'
import { Projects } from './sections/Projects'
import { Skills } from './sections/Skills'
import { Contact } from './sections/Contact'
import { FloatingBook } from './components/FloatingBook'

const Admin = lazy(() => import('./admin/Admin'))

const isAdminHash = () => window.location.hash.startsWith('#/admin')

export default function App() {
  const [ready, setReady] = useState(false)
  const [admin, setAdmin] = useState(isAdminHash())
  useEffect(() => {
    const on = () => setAdmin(isAdminHash())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])

  if (admin)
    return (
      <Suspense fallback={<div className="p-10 font-mono text-sm">Loading admin…</div>}>
        <Admin />
      </Suspense>
    )

  return (
    <SmoothScroll locked={!ready}>
      <a href="#about" className="skip-link">
        Skip to content
      </a>
      {!ready && <Loader onDone={() => setReady(true)} />}
      <Cursor />
      <ScrollProgress />
      <Nav ready={ready} />
      {ready && <FloatingBook />}
      <main>
        <Hero ready={ready} />
        <About />
        <Projects />
        <Skills />
        <Contact />
      </main>
    </SmoothScroll>
  )
}
