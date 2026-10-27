import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { haptic } from '../../lib/haptics'
import { useFrame, useMotionPermission, useTilt } from '../../lib/sensors'
import { sfx } from '../../lib/sound'
import { Bar, Button, GameTitle } from '../../components/ui'
import type { RecruitProps } from '../types'

const SHIP_Y = 0.85
const SPEED = 0.42
const PROGRESS_PER_SEC = 6.5
const HIT_PENALTY = 15

interface Rock {
  id: number
  x: number
  y: number
  icon: string
}

export function Reef({ onDone }: RecruitProps) {
  const { perm, ask } = useMotionPermission()
  const [started, setStarted] = useState(false)
  const { tilt, seen } = useTilt(started)
  const sim = useRef({ x: 0.5, progress: 0, rocks: [] as Rock[], spawn: 0, nextId: 0, touchX: null as number | null, touchAt: 0, done: false, hitAt: 0 })
  const [, force] = useState(0)
  const box = useRef<HTMLDivElement>(null)

  useFrame(started, (dt, t) => {
    const s = sim.current
    if (s.done) return

    // řízení: náklon, nebo prst
    const useTouch = s.touchX !== null && performance.now() - s.touchAt < 1500
    const target = useTouch ? s.touchX! : seen ? 0.5 + Math.max(-1, Math.min(1, tilt.current.gamma / 30)) * 0.45 : s.x
    s.x += (target - s.x) * Math.min(1, dt * 6)
    s.x = Math.max(0.06, Math.min(0.94, s.x))

    // útesy
    s.spawn -= dt
    if (s.spawn <= 0) {
      s.spawn = Math.max(0.45, 0.9 - t * 0.02)
      s.rocks.push({ id: s.nextId++, x: 0.08 + Math.random() * 0.84, y: -0.1, icon: Math.random() < 0.2 ? '🦈' : '🪨' })
    }
    for (const r of s.rocks) r.y += SPEED * dt
    const hit = s.rocks.find((r) => Math.abs(r.x - s.x) < 0.1 && Math.abs(r.y - SHIP_Y) < 0.06)
    if (hit) {
      s.rocks = s.rocks.filter((r) => r !== hit)
      s.progress = Math.max(0, s.progress - HIT_PENALTY)
      s.hitAt = performance.now()
      sfx.fail()
      haptic.fail()
    }
    s.rocks = s.rocks.filter((r) => r.y < 1.1)

    s.progress += dt * PROGRESS_PER_SEC
    if (s.progress >= 100) {
      s.done = true
      sfx.success()
      haptic.success()
      setTimeout(onDone, 500)
    }
    force((n) => n + 1)
  })

  const onPointer = (e: React.PointerEvent) => {
    const r = box.current?.getBoundingClientRect()
    if (!r) return
    sim.current.touchX = (e.clientX - r.left) / r.width
    sim.current.touchAt = performance.now()
  }

  const s = sim.current
  const justHit = performance.now() - s.hitAt < 400

  return (
    <div className="flex flex-1 flex-col">
      <GameTitle title="Kormidelnice" subtitle="Eliška ti půjčí kormidlo. Naklápěj telefon a propluj mezi útesy. Náraz = kus zpátky." />
      <Bar value={s.progress / 100} className="mt-4 h-4" />
      <div
        ref={box}
        className={`relative mt-3 h-80 overflow-hidden rounded-2xl bg-gradient-to-b from-sea to-sea-2 ring-1 ring-foam/30 ${justHit ? 'ring-4 ring-blood-2' : ''}`}
        style={{ touchAction: 'none' }}
        onPointerDown={onPointer}
        onPointerMove={onPointer}
      >
        {s.rocks.map((r) => (
          <span key={r.id} className="absolute -translate-x-1/2 -translate-y-1/2 text-4xl" style={{ left: `${r.x * 100}%`, top: `${r.y * 100}%` }}>
            {r.icon}
          </span>
        ))}
        <motion.span
          className="absolute -translate-x-1/2 -translate-y-1/2 text-5xl"
          style={{ left: `${s.x * 100}%`, top: `${SHIP_Y * 100}%` }}
          animate={justHit ? { rotate: [0, -20, 20, 0] } : { rotate: 0 }}
        >
          ⛵
        </motion.span>
        {!started && <div className="absolute inset-0 grid place-items-center bg-black/40 font-pirate text-3xl text-parchment">☸️</div>}
      </div>
      {started ? (
        <p className="mt-2 text-center text-base text-parchment-3">{seen ? 'Nakláněj telefon doleva a doprava' : 'Táhni prstem po moři'}</p>
      ) : (
        <div className="mt-4 space-y-3">
          {perm === 'needed' && (
            <Button variant="dark" full onClick={ask}>
              📳 Povolit náklon telefonu
            </Button>
          )}
          <Button size="lg" full onClick={() => setStarted(true)}>
            Vyplout
          </Button>
        </div>
      )}
    </div>
  )
}
