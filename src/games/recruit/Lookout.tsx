import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { haptic } from '../../lib/haptics'
import { sfx } from '../../lib/sound'
import { GameTitle } from '../../components/ui'
import type { RecruitProps } from '../types'

const ROUNDS = 3

function randomSpot() {
  return { x: 12 + Math.random() * 76, y: 12 + Math.random() * 76 }
}

export function Lookout({ onDone }: RecruitProps) {
  const [ship, setShip] = useState(randomSpot)
  const [light, setLight] = useState({ x: 50, y: 50 })
  const [found, setFound] = useState(0)
  const [hint, setHint] = useState(false)
  const box = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setHint(false)
    const id = window.setTimeout(() => setHint(true), 9000)
    return () => window.clearTimeout(id)
  }, [found])

  const toPct = (e: React.PointerEvent) => {
    const r = box.current!.getBoundingClientRect()
    return { x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }
  }

  const onDown = (e: React.PointerEvent) => {
    const p = toPct(e)
    setLight(p)
    if (Math.hypot(p.x - ship.x, p.y - ship.y) < 11) {
      sfx.success()
      haptic.success()
      const n = found + 1
      setFound(n)
      if (n >= ROUNDS) setTimeout(onDone, 500)
      else setShip(randomSpot())
    } else {
      haptic.tick()
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <GameTitle title="Hlídka na stěžni" subtitle="Noc. Mája ti půjčila čelovku. Svícením prstem najdi nepřátelskou loď a klepni na ni." />
      <p className="mt-3 text-center font-pirate text-2xl text-gold-2">
        Nalezeno {found} / {ROUNDS}
      </p>
      <div
        ref={box}
        className="relative mt-3 aspect-square w-full overflow-hidden rounded-2xl bg-gradient-to-b from-[#0b1d2c] to-sea"
        style={{ touchAction: 'none' }}
        onPointerMove={(e) => setLight(toPct(e))}
        onPointerDown={onDown}
      >
        <span className="absolute -translate-x-1/2 -translate-y-1/2 text-4xl" style={{ left: `${ship.x}%`, top: `${ship.y}%` }}>
          🏴‍☠️
        </span>
        <span className="absolute left-[20%] top-[70%] text-3xl">🐟</span>
        <span className="absolute left-[75%] top-[25%] text-3xl">🦑</span>
        <span className="absolute left-[60%] top-[80%] text-3xl">🛢️</span>
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: `radial-gradient(circle at ${light.x}% ${light.y}%, transparent 0, transparent 13%, rgba(2,6,10,0.97) 20%)` }}
        />
        {hint && (
          <motion.div
            className="pointer-events-none absolute h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full ring-4 ring-gold-2"
            style={{ left: `${ship.x}%`, top: `${ship.y}%` }}
            animate={{ opacity: [0, 0.6, 0] }}
            transition={{ repeat: Infinity, duration: 1.4 }}
          />
        )}
      </div>
    </div>
  )
}
