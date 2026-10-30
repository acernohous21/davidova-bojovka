import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { STORY, type Effect, type StoryStep } from '../data/story'
import { fireConfetti } from '../lib/fx'
import { haptic } from '../lib/haptics'
import { sfx } from '../lib/sound'
import { fill, useGame } from '../state/game'
import { ArriveView, CallView, ChapterView, ChoiceView, DowryView, InputView, PvpView, SayView, TextView } from './steps/Basic'
import { BottleStep } from './steps/BottleStep'
import { Payoff, Treasure } from './steps/Finale'
import { GameStep } from './steps/GameStep'
import { IrlStep } from './steps/IrlStep'
import { RecruitStep } from './steps/RecruitStep'

const TAPPABLE = new Set<StoryStep['type']>(['text', 'say', 'chapter'])

export function StoryScreen() {
  const { state, dispatch } = useGame()
  const index = state.step
  const step = STORY[index]
  const [overlay, setOverlay] = useState<Effect | null>(null)

  const next = () => {
    sfx.tap()
    haptic.tap()
    dispatch({ type: 'NEXT' })
    window.scrollTo({ top: 0 })
  }

  const effect = step.type === 'text' || step.type === 'say' ? step.effect : undefined

  useEffect(() => {
    if (!effect) return
    let ms = 700
    switch (effect) {
      case 'buzz':
        haptic.fail()
        sfx.ring()
        break
      case 'shake':
        haptic.fail()
        sfx.whoosh()
        break
      case 'confetti':
        sfx.fanfare()
        haptic.levelUp()
        fireConfetti()
        break
      case 'flash':
        sfx.fanfare()
        haptic.levelUp()
        break
      case 'splash':
        sfx.splash()
        haptic.fail()
        ms = 900
        break
      case 'gunfire':
        for (let i = 0; i < 6; i++) setTimeout(() => sfx.gunshot(), i * 110)
        haptic.fail()
        ms = 900
        break
      case 'blackout':
        sfx.glitch()
        ms = 2200
        break
      case 'hearts':
        sfx.success()
        haptic.success()
        ms = 2400
        break
    }
    setOverlay(effect)
    const id = window.setTimeout(() => setOverlay(null), ms)
    return () => window.clearTimeout(id)
  }, [index, effect])

  const tappable = TAPPABLE.has(step.type)

  return (
    <>
      <AnimatePresence>
        {overlay === 'flash' && (
          <motion.div
            className="pointer-events-none fixed inset-0 z-40 bg-gold-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.7, 0, 0.5, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
          />
        )}
        {overlay === 'gunfire' && (
          <motion.div
            className="pointer-events-none fixed inset-0 z-40 bg-blood-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0, 0.4, 0, 0.5, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          />
        )}
        {overlay === 'splash' && (
          <motion.div
            className="pointer-events-none fixed inset-x-0 bottom-0 z-40 bg-gradient-to-t from-sea-2 via-foam/60 to-transparent"
            initial={{ height: '0%' }}
            animate={{ height: ['0%', '80%', '0%'] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9 }}
          />
        )}
        {overlay === 'hearts' && (
          <motion.div key="hearts" className="pointer-events-none fixed inset-0 z-40 overflow-hidden" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {Array.from({ length: 18 }).map((_, i) => (
              <motion.span
                key={i}
                className="absolute text-4xl"
                style={{ left: `${(i * 37) % 100}%` }}
                initial={{ top: '105%', scale: 0.6 }}
                animate={{ top: '-10%', scale: 1.2, rotate: (i % 2 ? 1 : -1) * 20 }}
                transition={{ duration: 1.6 + (i % 5) * 0.2, delay: (i % 6) * 0.1, ease: 'easeOut' }}
              >
                {i % 3 ? '❤️' : '💕'}
              </motion.span>
            ))}
          </motion.div>
        )}
        {overlay === 'blackout' && (
          <motion.div
            className="pointer-events-none fixed inset-0 z-40 bg-black"
            initial={{ opacity: 0, filter: 'blur(0px)' }}
            animate={{ opacity: [0, 0.6, 0.3, 0.9, 1, 1] }}
            exit={{ opacity: 0, transition: { duration: 0.6 } }}
            transition={{ duration: 2.2 }}
          />
        )}
      </AnimatePresence>

      <main
        className={`mx-auto flex w-full max-w-md flex-1 flex-col px-4 pb-[max(env(safe-area-inset-bottom),24px)] pt-5 ${tappable ? 'cursor-pointer' : ''}`}
        onClick={tappable ? next : undefined}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0, pointerEvents: 'auto', x: effect === 'shake' || effect === 'buzz' ? [0, -8, 8, -6, 6, 0] : 0 }}
            exit={{ opacity: 0, y: -16, pointerEvents: 'none', transition: { duration: 0.15 } }}
            transition={{ duration: 0.25 }}
            className="flex flex-1 flex-col"
          >
            <StepView step={step} index={index} onNext={next} />
          </motion.div>
        </AnimatePresence>

        {tappable && (
          <p className="mt-6 animate-pulse text-center font-pirate text-base tracking-[0.2em] text-parchment-3/70">klepni pro pokračování</p>
        )}
      </main>
    </>
  )
}

function StepView({ step, index, onNext }: { step: StoryStep; index: number; onNext: () => void }) {
  const { state } = useGame()
  switch (step.type) {
    case 'chapter':
      return <ChapterView step={step} />
    case 'text':
      return <TextView text={fill(step.text, state)} style={step.style} />
    case 'say':
      return <SayView who={step.who} text={fill(step.text, state)} />
    case 'choice':
      return <ChoiceView key={index} prompt={step.prompt} options={step.options} onNext={onNext} />
    case 'arrive':
      return <ArriveView step={step} onNext={onNext} />
    case 'call':
      return <CallView key={index} step={step} onNext={onNext} />
    case 'input':
      return <InputView key={index} step={step} onNext={onNext} />
    case 'dowry':
      return <DowryView onNext={onNext} />
    case 'pvp':
      return <PvpView onNext={onNext} />
    case 'payoff':
      return <Payoff onNext={onNext} />
    case 'treasure':
      return <Treasure />
    case 'game':
      return <GameStep key={index} step={step} onNext={onNext} />
    case 'recruit':
      return <RecruitStep key={index} step={step} onNext={onNext} />
    case 'irl':
      return <IrlStep key={index} step={step} onNext={onNext} />
    case 'bottle':
      return <BottleStep key={index} step={step} onNext={onNext} />
  }
}
