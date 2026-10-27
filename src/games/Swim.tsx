import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { haptic } from '../lib/haptics'
import { useFrame } from '../lib/sensors'
import { sfx } from '../lib/sound'
import { Button, GameTitle } from '../components/ui'
import type { GameProps } from './types'

const SHARK_SPEED = 7
const STROKE = 3.4

export function Swim({ onDone }: GameProps) {
  const [phase, setPhase] = useState<'ready' | 'swim' | 'bitten'>('ready')
  const [dist, setDist] = useState(0)
  const [shark, setShark] = useState(-30)
  const last = useRef<'L' | 'R' | null>(null)
  const bites = useRef(0)
  const won = useRef(false)

  const sharkRef = useRef(-30)
  const distRef = useRef(0)

  useFrame(phase === 'swim', (dt) => {
    if (won.current) return
    sharkRef.current += SHARK_SPEED * dt
    setShark(sharkRef.current)
    if (sharkRef.current >= distRef.current) {
      bites.current += 1
      sfx.fail()
      haptic.fail()
      sharkRef.current = -1e9
      setPhase('bitten')
    }
  })

  const stroke = (side: 'L' | 'R') => {
    if (phase !== 'swim') return
    if (last.current === side) {
      sfx.splash()
      return
    }
    last.current = side
    haptic.tick()
    sfx.tick()
    const next = distRef.current + STROKE
    distRef.current = next
    setDist(next)
    if (next >= 100 && !won.current) {
      won.current = true
      sfx.success()
      onDone({ message: bites.current === 0 ? 'Doplaval jsi. Žralok zklamaně odplul.' : `Doplaval jsi. Se ${bites.current}× okousaným zadkem, ale doplaval.` })
    }
  }

  const reset = () => {
    setDist(0)
    setShark(-30)
    distRef.current = 0
    sharkRef.current = -30
    last.current = null
    setPhase('swim')
  }

  return (
    <div className="flex flex-1 flex-col">
      <GameTitle title="Ke břehu" subtitle="Střídej levou a pravou ruku. Stejnou dvakrát = jen cákáš. Za tebou je žralok." />
      <div className="relative mt-5 h-64 overflow-hidden rounded-2xl bg-gradient-to-b from-[#f3dc9b] via-sea-2 to-sea">
        <div className="absolute inset-x-0 top-0 h-10 bg-[#f3dc9b] text-center text-2xl">🌴 🐐 🌴</div>
        <motion.div className="absolute left-1/2 -translate-x-1/2 text-5xl" animate={{ top: `${88 - dist * 0.72}%` }} transition={{ duration: 0.15 }}>
          🏊
        </motion.div>
        <motion.div className="absolute left-[30%] text-4xl" animate={{ top: `${Math.min(110, 88 - shark * 0.72 + 10)}%` }} transition={{ duration: 0.1 }}>
          🦈
        </motion.div>
        <div className="absolute bottom-2 right-3 font-pirate text-xl text-parchment">{Math.min(100, Math.round(dist))} %</div>
      </div>

      {phase === 'ready' && (
        <Button size="lg" full className="mt-6" onClick={reset}>
          Plavat!
        </Button>
      )}
      {phase === 'bitten' && (
        <div className="mt-5 text-center">
          <p className="text-2xl text-blood-2">CHŇAP! Žralok tě kousl do zadku. Zpátky na loď.</p>
          <Button size="lg" full className="mt-4" onClick={reset}>
            Znovu
          </Button>
        </div>
      )}
      {phase === 'swim' && (
        <div className="mt-auto grid grid-cols-2 gap-3 pt-5">
          <button type="button" className="h-32 rounded-2xl bg-sea text-5xl ring-2 ring-foam/40 active:bg-sea-2" onPointerDown={() => stroke('L')}>
            🤚
          </button>
          <button type="button" className="h-32 rounded-2xl bg-sea text-5xl ring-2 ring-foam/40 active:bg-sea-2" onPointerDown={() => stroke('R')}>
            ✋
          </button>
        </div>
      )}
    </div>
  )
}
