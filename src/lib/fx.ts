import confetti from 'canvas-confetti'

export function fireConfetti(): void {
  confetti({ particleCount: 140, spread: 90, origin: { y: 0.6 }, zIndex: 100, colors: ['#f6d27a', '#f1e3c2', '#ff5a45', '#8fd3d8'] })
}

export function fireCoins(): void {
  confetti({ particleCount: 40, spread: 70, origin: { y: 0.3 }, zIndex: 100, shapes: ['circle'], colors: ['#f6d27a', '#e0b04a', '#8a6420'], scalar: 1.2 })
}
