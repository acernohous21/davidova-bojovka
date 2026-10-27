export type CrewId = 'matej' | 'eliska' | 'kuba' | 'adam' | 'tom' | 'lucka' | 'dejv' | 'maja'

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
  /** Volitelný člen (může chybět – dá se vypnout v adminu). */
  optional?: boolean
}

export const CREW: CrewMember[] = [
  {
    id: 'matej',
    name: 'Matěj',
    role: 'Lodní plavčík',
    icon: '🦩',
    birthday: '2003-08-22',
    skill: 'Nepotopitelný. Doslova – má rukávky i plameňáka.',
    weakness: 'Gumové kachničky. Neodolá jim.',
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
    teaser: 'Si atletka, pááána... já jsem skor tak, bodybuilder. Pomožem s taškou.',
  },
  {
    id: 'lucka',
    name: 'Lucka',
    role: 'Lodní kuchař',
    icon: '🥄',
    birthday: '2004-02-19',
    skill: 'S vařečkou uvaří cokoliv.',
    weakness: 'Nikdo neví, jestli je ten medvídek mazlíček, nebo zásoba na zimu.',
    teaser: 'Marcus, nigga, who dat is? Its Reggie. Who tf is Reggie!?',
  },
  {
    id: 'eliska',
    name: 'Eliška',
    role: 'Kormidelník',
    icon: '☸️',
    birthday: '2004-06-22',
    skill: 'Proplete loď mezi útesy za každého počasí.',
    weakness: 'Levá a pravá? Ach ty řidičky.',
    teaser: 'Vy nevidíte, že máte v kuchyni pneumatiky!?',
  },
  {
    id: 'dejv',
    name: 'Dejv',
    role: 'Šermíř',
    icon: '⚔️',
    birthday: '2003-11-13',
    skill: 'Šavle + brýle = dvojnásobná přesnost.',
    weakness: 'Bacha na kamery, nebo přijde černoch a rozbje ti hubu.',
    teaser: 'Co sis za to koupil? Chlast? Fet? Automaty?',
  },
  {
    id: 'maja',
    name: 'Mája',
    role: 'Hlídka na stěžni',
    icon: '🔦',
    birthday: '2004-05-22',
    skill: 'Vidí ve tmě. Čelovka nikdy nezhasne.',
    weakness: 'Bacha, nebo tě zavře do podpalubí a už tě nepustí.',
    teaser: '5 let, přijde vá to jako hodně? Pro chlapa jako jsem já by nebylo hodně ani 15.',
    optional: true,
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
    weakness: 'Neví, kde je jih. Racek na rameni taky ne.',
    teaser: 'Davidovi kokotovi, kokot Adam',
  },
]

export const CREW_BY_ID = Object.fromEntries(CREW.map((c) => [c.id, c])) as Record<CrewId, CrewMember>

export function crewPhoto(id: CrewId): string {
  return `${import.meta.env.BASE_URL}crew/${id}.jpg`
}
