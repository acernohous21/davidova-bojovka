import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { haptic } from '../lib/haptics'
import { sfx } from '../lib/sound'
import { GameTitle } from '../components/ui'
import type { GameProps } from './types'

const MAILS = [
  { from: 'Bagr Solutions s.r.o.', text: 'Hledáme seniora s 15 lety praxe v technologii, která existuje 3 roky.' },
  { from: 'Agile Hrad a.s.', text: 'Bohužel. Hledáme někoho, kdo postaví hrad. S jednou věží. Možná dvěma.' },
  { from: 'Medium Issue Ltd.', text: 'Váš profil je high. My hledáme max medium.' },
  { from: 'Patent na Rozum, z.s.', text: 'Bohužel nemáme patent na rozum, takže vás nevezmeme.' },
  { from: 'Stromy Digital', text: 'Děkujeme za zájem. Tak. Zpátky na stromy.' },
  { from: 'Komerčka IT', text: 'Chyba není naše. Je vaše. Proto vás nebereme.' },
  { from: 'HR Bot 3000', text: 'Dobrý den, {jméno}, děkujeme za Váš zájem o pozici {pozice}.' },
]

export function Jobs({ onDone }: GameProps) {
  const [left, setLeft] = useState(MAILS.length)
  const index = MAILS.length - left

  const dismiss = () => {
    sfx.whoosh()
    haptic.tick()
    const n = left - 1
    setLeft(n)
    if (n === 0) setTimeout(() => onDone({ message: 'Doručená pošta: 0. Nabídky: 0. Naděje: 0.' }), 350)
  }

  return (
    <div className="flex flex-1 flex-col">
      <GameTitle title="Hledání práce" subtitle="Rozeslal jsi 147 životopisů. Odpovědi už chodí. Odhoď je swipem do strany." />
      <p className="mt-3 text-center font-pirate text-2xl text-parchment-3">📬 {left} nepřečtených</p>
      <div className="relative mt-4 h-64">
        <AnimatePresence>
          {MAILS.slice(index, index + 3)
            .reverse()
            .map((m, k, arr) => {
              const top = k === arr.length - 1
              const depth = arr.length - 1 - k
              return (
                <motion.div
                  key={m.from}
                  className="absolute inset-x-0 top-0 rounded-2xl bg-white p-4 text-[#1a1a1a] shadow-xl"
                  style={{ zIndex: 10 - depth }}
                  initial={{ scale: 0.9, y: 30, opacity: 0 }}
                  animate={{ scale: 1 - depth * 0.05, y: depth * 14, opacity: 1 }}
                  exit={{ x: 400, rotate: 25, opacity: 0, transition: { duration: 0.25 } }}
                  drag={top ? 'x' : false}
                  dragSnapToOrigin
                  onDragEnd={(_, info) => {
                    if (Math.abs(info.offset.x) > 90) dismiss()
                  }}
                >
                  <div className="flex items-center gap-2 text-sm text-[#666]">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-[#e8eaf6] text-base">✉️</span>
                    <span className="font-semibold text-[#1a1a1a]">{m.from}</span>
                  </div>
                  <p className="mt-2 font-semibold">Re: Vaše žádost o pozici</p>
                  <p className="mt-1 text-lg leading-snug text-[#333]">Děkujeme za Váš zájem, bohužel… {m.text}</p>
                  {top && <p className="mt-3 text-center text-sm text-[#999]">⇠ swipni pryč ⇢</p>}
                </motion.div>
              )
            })}
        </AnimatePresence>
      </div>
      <button type="button" className="mx-auto mt-6 text-sm text-parchment-3 underline" onClick={() => left > 0 && dismiss()}>
        Swipe nejde? Klepni a smaž.
      </button>
    </div>
  )
}
