export type CrewId = 'matej' | 'eliska' | 'kuba' | 'adam' | 'tom' | 'lucka' | 'dejv' | 'roman'

export interface CrewMember {
  id: CrewId
  name: string
  role: string
  icon: string
  /** ISO datum narození (YYYY-MM-DD) – používá se ve vzpouře. */
  birthday: string
  skill: string
  weakness: string
  /** Nápověda na náborové kartě, dokud není naverbovaný. */
  teaser: string
}

export const CREW: CrewMember[] = [
  {
    id: 'matej',
    name: 'Matěj',
    role: 'Lodní plavčík',
    icon: '🦩',
    birthday: '2003-08-22',
    skill: 'Nepotopitelný. Doslova – má rukávky i plameňáka.',
    weakness: 'Workoholismus.',
    teaser: 'Liberecký Jeremy Fragance.',
  },
  {
    id: 'kuba',
    name: 'Kuba',
    role: 'Radista',
    icon: '🍌',
    birthday: '2004-01-05',
    skill: 'Spojení s celým světem přes banán.',
    weakness: 'Dal by sis ten jeho banán?',
    teaser: 'Si atletka, pááána... já jsem skor tak, bodybuilder. Pomožem s taškou?',
  },
  {
    id: 'lucka',
    name: 'Lucka',
    role: 'Lodní kuchař',
    icon: '🥄',
    birthday: '2004-02-19',
    skill: 'S vařečkou uvaří cokoliv.',
    weakness: 'Nikdo neví, jestli je ten medvídek mazlíček, nebo zásoba na zimu.',
    teaser: 'I pohřeb ti zaúčtuje jako mimořádný náklad.',
  },
  {
    id: 'eliska',
    name: 'Eliška',
    role: 'Kormidelník',
    icon: '☸️',
    birthday: '2004-06-22',
    skill: 'Proplete loď mezi útesy za každého počasí.',
    weakness: 'Levá a pravá? Ach ty řidičky.',
    teaser: 'Your type of (cigánka) Esmeralda.',
  },
  {
    id: 'dejv',
    name: 'Dejv',
    role: 'Šermíř',
    icon: '⚔️',
    birthday: '2003-11-13',
    skill: 'Šavle + brýle = dvojnásobná přesnost.',
    weakness: 'Už nemá svůj baton.',
    teaser: 'Bacha na kamery, nebo přijde černoch a rozbje ti hubu.',
  },
  {
    id: 'roman',
    name: 'Roman',
    role: 'Hlídka na stěžni',
    icon: '🐒',
    birthday: '2004-07-10',
    skill: 'Vidí všechno. A co nevidí on, vidí jeho opice.',
    weakness: 'Španělky, Italky, Slovenky...',
    teaser: 'Má na rameni opici, a nebo on je ta opice? Idk..',
  },
  {
    id: 'tom',
    name: 'Tom',
    role: 'Dělostřelec',
    icon: '💥',
    birthday: '2003-12-25',
    skill: 'Střílí dřív, než se zeptá.',
    weakness: 'Přes růžové brýle vidí svět moc růžově.',
    teaser: 'Hele duha. Cože? Kámo, hele, tam je duha. Co? Ajo, duha.',
  },
  {
    id: 'adam',
    name: 'Adam',
    role: 'Navigátor',
    icon: '🧭',
    birthday: '2004-06-07',
    skill: 'Vždycky ví, kde je sever.',
    weakness: 'Neví, kolik je hodin... Ale to ty vlastně taky ne.',
    teaser: 'Davidovi kokotovi, kokot Adam',
  },
]

export const CREW_BY_ID = Object.fromEntries(CREW.map((c) => [c.id, c])) as Record<CrewId, CrewMember>

export function crewPhoto(id: CrewId): string {
  return `${import.meta.env.BASE_URL}crew/${id}.jpg`
}
