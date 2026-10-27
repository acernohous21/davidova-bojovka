import { motion } from 'framer-motion'
import { useState } from 'react'
import { CONFIG } from '../../data/config'
import { CREW_BY_ID, crewPhoto } from '../../data/crew'
import type { StoryStep } from '../../data/story'
import { RECRUIT_GAMES } from '../../games'
import { fireConfetti } from '../../lib/fx'
import { haptic } from '../../lib/haptics'
import { sfx } from '../../lib/sound'
import { useGame } from '../../state/game'
import { Button } from '../ui'

type Phase = 'intro' | 'game' | 'card'

export function RecruitStep({ step, onNext }: { step: Extract<StoryStep, { type: 'recruit' }>; onNext: () => void }) {
  const { state, dispatch } = useGame()
  const member = CREW_BY_ID[step.who]
  const already = state.crew.includes(step.who)
  const [phase, setPhase] = useState<Phase>(already ? 'card' : 'intro')
  const Game = RECRUIT_GAMES[step.game]

  if (phase === 'intro')
    return (
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <p className="font-pirate text-xl tracking-[0.3em] text-parchment-3">Verbování</p>
        <div className="relative mt-4 h-56 w-44 overflow-hidden rounded-2xl rope-border">
          <img src={crewPhoto(member.id)} alt="" className="h-full w-full scale-110 object-cover blur-xl brightness-50 grayscale" />
          <div className="absolute inset-0 grid place-items-center font-pirate text-7xl text-parchment/80">?</div>
        </div>
        <p className="mt-6 text-2xl leading-snug text-parchment">{member.teaser}</p>
        <p className="mt-2 text-lg italic text-parchment-3">Chce se přidat k posádce. Ale nejdřív musíš ukázat, že jsi kapitán.</p>
        <Button size="lg" full className="mt-8" onClick={() => setPhase('game')}>
          Naverbovat
        </Button>
      </div>
    )

  if (phase === 'game')
    return (
      <Game
        onDone={() => {
          sfx.fanfare()
          haptic.levelUp()
          fireConfetti()
          dispatch({ type: 'RECRUIT', id: member.id })
          dispatch({ type: 'EARN', amount: CONFIG.recruitReward, text: `Verbování: ${member.name}` })
          setPhase('card')
        }}
      />
    )

  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <motion.div
        className="parchment burnt w-full p-3"
        initial={{ rotateY: 180, scale: 0.7 }}
        animate={{ rotateY: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 90, damping: 14 }}
      >
        <p className="font-pirate text-lg tracking-[0.2em] text-[#6b4a1e]">Nový člen posádky</p>
        <div className="mt-2 overflow-hidden rounded-xl ring-4 ring-[#6b4a1e]/40">
          <img src={crewPhoto(member.id)} alt={member.name} className="aspect-[4/5] w-full object-cover" />
        </div>
        <p className="mt-3 font-pirate text-5xl leading-none">{member.name}</p>
        <p className="font-pirate text-2xl text-[#8a2f22]">
          {member.icon} {member.role}
        </p>
        <div className="mt-3 space-y-1 text-left text-lg leading-snug">
          <p>
            <b>Schopnost:</b> {member.skill}
          </p>
          <p>
            <b>Slabost:</b> {member.weakness}
          </p>
        </div>
      </motion.div>
      <p className="mt-4 text-lg italic text-parchment-3">
        {member.name} si teď nasadí svůj pirátský doplněk. +{CONFIG.recruitReward} 🐪 do věna.
      </p>
      <Button size="lg" full className="mt-5" onClick={onNext}>
        Vítej na palubě!
      </Button>
    </div>
  )
}
