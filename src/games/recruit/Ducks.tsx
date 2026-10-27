import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { haptic } from '../../lib/haptics'
import { sfx } from '../../lib/sound'
import { Bar, Button, GameTitle } from '../../components/ui'
import type { RecruitProps } from '../types'

const NEEDED = 10
const SINK_MS = 1700

interface Duck {
  id: number
  x: number
  y: number
}

export function Ducks({ onDone }: RecruitProps) {
  const [started, setStarted] = useState(false)
  const [ducks, setDucks] = useState<Duck[]>([])
  const [saved, setSaved] = useState(0)
  const [lost, setLost] = useState(0)
  const nextId = useRef(0)
  const alive = useRef(new Set<number>())
  const finished = saved >= NEEDED

  useEffect(() => {
    if (!started || finished) return
    const id = window.setInterval(() => {
      const duck = { id: nextId.current++, x: 8 + Math.random() * 76, y: 10 + Math.random() * 70 }
      alive.current.add(duck.id)
      setDucks((d) => [...d, duck])
      window.setTimeout(() => {
        if (!alive.current.delete(duck.id)) return
        setLost((l) => l + 1)
        setDucks((d) => d.filter((x) => x.id !== duck.id))
      }, SINK_MS)
    }, 650)
    return () => window.clearInterval(id)
  }, [started, finished])

  useEffect(() => {
    if (finished) {
      sfx.success()
      const id = window.setTimeout(onDone, 600)
      return () => window.clearTimeout(id)
    }
  }, [finished, onDone])

  const save = (id: number) => {
    if (!alive.current.delete(id)) return
    setDucks((d) => d.filter((x) => x.id !== id))
    setSaved((s) => s + 1)
    sfx.quack()
    haptic.tick()
  }

  return (
    <div className="flex flex-1 flex-col">
      <GameTitle title="Lodní plavčík" subtitle="Matějovy kachničky se topí! Zachraň jich 10, než zmizí pod hladinou." />
      <Bar value={saved / NEEDED} className="mt-4 h-4" />
      <p className="mt-1 text-center text-parchment-3">
        Zachráněno {saved} · Utopeno {lost} 🪦
      </p>
      <div className="relative mt-3 h-72 overflow-hidden rounded-2xl bg-gradient-to-b from-sea-2 to-sea ring-1 ring-foam/30">
        <AnimatePresence>
          {ducks.map((d) => (
            <motion.button
              key={d.id}
              type="button"
              className="absolute -translate-x-1/2 -translate-y-1/2 p-2 text-5xl"
              style={{ left: `${d.x}%`, top: `${d.y}%` }}
              initial={{ scale: 0, y: 20 }}
              animate={{ scale: [1, 1, 0.6], y: [0, 0, 20], opacity: [1, 1, 0.3] }}
              exit={{ scale: 1.5, opacity: 0, y: -40 }}
              transition={{ duration: SINK_MS / 1000, times: [0, 0.5, 1] }}
              onPointerDown={() => save(d.id)}
            >
              🐤
            </motion.button>
          ))}
        </AnimatePresence>
        <span className="absolute bottom-2 right-3 text-4xl">🦩</span>
      </div>
      {!started && (
        <Button size="lg" full className="mt-5" onClick={() => setStarted(true)}>
          Skočit do vody
        </Button>
      )}
    </div>
  )
}
