import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { CONFIG, DUEL_COOLDOWN_MIN } from '../../data/config'
import { SPEAKERS, type Speaker, type StoryStep } from '../../data/story'
import { haptic } from '../../lib/haptics'
import { sfx } from '../../lib/sound'
import { useGame } from '../../state/game'
import { DowryBar } from '../Header'
import { Button } from '../ui'

type Of<T extends StoryStep['type']> = Extract<StoryStep, { type: T }>

export function ChapterView({ step }: { step: Of<'chapter'> }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <motion.div className="text-6xl animate-bob" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        🏴‍☠️
      </motion.div>
      <motion.p
        className="mt-6 font-pirate text-xl tracking-[0.3em] text-parchment-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {step.num}
      </motion.p>
      <motion.h2
        className="mt-2 font-pirate text-6xl leading-none gold-text"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.35, type: 'spring', stiffness: 160, damping: 13 }}
      >
        {step.title}
      </motion.h2>
      {step.place && (
        <motion.p className="mt-4 text-lg italic text-parchment-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
          📍 {step.place}
        </motion.p>
      )}
    </div>
  )
}

export function TextView({ text, style = 'normal' }: { text: string; style?: 'normal' | 'shout' | 'whisper' | 'note' }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      {style === 'shout' && <p className="font-pirate text-6xl leading-none gold-text">{text}</p>}
      {style === 'normal' && <p className="text-3xl leading-snug text-parchment">{text}</p>}
      {style === 'whisper' && <p className="text-4xl italic text-parchment-3">{text}</p>}
      {style === 'note' && <p className="rounded-2xl bg-black/30 p-4 text-lg italic leading-snug text-parchment-3 ring-1 ring-gold/20">{text}</p>}
    </div>
  )
}

export function Avatar({ who, size = 'md' }: { who: Speaker; size?: 'md' | 'lg' }) {
  const s = SPEAKERS[who]
  const dim = size === 'lg' ? 'h-28 w-28 text-6xl' : 'h-14 w-14 text-3xl'
  return (
    <div className={`grid ${dim} shrink-0 place-items-center rounded-full bg-deep`} style={{ boxShadow: `inset 0 0 0 3px ${s.color}, 0 0 20px ${s.color}55` }}>
      {s.icon}
    </div>
  )
}

export function SayView({ who, text }: { who: Speaker; text: string }) {
  const s = SPEAKERS[who]
  return (
    <div className="flex flex-1 flex-col justify-center">
      <div className="flex items-end gap-3">
        <Avatar who={who} />
        <p className="pb-1 font-pirate text-2xl" style={{ color: s.color }}>
          {s.name}
        </p>
      </div>
      <motion.div
        className="parchment burnt relative mt-3 p-5"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <div className="absolute -top-2 left-6 h-4 w-4 rotate-45 bg-parchment" />
        <p className="text-2xl leading-snug">{text}</p>
      </motion.div>
    </div>
  )
}

export function ChoiceView({ prompt, options, onNext }: { prompt: string; options: { label: string; reply?: string }[]; onNext: () => void }) {
  const [chosen, setChosen] = useState<number | null>(null)
  const reply = chosen !== null ? options[chosen].reply : undefined
  return (
    <div className="flex flex-1 flex-col justify-center text-center">
      {prompt && <p className="font-pirate text-4xl text-gold-2">{prompt}</p>}
      {chosen === null ? (
        <div className="mt-6 space-y-3">
          {options.map((o, i) => (
            <Button key={i} variant={i === 0 ? 'gold' : 'outline'} size="lg" full onClick={() => (o.reply ? setChosen(i) : onNext())}>
              {o.label}
            </Button>
          ))}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-6">
          <p className="text-3xl leading-snug text-parchment">{reply}</p>
          <Button size="lg" full onClick={onNext}>
            Dál
          </Button>
        </motion.div>
      )}
    </div>
  )
}

export function ArriveView({ step, onNext }: { step: Of<'arrive'>; onNext: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <p className="font-pirate text-xl tracking-[0.3em] text-parchment-3">Další zastávka</p>
      <motion.div className="my-6 grid h-36 w-36 place-items-center rounded-full bg-sea text-7xl rope-border" animate={{ rotate: [0, -6, 6, 0] }} transition={{ repeat: Infinity, duration: 4 }}>
        {step.icon ?? '📍'}
      </motion.div>
      <h2 className="font-pirate text-5xl leading-none gold-text">{step.place}</h2>
      <p className="mt-4 text-xl leading-snug text-parchment-2">{step.text}</p>
      <Button size="lg" full className="mt-8" onClick={onNext}>
        ⚓ Jsme tady
      </Button>
    </div>
  )
}

export function CallView({ step, onNext }: { step: Of<'call'>; onNext: () => void }) {
  useEffect(() => {
    sfx.ring()
    haptic.fail()
    const id = window.setInterval(() => {
      sfx.ring()
      haptic.fail()
    }, 1600)
    return () => window.clearInterval(id)
  }, [])
  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-between bg-gradient-to-b from-[#1b1b1f] to-black px-6 pb-[max(env(safe-area-inset-bottom),40px)] pt-[max(env(safe-area-inset-top),60px)] text-center">
      <div>
        <p className="text-base text-white/60">Příchozí hovor…</p>
        <p className="mt-2 font-body text-4xl font-semibold text-white">{step.caller}</p>
        <p className="mt-1 text-base text-white/50">+252 61 *** ** 69 · Somálsko</p>
      </div>
      <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}>
        <Avatar who={step.who} size="lg" />
      </motion.div>
      <div className="flex w-full justify-around">
        <div className="text-center">
          <button type="button" className="grid h-18 w-18 place-items-center rounded-full bg-[#e5443a] p-5 text-3xl" onClick={() => haptic.fail()} aria-label="Odmítnout">
            📵
          </button>
          <p className="mt-2 text-sm text-white/60">Odmítnout (nejde)</p>
        </div>
        <div className="text-center">
          <motion.button
            type="button"
            className="grid h-18 w-18 place-items-center rounded-full bg-[#34c759] p-5 text-3xl"
            animate={{ rotate: [0, -15, 15, -15, 0] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            onClick={onNext}
            aria-label="Přijmout"
          >
            📞
          </motion.button>
          <p className="mt-2 text-sm text-white/60">Přijmout</p>
        </div>
      </div>
    </div>
  )
}

export function InputView({ step, onNext }: { step: Of<'input'>; onNext: () => void }) {
  const { state, dispatch } = useGame()
  const [value, setValue] = useState(state[step.key])
  const ok = value.trim().length > 0
  return (
    <div className="flex flex-1 flex-col justify-center text-center">
      <p className="font-pirate text-4xl leading-tight text-gold-2">{step.prompt}</p>
      <input
        className="parchment burnt mt-6 w-full px-4 py-4 text-center font-pirate text-4xl text-[#2a1a0a] outline-none placeholder:text-[#2a1a0a]/40"
        placeholder={step.placeholder}
        value={value}
        maxLength={30}
        onChange={(e) => setValue(e.target.value)}
      />
      <Button
        size="lg"
        full
        className="mt-6"
        disabled={!ok}
        onClick={() => {
          dispatch({ type: 'SET_NAME', key: step.key, value: value.trim() })
          dispatch({ type: 'LOG', text: `Loď pokřtěna: ${value.trim()}` })
          onNext()
        }}
      >
        {step.button}
      </Button>
    </div>
  )
}

export function PvpView({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-1 flex-col justify-center text-center">
      <motion.p
        className="text-8xl"
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 160, damping: 10 }}
      >
        ⚔️
      </motion.p>
      <p className="mt-4 font-pirate text-5xl leading-none text-blood-2">Pravidla se mění</p>
      <p className="mt-2 font-pirate text-3xl text-gold-2">Hra je teď PvP</p>
      <div className="parchment burnt mt-6 p-4 text-left text-lg leading-snug">
        <p>Doteď tě nutila pít jen posádka. To končí.</p>
        <p className="mt-2">
          Každého, koho naverbuješ, můžeš vyzvat na souboj: <b>⚓ nahoře → Posádka → klepni na člena</b>.
        </p>
        <p className="mt-2">Vyhraješ? Pije on. Prohraješ? Nic se neděje.</p>
        <p className="mt-2">Každý člen má po souboji {DUEL_COOLDOWN_MIN} minut klid.</p>
      </div>
      <Button size="lg" full className="mt-6" onClick={onNext}>
        Jdu verbovat 🏴‍☠️
      </Button>
    </div>
  )
}

export function DowryView({ onNext }: { onNext: () => void }) {
  const { state, dispatch } = useGame()
  return (
    <div className="flex flex-1 flex-col justify-center text-center">
      <p className="font-pirate text-4xl text-gold-2">Věno</p>
      <p className="mt-2 text-xl text-parchment-2">Esmeralda stojí {CONFIG.dowry} velbloudů. Ty máš nula. Nemáš ani kozu.</p>
      <motion.div className="mt-6" initial={{ rotate: -8, scale: 0.6, opacity: 0 }} animate={{ rotate: -2, scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 140, damping: 12 }}>
        <DowryBar camels={state.money} big />
      </motion.div>
      <p className="mt-6 text-lg italic text-parchment-3">Ukazatel věna teď uvidíš pořád nahoře. Každý velbloud se počítá.</p>
      <Button
        size="lg"
        full
        className="mt-6"
        onClick={() => {
          dispatch({ type: 'SHOW_DOWRY' })
          onNext()
        }}
      >
        Seženu je 🐪
      </Button>
    </div>
  )
}
