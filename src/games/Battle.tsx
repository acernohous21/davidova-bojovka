import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { haptic } from '../lib/haptics'
import { sfx } from '../lib/sound'
import { useGame } from '../state/game'
import { Bar, Button, GameTitle } from '../components/ui'
import type { GameProps } from './types'

const COOLDOWN = 280

export function Battle({ onDone }: GameProps) {
  const { state } = useGame()
  const [started, setStarted] = useState(false)
  const [enemy, setEnemy] = useState(100)
  const [ours, setOurs] = useState(100)
  const [hit, setHit] = useState<'enemy' | 'ours' | null>(null)
  const [over, setOver] = useState(false)
  const lastShot = useRef(0)
  const ship = state.shipName || 'Tvoje loď'

  useEffect(() => {
    if (!started || over) return
    const id = window.setInterval(() => {
      sfx.cannon()
      haptic.fail()
      setHit('ours')
      setOurs((h) => Math.max(18, h - (5 + Math.random() * 6)))
      window.setTimeout(() => setHit(null), 200)
    }, 1500)
    return () => window.clearInterval(id)
  }, [started, over])

  const fire = () => {
    const now = performance.now()
    if (now - lastShot.current < COOLDOWN || over) return
    lastShot.current = now
    sfx.cannon()
    haptic.tick()
    setHit('enemy')
    window.setTimeout(() => setHit(null), 150)
    setEnemy((h) => {
      const next = Math.max(1, h - (4 + Math.random() * 4))
      if (next === 1) setOver(true)
      return next
    })
  }

  return (
    <div className="flex flex-1 flex-col">
      <GameTitle title="Námořní bitva" subtitle={`${ship} proti soupeřově lodi. Pal, co to dá!`} />

      <div className="mt-4 space-y-2">
        <ShipBar name="🏴‍☠️ Soupeř" hp={enemy} color="bg-blood-2" />
        <ShipBar name={`⚓ ${ship}`} hp={ours} color="bg-foam" />
      </div>

      <div className="relative mt-4 h-44 overflow-hidden rounded-2xl bg-gradient-to-b from-[#24435e] to-sea">
        <motion.span className="absolute right-6 top-6 text-6xl" animate={hit === 'enemy' ? { x: [0, 8, -8, 0], rotate: [0, 6, -6, 0] } : { y: [0, -4, 0] }} transition={hit === 'enemy' ? { duration: 0.15 } : { repeat: Infinity, duration: 2 }}>
          🏴‍☠️
        </motion.span>
        <motion.span className="absolute bottom-6 left-6 text-6xl" animate={hit === 'ours' ? { x: [0, -8, 8, 0], rotate: [0, -6, 6, 0] } : { y: [0, 4, 0] }} transition={hit === 'ours' ? { duration: 0.2 } : { repeat: Infinity, duration: 2.2 }}>
          ⛵
        </motion.span>
        {hit === 'enemy' && <span className="absolute right-12 top-10 text-5xl">💥</span>}
        {hit === 'ours' && <span className="absolute bottom-10 left-12 text-5xl">💥</span>}
      </div>

      {!started ? (
        <Button size="lg" full className="mt-6" onClick={() => setStarted(true)}>
          ⚔️ Do boje!
        </Button>
      ) : over ? (
        <motion.div className="mt-5 text-center" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-2xl leading-snug text-parchment">
            Soupeřova loď se drží na posledním prkně. Děla to nedorazí. Tohle se musí rozhodnout v reálu.
          </p>
          <Button size="lg" full className="mt-4" onClick={() => onDone({ score: 1, message: 'Kořist z trosek: pár mincí a jedna mokrá ponožka.' })}>
            Vylodit se
          </Button>
        </motion.div>
      ) : (
        <Button size="xl" variant="blood" full className="mt-6 h-28 text-5xl" silent onPointerDown={fire}>
          🔥 PAL!
        </Button>
      )}
    </div>
  )
}

function ShipBar({ name, hp, color }: { name: string; hp: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between font-pirate text-xl">
        <span className="truncate text-parchment">{name}</span>
        <span className="tabular-nums text-parchment-2">{Math.round(hp)} HP</span>
      </div>
      <Bar value={hp / 100} color={color} className="h-4" />
    </div>
  )
}
