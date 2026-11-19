import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Float, Lightformer, MeshDistortMaterial } from '@react-three/drei'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useIsMobile, useReducedMotion } from '../hooks/useEnv'

/* Full-screen silver ripple surface. One cheap fragment shader, no geometry cost. */
const vert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.9999, 1.0);
  }
`
const frag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uCenter;
  uniform float uAspect;
  uniform vec2 uPointer;     // pointer in uv space
  uniform float uPointerAmt; // 0..1, rises while the pointer moves
  uniform vec2 uClick;       // last click in uv space
  uniform float uClickAge;   // seconds since the click (large = none)

  void main() {
    vec2 p = vUv - uCenter;
    p.x *= uAspect;
    p.y *= 1.55;                       // flatten rings into a seen-from-above perspective
    float d = length(p);

    float w  = sin(d * 21.0 - uTime * 0.6);
    float w2 = sin(d * 47.0 - uTime * 1.0) * 0.22;
    float h  = (w + w2) * exp(-d * 0.42);

    // ripples that follow the pointer
    vec2 pp = vUv - uPointer;
    pp.x *= uAspect; pp.y *= 1.55;
    float dp = length(pp);
    h += sin(dp * 40.0 - uTime * 2.6) * exp(-dp * 3.4) * uPointerAmt * 0.75;

    // shockwave where you click
    vec2 pc = vUv - uClick;
    pc.x *= uAspect; pc.y *= 1.55;
    float dc = length(pc);
    float front = uClickAge * 0.9;
    float env = exp(-pow((dc - front) * 7.0, 2.0)) * exp(-uClickAge * 1.3);
    h += sin((dc - front) * 52.0) * env * 1.5;

    float lum = 0.62 + 0.30 * h;

    vec3 hi  = vec3(0.972, 0.974, 0.980);
    vec3 mid = vec3(0.792, 0.800, 0.816);
    vec3 lo  = vec3(0.600, 0.614, 0.640);
    vec3 col = mix(lo, mid, smoothstep(0.30, 0.62, lum));
    col = mix(col, hi, smoothstep(0.62, 0.96, lum));

    // contact shadow under the sphere
    vec2 q = vUv - (uCenter - vec2(0.0, 0.17));
    q.x *= uAspect;
    q.y *= 3.2;
    col *= 1.0 - 0.30 * exp(-dot(q, q) * 12.0);

    // keep the very top calm so the navigation stays crisp
    col = mix(col, vec3(0.969), smoothstep(0.82, 1.0, vUv.y) * 0.65);

    gl_FragColor = vec4(col, 1.0);
  }
`

function Scene({ reduced, mobile }: { reduced: boolean; mobile: boolean }) {
  const { pointer, viewport, size } = useThree()
  const sphere = useRef<THREE.Group>(null)
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uCenter: { value: new THREE.Vector2(0.5, 0.62) },
      uAspect: { value: 1 },
      uPointer: { value: new THREE.Vector2(0.5, 0.4) },
      uPointerAmt: { value: 0 },
      uClick: { value: new THREE.Vector2(0.5, 0.5) },
      uClickAge: { value: 99 },
    }),
    [],
  )
  const px = useRef(0)
  const py = useRef(0)
  const gl = useThree((t) => t.gl)
  const ptr = useRef({ x: 0.5, y: 0.4, tx: 0.5, ty: 0.4, amt: 0 })
  const clickAt = useRef(-99)

  useEffect(() => {
    if (reduced) return
    const el = gl.domElement
    const toUv = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      return { x: (e.clientX - r.left) / r.width, y: 1 - (e.clientY - r.top) / r.height, inside: e.clientY >= r.top && e.clientY <= r.bottom }
    }
    const move = (e: PointerEvent) => {
      const u = toUv(e)
      if (!u.inside) return
      ptr.current.tx = u.x
      ptr.current.ty = u.y
      ptr.current.amt = Math.min(1, ptr.current.amt + 0.12)
    }
    const down = (e: PointerEvent) => {
      const u = toUv(e)
      if (!u.inside) return
      uniforms.uClick.value.set(u.x, u.y)
      clickAt.current = performance.now() / 1000
    }
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', down, { passive: true })
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', down)
    }
  }, [gl, reduced, uniforms])

  const radius = Math.min(mobile ? 0.6 : 0.6, viewport.width * 0.2)
  const baseY = viewport.height * (mobile ? 0.17 : 0.17)

  useFrame((s, dt) => {
    const tx = reduced ? 0 : pointer.x * 0.28
    const ty = reduced ? 0 : pointer.y * 0.16
    px.current = THREE.MathUtils.damp(px.current, tx, 2.6, dt)
    py.current = THREE.MathUtils.damp(py.current, ty, 2.6, dt)
    const y = baseY + py.current
    if (sphere.current) sphere.current.position.set(px.current, y, 0)
    const q = ptr.current
    q.x = THREE.MathUtils.damp(q.x, q.tx, 6, dt)
    q.y = THREE.MathUtils.damp(q.y, q.ty, 6, dt)
    q.amt = Math.max(0, q.amt - dt * 0.9)
    uniforms.uPointer.value.set(q.x, q.y)
    uniforms.uPointerAmt.value = q.amt
    uniforms.uClickAge.value = Math.min(99, performance.now() / 1000 - clickAt.current)
    uniforms.uTime.value = reduced ? 0 : s.clock.elapsedTime
    uniforms.uAspect.value = size.width / size.height
    uniforms.uCenter.value.set(0.5 + px.current / viewport.width, 0.5 + y / viewport.height)
  })

  return (
    <>
      <mesh frustumCulled={false} renderOrder={-1}>
        <planeGeometry args={[2, 2]} />
        <shaderMaterial vertexShader={vert} fragmentShader={frag} uniforms={uniforms} depthWrite={false} depthTest={false} />
      </mesh>
      <Float speed={reduced ? 0 : 1.2} rotationIntensity={0} floatIntensity={reduced ? 0 : 0.35} floatingRange={[-0.05, 0.05]}>
        <group ref={sphere}>
          <mesh>
            <sphereGeometry args={[radius, mobile ? 48 : 96, mobile ? 48 : 96]} />
            <MeshDistortMaterial
              color="#eceef1"
              metalness={1}
              roughness={0.035}
              distort={reduced ? 0 : 0.14}
              speed={reduced ? 0 : 1.3}
              envMapIntensity={1.4}
            />
          </mesh>
        </group>
      </Float>
    </>
  )
}

/** Offline studio lighting — no HDR download. The dark pupil comes from the black floor/strip panels. */
function Studio() {
  return (
    <Environment resolution={256} frames={1}>
      <color attach="background" args={['#cfd1d6']} />
      <Lightformer form="rect" intensity={4} position={[0, 6, -3]} scale={[14, 3, 1]} />
      <Lightformer form="rect" intensity={2.2} position={[-6, 1, 3]} rotation-y={Math.PI / 2} scale={[8, 5, 1]} />
      <Lightformer form="rect" intensity={2.2} position={[6, 0, 2]} rotation-y={-Math.PI / 2} scale={[8, 5, 1]} />
      <Lightformer form="ring" color="#ffffff" intensity={3} position={[0, 0, 6]} scale={7} />
      <Lightformer form="rect" intensity={0.9} color="#000" position={[0, -4, 0]} rotation-x={Math.PI / 2} scale={[14, 14, 1]} />
      <Lightformer form="rect" intensity={1} color="#000" position={[0, 1.2, 4]} scale={[3.4, 1.6, 1]} />
    </Environment>
  )
}

export default function ChromeScene({ active }: { active: boolean }) {
  const reduced = useReducedMotion()
  const mobile = useIsMobile()
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, mobile ? 1.5 : 1.75]}
      camera={{ position: [0, 0, 6.2], fov: 38 }}
      gl={{ antialias: !mobile, alpha: false, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.05
      }}
      aria-hidden
    >
      <ambientLight intensity={0.35} />
      <Studio />
      <Scene reduced={reduced} mobile={mobile} />
    </Canvas>
  )
}
