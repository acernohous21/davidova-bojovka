import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { DUEL_COOLDOWN_MIN, DUEL_GAMES } from '../data/config'
import { CREW_BY_ID, crewPhoto, type CrewId } from '../data/crew'
import { fireConfetti } from '../lib/fx'
import { haptic } from '../lib/haptics'
import { sfx } from '../lib/sound'
import { pick } from '../lib/text'
import { useGame } from '../state/game'
import { Button } from './ui'

const COOLDOWN_MS = DUEL_COOLDOWN_MIN * 60_000

/** Kolik ms zbývá, než jde člena posádky znovu vyzvat (0 = může se). */
export function duelCooldown(last: number | undefined, now: number): number {
  return last === undefined ? 0 : Math.max(0, last + COOLDOWN_MS - now)
}

export function formatCooldown(ms: number): string {
  const s = Math.ceil(ms / 1000)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

/** Tikající „teď“ pro odpočty cooldownu. */
export function useNow(): number {
  const [now, setNow] = useState(Date.now)
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])
  return now
}

export function DuelPanel({ id, onBack }: { id: CrewId; onBack: () => void }) {
  const { state, dispatch } = useGame()
  const member = CREW_BY_ID[id]
  const now = useNow()
  const wait = duelCooldown(state.duels[id], now)
  const [game, setGame] = useState<(typeof DUEL_GAMES)[number] | null>(null)
  const [rerolled, setRerolled] = useState(false)
  const [result, setResult] = useState<'won' | 'lost' | null>(null)

  const roll = () => setGame((g) => pick(DUEL_GAMES.filter((x) => x !== g)))

  const finish = (won: boolean) => {
    dispatch({ type: 'DUEL', id, won, game: game!.title })
    setResult(won ? 'won' : 'lost')
    if (won) {
      sfx.fanfare()
      haptic.levelUp()
      fireConfetti()
    } else {
      sfx.fail()
      haptic.fail()
    }
  }

  return (
    <div className="space-y-4">
      <button type="button" className="text-lg text-parchment-3" onClick={onBack}>
        ◀ Posádka
      </button>

      <div className="flex items-center gap-3">
        <img src={crewPhoto(id)} alt={member.name} className="h-20 w-20 rounded-2xl object-cover ring-2 ring-gold" />
        <div className="leading-tight">
          <p className="font-pirate text-3xl text-gold-2">{member.name}</p>
          <p className="text-base text-parchment-3">
            {member.icon} {member.role}
          </p>
        </div>
      </div>

      {result ? (
        <motion.div className="rounded-2xl bg-sea p-4 text-center" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <p className="text-6xl">{result === 'won' ? '🍻' : '🙈'}</p>
          <p className="mt-2 font-pirate text-3xl text-gold-2">{result === 'won' ? `${member.name} pije!` : 'Prohra.'}</p>
          <p className="mt-1 text-lg text-parchment-2">
            {result === 'won' ? 'Lok, nebo panák. Kapitán rozhodl.' : 'Kapitán už má dost. Tentokrát se nepije.'}
          </p>
          <p className="mt-3 text-base text-parchment-3">Další souboj až za {DUEL_COOLDOWN_MIN} minut.</p>
          <Button full className="mt-4" onClick={onBack}>
            Zpět k posádce
          </Button>
        </motion.div>
      ) : wait > 0 ? (
        <div className="rounded-2xl bg-sea p-4 text-center">
          <p className="text-5xl">⏳</p>
          <p className="mt-2 font-pirate text-2xl text-gold-2">{member.name} se ještě vzpamatovává</p>
          <p className="mt-1 text-lg text-parchment-2">
            Znovu vyzvat za <b className="tabular-nums">{formatCooldown(wait)}</b>
          </p>
        </div>
      ) : !game ? (
        <div className="rounded-2xl bg-sea p-4">
          <p className="text-lg text-parchment-2">
            Souboj kapitána s posádkou. Když vyhraješ, {member.name} pije. Když prohraješ, nic se neděje. Pak má {DUEL_COOLDOWN_MIN} minut klid.
          </p>
          <Button size="lg" full className="mt-4" onClick={roll}>
            ⚔️ Vyzvat na souboj
          </Button>
        </div>
      ) : (
        <motion.div key={game.title} className="parchment burnt p-4" initial={{ rotate: -3, scale: 0.9, opacity: 0 }} animate={{ rotate: 0, scale: 1, opacity: 1 }}>
          <p className="text-center text-5xl">{game.icon}</p>
          <p className="mt-1 text-center font-pirate text-3xl">{game.title}</p>
          <p className="mt-2 text-lg leading-snug">{game.rules}</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button variant="dark" onClick={() => finish(false)}>
              Prohrál jsem
            </Button>
            <Button onClick={() => finish(true)}>Vyhrál jsem</Button>
          </div>
          {!rerolled && (
            <button
              type="button"
              className="mt-3 w-full py-2 text-base font-semibold underline underline-offset-4 opacity-80"
              onClick={() => {
                setRerolled(true)
                roll()
              }}
            >
              🎲 Losovat jinou hru (jen jednou)
            </button>
          )}
        </motion.div>
      )}
    </div>
  )
}
