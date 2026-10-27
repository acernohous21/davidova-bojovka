import { motion } from 'framer-motion'
import { useState } from 'react'
import type { StoryStep } from '../../data/story'
import { GAMES, type GameResult } from '../../games'
import { fireCoins } from '../../lib/fx'
import { haptic } from '../../lib/haptics'
import { sfx } from '../../lib/sound'
import { formatCamels } from '../../lib/text'
import { useGame } from '../../state/game'
import { Button } from '../ui'

export function GameStep({ step, onNext }: { step: Extract<StoryStep, { type: 'game' }>; onNext: () => void }) {
  const { dispatch } = useGame()
  const [result, setResult] = useState<GameResult | null>(null)
  const Game = GAMES[step.game]

  const done = (r: GameResult) => {
    const money = r.money ?? (step.reward ? Math.round(step.reward * (r.score ?? 1) * 10) / 10 : 0)
    if (money > 0) {
      sfx.coins()
      haptic.success()
      fireCoins()
    }
    setResult({ ...r, money })
  }

  if (!result) return <Game onDone={done} variant={step.variant} />

  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      {result.message && <p className="text-3xl leading-snug text-parchment">{result.message}</p>}
      {result.money !== undefined && result.money > 0 && (
        <motion.p
          className="mt-6 font-pirate text-6xl text-gold-2"
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12 }}
        >
          +{formatCamels(result.money)}
        </motion.p>
      )}
      <Button
        size="lg"
        full
        className="mt-8"
        onClick={() => {
          if (result.money) dispatch({ type: 'EARN', amount: result.money, text: `${step.title}` })
          onNext()
        }}
      >
        Dál
      </Button>
    </div>
  )
}
