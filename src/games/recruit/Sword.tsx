import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { haptic } from '../../lib/haptics'
import { sfx } from '../../lib/sound'
import { Bar, GameTitle } from '../../components/ui'
import type { RecruitProps } from '../types'

const NEEDED = 6
const DIRS = [
  { id: 'up', arrow: '⬆', label: 'shora' },
  { id: 'left', arrow: '⬅', label: 'zleva' },
  { id: 'right', arrow: '➡', label: 'zprava' },
  { id: 'down', arrow: '⬇', label: 'zdola' },
] as const

type Dir = (typeof DIRS)[number]['id']

export function Sword({ onDone }: RecruitProps) {
  const [attack, setAttack] = useState<Dir | null>(null)
  const [parried, setParried] = useState(0)
  const [msg, setMsg] = useState('Dejv se chystá…')
  const [round, setRound] = useState(0)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (parried >= NEEDED) return
    const wait = window.setTimeout(() => {
      const d = DIRS[Math.floor(Math.random() * 4)].id
      setAttack(d)
      sfx.whoosh()
      timer.current = window.setTimeout(() => {
        setAttack(null)
        setMsg('Škrábanec! Moc pomalé.')
        sfx.fail()
        haptic.fail()
        setRound((r) => r + 1)
      }, 1400)
    }, 700 + Math.random() * 600)
    return () => {
      window.clearTimeout(wait)
      window.clearTimeout(timer.current)
    }
  }, [round, parried])

  const parry = (d: Dir) => {
    if (!attack) return
    window.clearTimeout(timer.current)
    if (d === attack) {
      sfx.clang()
      haptic.success()
      setMsg('CINK! Vykryto.')
      const n = parried + 1
      setParried(n)
      if (n >= NEEDED) setTimeout(onDone, 500)
    } else {
      sfx.fail()
      haptic.fail()
      setMsg('Špatná strana! Au.')
    }
    setAttack(null)
    setRound((r) => r + 1)
  }

  const current = DIRS.find((d) => d.id === attack)

  return (
    <div className="flex flex-1 flex-col">
      <GameTitle title="Šermíř" subtitle="Dejv útočí šavlí. Kryj na stranu, odkud jde rána." />
      <Bar value={parried / NEEDED} className="mt-4 h-4" />
      <div className="relative mt-4 grid h-44 place-items-center rounded-2xl deck">
        {current ? (
          <motion.div key={round} className="text-center" initial={{ scale: 2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <div className="text-7xl text-blood-2">{current.arrow}</div>
            <p className="font-pirate text-3xl text-parchment">Útok {current.label}!</p>
          </motion.div>
        ) : (
          <p className="font-pirate text-3xl text-parchment-2">{msg}</p>
        )}
      </div>
      <div className="mx-auto mt-5 grid w-64 grid-cols-3 grid-rows-3 gap-2">
        {DIRS.map((d) => (
          <button
            key={d.id}
            type="button"
            className="grid h-20 place-items-center rounded-2xl bg-sea text-4xl ring-1 ring-gold/30 active:bg-gold active:text-abyss"
            style={{
              gridColumn: d.id === 'left' ? 1 : d.id === 'right' ? 3 : 2,
              gridRow: d.id === 'up' ? 1 : d.id === 'down' ? 3 : 2,
            }}
            onPointerDown={() => parry(d.id)}
          >
            {d.arrow}
          </button>
        ))}
        <div className="col-start-2 row-start-2 grid place-items-center text-4xl">🛡️</div>
      </div>
    </div>
  )
}
