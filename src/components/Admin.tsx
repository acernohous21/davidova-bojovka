import { useState } from 'react'
import { JOKER_META, type JokerId } from '../data/config'
import { CHAPTERS, STORY } from '../data/story'
import { formatCamels } from '../lib/text'
import { useGame } from '../state/game'
import { Button, Modal, PinPad, Sheet } from './ui'

export function Admin({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [unlocked, setUnlocked] = useState(false)
  const close = () => {
    setUnlocked(false)
    onClose()
  }

  if (!open) return null
  if (!unlocked)
    return (
      <Modal open>
        <PinPad title="Admin posádky" onSuccess={() => setUnlocked(true)} onCancel={close} />
      </Modal>
    )
  return <AdminPanel onClose={close} />
}

function AdminPanel({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useGame()
  const [confirmReset, setConfirmReset] = useState(false)
  const step = STORY[state.step]

  return (
    <Sheet open onClose={onClose} title="⚙️ Admin posádky">
      <div className="space-y-5 text-base">
        <section className="rounded-2xl bg-sea p-3">
          <p className="text-parchment-3">
            Krok {state.step + 1} / {STORY.length} · <span className="text-parchment">{step.type}</span>
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Button size="sm" variant="dark" onClick={() => dispatch({ type: 'PREV' })}>
              ◀ Zpět
            </Button>
            <Button size="sm" variant="dark" onClick={() => dispatch({ type: 'NEXT' })}>
              Přeskočit ▶
            </Button>
          </div>
          <p className="mt-2 text-sm text-parchment-3">Přeskočit = projde i láhvovou poštu, minihru nebo výzvu (bez peněz).</p>
        </section>

        <section>
          <p className="mb-2 font-pirate text-2xl text-gold-2">Skok na kapitolu</p>
          <div className="space-y-1.5">
            {CHAPTERS.map((c) => (
              <button
                key={c.step}
                type="button"
                className={`w-full rounded-xl px-3 py-2 text-left ${state.step >= c.step ? 'bg-sea text-parchment' : 'bg-deep text-parchment-3'}`}
                onClick={() => dispatch({ type: 'GOTO', step: c.step })}
              >
                {c.label}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-sea p-3">
          <p className="font-pirate text-2xl text-gold-2">Věno: {formatCamels(state.money)}</p>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {[-5, -1, 1, 5].map((d) => (
              <Button key={d} size="sm" variant="dark" onClick={() => dispatch({ type: 'EARN', amount: d, text: `Úprava od posádky (${d > 0 ? '+' : ''}${d} 🐪)` })}>
                {d > 0 ? '+' : ''}
                {d}
              </Button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-sea p-3">
          <p className="font-pirate text-2xl text-gold-2">Žolíky</p>
          {(Object.keys(JOKER_META) as JokerId[]).map((id) => (
            <div key={id} className="mt-2 flex items-center gap-2">
              <span className="flex-1">
                {JOKER_META[id].icon} {JOKER_META[id].label}: <b>{state.jokers[id]}</b>
              </span>
              <Button size="sm" variant="dark" onClick={() => dispatch({ type: 'ADD_JOKER', id, delta: -1 })}>
                −
              </Button>
              <Button size="sm" variant="dark" onClick={() => dispatch({ type: 'ADD_JOKER', id, delta: 1 })}>
                +
              </Button>
            </div>
          ))}
        </section>

        <section className="rounded-2xl bg-sea p-3">
          <p className="font-pirate text-2xl text-gold-2">Souboje</p>
          <p className="mt-1 text-parchment-3">
            {state.duelWins} výher / {state.duelLosses} proher
          </p>
          <Button size="sm" variant="dark" full className="mt-2" onClick={() => dispatch({ type: 'RESET_DUELS' })}>
            Vynulovat cooldowny
          </Button>
        </section>

        <section className="rounded-2xl bg-blood/20 p-3 ring-1 ring-blood/40">
          {confirmReset ? (
            <div className="space-y-2">
              <p>Opravdu smazat celý postup a začít od nuly?</p>
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" variant="dark" onClick={() => setConfirmReset(false)}>
                  Ne
                </Button>
                <Button
                  size="sm"
                  variant="blood"
                  onClick={() => {
                    dispatch({ type: 'RESET' })
                    onClose()
                  }}
                >
                  Ano, smazat
                </Button>
              </div>
            </div>
          ) : (
            <Button size="sm" variant="blood" full onClick={() => setConfirmReset(true)}>
              Reset hry
            </Button>
          )}
        </section>
      </div>
    </Sheet>
  )
}
