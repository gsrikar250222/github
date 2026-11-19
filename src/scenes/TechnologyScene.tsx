import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { useCallback, useMemo, useRef } from 'react'
import * as THREE from 'three'
import {
  SHOW_SKILL_LEVELS,
  clusters,
  skillCategories,
  type ClusterId,
  type Skill,
  type SkillLevel,
} from '../data/skills'
import { profile } from '../data/profile'
import { useIsMobile, useReducedMotion } from '../hooks/useEnv'
import { CAM_FOV, MOBILE_CAM_Z, MOBILE_PITCH } from './constants'
import { cn } from '../lib/utils'

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

export type HoverSkill = (Skill & { category: string }) | null

export interface SceneProps {
  active: boolean
  cluster: ClusterId | null
  category: string | null // category id to emphasise (detail view)
  onSelectCluster: (c: ClusterId) => void
  onHover: (s: HoverSkill) => void
}

/* ── DOM-label registry: 3D anchors → screen-space DOM nodes ─────────── */

interface Entry {
  obj?: THREE.Object3D | null
  el?: HTMLElement | null
}
type Registry = Map<string, Entry>

function Projector({ reg }: { reg: React.RefObject<Registry> }) {
  const { camera, size } = useThree()
  const v = useMemo(() => new THREE.Vector3(), [])
  useFrame(() => {
    reg.current.forEach(({ obj, el }) => {
      if (!obj || !el) return
      obj.updateWorldMatrix(true, false)
      v.setFromMatrixPosition(obj.matrixWorld).project(camera)
      const x = (v.x * 0.5 + 0.5) * size.width
      const y = (-v.y * 0.5 + 0.5) * size.height
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
      el.style.zIndex = String(Math.round((1 - v.z) * 800))
      el.style.opacity = '1'
    })
  })
  return null
}

/* ── layout ─────────────────────────────────────────────────── */

function detailLayout(
  n: number,
  mobile: boolean,
  pxPerUnit: number,
): { pos: THREE.Vector3; ring: number }[] {
  if (mobile) {
    // single staggered column, fixed pixel pitch — every label stays legible on a narrow screen
    const pitch = MOBILE_PITCH / pxPerUnit
    const jog = 26 / pxPerUnit
    return Array.from({ length: n }, (_, i) => ({
      pos: new THREE.Vector3((i % 2 ? 1 : -1) * jog, ((n - 1) / 2 - i) * pitch, 0),
      ring: 0,
    }))
  }
  const L = n <= 8 ? 1 : n <= 16 ? 2 : 3
  const scales = L === 1 ? [0.72] : L === 2 ? [0.64, 1] : [0.56, 0.8, 1]
  const RX = 5.2
  const RY = 2.75
  const sizes = Array.from({ length: L }, (_, r) => Math.ceil((n - r) / L))
  return Array.from({ length: n }, (_, i) => {
    const r = i % L
    const k = Math.floor(i / L)
    const m = sizes[r]
    const a = -Math.PI / 2 + (k / m) * Math.PI * 2 + (r % 2 ? Math.PI / m : 0)
    return {
      pos: new THREE.Vector3(Math.cos(a) * RX * scales[r], Math.sin(a) * RY * scales[r], Math.sin(a * 2 + r) * 0.6),
      ring: r,
    }
  })
}

const levelDot: Record<SkillLevel, string> = {
  building: 'bg-black',
  working: 'bg-metal',
  familiar: 'border border-metal bg-transparent',
  exploring: 'border border-dashed border-metal bg-transparent',
}

function useProgress(key: unknown, speed: number, reduced: boolean) {
  const p = useRef(reduced ? 1 : 0)
  const last = useRef<unknown>(undefined)
  if (last.current !== key) {
    last.current = key
    p.current = reduced ? 1 : 0
  }
  useFrame((_, dt) => {
    if (p.current < 1) p.current = Math.min(1, p.current + dt * speed)
  })
  return p
}

function Lines({
  targets,
  pairs,
  progress,
  opacity,
}: {
  targets: THREE.Vector3[]
  pairs: [number, number][]
  progress: React.RefObject<number>
  opacity: number
}) {
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pairs.length * 6), 3))
    return g
  }, [pairs])
  useFrame(() => {
    const e = easeOut(progress.current ?? 1)
    const arr = geom.attributes.position.array as Float32Array
    pairs.forEach(([a, b], i) => {
      const A = a < 0 ? null : targets[a]
      const B = b < 0 ? null : targets[b]
      arr[i * 6] = (A?.x ?? 0) * e
      arr[i * 6 + 1] = (A?.y ?? 0) * e
      arr[i * 6 + 2] = (A?.z ?? 0) * e
      arr[i * 6 + 3] = (B?.x ?? 0) * e
      arr[i * 6 + 4] = (B?.y ?? 0) * e
      arr[i * 6 + 5] = (B?.z ?? 0) * e
    })
    geom.attributes.position.needsUpdate = true
  })
  return (
    <lineSegments geometry={geom} frustumCulled={false}>
      <lineBasicMaterial color="#92969e" transparent opacity={opacity} />
    </lineSegments>
  )
}

function Orb({ r, dark = false }: { r: number; dark?: boolean }) {
  return (
    <mesh>
      <sphereGeometry args={[r, 28, 28]} />
      <meshStandardMaterial
        color={dark ? '#171717' : '#d9dadd'}
        metalness={dark ? 0.9 : 0.55}
        roughness={dark ? 0.2 : 0.28}
        envMapIntensity={1.2}
      />
    </mesh>
  )
}

/* ── scene content ──────────────────────────────────────────── */

interface Item {
  id: string
  skill: Skill & { category: string }
}

function Overview({
  reg,
  reduced,
  mobile,
}: {
  reg: React.RefObject<Registry>
  reduced: boolean
  mobile: boolean
}) {
  const progress = useProgress('overview', 1.1, reduced)
  const nodes = useRef<(THREE.Group | null)[]>([])
  const targets = useMemo(
    () =>
      clusters.map((_, i) => {
        const a = -Math.PI / 2 + (i * Math.PI * 2) / clusters.length
        const rx = mobile ? 1.2 : 3.7
        const ry = mobile ? 2.6 : 2.0
        return new THREE.Vector3(Math.cos(a) * rx, -Math.sin(a) * -ry, (i % 2 ? 0.9 : -0.9) * (mobile ? 0.4 : 1))
      }),
    [mobile],
  )
  const pairs = useMemo<[number, number][]>(
    () => [
      ...targets.map((_, i) => [-1, i] as [number, number]),
      ...targets.map((_, i) => [i, (i + 1) % targets.length] as [number, number]),
    ],
    [targets],
  )
  useFrame(() => {
    const e = easeOut(progress.current)
    targets.forEach((t, i) => nodes.current[i]?.position.set(t.x * e, t.y * e, t.z * e))
  })
  const setObj = (id: string) => (o: THREE.Object3D | null) => {
    const m = reg.current
    if (o) m.set(id, { ...(m.get(id) ?? {}), obj: o })
    else if (m.has(id)) m.get(id)!.obj = null
  }
  return (
    <group>
      <Lines targets={targets} pairs={pairs} progress={progress} opacity={0.5} />
      <group ref={setObj('center')}>
        <Orb r={0.3} dark />
      </group>
      {clusters.map((c, i) => (
        <group
          key={c.id}
          ref={(g) => {
            nodes.current[i] = g
            setObj(`cl-${c.id}`)(g)
          }}
        >
          <Orb r={0.15} dark />
        </group>
      ))}
    </group>
  )
}

function Detail({
  items,
  reg,
  reduced,
  mobile,
  clusterKey,
}: {
  items: Item[]
  reg: React.RefObject<Registry>
  reduced: boolean
  mobile: boolean
  clusterKey: string
}) {
  const progress = useProgress(clusterKey, 1.2, reduced)
  const nodes = useRef<(THREE.Group | null)[]>([])
  const { size } = useThree()
  const pxPerUnit = size.height / (2 * MOBILE_CAM_Z * Math.tan((CAM_FOV * Math.PI) / 360))
  const layout = useMemo(
    () => detailLayout(items.length, mobile, pxPerUnit),
    [items.length, mobile, pxPerUnit],
  )
  const targets = useMemo(() => layout.map((l) => l.pos), [layout])
  const pairs = useMemo<[number, number][]>(() => {
    const p: [number, number][] = mobile ? [] : items.map((_, i) => [-1, i])
    const byRing = new Map<number, number[]>()
    layout.forEach((l, i) => byRing.set(l.ring, [...(byRing.get(l.ring) ?? []), i]))
    byRing.forEach((idx) => {
      if (mobile) idx.slice(1).forEach((b, k) => p.push([idx[k], b]))
      else if (idx.length > 2) idx.forEach((a, k) => p.push([a, idx[(k + 1) % idx.length]]))
    })
    return p
  }, [items, layout, mobile])

  useFrame(() => {
    const e = easeOut(progress.current)
    targets.forEach((t, i) => nodes.current[i]?.position.set(t.x * e, t.y * e, t.z * e))
  })
  const setObj = (id: string) => (o: THREE.Object3D | null) => {
    const m = reg.current
    if (o) m.set(id, { ...(m.get(id) ?? {}), obj: o })
    else if (m.has(id)) m.get(id)!.obj = null
  }
  return (
    <group>
      <Lines targets={targets} pairs={pairs} progress={progress} opacity={0.42} />
      <group ref={setObj('center')}>
        <Orb r={0.28} dark />
      </group>
      {items.map((it, i) => (
        <group
          key={it.id}
          ref={(g) => {
            nodes.current[i] = g
            setObj(it.id)(g)
          }}
        >
          <Orb r={0.07} dark />
        </group>
      ))}
    </group>
  )
}

function Rig({ children, reduced }: { children: React.ReactNode; reduced: boolean }) {
  const g = useRef<THREE.Group>(null)
  const { pointer } = useThree()
  useFrame((_, dt) => {
    if (!g.current || reduced) return
    g.current.rotation.y = THREE.MathUtils.damp(g.current.rotation.y, pointer.x * 0.12, 3, dt)
    g.current.rotation.x = THREE.MathUtils.damp(g.current.rotation.x, -pointer.y * 0.08, 3, dt)
  })
  return <group ref={g}>{children}</group>
}

/* ── root: Canvas + DOM label overlay ───────────────────────── */

export default function TechnologyScene({ active, cluster, category, onSelectCluster, onHover }: SceneProps) {
  const reduced = useReducedMotion()
  const mobile = useIsMobile()
  const reg = useRef<Registry>(new Map())

  const items = useMemo<Item[]>(() => {
    if (!cluster) return []
    const list = skillCategories
      .filter((c) => c.cluster === cluster)
      .flatMap((c) => c.skills.map((s) => ({ id: `${c.id}::${s.name}`, skill: { ...s, category: c.id } })))
    // narrow screens draw one discipline at a time so labels stay readable
    return mobile && category ? list.filter((i) => i.skill.category === category) : list
  }, [cluster, category, mobile])

  const counts = useMemo(
    () =>
      Object.fromEntries(
        clusters.map((c) => [
          c.id,
          new Set(skillCategories.filter((k) => k.cluster === c.id).flatMap((k) => k.skills.map((s) => s.name))).size,
        ]),
      ),
    [],
  )

  const bind = useCallback(
    (id: string) => (el: HTMLElement | null) => {
      const m = reg.current
      if (el) m.set(id, { ...(m.get(id) ?? {}), el })
      else m.delete(id)
    },
    [],
  )

  const centerLabel = cluster ? clusters.find((c) => c.id === cluster)!.label : profile.brand

  return (
    <div className="absolute inset-0">
      <Canvas
        frameloop={active ? 'always' : 'never'}
        dpr={[1, mobile ? 1.5 : 1.75]}
        camera={{ position: [0, 0, mobile ? 9.5 : 8.6], fov: 40 }}
        gl={{ antialias: !mobile, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <Environment resolution={128} frames={1}>
          <color attach="background" args={['#9a9da4']} />
          <Lightformer form="rect" intensity={3} position={[0, 5, -3]} scale={[12, 3, 1]} />
          <Lightformer form="rect" intensity={2} position={[-5, 0, 3]} rotation-y={Math.PI / 2} scale={[7, 4, 1]} />
          <Lightformer form="rect" intensity={2} position={[5, 0, 3]} rotation-y={-Math.PI / 2} scale={[7, 4, 1]} />
        </Environment>
        <Projector reg={reg} />
        <Rig reduced={reduced}>
          {cluster ? (
            <Detail
              key={`${cluster}-${mobile ? category : 'all'}`}
              clusterKey={`${cluster}-${mobile ? category : 'all'}`}
              items={items}
              reg={reg}
              reduced={reduced}
              mobile={mobile}
            />
          ) : (
            <Overview reg={reg} reduced={reduced} mobile={mobile} />
          )}
        </Rig>
      </Canvas>

      {/* label overlay — plain, focusable DOM */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* centre label */}
        {!cluster && (
          <div
            key={`center-${cluster ?? 'root'}`}
            ref={bind('center')}
            className="absolute left-0 top-0 opacity-0"
          >
            <p className="display -translate-x-1/2 translate-y-6 whitespace-nowrap text-center text-xl md:text-3xl">{centerLabel}</p>
          </div>
        )}

        {!cluster &&
          clusters.map((c) => (
            <div key={c.id} ref={bind(`cl-${c.id}`)} className="absolute left-0 top-0 opacity-0">
              <button
                onClick={() => onSelectCluster(c.id)}
                data-cursor
                aria-label={`${c.label} — ${counts[c.id]} technologies. Open details`}
                className="pointer-events-auto group -translate-x-1/2 -translate-y-[calc(100%+12px)] whitespace-nowrap rounded-full border border-silver bg-white/90 px-3.5 py-2 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-black backdrop-blur transition-colors hover:border-black hover:bg-black hover:text-white focus-visible:border-black md:text-[0.68rem]"
              >
                {c.label}
                <span className="ml-2 text-metal group-hover:text-silver">{counts[c.id]}</span>
              </button>
            </div>
          ))}

        {cluster &&
          items.map((it) => {
            const dim = !!category && it.skill.category !== category
            return (
              <div key={it.id} ref={bind(it.id)} className="absolute left-0 top-0 opacity-0">
                <button
                  onPointerEnter={() => onHover(it.skill)}
                  onPointerLeave={() => onHover(null)}
                  onFocus={() => onHover(it.skill)}
                  onBlur={() => onHover(null)}
                  data-cursor
                  aria-label={`${it.skill.name}. ${it.skill.description}`}
                  className={cn(
                    'pointer-events-auto flex -translate-x-1/2 -translate-y-[calc(100%+9px)] items-center gap-2 whitespace-nowrap rounded-full border bg-white/90 px-3 py-1.5 font-mono text-[0.66rem] uppercase tracking-[0.08em] text-black backdrop-blur transition-[transform,opacity,background,color] duration-300 hover:scale-110 hover:border-black hover:bg-black hover:text-white focus-visible:scale-110 focus-visible:border-black',
                    mobile && '!px-2.5 !py-1 !text-[0.6rem]',
                    dim ? 'border-line opacity-30' : 'border-silver',
                  )}
                >
                  {SHOW_SKILL_LEVELS && <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', levelDot[it.skill.level])} />}
                  {it.skill.name}
                </button>
              </div>
            )
          })}
      </div>
    </div>
  )
}
