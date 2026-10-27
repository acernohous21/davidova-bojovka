export const CONFIG = {
  hero: 'David',
  appTitle: 'Kapitán David',
  subtitle: 'Cesta za pokladem',

  /** PIN posádky (hodnocení výzev + admin přes dlouhé podržení lebky). */
  pin: '7777',

  /** Věno za Esmeraldu (ve velbloudech). */
  dowry: 100,

  /** Kolik velbloudů dostane za každého naverbovaného člena posádky. */
  recruitReward: 1,

  /**
   * Láhvová pošta – na opáleném papírku je hádanka, odpověď je heslo.
   * Na papírek patří i číslice do truhly.
   */
  bottles: {
    1: { riddle: 'Šéf ti řekl, kam se máš vrátit. Zpátky na…', code: 'STROMY', chestDigit: '?' },
    2: { riddle: 'Rum je pro suchozemce. Co pije pravý kapitán?', code: 'WHISKY', chestDigit: '?' },
    3: { riddle: 'Kdo tě prodal pirátům za pivo, žejo?', code: 'MAJKL', chestDigit: '?' },
    4: { riddle: 'Kdo nikdy nezapomíná?', code: 'TYGI', chestDigit: '?' },
  } as Record<number, { riddle: string; code: string; chestDigit: string }>,

  jokers: { parrot: 1, exemption: 1, ransom: 1 },

  forbiddenWords: ['práce', 'meeting', 'issue', 'Štěpán', 'deadline'],
}

export type JokerId = keyof typeof CONFIG.jokers

export const JOKER_META: Record<JokerId, { icon: string; label: string; text: string; mult: number }> = {
  parrot: {
    icon: '🦜',
    label: 'Papoušek',
    text: 'Výzvu plníš s někým z posádky. Odměna ×0,5.',
    mult: 0.5,
  },
  exemption: {
    icon: '📜',
    label: 'Kaperská výjimka',
    text: 'Výzvu vyměníš za záchrannou z lodního deníku. Odměna ×0,75.',
    mult: 0.75,
  },
  ransom: {
    icon: '💰',
    label: 'Výkupné',
    text: 'Výzvu přeskočíš, ale koupíš posádce rundu. Odměna 0 $.',
    mult: 0,
  },
}

export const RESCUE_TASKS = [
  'Nauč cizího člověka pirátský pozdrav („ARRR!“ + mávnutí šavlí) a nech ho ho předvést.',
  'Zazpívej s posádkou nahlas jednu sloku Wellermana. Venku. Před lidmi.',
  'Nech si od cizího člověka vymyslet pirátskou přezdívku. Posádka tě tak bude oslovovat do konce večera.',
  'Pozdrav 3 kolemjdoucí: „Ahoj, suchozemci!“ a ukloň se.',
  'Vyfoť se s někým v halloweenském kostýmu tak, že jsi jeho zajatec.',
]

export const PIRATE_CODE = [
  'Nikdy už nepůjdu na meeting, radši půjdu zpátky na stromy.',
  'Issue je vždycky high. Nikdy low.',
  'Hrad bude mít tak 6-7 věží.',
  'Na mé lodi se pije whisky. Rum je pro suchozemce.',
  'Kdo řekne „zpátky na stromy“, jde na prkno.',
  'Posádku nikdy nezradím. Ani za pivo od Majkla Punka.',
  'Poklad se dělí spravedlivě: kapitán si vezme, kolik chce, posádka zbytek.',
]
