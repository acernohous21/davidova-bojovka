import { useCallback, useEffect, useRef, useState } from 'react'

type Perm = 'unknown' | 'needed' | 'granted' | 'denied'

interface PermissionCtor {
  requestPermission?: () => Promise<'granted' | 'denied'>
}

let motionPerm: Perm = 'unknown'

function detectMotionPerm(): Perm {
  if (motionPerm !== 'unknown') return motionPerm
  const m = (window as unknown as { DeviceMotionEvent?: PermissionCtor }).DeviceMotionEvent
  if (!m) return (motionPerm = 'denied')
  return (motionPerm = typeof m.requestPermission === 'function' ? 'needed' : 'granted')
}

/** Povolení pohybových senzorů (iOS ho chce po kliknutí). Sdílené pro celou appku. */
export function useMotionPermission() {
  const [perm, setPerm] = useState<Perm>(() => detectMotionPerm())

  const ask = useCallback(async () => {
    const m = (window as unknown as { DeviceMotionEvent?: PermissionCtor }).DeviceMotionEvent
    const o = (window as unknown as { DeviceOrientationEvent?: PermissionCtor }).DeviceOrientationEvent
    try {
      const res = await m?.requestPermission?.()
      await o?.requestPermission?.().catch(() => undefined)
      motionPerm = res === 'granted' ? 'granted' : 'denied'
    } catch {
      motionPerm = 'denied'
    }
    setPerm(motionPerm)
  }, [])

  return { perm, ask }
}

/** Počítá zatřesení telefonem. Vrací, jestli senzor vůbec něco poslal. */
export function useShake(active: boolean, onShake: () => void, threshold = 14) {
  const cb = useRef(onShake)
  cb.current = onShake
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    if (!active) return
    let last: number | null = null
    let lastShake = 0
    const onMotion = (e: DeviceMotionEvent) => {
      const a = e.accelerationIncludingGravity
      if (!a || a.x === null || a.y === null || a.z === null) return
      setSeen(true)
      const mag = Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z)
      if (last !== null) {
        const now = Date.now()
        if (Math.abs(mag - last) > threshold && now - lastShake > 260) {
          lastShake = now
          cb.current()
        }
      }
      last = mag
    }
    window.addEventListener('devicemotion', onMotion)
    return () => window.removeEventListener('devicemotion', onMotion)
  }, [active, threshold])
  return seen
}

/** Aktuální náklon telefonu (stupně). beta = dopředu/dozadu, gamma = do stran. */
export function useTilt(active: boolean) {
  const ref = useRef({ beta: 90, gamma: 0 })
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    if (!active) return
    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.beta === null || e.gamma === null) return
      ref.current = { beta: e.beta, gamma: e.gamma }
      setSeen(true)
    }
    window.addEventListener('deviceorientation', onOrient)
    return () => window.removeEventListener('deviceorientation', onOrient)
  }, [active])
  return { tilt: ref, seen }
}

/** requestAnimationFrame smyčka s delta časem v sekundách. */
export function useFrame(active: boolean, fn: (dt: number, t: number) => void) {
  const cb = useRef(fn)
  cb.current = fn
  useEffect(() => {
    if (!active) return
    let raf = 0
    let last = performance.now()
    const start = last
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      cb.current(dt, (now - start) / 1000)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [active])
}
