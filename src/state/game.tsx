import { createContext, useContext, useEffect, useReducer, type Dispatch, type ReactNode } from 'react'
import { CONFIG, type JokerId } from '../data/config'
import { CREW_BY_ID, type CrewId } from '../data/crew'
import { STORY } from '../data/story'
import { setSoundEnabled } from '../lib/sound'

export interface IrlState {
  status: 'active' | 'waiting' | 'done'
  /** Násobič odměny podle žolíku. */
  mult: number
  joker?: JokerId | 'giveup'
  rescueTask?: string
  pct?: number
  earned?: number
}

export interface LogEntry {
  at: number
  text: string
  money?: number
}

export interface GameState {
  version: 1
  started: boolean
  step: number
  money: number
  crew: CrewId[]
  jokers: Record<JokerId, number>
  irl: Record<string, IrlState>
  shipName: string
  shots: number
  dowryShown: boolean
  /** Kdy byl kdo naposledy vyzván na souboj (ms) – kvůli cooldownu. */
  duels: Partial<Record<CrewId, number>>
  duelWins: number
  duelLosses: number
  sound: boolean
  log: LogEntry[]
}

export type Action =
  | { type: 'START' }
  | { type: 'NEXT' }
  | { type: 'PREV' }
  | { type: 'GOTO'; step: number }
  | { type: 'EARN'; amount: number; text: string }
  | { type: 'RECRUIT'; id: CrewId }
  | { type: 'SET_IRL'; id: string; patch: Partial<IrlState> }
  | { type: 'USE_JOKER'; id: JokerId }
  | { type: 'ADD_JOKER'; id: JokerId; delta: number }
  | { type: 'SET_NAME'; key: 'shipName'; value: string }
  | { type: 'SHOT' }
  | { type: 'SHOW_DOWRY' }
  | { type: 'DUEL'; id: CrewId; won: boolean; game: string }
  | { type: 'RESET_DUELS' }
  | { type: 'TOGGLE_SOUND' }
  | { type: 'LOG'; text: string }
  | { type: 'RESET' }

const STORAGE_KEY = 'kapitan-david-v4'

export function initialState(): GameState {
  return {
    version: 1,
    started: false,
    step: 0,
    money: 0,
    crew: [],
    jokers: { ...CONFIG.jokers },
    irl: {},
    shipName: '',
    shots: 0,
    dowryShown: false,
    duels: {},
    duelWins: 0,
    duelLosses: 0,
    sound: true,
    log: [],
  }
}

export function loadState(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialState()
    const parsed = JSON.parse(raw) as GameState
    if (parsed.version !== 1) return initialState()
    return { ...initialState(), ...parsed }
  } catch {
    return initialState()
  }
}

function nextIndex(from: number, dir: 1 | -1): number {
  return Math.max(0, Math.min(STORY.length - 1, from + dir))
}

/** Při skoku dopředu (admin) dopočítá pasivní efekty přeskočených kroků. */
function applySkipped(state: GameState, from: number, to: number): GameState {
  let s = state
  for (let i = from; i < to; i++) {
    const step = STORY[i]
    if (step.type === 'dowry') s = { ...s, dowryShown: true }
  }
  return s
}

const log = (state: GameState, text: string, money?: number): LogEntry[] => [...state.log, { at: Date.now(), text, money }]

export function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'START':
      return { ...state, started: true, log: log(state, 'Hra začala. Všechno nejlepší, kapitáne!') }
    case 'NEXT':
      return { ...state, step: nextIndex(state.step, 1) }
    case 'PREV':
      return { ...state, step: nextIndex(state.step, -1) }
    case 'GOTO': {
      const to = Math.max(0, Math.min(STORY.length - 1, action.step))
      const s = to > state.step ? applySkipped(state, state.step, to) : state
      return { ...s, step: to }
    }
    case 'EARN': {
      const amount = Math.round(action.amount * 100) / 100
      return { ...state, money: Math.max(0, Math.round((state.money + amount) * 100) / 100), log: log(state, action.text, amount) }
    }
    case 'RECRUIT':
      if (state.crew.includes(action.id)) return state
      return {
        ...state,
        crew: [...state.crew, action.id],
        log: log(state, `Na palubu se přidal(a) ${CREW_BY_ID[action.id].name} – ${CREW_BY_ID[action.id].role}.`),
      }
    case 'SET_IRL': {
      const prev = state.irl[action.id] ?? { status: 'active', mult: 1 }
      return { ...state, irl: { ...state.irl, [action.id]: { ...prev, ...action.patch } } }
    }
    case 'USE_JOKER':
      return { ...state, jokers: { ...state.jokers, [action.id]: Math.max(0, state.jokers[action.id] - 1) } }
    case 'ADD_JOKER':
      return { ...state, jokers: { ...state.jokers, [action.id]: Math.max(0, state.jokers[action.id] + action.delta) } }
    case 'SET_NAME':
      return { ...state, [action.key]: action.value }
    case 'SHOT':
      return { ...state, shots: state.shots + 1 }
    case 'SHOW_DOWRY':
      return { ...state, dowryShown: true }
    case 'DUEL': {
      const name = CREW_BY_ID[action.id].name
      return {
        ...state,
        duels: { ...state.duels, [action.id]: Date.now() },
        duelWins: state.duelWins + (action.won ? 1 : 0),
        duelLosses: state.duelLosses + (action.won ? 0 : 1),
        log: log(state, action.won ? `⚔️ ${action.game}: ${name} prohrál(a) a pije!` : `⚔️ ${action.game}: ${name} vyhrál(a). Kapitán se ztrapnil.`),
      }
    }
    case 'RESET_DUELS':
      return { ...state, duels: {} }
    case 'TOGGLE_SOUND':
      return { ...state, sound: !state.sound }
    case 'LOG':
      return { ...state, log: log(state, action.text) }
    case 'RESET':
      return initialState()
    default:
      return state
  }
}

/** Nahradí zástupku {ship} v textu. */
export function fill(text: string, state: GameState): string {
  return text.replaceAll('{ship}', state.shipName || 'Bezejmenná')
}

interface Ctx {
  state: GameState
  dispatch: Dispatch<Action>
}

const GameContext = createContext<Ctx | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, undefined, loadState)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* plné úložiště / private mode – hra jede dál bez ukládání */
    }
  }, [state])

  useEffect(() => setSoundEnabled(state.sound), [state.sound])

  useEffect(() => {
    if (import.meta.env.DEV) (window as unknown as { __game?: unknown }).__game = { state, dispatch }
  }, [state])

  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useGame(): Ctx {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used inside GameProvider')
  return ctx
}
