import { motion } from 'framer-motion'
import { useState } from 'react'
import { CREW, crewPhoto, type CrewMember } from '../data/crew'
import { haptic } from '../lib/haptics'
import { sfx } from '../lib/sound'
import { formatDate, shuffle } from '../lib/text'
import { useGame } from '../state/game'
import { Button, GameTitle } from '../components/ui'
import type { GameProps } from './types'

const PER_PERSON = 1

function iso(y: number, m: number, d: number): string | null {
  const date = new Date(Date.UTC(y, m - 1, d))
  if (date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) return null
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

/** Správné datum + 3 podobná špatná. Rok zůstává stejný (David ví, kdo je z jakého ročníku). */
function options(birthday: string): string[] {
  const [y, m, d] = birthday.split('-').map(Number)
  const candidates = shuffle([
    iso(y, m, d + 1),
    iso(y, m, d - 1),
    iso(y, m, d + 6),
    iso(y, m, d - 10),
    iso(y, m + 1, d),
    iso(y, m - 1, d),
    iso(y, m + 1, d - 3),
    iso(y, d, m),
  ]).filter((c): c is string => !!c && c !== birthday)
  const wrong = [...new Set(candidates)].slice(0, 3)
  return shuffle([birthday, ...wrong])
}

interface Round {
  member: CrewMember
  options: string[]
}

export function Mutiny({ onDone }: GameProps) {
  const { state } = useGame()
  const [rounds] = useState<Round[]>(() =>
    shuffle(CREW.filter((c) => state.crew.includes(c.id))).map((member) => ({
      member,
      options: options(member.birthday),
    })),
  )
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [correct, setCorrect] = useState(0)

  if (rounds.length === 0) {
    return (
      <div className="flex flex-1 flex-col justify-center text-center">
        <p className="text-2xl">Posádka je prázdná. Vzpouru nemá kdo dělat.</p>
        <Button size="lg" full className="mt-6" onClick={() => onDone({ money: 0 })}>
          Dál
        </Button>
      </div>
    )
  }

  const round = rounds[i]
  const right = picked === round.member.birthday
  const last = i === rounds.length - 1

  const choose = (opt: string) => {
    if (picked) return
    setPicked(opt)
    if (opt === round.member.birthday) {
      setCorrect((c) => c + 1)
      sfx.coin()
      haptic.success()
    } else {
      sfx.splash()
      haptic.fail()
    }
  }

  const next = () => {
    if (last) {
      onDone({
        money: correct * PER_PERSON,
        score: correct / rounds.length,
        message:
          correct === rounds.length
            ? 'Znáš všechny narozeniny. Posádka by za tebe skočila do moře.'
            : `Trefil jsi ${correct} z ${rounds.length}. Zbytek posádky ti to bude připomínat do smrti.`,
      })
      return
    }
    setPicked(null)
    setI(i + 1)
  }

  return (
    <div className="flex flex-1 flex-col">
      <GameTitle title="Vzpoura" subtitle="Dokaž, že jsi dobrý kapitán. Kdy má tenhle člen posádky narozeniny?" />
      <p className="mt-3 text-center text-lg text-parchment-3">
        {i + 1} / {rounds.length} · věrných: {correct}
      </p>
      <motion.div key={round.member.id} className="mx-auto mt-3 w-48" initial={{ rotate: -6, scale: 0.8, opacity: 0 }} animate={{ rotate: 0, scale: 1, opacity: 1 }}>
        <img src={crewPhoto(round.member.id)} alt={round.member.name} className="aspect-square w-full rounded-2xl object-cover rope-border" />
        <p className="mt-2 text-center font-pirate text-3xl text-gold-2">
          {round.member.name} <span className="text-xl text-parchment-3">{round.member.role}</span>
        </p>
      </motion.div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {round.options.map((opt) => {
          const isRight = opt === round.member.birthday
          const cls = !picked ? 'dark' : isRight ? 'gold' : opt === picked ? 'blood' : 'dark'
          return (
            <Button key={opt} variant={cls as 'dark' | 'gold' | 'blood'} size="md" className={picked && !isRight && opt !== picked ? 'opacity-40' : ''} onClick={() => choose(opt)}>
              {formatDate(opt)}
            </Button>
          )
        })}
      </div>
      {picked && (
        <motion.div className="mt-4 text-center" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className={`font-pirate text-3xl ${right ? 'text-gold-2' : 'text-blood-2'}`}>
            {right ? `✅ ${round.member.name} znovu přísahá věrnost! +${PER_PERSON} 🐪` : '☠️ PRKNO! Panák.'}
          </p>
          <Button size="lg" full className="mt-3" onClick={next}>
            {last ? 'Konec vzpoury' : 'Další'}
          </Button>
        </motion.div>
      )}
    </div>
  )
}
