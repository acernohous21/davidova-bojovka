import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { haptic } from '../lib/haptics'
import { sfx } from '../lib/sound'
import { Button, GameTitle } from '../components/ui'
import type { GameProps } from './types'

const ROUNDS = 8

type Side = 'left' | 'right'

export function Dodge({ onDone }: GameProps) {
  const [round, setRound] = useState(0)
  const [shot, setShot] = useState<Side | null>(null)
  const [feedback, setFeedback] = useState<'hit' | 'dodged' | null>(null)
  const [dodged, setDodged] = useState(0)
  const [started, setStarted] = useState(false)
  const timeout = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!started || round >= ROUNDS) return
    setShot(null)
    const wait = window.setTimeout(() => {
      const side: Side = Math.random() < 0.5 ? 'left' : 'right'
      setShot(side)
      sfx.gunshot()
      haptic.tick()
      timeout.current = window.setTimeout(() => resolve(null, side), 1300 - round * 70)
    }, 600 + Math.random() * 700)
    return () => {
      window.clearTimeout(wait)
      window.clearTimeout(timeout.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, started])

  useEffect(() => {
    if (round < ROUNDS) return
    const score = dodged / ROUNDS
    onDone({
      score,
      message: score === 1 ? 'Uhnul jsi všem kulkám. Matrix.' : `Uhnul jsi ${dodged} z ${ROUNDS} kulek. Zbytek byly naštěstí slepé.`,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round])

  const resolve = (dodgeTo: Side | null, side: Side) => {
    window.clearTimeout(timeout.current)
    const ok = dodgeTo !== null && dodgeTo !== side
    if (ok) {
      setDodged((d) => d + 1)
      sfx.whoosh()
    } else {
      sfx.fail()
      haptic.fail()
    }
    setFeedback(ok ? 'dodged' : 'hit')
    setShot(null)
    window.setTimeout(() => {
      setFeedback(null)
      setRound((r) => r + 1)
    }, 500)
  }

  return (
    <div className="flex flex-1 flex-col">
      <GameTitle title="Přestřelka" subtitle="Odkud se střílí, odtamtud pryč! Klepni na opačnou stranu." />
      <div className="relative mt-6 grid h-56 place-items-center overflow-hidden rounded-2xl deck">
        <motion.span className="text-7xl" animate={{ x: feedback === 'dodged' ? [0, shot === 'left' ? 40 : -40, 0] : 0 }}>
          {feedback === 'hit' ? '🤕' : feedback === 'dodged' ? '😎' : '😨'}
        </motion.span>
        {shot && (
          <motion.div
            className={`absolute top-1/2 -translate-y-1/2 font-pirate text-4xl text-blood-2 ${shot === 'left' ? 'left-3' : 'right-3'}`}
            initial={{ scale: 2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            {shot === 'left' ? '💥→' : '←💥'}
          </motion.div>
        )}
        <div className="absolute right-2 top-2 font-pirate text-xl text-parchment">
          {Math.min(round + 1, ROUNDS)} / {ROUNDS}
        </div>
      </div>
      {shot && <p className="mt-3 text-center font-pirate text-3xl text-blood-2">Střílí {shot === 'left' ? 'ZLEVA' : 'ZPRAVA'}!</p>}
      {!started ? (
        <Button size="lg" full className="mt-6" onClick={() => setStarted(true)}>
          Připraven
        </Button>
      ) : (
        <div className="mt-auto grid grid-cols-2 gap-3 pt-6">
          <Button size="xl" variant="dark" disabled={!shot} onClick={() => shot && resolve('left', shot)}>
            ⬅ Uhnout
          </Button>
          <Button size="xl" variant="dark" disabled={!shot} onClick={() => shot && resolve('right', shot)}>
            Uhnout ➡
          </Button>
        </div>
      )}
    </div>
  )
}
