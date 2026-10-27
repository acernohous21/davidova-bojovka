import { motion } from 'framer-motion'
import { useState } from 'react'
import { haptic } from '../lib/haptics'
import { sfx } from '../lib/sound'
import { Button, GameTitle } from '../components/ui'
import type { GameProps } from './types'

const QUESTIONS: { q: string; answers: string[]; reactions: string[] }[] = [
  {
    q: 'Kde se vidíte za pět let?',
    answers: ['Na vlastní lodi', 'V Praze, doma', 'Kde je rum. Teda whisky.'],
    reactions: ['Ambiciózní. Líbí.', 'Optimista. Taky líbí.', 'Upřímnost oceňujeme.'],
  },
  {
    q: 'Máte zkušenosti s agilním pleněním?',
    answers: ['Scrum, Kanban, Kraken', 'Plenil jsem sprinty', 'Ne, ale učím se rychle'],
    reactions: ['Kraken jako framework. Senior.', 'Velocity: 3 lodě za sprint.', 'Na tohle slyšíme.'],
  },
  {
    q: 'Jak řešíte konflikty v týmu?',
    answers: ['Prkno', 'Prkno, ale s empatií', 'Retrospektiva. Pak prkno.'],
    reactions: ['Efektivní.', 'Moderní leadership.', 'Procesně čisté.'],
  },
  {
    q: 'Jaká je vaše největší slabost?',
    answers: ['Perfekcionismus', 'Meetingy', 'Majkl Punk'],
    reactions: ['Klasika.', 'Tady žádné nemáme. Jen přepadení.', 'To chápeme. To má každý.'],
  },
  {
    q: 'Proč jste odešel z minulé práce?',
    answers: ['Zpátky na stromy', 'Chtěl jsem dvě věže', 'Bylo to high issue'],
    reactions: ['Rozumíme. Tady jsou jen stěžně.', 'Tady máme dva stěžně. Sedí to.', 'Tady je všechno high. I posádka.'],
  },
]

export function Interview({ onDone }: GameProps) {
  const [i, setI] = useState(0)
  const [reaction, setReaction] = useState<string | null>(null)
  const done = i >= QUESTIONS.length

  if (done)
    return (
      <div className="flex flex-1 flex-col justify-center text-center">
        <div className="parchment burnt p-5">
          <p className="font-pirate text-4xl">Pirátská licence</p>
          <p className="mt-3 text-xl leading-snug">
            Gratulujeme, nastupujete ihned na pozici <b>Kapitán</b>. Mzda: co si nakradete. Benefity: skorbut, papoušek, multisport.
          </p>
          <p className="mt-3 font-pirate text-2xl text-[#8a2f22]">✔ Schváleno · razítko 🏴‍☠️</p>
        </div>
        <Button size="lg" full className="mt-6" onClick={() => onDone({ score: 1, message: 'Konečně tě někdo vzal. Nástupní bonus: 3 velbloudi.' })}>
          Podepsat krví (kečupem)
        </Button>
      </div>
    )

  const q = QUESTIONS[i]
  return (
    <div className="flex flex-1 flex-col">
      <GameTitle title="Přijímací pohovor" subtitle="Pozice: Pirát (Senior). Úvazek: 24/7. Home office: moře." />
      <p className="mt-4 text-center text-lg text-parchment-3">
        Otázka {i + 1} / {QUESTIONS.length}
      </p>
      <motion.div key={i} className="parchment burnt mt-2 p-4" initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
        <p className="font-pirate text-xl text-[#6b4a1e]">HR pirátka:</p>
        <p className="text-2xl leading-snug">{q.q}</p>
      </motion.div>
      {reaction ? (
        <motion.div className="mt-5 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="text-2xl italic text-gold-2">„{reaction}“</p>
          <Button
            size="lg"
            full
            className="mt-5"
            onClick={() => {
              setReaction(null)
              setI(i + 1)
            }}
          >
            Další otázka
          </Button>
        </motion.div>
      ) : (
        <div className="mt-5 space-y-3">
          {q.answers.map((a, k) => (
            <Button
              key={a}
              variant="dark"
              size="lg"
              full
              onClick={() => {
                sfx.coin()
                haptic.tick()
                setReaction(q.reactions[k])
              }}
            >
              {a}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
