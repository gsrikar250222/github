import { useEffect, useState, useSyncExternalStore } from 'react'

const mq = (q: string) => ({
  subscribe: (cb: () => void) => {
    const m = window.matchMedia(q)
    m.addEventListener('change', cb)
    return () => m.removeEventListener('change', cb)
  },
  get: () => window.matchMedia(q).matches,
})

function useMedia(q: string, server = false) {
  const m = mq(q)
  return useSyncExternalStore(m.subscribe, m.get, () => server)
}

export const useReducedMotion = () => useMedia('(prefers-reduced-motion: reduce)')
export const useIsMobile = () => useMedia('(max-width: 767px)')
export const useFinePointer = () => useMedia('(hover: hover) and (pointer: fine)')

let webglCache: boolean | null = null
export function detectWebGL(): boolean {
  if (webglCache !== null) return webglCache
  try {
    const c = document.createElement('canvas')
    webglCache = !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')))
  } catch {
    webglCache = false
  }
  return webglCache
}

export function useWebGL() {
  const [ok, setOk] = useState(true)
  useEffect(() => setOk(detectWebGL()), [])
  return ok
}

/** True once the element has come near the viewport (for lazy-mounting heavy scenes). */
export function useNearViewport<T extends Element>(margin = '200px') {
  const [el, setEl] = useState<T | null>(null)
  const [near, setNear] = useState(false)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        setVisible(e.isIntersecting)
        if (e.isIntersecting) setNear(true)
      },
      { rootMargin: margin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [el, margin])
  return { ref: setEl, near, visible }
}
