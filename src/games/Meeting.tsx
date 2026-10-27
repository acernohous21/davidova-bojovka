import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { STEPAN_QUOTES } from '../data/story'
import { haptic } from '../lib/haptics'
import { sfx } from '../lib/sound'
import { Bar, Button } from '../components/ui'
import type { GameProps } from './types'

const FACES = ['🙂', '🙂', '😐', '😐', '😑', '😑', '😒', '😤', '😤', '😡', '🤬']

export function Meeting({ onDone }: GameProps) {
  const [i, setI] = useState(0)
  const [seconds, setSeconds] = useState(47 * 60 + 12)
  const [quit, setQuit] = useState(false)
  const rage = (i + 1) / STEPAN_QUOTES.length
  const last = i === STEPAN_QUOTES.length - 1

  useEffect(() => {
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => window.clearInterval(id)
  }, [])

  const nod = () => {
    sfx.tick()
    haptic.tick()
    setI((v) => Math.min(STEPAN_QUOTES.length - 1, v + 1))
  }

  const time = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`

  return (
    <div className="flex flex-1 flex-col">
      <div className="rounded-2xl bg-[#1f1f2b] p-3 ring-1 ring-white/10">
        <div className="flex items-center justify-between text-sm text-white/70">
          <span>🔴 Issue meeting (urgent!!!)</span>
          <span className="tabular-nums">{time}</span>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <Tile name="Štěpán" icon="👔" speaking />
          <Tile name="David" icon={FACES[i]} />
          <Tile name="Míra" icon="🚧" off />
          <Tile name="Koudy" icon="🚜" off />
        </div>
      </div>

      <div className="relative mt-4 min-h-36 flex-1">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={i}
            className="parchment burnt p-4"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <p className="font-pirate text-xl text-[#24508a]">Štěpán:</p>
            <p className="text-2xl leading-snug">„{STEPAN_QUOTES[i]}“</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-4">
        <div className="mb-1 flex justify-between font-pirate text-lg">
          <span className="text-parchment-2">Nasranost</span>
          <span className={rage > 0.8 ? 'text-blood-2' : 'text-parchment-2'}>{Math.round(rage * 100)} %</span>
        </div>
        <motion.div animate={last ? { x: [0, -4, 4, -4, 4, 0] } : {}} transition={{ repeat: last ? Infinity : 0, duration: 0.4 }}>
          <Bar value={rage} color={rage > 0.8 ? 'bg-blood-2' : rage > 0.5 ? 'bg-gold' : 'bg-foam'} className="h-5" />
        </motion.div>
      </div>

      <div className="mt-5">
        {!last ? (
          <Button size="lg" full variant="dark" onClick={nod}>
            🙂 Kývnout a dělat, že poslouchám
          </Button>
        ) : (
          <Button
            size="xl"
            full
            variant="blood"
            disabled={quit}
            onClick={() => {
              setQuit(true)
              sfx.fanfare()
              haptic.levelUp()
              setTimeout(() => onDone({ message: '„DÁVÁM VÝPOVĚĎ!“ … a zavěsil jsi.' }), 400)
            }}
          >
            DÁVÁM VÝPOVĚĎ
          </Button>
        )}
      </div>
    </div>
  )
}

function Tile({ name, icon, speaking, off }: { name: string; icon: string; speaking?: boolean; off?: boolean }) {
  return (
    <div className={`relative grid aspect-video place-items-center rounded-xl bg-[#2b2b3a] ${speaking ? 'ring-2 ring-[#6264a7]' : ''}`}>
      <span className={`text-4xl ${off ? 'opacity-30' : ''}`}>{icon}</span>
      <span className="absolute bottom-1 left-2 text-xs text-white/80">
        {name}
        {off ? ' (kamera vypnutá)' : ''}
      </span>
    </div>
  )
}
