import { motion } from 'framer-motion'
import { useState } from 'react'
import { CONFIG } from '../../data/config'
import type { StoryStep } from '../../data/story'
import { haptic } from '../../lib/haptics'
import { sfx } from '../../lib/sound'
import { normalize } from '../../lib/text'
import { useGame } from '../../state/game'
import { Button } from '../ui'

export function BottleStep({ step, onNext }: { step: Extract<StoryStep, { type: 'bottle' }>; onNext: () => void }) {
  const { dispatch } = useGame()
  const [value, setValue] = useState('')
  const [wrong, setWrong] = useState(0)
  const [opened, setOpened] = useState(false)
  const code = CONFIG.bottles[step.n]?.code ?? ''

  const submit = () => {
    if (normalize(value) === normalize(code)) {
      sfx.success()
      haptic.success()
      dispatch({ type: 'SHOT' })
      dispatch({ type: 'LOG', text: `Láhvová pošta #${step.n} vypita.` })
      onNext()
    } else {
      sfx.fail()
      haptic.fail()
      setWrong((w) => w + 1)
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <p className="font-pirate text-xl tracking-[0.3em] text-parchment-3">Láhvová pošta #{step.n}</p>
      <motion.div
        className="my-5 text-8xl"
        animate={opened ? { rotate: [0, -30, -150, -150], y: [0, -10, -10, 0] } : { rotate: [-8, 8, -8], y: [0, -6, 0] }}
        transition={opened ? { duration: 1.2 } : { repeat: Infinity, duration: 2.4 }}
      >
        🍾
      </motion.div>
      <p className="text-2xl leading-snug text-parchment">{step.text}</p>
      {!opened ? (
        <>
          <p className="mt-3 text-lg italic text-parchment-3">Vypij lahvičku. Pak rozviň papírek.</p>
          <Button size="lg" full className="mt-6" onClick={() => setOpened(true)}>
            🥃 Vypito
          </Button>
        </>
      ) : (
        <motion.div className="mt-5 w-full" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-lg text-parchment-2">Na papírku je hádanka. Odpověď je heslo.</p>
          <motion.input
            className="parchment burnt mt-3 w-full px-4 py-4 text-center font-pirate text-4xl uppercase tracking-widest text-[#2a1a0a] outline-none placeholder:text-[#2a1a0a]/35"
            placeholder="Odpověď"
            value={value}
            animate={wrong ? { x: [0, -10, 10, -8, 8, 0] } : {}}
            key={wrong}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
          />
          {wrong > 0 && <p className="mt-2 text-lg text-blood-2">Špatně. Možná jsi pil moc rychle.</p>}
          {wrong > 2 && <p className="mt-1 text-base italic text-parchment-3">Nápověda: {CONFIG.bottles[step.n]?.riddle}</p>}
          <Button size="lg" full className="mt-4" disabled={!value.trim()} onClick={submit}>
            Odemknout
          </Button>
        </motion.div>
      )}
    </div>
  )
}
