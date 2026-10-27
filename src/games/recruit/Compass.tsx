import { motion } from 'framer-motion'
import { useState } from 'react'
import { haptic } from '../../lib/haptics'
import { sfx } from '../../lib/sound'
import { GameTitle } from '../../components/ui'
import type { RecruitProps } from '../types'

const DIRS = ['S', 'SV', 'V', 'JV', 'J', 'JZ', 'Z', 'SZ']

const QUESTIONS = [
  { q: 'Slunce zapadá na…', a: 'Z' },
  { q: 'Z Prahy do Somálska se pluje na…', a: 'JV' },
  { q: 'Polárka svítí na…', a: 'S' },
]

export function Compass({ onDone }: RecruitProps) {
  const [i, setI] = useState(0)
  const [squawk, setSquawk] = useState(false)
  const [angle, setAngle] = useState(0)

  const answer = (d: string, idx: number) => {
    setAngle(idx * 45)
    if (d === QUESTIONS[i].a) {
      sfx.success()
      haptic.success()
      setSquawk(false)
      if (i === QUESTIONS.length - 1) setTimeout(onDone, 500)
      else setTimeout(() => setI(i + 1), 500)
    } else {
      sfx.squawk()
      haptic.fail()
      setSquawk(true)
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <GameTitle title="Navigátor" subtitle="Adamův racek tě zkouší z navigace. Klepni na správný směr." />
      <p className="mt-4 text-center font-pirate text-3xl text-gold-2">{QUESTIONS[i].q}</p>
      <p className="text-center text-parchment-3">
        {i + 1} / {QUESTIONS.length}
      </p>
      <div className="relative mx-auto mt-4 aspect-square w-full max-w-xs rounded-full parchment">
        <motion.div className="absolute left-1/2 top-1/2 h-[42%] w-2 origin-bottom -translate-x-1/2 -translate-y-full rounded-full bg-blood" animate={{ rotate: angle }} transition={{ type: 'spring', stiffness: 80, damping: 8 }} />
        <div className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2a1a0a]" />
        {DIRS.map((d, idx) => {
          const a = (idx * 45 * Math.PI) / 180
          return (
            <button
              key={d}
              type="button"
              className="absolute grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#2a1a0a] font-pirate text-2xl text-parchment active:bg-blood"
              style={{ left: `${50 + Math.sin(a) * 40}%`, top: `${50 - Math.cos(a) * 40}%` }}
              onClick={() => answer(d, idx)}
            >
              {d}
            </button>
          )
        })}
      </div>
      <p className="mt-4 h-8 text-center font-pirate text-2xl text-blood-2">{squawk ? '🐦 KRÁÁÁ! Špatně!' : ''}</p>
    </div>
  )
}
