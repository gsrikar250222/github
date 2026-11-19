import { useEffect, useState } from 'react'
import { useReducedMotion } from '../hooks/useEnv'

/** The role line: every role stays visible, the active one lights up and the focus moves along. */
export function RoleCycle({ roles }: { roles: string[] }) {
  const reduced = useReducedMotion()
  const [i, setI] = useState(0)
  useEffect(() => {
    if (reduced) return
    const t = setInterval(() => setI((n) => (n + 1) % roles.length), 2200)
    return () => clearInterval(t)
  }, [reduced, roles.length])
  return (
    <>
      {roles.map((r, k) => (
        <span key={r}>
          {k > 0 && <span className="mx-2 opacity-40">·</span>}
          <span
            className="inline-block transition-[color,transform,letter-spacing] duration-700 ease-out"
            style={{
              color: !reduced && k === i ? '#d9420b' : undefined,
              transform: !reduced && k === i ? 'translateY(-2px)' : undefined,
              letterSpacing: !reduced && k === i ? '0.26em' : undefined,
            }}
          >
            {r.toUpperCase()}
          </span>
        </span>
      ))}
    </>
  )
}
