import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { JOKER_META, PIRATE_CODE, RESCUE_TASKS, type JokerId } from '../../data/config'
import type { StoryStep } from '../../data/story'
import { fireCoins } from '../../lib/fx'
import { haptic } from '../../lib/haptics'
import { sfx } from '../../lib/sound'
import { formatCamels, pick } from '../../lib/text'
import { fill, useGame, type IrlState } from '../../state/game'
import { Button, Modal, PinPad, Sheet } from '../ui'

const RATINGS = [
  { pct: 0, label: 'Vymluvil se', icon: '🐔' },
  { pct: 0.5, label: 'Napůl', icon: '🤏' },
  { pct: 1, label: 'Legenda', icon: '🏆' },
]

export function IrlStep({ step, onNext }: { step: Extract<StoryStep, { type: 'irl' }>; onNext: () => void }) {
  const { state, dispatch } = useGame()
  const irl: IrlState = state.irl[step.id] ?? { status: 'active', mult: 1 }
  const [jokerOpen, setJokerOpen] = useState(false)
  const [kodexOpen, setKodexOpen] = useState(false)
  const [pinOpen, setPinOpen] = useState(false)
  const [rating, setRating] = useState(false)
  const set = (patch: Partial<IrlState>) => dispatch({ type: 'SET_IRL', id: step.id, patch })
  const reward = Math.round(step.reward * irl.mult * 10) / 10

  const applyJoker = (id: JokerId) => {
    sfx.squawk()
    haptic.joker()
    dispatch({ type: 'USE_JOKER', id })
    dispatch({ type: 'LOG', text: `Žolík ${JOKER_META[id].label} u výzvy „${step.title}“.` })
    setJokerOpen(false)
    if (id === 'ransom') set({ status: 'done', joker: id, earned: 0 })
    else if (id === 'exemption') set({ joker: id, mult: JOKER_META[id].mult, rescueTask: pick(RESCUE_TASKS) })
    else set({ joker: id, mult: JOKER_META[id].mult })
  }

  const rate = (pct: number) => {
    const earned = Math.round(reward * pct * 10) / 10
    set({ status: 'done', pct, earned })
    if (earned > 0) {
      sfx.coins()
      haptic.success()
      fireCoins()
      dispatch({ type: 'EARN', amount: earned, text: `Výzva: ${step.title}` })
    } else {
      sfx.fail()
    }
    setRating(false)
  }

  const giveUp = () => {
    sfx.splash()
    haptic.fail()
    set({ status: 'done', joker: 'giveup', earned: 0 })
    dispatch({ type: 'LOG', text: `Výzva „${step.title}“ vzdána. Prkno!` })
  }

  if (irl.status === 'done') {
    const msg =
      irl.joker === 'giveup'
        ? { icon: '☠️', title: 'PRKNO!', text: 'Vzdal jsi to. Kapitán jde na prkno: panák. Hned.' }
        : irl.joker === 'ransom'
          ? { icon: '💰', title: 'Výkupné', text: 'Výzvu jsi přeskočil. Teď běž koupit posádce rundu.' }
          : irl.pct === 0
            ? { icon: '🐔', title: 'Suchozemec', text: 'Posádka nebyla přesvědčená. Žádná kořist.' }
            : irl.pct === 0.5
              ? { icon: '🤏', title: 'Napůl', text: 'Půl kořisti. Pirátsky průměrné.' }
              : { icon: '🏆', title: 'Legenda!', text: 'Tohle se bude vyprávět v každém přístavu.' }
    return (
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <motion.div className="text-8xl" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 10 }}>
          {msg.icon}
        </motion.div>
        <p className="mt-4 font-pirate text-6xl leading-none gold-text">{msg.title}</p>
        <p className="mt-3 text-2xl leading-snug text-parchment">{msg.text}</p>
        {!!irl.earned && <p className="mt-5 font-pirate text-5xl text-gold-2">+{formatCamels(irl.earned)}</p>}
        <Button size="lg" full className="mt-8" onClick={onNext}>
          Plout dál
        </Button>
      </div>
    )
  }

  const text = irl.rescueTask ?? fill(step.text, state)
  const availableJokers = (Object.keys(JOKER_META) as JokerId[]).filter((id) => state.jokers[id] > 0)

  return (
    <div className="flex flex-1 flex-col justify-center">
      <p className="text-center font-pirate text-xl tracking-[0.3em] text-blood-2">⚔️ Velká výzva</p>
      <motion.div className="parchment burnt mt-3 p-5" initial={{ rotate: -3, scale: 0.9 }} animate={{ rotate: 0, scale: 1 }}>
        <h2 className="text-center font-pirate text-5xl leading-none">{irl.rescueTask ? 'Záchranná výzva' : step.title}</h2>
        <p className="mt-4 text-2xl leading-snug">{text}</p>
        {irl.joker === 'parrot' && <p className="mt-3 text-lg italic text-[#6b4a1e]">🦜 Papoušek: plníš to s někým z posádky.</p>}
        <div className="mt-4 flex items-center justify-between border-t border-[#6b4a1e]/30 pt-3 font-pirate text-2xl">
          <span>Kořist</span>
          <span className="text-[#8a2f22]">až {formatCamels(reward)}</span>
        </div>
      </motion.div>

      {step.extra === 'kodex' && !irl.rescueTask && (
        <Button variant="outline" size="md" full className="mt-4" onClick={() => setKodexOpen(true)}>
          📜 Pirátský kodex
        </Button>
      )}

      <Button size="lg" full className="mt-5" onClick={() => setPinOpen(true)}>
        ✅ Splněno – posádka hodnotí
      </Button>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <Button variant="dark" size="md" disabled={!!irl.joker || availableJokers.length === 0} onClick={() => setJokerOpen(true)}>
          🃏 Žolík
        </Button>
        <Button variant="dark" size="md" onClick={giveUp}>
          ☠️ Vzdát
        </Button>
      </div>

      <Sheet open={jokerOpen} onClose={() => setJokerOpen(false)} title="Použít žolík">
        <div className="space-y-3">
          {availableJokers.map((id) => (
            <button key={id} type="button" className="flex w-full items-center gap-3 rounded-2xl bg-sea p-3 text-left ring-1 ring-gold/25 active:bg-sea-2" onClick={() => applyJoker(id)}>
              <span className="text-4xl">{JOKER_META[id].icon}</span>
              <span className="flex-1 leading-tight">
                <span className="block font-pirate text-2xl text-gold-2">
                  {JOKER_META[id].label} ×{state.jokers[id]}
                </span>
                <span className="text-base text-parchment-2">{JOKER_META[id].text}</span>
              </span>
            </button>
          ))}
        </div>
      </Sheet>

      <Sheet open={kodexOpen} onClose={() => setKodexOpen(false)}>
        <div className="parchment burnt p-5">
          <p className="text-center font-pirate text-4xl">Pirátský kodex</p>
          <p className="text-center text-lg italic">Čti nahlas. Pravou ruku na srdce, levou na pivo.</p>
          <ol className="mt-3 list-decimal space-y-2 pl-6 text-xl leading-snug">
            {PIRATE_CODE.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ol>
          <p className="mt-4 text-center font-pirate text-2xl">„Přísahám!“</p>
        </div>
      </Sheet>

      <Modal open={pinOpen}>
        <PinPad
          title="Hodnocení posádky"
          onSuccess={() => {
            setPinOpen(false)
            setRating(true)
          }}
          onCancel={() => setPinOpen(false)}
        />
      </Modal>

      <AnimatePresence>
        {rating && (
          <Modal open>
            <div className="panel rounded-3xl p-5 text-center">
              <p className="font-pirate text-3xl text-gold-2">Jak to zvládl?</p>
              <p className="text-parchment-3">Kořist až {formatCamels(reward)}</p>
              <div className="mt-4 space-y-2">
                {RATINGS.map((r) => (
                  <Button key={r.pct} variant={r.pct === 1 ? 'gold' : 'dark'} size="lg" full onClick={() => rate(r.pct)}>
                    {r.icon} {r.label} · {formatCamels(reward * r.pct)}
                  </Button>
                ))}
              </div>
              <button type="button" className="mt-3 text-sm text-parchment-3 underline" onClick={() => setRating(false)}>
                Ještě ne
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}
