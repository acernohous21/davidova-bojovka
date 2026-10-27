import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { haptic } from '../../lib/haptics'
import { sfx } from '../../lib/sound'
import { pick } from '../../lib/text'
import { Bar, Button, GameTitle } from '../../components/ui'
import type { RecruitProps } from '../types'

const NEEDED = 12
const FALL_MS = 2600
const FOOD = ['🍗', '🥩', '🧀', '🍞', '🍺', '🥃', '🌭', '🍖']

interface Item {
  id: number
  x: number
  icon: string
  rat: boolean
}

export function Kitchen({ onDone }: RecruitProps) {
  const [started, setStarted] = useState(false)
  const [items, setItems] = useState<Item[]>([])
  const [score, setScore] = useState(0)
  const [flash, setFlash] = useState<string | null>(null)
  const nextId = useRef(0)
  const alive = useRef(new Set<number>())
  const finished = score >= NEEDED

  useEffect(() => {
    if (!started || finished) return
    const id = window.setInterval(() => {
      const rat = Math.random() < 0.28
      const item = { id: nextId.current++, x: 10 + Math.random() * 80, icon: rat ? '🐀' : pick(FOOD), rat }
      alive.current.add(item.id)
      setItems((it) => [...it, item])
      window.setTimeout(() => {
        if (!alive.current.delete(item.id)) return
        setItems((it) => it.filter((x) => x.id !== item.id))
      }, FALL_MS)
    }, 520)
    return () => window.clearInterval(id)
  }, [started, finished])

  useEffect(() => {
    if (!finished) return
    sfx.success()
    const id = window.setTimeout(onDone, 600)
    return () => window.clearTimeout(id)
  }, [finished, onDone])

  const grab = (item: Item) => {
    if (!alive.current.delete(item.id)) return
    setItems((it) => it.filter((x) => x.id !== item.id))
    if (item.rat) {
      setScore((s) => Math.max(0, s - 2))
      setFlash('Krysa! −2 🤢')
      sfx.fail()
      haptic.fail()
    } else {
      setScore((s) => s + 1)
      setFlash(null)
      sfx.coin()
      haptic.tick()
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <GameTitle title="Lodní kuchařka" subtitle="Lucka vaří. Chytej jídlo do kotle, krysy nech padat." />
      <Bar value={score / NEEDED} className="mt-4 h-4" />
      <p className="mt-1 h-6 text-center font-pirate text-xl text-blood-2">{flash}</p>
      <div className="relative mt-2 h-80 overflow-hidden rounded-2xl deck">
        <AnimatePresence>
          {items.map((it) => (
            <motion.button
              key={it.id}
              type="button"
              className="absolute -translate-x-1/2 p-2 text-5xl"
              style={{ left: `${it.x}%` }}
              initial={{ top: '-15%' }}
              animate={{ top: '100%', rotate: it.rat ? 0 : 180 }}
              exit={{ scale: 1.6, opacity: 0 }}
              transition={{ duration: FALL_MS / 1000, ease: 'linear' }}
              onPointerDown={() => grab(it)}
            >
              {it.icon}
            </motion.button>
          ))}
        </AnimatePresence>
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-5xl">🍲</span>
      </div>
      {!started && (
        <Button size="lg" full className="mt-5" onClick={() => setStarted(true)}>
          Vařit!
        </Button>
      )}
    </div>
  )
}
