import { useRef, useState } from 'react'
import { haptic } from '../lib/haptics'
import { useFrame, useMotionPermission, useTilt } from '../lib/sensors'
import { sfx } from '../lib/sound'
import { useGame } from '../state/game'
import { Bar, Button, GameTitle } from '../components/ui'
import type { GameProps } from './types'

const DURATION = 15

function center(t: number): number {
  return 0.5 + 0.26 * Math.sin(t * 0.8) + 0.1 * Math.sin(t * 2.1 + 1)
}

export function DrunkWalk({ onDone }: GameProps) {
  const { state } = useGame()
  const { perm, ask } = useMotionPermission()
  const [phase, setPhase] = useState<'ready' | 'play'>('ready')
  const { tilt, seen } = useTilt(phase === 'play')
  const sim = useRef({ x: 0.5, vx: 0, t: 0, on: 0, touchX: null as number | null, touchAt: 0, done: false })
  const [, force] = useState(0)
  const box = useRef<HTMLDivElement>(null)
  const drunk = 1 + state.shots * 0.5
  const halfWidth = Math.max(0.09, 0.16 - state.shots * 0.015)

  useFrame(phase === 'play', (dt) => {
    const s = sim.current
    if (s.done) return
    s.t += dt
    const useTouch = s.touchX !== null && performance.now() - s.touchAt < 1500
    let push = 0
    if (useTouch) push = (s.touchX! - s.x) * 3
    else if (seen) push = Math.max(-1, Math.min(1, tilt.current.gamma / 30)) * 0.9
    const wobble = (Math.sin(s.t * 1.7) * 0.5 + Math.sin(s.t * 3.1 + 2) * 0.3) * 0.35 * drunk
    // opilá setrvačnost: rychlost se mění pomalu
    s.vx += ((push + wobble) - s.vx) * Math.min(1, dt * (3 / drunk))
    s.x = Math.max(0.02, Math.min(0.98, s.x + s.vx * dt))
    if (Math.abs(s.x - center(s.t)) < halfWidth) s.on += dt
    else if (Math.random() < 0.05) haptic.tick()
    if (s.t >= DURATION) {
      s.done = true
      const score = s.on / DURATION
      sfx.success()
      onDone({
        score,
        message:
          score > 0.8
            ? `Došel jsi rovně jako pravítko (${Math.round(score * 100)} %). Podezřele střízlivý.`
            : score > 0.5
              ? `Došel jsi. Většinou po chodníku (${Math.round(score * 100)} %).`
              : `Došel jsi. Nějak. Po čtyřech. (${Math.round(score * 100)} % na cestě)`,
      })
      return
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
  const points: string[] = []
  for (let i = 0; i <= 32; i++) points.push(`${(center(s.t + i * 0.05) * 100).toFixed(1)},${(120 - i * 4).toFixed(1)}`)
  const onPath = Math.abs(s.x - center(s.t)) < halfWidth

  return (
    <div className="flex flex-1 flex-col">
      <GameTitle title="Cesta do Vopice" subtitle="Nakláněj telefon do stran a drž se na chodníku. Každá láhvová pošta to zhorší." />
      <div
        ref={box}
        className="relative mt-4 overflow-hidden rounded-2xl bg-[#1d2a1a] ring-1 ring-gold/30"
        onPointerDown={onPointer}
        onPointerMove={onPointer}
        style={{ touchAction: 'none' }}
      >
        <svg viewBox="0 0 100 130" className="block w-full" style={{ filter: `blur(${Math.min(2, state.shots * 0.5)}px)`, transform: `rotate(${Math.sin(s.t * 1.3) * 3 * drunk}deg) scale(1.08)` }}>
          <polyline points={points.join(' ')} fill="none" stroke="#8b7b5e" strokeWidth={halfWidth * 200} strokeLinecap="round" strokeLinejoin="round" />
          <polyline points={points.join(' ')} fill="none" stroke="#f1e3c2" strokeOpacity="0.25" strokeWidth="0.8" strokeDasharray="3 3" />
          <text x={s.x * 100} y={123} fontSize="10" textAnchor="middle">
            {onPath ? '🥴' : '🤢'}
          </text>
        </svg>
        <div className="absolute left-2 top-2 rounded-lg bg-black/50 px-2 py-1 font-pirate text-lg">🥃 × {state.shots}</div>
      </div>
      {phase === 'play' ? (
        <div className="mt-4">
          <Bar value={s.t / DURATION} />
          <p className="mt-2 text-center text-base text-parchment-3">{seen ? 'Nakláněj telefon' : 'Táhni prstem po ploše'}</p>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {perm === 'needed' && (
            <Button variant="dark" full onClick={ask}>
              📳 Povolit náklon telefonu
            </Button>
          )}
          <Button
            size="lg"
            full
            onClick={() => {
              sim.current = { x: 0.5, vx: 0, t: 0, on: 0, touchX: null, touchAt: 0, done: false }
              setPhase('play')
            }}
          >
            Vyrazit
          </Button>
        </div>
      )}
    </div>
  )
}
