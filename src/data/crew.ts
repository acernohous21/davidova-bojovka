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
    teaser: 'Někdo s plameňákem kolem pasu a kachničkou v kapse.',
  },
  {
    id: 'eliska',
    name: 'Eliška',
    role: 'Kormidelnice',
    icon: '☸️',
    birthday: '2004-06-22',
    skill: 'Proplete loď mezi útesy. Za bezvětří fouká do plachet fénem.',
    weakness: 'Natáčky. Bez nich nevyplouvá.',
    teaser: 'Někdo s natáčkami a fénem v ruce.',
  },
  {
    id: 'kuba',
    name: 'Kuba',
    role: 'Radista',
    icon: '🍌',
    birthday: '2004-01-05',
    skill: 'Spojení s celým světem přes banán.',
    weakness: 'Když dostane hlad, spojení končí.',
    teaser: 'Někdo v kapuci drží u ucha… banán?',
  },
  {
    id: 'adam',
    name: 'Adam',
    role: 'Navigátor',
    icon: '🧭',
    birthday: '2004-06-07',
    skill: 'Vždycky ví, kde je sever.',
    weakness: 'Neví, kde je jih. Racek na rameni taky ne.',
    teaser: 'Někdo s dalekohledem z ruličky od toaleťáku.',
  },
  {
    id: 'tom',
    name: 'Tom',
    role: 'Dělostřelec',
    icon: '💥',
    birthday: '2003-12-25',
    skill: 'Střílí dřív, než se zeptá.',
    weakness: 'Přes růžové brýle vidí svět moc růžově.',
    teaser: 'Někdo v růžových brýlích s něčím, co hodně střílí.',
  },
  {
    id: 'lucka',
    name: 'Lucka',
    role: 'Lodní kuchařka',
    icon: '🥄',
    birthday: '2004-02-19',
    skill: 'S vařečkou uvaří cokoliv. I medvídka.',
    weakness: 'Nikdo neví, jestli je ten medvídek mazlíček, nebo zásoba na zimu.',
    teaser: 'Někdo s vařečkou a svázaným medvídkem.',
  },
  {
    id: 'dejv',
    name: 'Dejv',
    role: 'Šermíř',
    icon: '⚔️',
    birthday: '2003-11-13',
    skill: 'Šavle + brýle = dvojnásobná přesnost.',
    weakness: 'Bez rukávků do vody nevleze.',
    teaser: 'Někdo v havajské košili mává šavlí.',
  },
  {
    id: 'maja',
    name: 'Mája',
    role: 'Hlídka na stěžni',
    icon: '🔦',
    birthday: '2004-05-22',
    skill: 'Vidí ve tmě. Čelovka nikdy nezhasne.',
    weakness: 'Klepač na koberce považuje za zbraň.',
    teaser: 'Někdo s čelovkou a klepačem na koberce.',
    optional: true,
  },
]

export const CREW_BY_ID = Object.fromEntries(CREW.map((c) => [c.id, c])) as Record<CrewId, CrewMember>

export function crewPhoto(id: CrewId): string {
  return `${import.meta.env.BASE_URL}crew/${id}.jpg`
}
