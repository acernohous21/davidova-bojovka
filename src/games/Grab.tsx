import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { haptic } from '../lib/haptics'
import { sfx } from '../lib/sound'
import { Bar, Button, GameTitle } from '../components/ui'
import type { GameProps } from './types'

const WINDOW = 2

export function Grab({ onDone, variant }: GameProps) {
  const finale = variant === 'finale'
  const [phase, setPhase] = useState<'wait' | 'go' | 'fail' | 'win'>('wait')
  const [left, setLeft] = useState(WINDOW)
  const [tries, setTries] = useState(0)

  useEffect(() => {
    if (phase === 'wait') {
      const id = window.setTimeout(() => {
        setPhase('go')
        setLeft(WINDOW)
        sfx.clang()
        haptic.fail()
      }, 1500 + Math.random() * 1500)
      return () => window.clearTimeout(id)
    }
    if (phase === 'go') {
      const start = performance.now()
      const id = window.setInterval(() => {
        const l = WINDOW - (performance.now() - start) / 1000
        setLeft(l)
        if (l <= 0) {
          setPhase('fail')
          sfx.fail()
        }
      }, 30)
      return () => window.clearInterval(id)
    }
  }, [phase])

  return (
    <div className="flex flex-1 flex-col">
      <GameTitle
        title={finale ? 'Prkno podruhé' : 'Prkno'}
        subtitle={finale ? 'Tygi se sápe po pokladu. Až se objeví tlačítko, ČAPNI HO. Znovu!' : 'Tygi se otočí k posádce. Teď je ta chvíle. Až se objeví tlačítko, ČAPNI HO!'}
      />
      <div className="relative mt-6 h-48 overflow-hidden rounded-2xl bg-gradient-to-b from-sea-2 to-sea">
        <div className="absolute bottom-8 left-0 h-3 w-3/4 deck" />
        <motion.span className="absolute bottom-10 left-[45%] text-6xl" animate={phase === 'win' ? { x: 160, y: 120, rotate: 200 } : { y: [0, -3, 0] }} transition={phase === 'win' ? { duration: 0.8 } : { repeat: Infinity, duration: 1 }}>
          🏴‍☠️
        </motion.span>
        <span className="absolute bottom-10 left-[15%] text-6xl">{phase === 'go' ? '😠' : phase === 'win' ? '😎' : '😰'}</span>
        <div className="absolute inset-x-0 bottom-0 h-8 bg-sea-2/80" />
      </div>
      <div className="mt-6 flex-1">
        {phase === 'wait' && <p className="text-center font-pirate text-3xl text-parchment-3 animate-pulse">Čekej… čekej…</p>}
        {phase === 'go' && (
          <>
            <Bar value={left / WINDOW} color="bg-blood-2" />
            <Button
              size="xl"
              variant="blood"
              full
              className="mt-4 h-32 text-5xl"
              onClick={() => {
                setPhase('win')
                sfx.splash()
                haptic.success()
                setTimeout(() => onDone({ message: finale ? 'Tygi letí přes palubu. Podruhé. Tygi možná nezapomíná, ale plavat se nenaučil.' : tries === 0 ? 'Bleskově! Tygi ani nevěděl, co se děje.' : `Na ${tries + 1}. pokus. Ale počítá se to.` }), 900)
              }}
            >
              ČAPNI HO!
            </Button>
          </>
        )}
        {phase === 'fail' && (
          <div className="text-center">
            <p className="text-2xl text-blood-2">Moc pomalý! Tygi se otočil a šťouchl do tebe šavlí.</p>
            <Button
              size="lg"
              full
              className="mt-4"
              onClick={() => {
                setTries((t) => t + 1)
                setPhase('wait')
              }}
            >
              Znovu
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
