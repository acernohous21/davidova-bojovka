import { motion } from 'framer-motion'
import { useState } from 'react'
import { haptic } from '../lib/haptics'
import { sfx } from '../lib/sound'
import { pick } from '../lib/text'
import { Avatar } from '../components/steps/Basic'
import { Button, GameTitle } from '../components/ui'
import type { GameProps } from './types'

const REJECTS = [
  'Hehehe, ne, žejo.',
  'Za tolik ti dám leda pádlo, doprdele.',
  'Banka zkurvená, potřebuju víc, hahaha.',
  'To je málo, žejo. To je urážka, doprdele.',
  'Hehehehe. Ne. Hehe.',
]

export function Haggle({ onDone }: GameProps) {
  const [price, setPrice] = useState(500)
  const [offers, setOffers] = useState(0)
  const [line, setLine] = useState('Loď. Za 5 000 $, žejo. Kamarádská cena.')
  const [deal, setDeal] = useState(false)

  const offer = () => {
    sfx.tick()
    haptic.tick()
    setOffers((o) => o + 1)
    setLine(`${price} $? ${pick(REJECTS)}`)
  }

  const beer = () => {
    sfx.fanfare()
    haptic.levelUp()
    setDeal(true)
    setLine('Hehehehe. 0 $ a pivo? DOHODA, doprdele! Ty seš obchodník, žejo!')
  }

  return (
    <div className="flex flex-1 flex-col">
      <GameTitle title="Smlouvání" subtitle="Majkl chce za loď peníze. Ty máš jednu kozu. Smlouvej." />
      <div className="mt-5 flex items-start gap-3">
        <Avatar who="majkl" />
        <motion.div key={line} className="parchment burnt flex-1 p-3 text-xl leading-snug" initial={{ scale: 0.95 }} animate={{ scale: 1 }}>
          {line}
        </motion.div>
      </div>

      {!deal ? (
        <div className="mt-auto pt-6">
          <p className="text-center font-pirate text-6xl tabular-nums text-gold-2">{price} $</p>
          <input
            type="range"
            min={1}
            max={1000}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="mt-4 w-full accent-[#e0b04a]"
          />
          <Button size="lg" full className="mt-4" onClick={offer}>
            Nabídnout {price} $
          </Button>
          {offers >= 3 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Button size="lg" variant="outline" full className="mt-3" onClick={beer}>
                Nabídnout: 0 $ + pivo 🍺
              </Button>
            </motion.div>
          )}
        </div>
      ) : (
        <Button size="lg" full className="mt-auto" onClick={() => onDone({ message: 'Máš loď. Za pivo. Nejlepší obchod tvého života.' })}>
          Plácnout si 🤝
        </Button>
      )}
    </div>
  )
}
