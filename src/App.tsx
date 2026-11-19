import { lazy, Suspense, useEffect, useState } from 'react'
import { SmoothScroll } from './hooks/useSmoothScroll'
import { Nav } from './components/Nav'
import { Hero } from './sections/Hero'
import { Services } from './sections/Services'
import { Projects } from './sections/Projects'
import { About } from './sections/About'
import { Skills } from './sections/Skills'
import { Contact } from './sections/Contact'

const Admin = lazy(() => import('./admin/Admin'))
const isAdminHash = () => window.location.hash.startsWith('#/admin')

export default function App() {
  const [admin, setAdmin] = useState(isAdminHash())
  useEffect(() => {
    const on = () => setAdmin(isAdminHash())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])

  if (admin)
    return (
      <Suspense fallback={<div className="p-10">Loading admin…</div>}>
        <Admin />
      </Suspense>
    )

  return (
    <SmoothScroll>
      <a href="#services" className="skip-link">
        Skip to content
      </a>
      <Nav />
      <main>
        <Hero />
        <Services />
        <Projects />
        <About />
        <Skills />
        <Contact />
      </main>
    </SmoothScroll>
  )
}
