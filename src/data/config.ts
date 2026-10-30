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
   * Pořadí podle míst: 1 doma, 2 krčma na Národní, 3 po pasování, 4 Náplavka.
   * chestDigit = číslice kódu truhly na papírku, jen poznámka pro posádku (appka ji nepoužívá).
   */
  bottles: {
    1: { riddle: 'Štěpán ti řekl, kam se máš vrátit. Zpátky na…', code: 'STROMY', chestDigit: '?' },
    2: { riddle: 'Kdo tě prodal pirátům za pivo, žejo?', code: 'MAJKL', chestDigit: '?' },
    3: { riddle: 'Rum je pro suchozemce. Co pije pravý kapitán?', code: 'WHISKY', chestDigit: '?' },
    4: { riddle: 'Tvůj oblíbený kolega.', code: 'TYGI', chestDigit: '?' },
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
    text: 'Výzvu přeskočíš, ale koupíš posádce rundu. Odměna 0 🐪.',
    mult: 0,
  },
}

/** PvP souboje s naverbovanou posádkou (od prvního náboru). Prohraný člen posádky pije. */
export const DUEL_COOLDOWN_MIN = 30

export const DUEL_GAMES: { icon: string; title: string; rules: string }[] = [
  { icon: '✊', title: 'Kámen, nůžky, papír', rules: 'Klasika. Hraje se na 2 vítězná kola.' },
  { icon: '👍', title: 'Palcová válka', rules: 'Chyťte se za prsty, palce nahoru. Kdo přimáčkne soupeřův palec a udrží ho 3 vteřiny, vyhrál.' },
  { icon: '🖐️', title: 'Lichá, nebo sudá', rules: 'Soupeř si tipne lichou, nebo sudou. Na „tři“ oba ukážete 0–5 prstů a sečtete je. Kdo uhodl, má bod. Na 2 vítězná kola.' },
  {
    icon: '🔢',
    title: 'Kdo řekne 21',
    rules: 'Počítáte nahlas od jedničky a střídáte se. Když jsi na řadě, řekneš jedno, dvě, nebo tři další čísla (třeba „4, 5, 6“). Kdo musí říct 21, prohrál. Začíná soupeř.',
  },
  { icon: '🍺', title: 'Kategorie', rules: 'Soupeř vybere kategorii (alkohol, pražské hospody, piráti…). Střídavě jmenujete věci z ní. Kdo zaváhá přes 5 vteřin nebo něco zopakuje, prohrál.' },
  { icon: '🔤', title: 'Slovní fotbal', rules: 'Každé slovo musí začínat posledním písmenem předchozího. Kdo zaváhá přes 5 vteřin nebo zopakuje slovo, prohrál.' },
  { icon: '😐', title: 'Nesměj se', rules: '30 vteřin se ho snažíš rozesmát, pak se role prohodí. Kdo se zasměje první, prohrál.' },
  { icon: '👋', title: 'Plácaná', rules: 'Natáhněte proti sobě ruce dlaněmi k sobě. Útočník se snaží plácnout soupeře přes ruce, ten uhýbá. Při minutí se role prohodí. Kdo první dá 3 zásahy, vyhrál.' },
  { icon: '🔫', title: 'Rychlé tasení', rules: 'Stoupněte si zády k sobě, ruce podél těla. Někdo z posádky odpočítá a v náhodnou chvíli zařve „TEĎ!“. Kdo se první otočí, namíří prstovou pistolí a řekne „PIF!“, vyhrál. Na 2 vítězná kola.' },
  { icon: '🦜', title: 'ARRR!', rules: 'Střídavě počítáte od jedničky. Místo každého čísla dělitelného 7 nebo s číslicí 7 (7, 14, 17…) musíš zařvat „ARRR!“. Kdo se splete nebo zaváhá, prohrál.' },
]

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
