/**
 * Syntetizované zvuky přes Web Audio API. Žádné soubory.
 */
let ctx: AudioContext | null = null
let enabled = true

export function setSoundEnabled(on: boolean): void {
  enabled = on
}

function getCtx(): AudioContext | null {
  try {
    if (!ctx || ctx.state === 'closed') {
      const AC =
        window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!AC) return null
      ctx = new AC()
    }
    // iOS po systémovém dialogu (povolení pohybu) nebo hovoru přepne kontext do 'interrupted' – ne jen 'suspended'
    if (ctx.state !== 'running') void ctx.resume().catch(() => undefined)
    return ctx
  } catch {
    return null
  }
}

let unlockListening = false

/**
 * Zavolat při prvním kliknutí, aby se odemkl audio context (hlavně iOS).
 * Navíc při každém dalším dotyku zkusí kontext probudit, kdyby ho iOS mezitím uspal.
 */
export function unlockAudio(): void {
  const c = getCtx()
  if (!c) return
  const o = c.createOscillator()
  const g = c.createGain()
  g.gain.value = 0
  o.connect(g).connect(c.destination)
  o.start()
  o.stop(c.currentTime + 0.01)

  if (unlockListening) return
  unlockListening = true
  const wake = () => {
    if (ctx && ctx.state !== 'running') void ctx.resume().catch(() => undefined)
  }
  for (const ev of ['touchend', 'pointerup', 'click'] as const) document.addEventListener(ev, wake, { capture: true, passive: true })
  document.addEventListener('visibilitychange', () => document.visibilityState === 'visible' && wake())
}

function tone(freq: number, at: number, duration: number, type: OscillatorType = 'sine', volume = 0.18, slideTo?: number): void {
  const c = getCtx()
  if (!c || !enabled) return
  const t0 = c.currentTime + at
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = type
  o.frequency.setValueAtTime(freq, t0)
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + duration)
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(volume, t0 + 0.01)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration)
  o.connect(g).connect(c.destination)
  o.start(t0)
  o.stop(t0 + duration + 0.05)
}

function noise(at: number, duration: number, volume = 0.08, cutoff = 1200): void {
  const c = getCtx()
  if (!c || !enabled) return
  const t0 = c.currentTime + at
  const buffer = c.createBuffer(1, Math.floor(c.sampleRate * duration), c.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length)
  const src = c.createBufferSource()
  src.buffer = buffer
  const g = c.createGain()
  g.gain.value = volume
  const f = c.createBiquadFilter()
  f.type = 'lowpass'
  f.frequency.value = cutoff
  src.connect(f).connect(g).connect(c.destination)
  src.start(t0)
}

export const sfx = {
  tap() {
    tone(520, 0, 0.05, 'triangle', 0.06)
  },
  tick() {
    tone(900 + Math.random() * 200, 0, 0.04, 'square', 0.04)
  },
  coin() {
    tone(988, 0, 0.08, 'square', 0.07)
    tone(1319, 0.07, 0.25, 'square', 0.07)
  },
  coins() {
    for (let i = 0; i < 6; i++) tone(900 + Math.random() * 600, i * 0.07, 0.12, 'square', 0.05)
  },
  success() {
    ;[523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.35, 'triangle', 0.16))
    tone(1047, 0.6, 0.9, 'triangle', 0.14)
  },
  fail() {
    tone(330, 0, 0.25, 'sawtooth', 0.12)
    tone(262, 0.22, 0.3, 'sawtooth', 0.12)
    tone(196, 0.45, 0.6, 'sawtooth', 0.14)
  },
  fanfare() {
    ;[392, 523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, i * 0.1, 0.3, 'square', 0.07))
    tone(1047, 0.8, 1.2, 'triangle', 0.14)
    tone(1319, 0.8, 1.2, 'triangle', 0.1)
  },
  cannon() {
    tone(110, 0, 0.5, 'sawtooth', 0.2, 40)
    noise(0, 0.6, 0.25, 600)
  },
  gunshot() {
    noise(0, 0.15, 0.3, 3000)
    tone(200, 0, 0.1, 'square', 0.08, 60)
  },
  splash() {
    noise(0, 0.7, 0.18, 900)
    tone(300, 0.05, 0.3, 'sine', 0.06, 120)
  },
  whoosh() {
    noise(0, 0.35, 0.08)
  },
  ring() {
    for (let i = 0; i < 2; i++) {
      tone(880, i * 0.25, 0.18, 'sine', 0.14)
      tone(1100, i * 0.25 + 0.09, 0.12, 'sine', 0.1)
    }
  },
  beep(duration: number) {
    tone(720, 0, duration, 'sine', 0.2)
  },
  quack() {
    tone(520, 0, 0.12, 'sawtooth', 0.08, 320)
  },
  clang() {
    tone(1400, 0, 0.25, 'square', 0.06, 900)
    tone(2100, 0, 0.15, 'triangle', 0.05)
  },
  squawk() {
    tone(1500, 0, 0.15, 'sawtooth', 0.08, 900)
    tone(1300, 0.15, 0.2, 'sawtooth', 0.08, 700)
  },
  glitch() {
    for (let i = 0; i < 5; i++) tone(200 + Math.random() * 800, i * 0.05, 0.05, 'square', 0.06)
  },
}
