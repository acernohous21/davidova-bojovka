import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { haptic } from '../lib/haptics'
import { sfx } from '../lib/sound'
import { sleep } from '../lib/text'
import { Button, GameTitle } from '../components/ui'
import { Avatar } from '../components/steps/Basic'
import type { GameProps } from './types'

type Phase = 'show' | 'shuffle' | 'pick' | 'reveal'

export function Shells({ onDone }: GameProps) {
  // order[slot] = id piva, které stojí na pozici slot
  const [order, setOrder] = useState([0, 1, 2])
  const [phase, setPhase] = useState<Phase>('show')
  const [picked, setPicked] = useState<number | null>(null)
  const [line, setLine] = useState('Hehe, sleduj, Davide. Do jednoho dám prášek, žejo. Najdi to čistý.')

  useEffect(() => {
    if (phase !== 'shuffle') return
    let cancelled = false
    void (async () => {
      let o = [0, 1, 2]
      for (let k = 0; k < 9; k++) {
        await sleep(430 - k * 20)
        if (cancelled) return
        const a = Math.floor(Math.random() * 3)
        const b = (a + 1 + Math.floor(Math.random() * 2)) % 3
        o = [...o]
        ;[o[a], o[b]] = [o[b], o[a]]
        setOrder(o)
        sfx.whoosh()
      }
      await sleep(500)
      if (!cancelled) {
        setLine('Tak, který je čistý, žejo? Hehehe.')
        setPhase('pick')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [phase])

  const pick = (slot: number) => {
    if (phase !== 'pick') return
    setPicked(slot)
    setPhase('reveal')
    sfx.glitch()
    haptic.fail()
    setLine('HEHEHEHE. Všechny, Davide. Ve všech je prášek, žejo. Na zdraví!')
  }

  return (
    <div className="flex flex-1 flex-col">
      <GameTitle title="Pivo od Majkla" />
      <div className="mt-4 flex items-start gap-3">
        <Avatar who="majkl" />
        <div className="parchment burnt flex-1 p-3 text-xl leading-snug">{line}</div>
      </div>

      <div className="relative mx-auto mt-10 h-36 w-full max-w-xs">
        {[0, 1, 2].map((id) => {
          const slot = order.indexOf(id)
          const pill = phase === 'show' ? id === 1 : phase === 'reveal'
          return (
            <motion.button
              key={id}
              type="button"
              className="absolute top-0 flex w-1/3 flex-col items-center"
              animate={{ left: `${slot * 33.33}%`, y: picked === slot ? -16 : 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              onClick={() => pick(slot)}
            >
              <span className="text-7xl">🍺</span>
              <motion.span className="text-3xl" animate={{ opacity: pill ? 1 : 0, scale: pill ? 1 : 0.4 }}>
                💊
              </motion.span>
            </motion.button>
          )
        })}
      </div>

      <div className="mt-6">
        {phase === 'show' && (
          <Button size="lg" full onClick={() => setPhase('shuffle')}>
            Sleduju!
          </Button>
        )}
        {phase === 'shuffle' && <p className="text-center font-pirate text-2xl text-parchment-3">Majkl míchá…</p>}
        {phase === 'pick' && <p className="text-center font-pirate text-2xl text-gold-2">Klepni na pivo bez prášku</p>}
        {phase === 'reveal' && (
          <Button size="lg" full onClick={() => onDone({ message: 'Majkl Punk tě dostal. Samozřejmě, že tě dostal.' })}>
            …do prdele
          </Button>
        )}
      </div>
    </div>
  )
}
