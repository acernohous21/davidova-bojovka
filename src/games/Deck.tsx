import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { haptic } from '../lib/haptics'
import { sfx } from '../lib/sound'
import { Bar, Button, GameTitle } from '../components/ui'
import type { GameProps } from './types'

const NEEDED = 12
const SHOW_MS = 1100
const PIRATES = ['🏴‍☠️', '🥷', '😠', '🦜']
const HOSTAGES = ['🙋', '🧑‍🍳', '👵']

interface Target {
  id: number
  slot: number
  icon: string
  hostage: boolean
}

/** Vyčisti palubu: ťukáš na piráty, kteří vyskakují, a oni letí přes palubu. Rukojmí nechej být. */
export function Deck({ onDone }: GameProps) {
  const [started, setStarted] = useState(false)
  const [targets, setTargets] = useState<Target[]>([])
  const [overboard, setOverboard] = useState(0)
  const [oops, setOops] = useState(0)
  const [msg, setMsg] = useState<string | null>(null)
  const nextId = useRef(0)
  const alive = useRef(new Set<number>())
  const targetsRef = useRef<Target[]>([])
  const update = (next: Target[]) => {
    targetsRef.current = next
    setTargets(next)
  }
  const finished = overboard >= NEEDED

  useEffect(() => {
    if (!started || finished) return
    const id = window.setInterval(() => {
      const current = targetsRef.current
      const taken = new Set(current.map((t) => t.slot))
      const free = [0, 1, 2, 3, 4, 5, 6, 7, 8].filter((s) => !taken.has(s))
      if (free.length === 0) return
      const hostage = Math.random() < 0.22
      const t: Target = {
        id: nextId.current++,
        slot: free[Math.floor(Math.random() * free.length)],
        icon: hostage ? HOSTAGES[Math.floor(Math.random() * HOSTAGES.length)] : PIRATES[Math.floor(Math.random() * PIRATES.length)],
        hostage,
      }
      alive.current.add(t.id)
      update([...current, t])
      window.setTimeout(() => {
        if (!alive.current.delete(t.id)) return
        update(targetsRef.current.filter((x) => x.id !== t.id))
      }, SHOW_MS)
    }, 520)
    return () => window.clearInterval(id)
  }, [started, finished])

  useEffect(() => {
    if (!finished) return
    sfx.fanfare()
    haptic.levelUp()
    const id = window.setTimeout(
      () =>
        onDone({
          message:
            oops === 0
              ? 'Paluba je čistá. Ani jeden rukojmí se nenamočil.'
              : `Paluba je čistá. Jen ${oops}× letěl přes palubu i rukojmí. Omylem. Asi.`,
        }),
      700,
    )
    return () => window.clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished])

  const hit = (t: Target) => {
    if (!alive.current.delete(t.id)) return
    update(targetsRef.current.filter((x) => x.id !== t.id))
    if (t.hostage) {
      setOops((o) => o + 1)
      setOverboard((o) => Math.max(0, o - 1))
      setMsg('To byl rukojmí! 🙈')
      sfx.fail()
      haptic.fail()
    } else {
      setOverboard((o) => o + 1)
      setMsg('ŠPLOUCH!')
      sfx.splash()
      haptic.tick()
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <GameTitle title="Vyčisti palubu" subtitle="Piráti se na tebe vrhají. Ťukni na ně a letí přes palubu. Rukojmí nech být!" />
      <Bar value={overboard / NEEDED} className="mt-4 h-4" />
      <p className="mt-1 h-7 text-center font-pirate text-2xl text-parchment-2">
        {msg ?? `Přes palubu: ${overboard} / ${NEEDED}`}
      </p>
      <div className="deck relative mt-2 grid aspect-square w-full grid-cols-3 grid-rows-3 gap-2 rounded-2xl p-2">
        {Array.from({ length: 9 }).map((_, slot) => {
          const t = targets.find((x) => x.slot === slot)
          return (
            <div key={slot} className="relative grid place-items-center overflow-hidden rounded-xl bg-black/25">
              <AnimatePresence>
                {t && (
                  <motion.button
                    key={t.id}
                    type="button"
                    className="absolute inset-0 grid place-items-center text-6xl"
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={t.hostage ? { y: '100%' } : { x: 120, y: 60, rotate: 160, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                    onPointerDown={() => hit(t)}
                  >
                    {t.icon}
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
      {!started && (
        <Button size="lg" full className="mt-5" onClick={() => setStarted(true)}>
          Do nich!
        </Button>
      )}
    </div>
  )
}
