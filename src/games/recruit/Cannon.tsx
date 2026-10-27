import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { haptic } from '../../lib/haptics'
import { useFrame } from '../../lib/sensors'
import { sfx } from '../../lib/sound'
import { Button, GameTitle } from '../../components/ui'
import type { RecruitProps } from '../types'

const NEEDED = 3
const TOLERANCE = 7

export function Cannon({ onDone }: RecruitProps) {
  const [aim, setAim] = useState(50)
  const [target, setTarget] = useState(() => 20 + Math.random() * 60)
  const [hits, setHits] = useState(0)
  const [flying, setFlying] = useState<number | null>(null)
  const [msg, setMsg] = useState('')
  const t = useRef(0)

  useFrame(flying === null && hits < NEEDED, (dt) => {
    t.current += dt * (1.4 + hits * 0.35)
    setAim(50 + Math.sin(t.current) * 45)
  })

  const fire = () => {
    if (flying !== null) return
    sfx.cannon()
    haptic.tick()
    const shot = aim
    setFlying(shot)
    setTimeout(() => {
      if (Math.abs(shot - target) < TOLERANCE) {
        const n = hits + 1
        setHits(n)
        setMsg('ZÁSAH! 💥')
        sfx.success()
        haptic.success()
        if (n >= NEEDED) setTimeout(onDone, 700)
        setTarget(15 + Math.random() * 70)
      } else {
        setMsg(shot < target ? 'Moc vlevo. Šplouch.' : 'Moc vpravo. Šplouch.')
        sfx.splash()
      }
      setFlying(null)
    }, 450)
  }

  return (
    <div className="flex flex-1 flex-col">
      <GameTitle title="Dělostřelec" subtitle="Tom zaměřuje přes růžové brýle. Vystřel, když je zaměřovač nad lodí. Potřebuješ 3 zásahy." />
      <p className="mt-3 text-center font-pirate text-2xl text-gold-2">
        Zásahy: {hits} / {NEEDED}
      </p>
      <div className="relative mt-3 h-56 overflow-hidden rounded-2xl bg-gradient-to-b from-[#ff9ec7]/30 via-sea-2 to-sea">
        <motion.span className="absolute top-10 -translate-x-1/2 text-5xl" animate={{ left: `${target}%` }}>
          🏴‍☠️
        </motion.span>
        <div className="absolute top-0 h-full w-0.5 bg-blood-2/70" style={{ left: `${aim}%` }} />
        <div className="absolute top-12 -translate-x-1/2 text-3xl" style={{ left: `${aim}%` }}>
          🎯
        </div>
        {flying !== null && (
          <motion.div className="absolute -translate-x-1/2 text-2xl" style={{ left: `${flying}%` }} initial={{ top: '90%' }} animate={{ top: '15%' }} transition={{ duration: 0.45 }}>
            ⚫
          </motion.div>
        )}
        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-4xl">💥</span>
      </div>
      <p className="mt-2 h-8 text-center font-pirate text-2xl text-parchment-2">{msg}</p>
      <Button size="xl" variant="blood" full className="mt-2" silent onPointerDown={fire}>
        PAL!
      </Button>
    </div>
  )
}
