import { motion } from 'framer-motion'
import { useState } from 'react'
import { Admin } from './components/Admin'
import { Header } from './components/Header'
import { ShipSheet } from './components/ShipSheet'
import { StoryScreen } from './components/StoryScreen'
import { Button } from './components/ui'
import { CONFIG } from './data/config'
import { haptic } from './lib/haptics'
import { sfx, unlockAudio } from './lib/sound'
import { GameProvider, useGame } from './state/game'

export default function App() {
  return (
    <GameProvider>
      <Shell />
    </GameProvider>
  )
}

function Shell() {
  const { state } = useGame()
  const [admin, setAdmin] = useState(false)
  const [ship, setShip] = useState(false)

  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-hidden">
      <Waves />
      {state.started ? (
        <>
          <Header onAdmin={() => setAdmin(true)} onShip={() => setShip(true)} />
          <StoryScreen />
        </>
      ) : (
        <StartScreen onAdmin={() => setAdmin(true)} />
      )}
      <ShipSheet open={ship} onClose={() => setShip(false)} />
      <Admin open={admin} onClose={() => setAdmin(false)} />
    </div>
  )
}

function StartScreen({ onAdmin }: { onAdmin: () => void }) {
  const { dispatch } = useGame()
  return (
    <main className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-6 pb-[max(env(safe-area-inset-bottom),32px)] pt-[max(env(safe-area-inset-top),32px)] text-center">
      <motion.div
        className="text-8xl"
        initial={{ scale: 0, rotate: -40 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 140, damping: 10 }}
        onContextMenu={(e) => {
          e.preventDefault()
          onAdmin()
        }}
      >
        ☠️
      </motion.div>
      <motion.h1
        className="mt-4 font-pirate text-7xl leading-none gold-text"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {CONFIG.appTitle}
      </motion.h1>
      <motion.p className="mt-2 font-pirate text-3xl text-parchment-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        {CONFIG.subtitle}
      </motion.p>
      <motion.div
        className="parchment burnt mt-8 p-5 text-left text-xl leading-snug"
        initial={{ opacity: 0, rotate: -4, y: 30 }}
        animate={{ opacity: 1, rotate: -1, y: 0 }}
        transition={{ delay: 0.9, type: 'spring' }}
      >
        <p>Davide,</p>
        <p className="mt-2">všechno nejlepší k narozeninám. Dnes nejdeš „jen na pivo“. Dnes vyplouváš.</p>
        <p className="mt-2">Drž telefon u sebe, poslouchej posádku a nikomu nevěř. Hlavně ne punkerům.</p>
        <p className="mt-3 text-right font-pirate text-2xl">— tvoje budoucí posádka</p>
      </motion.div>
      <p className="mt-6 text-base text-parchment-3">🔊 Zapni si zvuk. Hra chce občas pohyb telefonu a mikrofon.</p>
      <Button
        size="xl"
        full
        className="mt-6"
        onClick={() => {
          unlockAudio()
          sfx.fanfare()
          haptic.levelUp()
          dispatch({ type: 'START' })
        }}
      >
        ⚓ Vyplout
      </Button>
    </main>
  )
}

function Waves() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-0 h-24 overflow-hidden opacity-40">
      {[0, 1].map((k) => (
        <svg
          key={k}
          className="absolute bottom-0 h-full w-[200%] animate-wave"
          style={{ animationDuration: k ? '14s' : '9s', bottom: k ? -10 : 0, opacity: k ? 0.5 : 1 }}
          viewBox="0 0 1200 100"
          preserveAspectRatio="none"
        >
          <path d="M0 50 Q75 20 150 50 T300 50 T450 50 T600 50 T750 50 T900 50 T1050 50 T1200 50 V100 H0 Z" fill="#1d5170" />
        </svg>
      ))}
    </div>
  )
}
