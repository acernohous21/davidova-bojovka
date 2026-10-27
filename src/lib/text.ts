export function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Velbloudi. 0,1 velblouda = 1 koza. */
export function formatCamels(n: number): string {
  const rounded = Math.round(n * 10) / 10
  if (rounded > 0 && rounded < 1) return `${Math.round(rounded * 10)} ${rounded === 0.1 ? 'koza' : rounded < 0.5 ? 'kozy' : 'koz'} 🐐`
  return `${rounded.toLocaleString('cs-CZ', { maximumFractionDigits: 1 })} 🐪`
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return `${d}. ${m}. ${y}`
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}
