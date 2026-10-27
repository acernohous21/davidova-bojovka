import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { haptic } from '../lib/haptics'
import { useFrame, useMotionPermission, useShake, useTilt } from '../lib/sensors'
import { sfx } from '../lib/sound'
import { Bar, Button, Fallback, GameTitle } from '../components/ui'
import type { GameProps } from './types'

const TILT_HOLD = 1.2
const SHAKES = 20

type Phase = 'intro' | 'tilt' | 'shake' | 'rating'

export function Hustle({ onDone }: GameProps) {
  const { perm, ask } = useMotionPermission()
  const [phase, setPhase] = useState<Phase>('intro')
  const [hold, setHold] = useState(0)
  const [shakes, setShakes] = useState(0)
  const holdRef = useRef(0)
  const { tilt, seen } = useTilt(phase === 'tilt')

  useFrame(phase === 'tilt' && seen, (dt) => {
    const leaning = tilt.current.beta < 35 || Math.abs(tilt.current.gamma) > 55
    holdRef.current = leaning ? holdRef.current + dt : Math.max(0, holdRef.current - dt)
    setHold(holdRef.current)
    if (holdRef.current >= TILT_HOLD) {
      sfx.success()
      haptic.success()
      setPhase('shake')
    }
  })

  const shakesRef = useRef(0)
  const bump = () => {
    if (shakesRef.current >= SHAKES) return
    shakesRef.current += 1
    setShakes(shakesRef.current)
    sfx.tick()
    haptic.tick()
    if (shakesRef.current >= SHAKES) {
      sfx.success()
      setTimeout(() => setPhase('rating'), 300)
    }
  }
  const shakeSeen = useShake(phase === 'shake', bump)

  return (
    <div className="flex flex-1 flex-col">
      <GameTitle title="Nejstarší řemeslo" />

      {phase === 'intro' && (
        <div className="mt-6 flex flex-1 flex-col text-center">
          <div className="text-7xl">🎣</div>
          <p className="mt-4 text-2xl leading-snug">Za palmou čeká první zákazník. Místní rybář. Smrdí rybou. Nabízí jednu kozu.</p>
          <p className="mt-2 text-xl italic text-parchment-3">Nejdřív si klekni (nakloň telefon), pak to rozjeď (třes).</p>
          {perm === 'needed' && (
            <Button variant="dark" full className="mt-6" onClick={ask}>
              📳 Povolit pohyb telefonu
            </Button>
          )}
          <Button size="lg" full className="mt-4" onClick={() => setPhase('tilt')}>
            Jdu na to
          </Button>
        </div>
      )}

      {phase === 'tilt' && (
        <div className="mt-6 flex flex-1 flex-col text-center">
          <motion.div className="text-8xl" animate={{ rotate: [0, 50, 50, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
            📱
          </motion.div>
          <p className="mt-4 font-pirate text-3xl text-gold-2">Nakloň telefon dopředu</p>
          <p className="text-lg text-parchment-3">Skoro naplocho. A vydrž.</p>
          <Bar value={hold / TILT_HOLD} className="mt-5 h-5" />
          {!seen && <p className="mt-3 text-base text-parchment-3">Čekám na senzor náklonu…</p>}
          <Fallback onClick={() => setPhase('shake')}>Senzor nejde? Klekni si v duchu a klepni sem.</Fallback>
        </div>
      )}

      {phase === 'shake' && (
        <div className="mt-6 flex flex-1 flex-col text-center">
          <motion.div className="text-8xl" key={shakes} animate={{ x: [0, -12, 12, 0], y: [0, 6, -6, 0] }} transition={{ duration: 0.2 }}>
            {shakes < SHAKES * 0.4 ? '😐' : shakes < SHAKES * 0.8 ? '😩' : '🥵'}
          </motion.div>
          <p className="mt-4 font-pirate text-3xl text-gold-2">A teď třes!</p>
          <p className="font-pirate text-5xl tabular-nums text-parchment">
            {shakes} / {SHAKES}
          </p>
          <Bar value={shakes / SHAKES} className="mt-4 h-5" />
          <p className="mt-2 text-base text-parchment-3">{shakeSeen ? '📳 Senzor jede' : 'Zatřes telefonem…'}</p>
          <Fallback onClick={bump} />
        </div>
      )}

      {phase === 'rating' && (
        <div className="mt-6 flex flex-1 flex-col text-center">
          <p className="text-xl text-parchment-3">Hodnocení zákazníka</p>
          <p className="mt-1 text-5xl">⭐☆☆☆☆</p>
          <div className="parchment burnt mt-5 p-4 text-left text-xl italic leading-snug">„Zuby. Moc zubů. A pořád mluvil o nějaké Esmeraldě.“ — rybář, 58 let</div>
          <Button
            size="lg"
            full
            className="mt-6"
            onClick={() => onDone({ money: 0.1, message: 'Zaplatil ti kozou. Jednou. A ztratil jsi zbytek důstojnosti.' })}
          >
            Vzít kozu 🐐
          </Button>
        </div>
      )}
    </div>
  )
}
