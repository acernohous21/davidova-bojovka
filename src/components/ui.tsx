import { AnimatePresence, motion, type HTMLMotionProps } from 'framer-motion'
import { useState, type ReactNode } from 'react'
import { CONFIG } from '../data/config'
import { haptic } from '../lib/haptics'
import { sfx } from '../lib/sound'

// ---------- Button ----------

type Variant = 'gold' | 'blood' | 'parchment' | 'ghost' | 'outline' | 'dark'
type Size = 'sm' | 'md' | 'lg' | 'xl'

const VARIANT: Record<Variant, string> = {
  gold: 'bg-gradient-to-b from-gold-2 to-gold text-abyss font-pirate shadow-[0_6px_0_#8a6420,0_10px_24px_rgba(0,0,0,0.45)] active:shadow-[0_2px_0_#8a6420] active:translate-y-1',
  blood:
    'bg-gradient-to-b from-blood-2 to-blood text-parchment font-pirate shadow-[0_6px_0_#6e1a14,0_10px_24px_rgba(0,0,0,0.45)] active:shadow-[0_2px_0_#6e1a14] active:translate-y-1',
  parchment: 'parchment font-pirate shadow-[0_5px_0_#9c855a] active:translate-y-1 active:shadow-none',
  ghost: 'bg-transparent text-parchment-2 font-body font-semibold',
  outline: 'bg-transparent text-gold-2 font-pirate ring-2 ring-gold/60 ring-inset',
  dark: 'bg-sea text-parchment font-pirate ring-1 ring-gold/30 ring-inset',
}

const SIZE: Record<Size, string> = {
  sm: 'text-base px-3 py-2 rounded-lg',
  md: 'text-xl px-5 py-3 rounded-xl',
  lg: 'text-2xl px-6 py-4 rounded-2xl',
  xl: 'text-3xl px-6 py-5 rounded-2xl',
}

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: Variant
  size?: Size
  full?: boolean
  silent?: boolean
  children?: ReactNode
}

export function Button({ variant = 'gold', size = 'md', full, silent, className = '', children, onClick, disabled, ...rest }: ButtonProps) {
  return (
    <motion.button
      type="button"
      whileTap={disabled ? undefined : { scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={`${VARIANT[variant]} ${SIZE[size]} ${full ? 'w-full' : ''} inline-flex items-center justify-center gap-2 leading-none tracking-wide transition-[transform,box-shadow] duration-100 disabled:pointer-events-none disabled:opacity-40 ${className}`}
      disabled={disabled}
      onClick={(e) => {
        if (!silent) {
          sfx.tap()
          haptic.tap()
        }
        onClick?.(e)
      }}
      {...rest}
    >
      {children}
    </motion.button>
  )
}

// ---------- Modal / Sheet ----------

export function Sheet({ open, onClose, children, title }: { open: boolean; onClose: () => void; children: ReactNode; title?: string }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="panel no-scrollbar max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-3xl px-4 pb-[max(env(safe-area-inset-bottom),20px)] pt-3"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-parchment-3/40" />
            {title && (
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-pirate text-3xl text-gold-2">{title}</h2>
                <button type="button" className="px-2 text-2xl text-parchment-3" onClick={onClose} aria-label="Zavřít">
                  ✕
                </button>
              </div>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Modal({ open, children }: { open: boolean; children: ReactNode }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-sm"
            initial={{ scale: 0.85, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ---------- PIN ----------

export function PinPad({ onSuccess, onCancel, title = 'Jen pro posádku' }: { onSuccess: () => void; onCancel?: () => void; title?: string }) {
  const [pin, setPin] = useState('')
  const [wrong, setWrong] = useState(false)

  const press = (d: string) => {
    sfx.tick()
    haptic.tick()
    const next = (pin + d).slice(0, CONFIG.pin.length)
    setPin(next)
    setWrong(false)
    if (next.length === CONFIG.pin.length) {
      if (next === CONFIG.pin) {
        sfx.success()
        onSuccess()
      } else {
        sfx.fail()
        haptic.fail()
        setWrong(true)
        setTimeout(() => setPin(''), 400)
      }
    }
  }

  return (
    <div className="panel rounded-3xl p-5 text-center">
      <p className="font-pirate text-2xl text-gold-2">{title}</p>
      <p className="text-sm text-parchment-3">Kapitáne, dej telefon posádce.</p>
      <motion.div className="my-4 flex justify-center gap-3" animate={wrong ? { x: [0, -10, 10, -8, 8, 0] } : {}}>
        {Array.from({ length: CONFIG.pin.length }).map((_, i) => (
          <span key={i} className={`h-4 w-4 rounded-full ${i < pin.length ? (wrong ? 'bg-blood-2' : 'bg-gold-2') : 'bg-black/50 ring-1 ring-gold/30'}`} />
        ))}
      </motion.div>
      <div className="grid grid-cols-3 gap-2">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
          <button key={d} type="button" className="rounded-xl bg-sea py-3 font-pirate text-3xl text-parchment active:bg-sea-2" onClick={() => press(d)}>
            {d}
          </button>
        ))}
        <button type="button" className="rounded-xl py-3 text-sm text-parchment-3" onClick={onCancel}>
          Zpět
        </button>
        <button type="button" className="rounded-xl bg-sea py-3 font-pirate text-3xl text-parchment active:bg-sea-2" onClick={() => press('0')}>
          0
        </button>
        <button type="button" className="rounded-xl py-3 text-xl text-parchment-3" onClick={() => setPin(pin.slice(0, -1))}>
          ⌫
        </button>
      </div>
    </div>
  )
}

// ---------- Drobnosti ----------

export function GameTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="text-center">
      <h2 className="font-pirate text-4xl leading-none text-gold-2">{title}</h2>
      {subtitle && <p className="mt-2 text-lg italic leading-snug text-parchment-2">{subtitle}</p>}
    </div>
  )
}

export function Bar({ value, color = 'bg-gold', className = '' }: { value: number; color?: string; className?: string }) {
  return (
    <div className={`h-3 overflow-hidden rounded-full bg-black/50 ring-1 ring-gold/20 ${className}`}>
      <motion.div className={`h-full ${color}`} animate={{ width: `${Math.max(0, Math.min(1, value)) * 100}%` }} transition={{ duration: 0.15 }} />
    </div>
  )
}

export function Fallback({ onClick, children = 'Nejde to? Klepej sem.' }: { onClick: () => void; children?: ReactNode }) {
  return (
    <button type="button" className="mx-auto mt-3 block text-sm text-parchment-3 underline" onClick={onClick}>
      {children}
    </button>
  )
}
