import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { haptic } from '../lib/haptics'
import { useFrame, useMicLevel } from '../lib/sensors'
import { sfx } from '../lib/sound'
import { Bar, Button, Fallback, GameTitle } from '../components/ui'
import type { GameProps } from './types'

const NEEDED = 1.5
const THRESHOLD = 0.55

export function Shout({ onDone }: GameProps) {
  const mic = useMicLevel()
  const [level, setLevel] = useState(0)
  const [held, setHeld] = useState(0)
  const done = useRef(false)
  const heldRef = useRef(0)

  const finish = (message: string) => {
    if (done.current) return
    done.current = true
    sfx.fanfare()
    haptic.levelUp()
    onDone({ message })
  }

  useFrame(mic.status === 'on', (dt) => {
    const l = mic.level.current
    setLevel(l)
    const h = heldRef.current
    heldRef.current = l > THRESHOLD ? h + dt : Math.max(0, h - dt * 0.5)
    setHeld(heldRef.current)
    if (heldRef.current >= NEEDED) finish('Celá loď ztichla. I racci přestali křičet.')
  })

  return (
    <div className="flex flex-1 flex-col">
      <GameTitle title="Proslov" subtitle="Zařvi to nahlas. Pořádně. Ať to slyší celá hospoda." />
      <motion.div
        className="parchment burnt mt-5 p-4 text-center"
        animate={{ scale: 1 + level * 0.08, rotate: level > THRESHOLD ? [-1, 1, -1] : 0 }}
      >
        <p className="font-pirate text-3xl leading-tight">„JSEM NEJVĚTŠÍ PIRÁT NA SVĚTĚ, VY MRDKY, A NIKDO SE NADE MNE POVYŠOVAT NEBUDE!“</p>
      </motion.div>

      {mic.status === 'idle' && (
        <Button size="lg" full className="mt-6" onClick={() => void mic.start()}>
          🎤 Zapnout mikrofon
        </Button>
      )}
      {mic.status === 'on' && (
        <div className="mt-6 space-y-3">
          <div className="flex items-end gap-1" style={{ height: 80 }}>
            {Array.from({ length: 20 }).map((_, i) => {
              const on = level * 20 > i
              return <div key={i} className={`flex-1 rounded-sm ${on ? (i > 13 ? 'bg-blood-2' : i > 8 ? 'bg-gold' : 'bg-foam') : 'bg-black/40'}`} style={{ height: `${20 + i * 4}%` }} />
            })}
          </div>
          <p className="text-center font-pirate text-2xl text-parchment-2">{level > THRESHOLD ? 'ANO! DRŽ TO!' : 'Hlasitěji!'}</p>
          <Bar value={held / NEEDED} color="bg-blood-2" />
        </div>
      )}
      {mic.status === 'denied' && <p className="mt-6 text-center text-lg text-blood-2">Mikrofon nejde. Posádka musí potvrdit, že jsi řval dost nahlas.</p>}
      <Fallback onClick={() => finish('Posádka potvrzuje: bylo to slyšet až do Mogadišu.')}>Mikrofon nefunguje? Posádka potvrdí, že řval.</Fallback>
    </div>
  )
}
