import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { CONFIG } from '../../data/config'
import { CREW_BY_ID, crewPhoto } from '../../data/crew'
import { fireCoins, fireConfetti } from '../../lib/fx'
import { haptic } from '../../lib/haptics'
import { sfx } from '../../lib/sound'
import { formatCamels, sleep } from '../../lib/text'
import { useGame } from '../../state/game'
import { DowryBar } from '../Header'
import { Button } from '../ui'

/** Finále: posádka se složí na zbytek věna. */
export function Payoff({ onNext }: { onNext: () => void }) {
  const { state, dispatch } = useGame()
  const dowry = CONFIG.dowry
  const [phase, setPhase] = useState<'gap' | 'crew' | 'done'>(state.money >= dowry ? 'done' : 'gap')
  const [shown, setShown] = useState(0)
  const [display, setDisplay] = useState(state.money)
  const gap = Math.max(0, dowry - state.money)
  const crew = state.crew
  const per = gap / Math.max(1, crew.length)

  useEffect(() => {
    if (phase !== 'crew') return
    let cancelled = false
    void (async () => {
      const own = state.money
      for (let i = 0; i < crew.length; i++) {
        await sleep(800)
        if (cancelled) return
        setShown(i + 1)
        setDisplay(own + per * (i + 1))
        sfx.coin()
        haptic.tick()
        fireCoins()
      }
      await sleep(800)
      if (cancelled) return
      dispatch({ type: 'EARN', amount: gap, text: 'Posádka se složila na zbytek věna.' })
      sfx.fanfare()
      haptic.levelUp()
      fireConfetti()
      setPhase('done')
    })()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  return (
    <div className="flex flex-1 flex-col justify-center text-center">
      <p className="font-pirate text-5xl leading-none gold-text">{phase === 'done' ? 'Věno je kompletní!' : 'Esmeralda čeká'}</p>
      <div className="mt-6">
        <DowryBar camels={phase === 'crew' ? display : state.money} big />
      </div>

      {phase === 'gap' && (
        <>
          <p className="mt-6 text-2xl text-parchment-2">
            Chybí ti <b className="text-blood-2">{formatCamels(gap)}</b>.
          </p>
          <p className="mt-2 text-xl italic text-parchment-3">Kapitán to sám nedá. Kapitán nikdy nic nedá sám.</p>
          <Button size="lg" full className="mt-8" onClick={() => setPhase('crew')}>
            Posádko…?
          </Button>
        </>
      )}

      {phase !== 'gap' && crew.length > 0 && (
        <div className="mt-6 grid grid-cols-4 gap-2">
          {crew.map((id, i) => (
            <motion.div
              key={id}
              initial={phase === 'done' ? false : { y: 40, opacity: 0, scale: 0.6 }}
              animate={phase === 'done' || i < shown ? { y: 0, opacity: 1, scale: 1 } : {}}
              transition={{ type: 'spring', stiffness: 220, damping: 14 }}
            >
              <img src={crewPhoto(id)} alt={CREW_BY_ID[id].name} className="aspect-square w-full rounded-xl object-cover ring-2 ring-gold" />
              <p className="mt-1 font-pirate text-lg text-parchment">{CREW_BY_ID[id].name}</p>
              <p className="text-sm text-gold-2">+{formatCamels(per)}</p>
            </motion.div>
          ))}
        </div>
      )}

      {phase === 'done' && (
        <Button size="lg" full className="mt-8" onClick={onNext}>
          🐪 Zaplatit věno
        </Button>
      )}
    </div>
  )
}

export function Treasure() {
  const { state } = useGame()
  const legends = Object.values(state.irl).filter((i) => i.pct === 1).length
  const paka = state.irl.paka?.pct

  useEffect(() => {
    sfx.fanfare()
    haptic.levelUp()
    fireConfetti()
    const id = window.setTimeout(fireConfetti, 900)
    return () => window.clearTimeout(id)
  }, [])

  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <motion.div
        className="text-9xl"
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 150, damping: 10 }}
      >
        🧰
      </motion.div>
      <p className="mt-4 font-pirate text-6xl leading-none gold-text">Poklad nalezen!</p>

      <div className="parchment burnt mt-8 w-full p-4 text-left">
        <p className="text-center font-pirate text-3xl">Lodní deník</p>
        <ul className="mt-2 space-y-1 text-lg">
          <li>🏴‍☠️ Kapitán: <b>David</b></li>
          <li>🚢 Loď: <b>{state.shipName || 'Bezejmenná'}</b></li>
          <li>💪 Souboj v páce: <b>{paka === undefined ? '–' : paka === 0 ? 'prohrán' : 'vyhrán'}</b></li>
          <li>🌊 Tygi hozen přes palubu: <b>2×</b></li>
          <li>👥 Posádka: <b>{state.crew.length}</b> + 4 cizí rekruti</li>
          <li>🏆 Legendární výzvy: <b>{legends}</b></li>
          <li>🥃 Láhvová pošta: <b>{state.shots}</b></li>
          <li>🐪 Velbloudi: <b>ukradeni (zase)</b></li>
          <li>💍 Svatba: <b>nebyla. Naštěstí.</b></li>
        </ul>
      </div>
      <p className="mt-6 font-pirate text-3xl text-gold-2">Všechno nejlepší, kapitáne! 🎂</p>
    </div>
  )
}
