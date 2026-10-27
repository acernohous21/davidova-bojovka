import { useState } from 'react'
import { CONFIG, JOKER_META, PIRATE_CODE, type JokerId } from '../data/config'
import { CREW, crewPhoto } from '../data/crew'
import { formatCamels } from '../lib/text'
import { useGame } from '../state/game'
import { Sheet } from './ui'

type Tab = 'crew' | 'jokers' | 'rules' | 'log'

const TABS: { id: Tab; label: string }[] = [
  { id: 'crew', label: '👥 Posádka' },
  { id: 'jokers', label: '🃏 Žolíky' },
  { id: 'rules', label: '📜 Kodex' },
  { id: 'log', label: '📖 Deník' },
]

export function ShipSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state } = useGame()
  const [tab, setTab] = useState<Tab>('crew')
  const crew = CREW.filter((c) => !c.optional || state.majaEnabled)

  return (
    <Sheet open={open} onClose={onClose} title={state.shipName ? `Loď ${state.shipName}` : 'Tvoje loď'}>
      <div className="no-scrollbar -mx-4 mb-4 flex gap-2 overflow-x-auto px-4">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-base ${tab === t.id ? 'bg-gold text-abyss' : 'bg-sea text-parchment-2'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'crew' && (
        <div className="grid grid-cols-2 gap-3">
          {crew.map((c) => {
            const has = state.crew.includes(c.id)
            return (
              <div key={c.id} className="overflow-hidden rounded-2xl bg-sea ring-1 ring-gold/25">
                <div className="relative aspect-[3/4]">
                  {has ? (
                    <img src={crewPhoto(c.id)} alt={c.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="grid h-full w-full place-items-center bg-deep text-5xl opacity-60">❔</div>
                  )}
                </div>
                <div className="p-2 leading-tight">
                  <p className="font-pirate text-xl text-gold-2">{has ? c.name : '???'}</p>
                  <p className="text-sm text-parchment-3">{has ? `${c.icon} ${c.role}` : 'Ještě nenaverbován'}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}


      {tab === 'jokers' && (
        <div className="space-y-3">
          {(Object.keys(JOKER_META) as JokerId[]).map((id) => (
            <div key={id} className="flex items-center gap-3 rounded-2xl bg-sea p-3 ring-1 ring-gold/25">
              <span className="text-4xl">{JOKER_META[id].icon}</span>
              <div className="flex-1 leading-tight">
                <p className="font-pirate text-2xl text-gold-2">{JOKER_META[id].label}</p>
                <p className="text-base text-parchment-2">{JOKER_META[id].text}</p>
              </div>
              <span className="font-pirate text-3xl text-parchment">×{state.jokers[id]}</span>
            </div>
          ))}
          <p className="text-center text-sm italic text-parchment-3">Žolík se dá použít u velké výzvy. Vzdát bez žolíku = prkno (panák).</p>
        </div>
      )}

      {tab === 'rules' && (
        <div className="space-y-4">
          <div className="parchment burnt p-4">
            <p className="text-center font-pirate text-3xl">Pirátský kodex</p>
            <ol className="mt-2 list-decimal space-y-1 pl-6 text-lg leading-snug">
              {PIRATE_CODE.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ol>
          </div>
          <div className="rounded-2xl bg-blood/20 p-4 ring-1 ring-blood/50">
            <p className="font-pirate text-2xl text-blood-2">☠️ Zakázaná slova</p>
            <p className="mt-1 text-lg text-parchment">{CONFIG.forbiddenWords.join(' · ')}</p>
            <p className="mt-1 text-base text-parchment-3">Kdo je řekne, jde na prkno. Prkno = lok nebo panák.</p>
          </div>
        </div>
      )}

      {tab === 'log' && (
        <ol className="space-y-2">
          {[...state.log].reverse().map((e, i) => (
            <li key={i} className="flex gap-3 rounded-xl bg-sea/60 px-3 py-2 text-base">
              <span className="shrink-0 tabular-nums text-parchment-3">
                {new Date(e.at).toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="flex-1 text-parchment-2">{e.text}</span>
              {e.money !== undefined && e.money !== 0 && <span className="shrink-0 font-bold text-gold-2">+{formatCamels(e.money)}</span>}
            </li>
          ))}
        </ol>
      )}
    </Sheet>
  )
}
