import { motion } from 'framer-motion'
import { useRef } from 'react'
import { CONFIG } from '../data/config'
import { chapterAt } from '../data/story'
import { haptic } from '../lib/haptics'
import { setSoundEnabled, sfx } from '../lib/sound'
import { formatCamels } from '../lib/text'
import { useGame } from '../state/game'

/** Ukazatel věna pro Esmeraldu: karavana velbloudů, která se plní. */
export function DowryBar({ camels, big = false }: { camels: number; big?: boolean }) {
  const pct = Math.min(1, camels / CONFIG.dowry)
  return (
    <div className={`parchment burnt relative overflow-hidden ${big ? 'p-4' : 'px-3 py-2'}`}>
      <div className="flex items-center justify-between font-pirate text-[#2a1a0a]">
        <span className={big ? 'text-3xl' : 'text-lg'}>🔮 Věno pro Esmeraldu</span>
        <span className={`tabular-nums ${big ? 'text-3xl' : 'text-lg'}`}>
          {Math.floor(camels)} / {CONFIG.dowry} 🐪
        </span>
      </div>
      <div className={`relative mt-1 overflow-hidden rounded-full bg-[#2a1a0a]/15 ${big ? 'h-6' : 'h-3'}`}>
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#c9a36b] to-[#8a6420]"
          animate={{ width: `${pct * 100}%` }}
          transition={{ type: 'spring', stiffness: 60, damping: 15 }}
        />
      </div>
      {big && (
        <p className="mt-2 text-center font-body text-base text-[#4a3215]">
          {camels > 0 && camels < 1 ? `Zatím máš ${formatCamels(camels)}.` : 'Ani o kopyto míň.'}
        </p>
      )}
    </div>
  )
}

export function Header({ onAdmin, onShip }: { onAdmin: () => void; onShip: () => void }) {
  const { state, dispatch } = useGame()
  const chapter = chapterAt(state.step)
  const timer = useRef<number | undefined>(undefined)

  const startPress = () => {
    timer.current = window.setTimeout(() => {
      haptic.joker()
      onAdmin()
    }, 1200)
  }
  const endPress = () => window.clearTimeout(timer.current)

  return (
    <header className="sticky top-0 z-30 border-b border-gold/20 bg-abyss/85 px-4 pb-3 pt-[max(env(safe-area-inset-top),10px)] backdrop-blur-md">
      <div className="mx-auto flex max-w-md items-center gap-3">
        <button
          type="button"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-sea text-2xl rope-border"
          onPointerDown={startPress}
          onPointerUp={endPress}
          onPointerLeave={endPress}
          onContextMenu={(e) => e.preventDefault()}
          aria-label="Lebka"
        >
          ☠️
        </button>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate font-pirate text-xl text-gold-2">{chapter.title}</p>
          <p className="truncate text-sm text-parchment-3">
            {chapter.num}
            {chapter.place ? ` · ${chapter.place}` : ''}
          </p>
        </div>
        <button type="button" className="rounded-xl bg-sea px-3 py-2 text-xl ring-1 ring-gold/30" onClick={onShip} aria-label="Loď">
          ⚓
          {state.crew.length > 0 && <span className="ml-1 font-pirate text-base text-gold-2">{state.crew.length}</span>}
        </button>
        <button
          type="button"
          className="rounded-xl bg-sea px-3 py-2 text-xl ring-1 ring-gold/30"
          aria-label={state.sound ? 'Vypnout zvuk' : 'Zapnout zvuk'}
          onClick={() => {
            dispatch({ type: 'TOGGLE_SOUND' })
            if (!state.sound) {
              setSoundEnabled(true)
              sfx.tap()
            }
          }}
        >
          {state.sound ? '🔊' : '🔇'}
        </button>
      </div>
      {state.dowryShown && (
        <motion.div className="mx-auto mt-2 max-w-md" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <DowryBar camels={state.money} />
        </motion.div>
      )}
    </header>
  )
}
