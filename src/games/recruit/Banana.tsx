import { motion } from 'framer-motion'
import { useState } from 'react'
import { haptic } from '../../lib/haptics'
import { sfx } from '../../lib/sound'
import { normalize, sleep } from '../../lib/text'
import { Button, GameTitle } from '../../components/ui'
import type { RecruitProps } from '../types'

const WORD = 'PIVO'
const MORSE: Record<string, string> = {
  A: '.-',
  H: '....',
  I: '..',
  J: '.---',
  O: '---',
  P: '.--.',
  R: '.-.',
  S: '...',
  V: '...-',
  K: '-.-',
}

export function Banana({ onDone }: RecruitProps) {
  const [answered, setAnswered] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [lit, setLit] = useState<string | null>(null)
  const [value, setValue] = useState('')
  const [wrong, setWrong] = useState(false)

  const play = async () => {
    if (playing) return
    setPlaying(true)
    for (const letter of WORD) {
      for (const sym of MORSE[letter]) {
        const d = sym === '.' ? 0.15 : 0.45
        setLit(sym)
        sfx.beep(d)
        await sleep(d * 1000)
        setLit(null)
        await sleep(150)
      }
      await sleep(450)
    }
    setPlaying(false)
  }

  if (!answered)
    return (
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <GameTitle title="Radista" subtitle="Banán zvoní. Někdo ti chce něco říct. Zvedni to." />
        <motion.button
          type="button"
          className="mt-8 text-9xl"
          animate={{ rotate: [-12, 12, -12] }}
          transition={{ repeat: Infinity, duration: 0.25 }}
          onClick={() => {
            sfx.ring()
            haptic.tick()
            setAnswered(true)
          }}
        >
          🍌
        </motion.button>
        <p className="mt-4 font-pirate text-2xl text-gold-2">Klepni na banán</p>
      </div>
    )

  return (
    <div className="flex flex-1 flex-col">
      <GameTitle title="Radista" subtitle="Z banánu pípá morseovka. Přelož ji. Je to jedno slovo a ty ho miluješ." />
      <div className="mt-4 grid place-items-center">
        <div className={`grid h-28 w-28 place-items-center rounded-full text-6xl transition-colors ${lit ? 'bg-gold-2' : 'bg-sea'}`}>{lit === '-' ? '➖' : lit === '.' ? '⚫' : '🍌'}</div>
      </div>
      <Button variant="dark" full className="mt-4" disabled={playing} onClick={() => void play()}>
        {playing ? 'Pípá…' : '▶ Přehrát zprávu'}
      </Button>
      <div className="mt-4 grid grid-cols-5 gap-1.5 rounded-xl bg-black/30 p-2 text-center">
        {Object.entries(MORSE).map(([l, code]) => (
          <div key={l} className="rounded-lg bg-sea py-1">
            <div className="font-pirate text-xl text-gold-2">{l}</div>
            <div className="font-mono text-sm text-parchment">{code.replaceAll('.', '•').replaceAll('-', '–')}</div>
          </div>
        ))}
      </div>
      <input
        className="parchment burnt mt-4 w-full px-4 py-3 text-center font-pirate text-3xl uppercase tracking-widest text-[#2a1a0a] outline-none"
        placeholder="Zpráva"
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          setWrong(false)
        }}
      />
      {wrong && <p className="mt-2 text-center text-blood-2">Kuba nerozumí. Zkus to znovu.</p>}
      <Button
        size="lg"
        full
        className="mt-3"
        disabled={!value.trim()}
        onClick={() => {
          if (normalize(value) === normalize(WORD)) onDone()
          else {
            sfx.fail()
            setWrong(true)
          }
        }}
      >
        Odvysílat odpověď
      </Button>
    </div>
  )
}
