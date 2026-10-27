import type { ComponentType } from 'react'
import type { GameId, RecruitGameId } from '../data/story'
import { Battle } from './Battle'
import { Dodge } from './Dodge'
import { DrunkWalk } from './DrunkWalk'
import { Grab } from './Grab'
import { Haggle } from './Haggle'
import { Hustle } from './Hustle'
import { Interview } from './Interview'
import { Jobs } from './Jobs'
import { Meeting } from './Meeting'
import { Mutiny } from './Mutiny'
import { Banana } from './recruit/Banana'
import { Cannon } from './recruit/Cannon'
import { Compass } from './recruit/Compass'
import { Ducks } from './recruit/Ducks'
import { Kitchen } from './recruit/Kitchen'
import { Lookout } from './recruit/Lookout'
import { Reef } from './recruit/Reef'
import { Sword } from './recruit/Sword'
import { Shells } from './Shells'
import { Shout } from './Shout'
import { Swim } from './Swim'
import type { GameProps, RecruitProps } from './types'

export type { GameResult } from './types'

export const GAMES: Record<GameId, ComponentType<GameProps>> = {
  meeting: Meeting,
  jobs: Jobs,
  drunk: DrunkWalk,
  shells: Shells,
  dodge: Dodge,
  grab: Grab,
  shout: Shout,
  swim: Swim,
  hustle: Hustle,
  haggle: Haggle,
  interview: Interview,
  mutiny: Mutiny,
  battle: Battle,
}

export const RECRUIT_GAMES: Record<RecruitGameId, ComponentType<RecruitProps>> = {
  banana: Banana,
  compass: Compass,
  sword: Sword,
  ducks: Ducks,
  cannon: Cannon,
  reef: Reef,
  kitchen: Kitchen,
  lookout: Lookout,
}
