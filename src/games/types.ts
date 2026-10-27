export interface GameResult {
  /** 0..1 – kolik procent odměny ze scénáře si zaslouží. */
  score?: number
  /** Přesná částka (přebije score × reward). */
  money?: number
  /** Hláška na výsledkové obrazovce. */
  message?: string
}

export interface GameProps {
  onDone: (r: GameResult) => void
  /** Varianta téže minihry na jiném místě příběhu. */
  variant?: 'finale'
}

export interface RecruitProps {
  onDone: () => void
}
