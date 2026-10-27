import type { CrewId } from './crew'

/**
 * Celý příběh jako seznam kroků (obrazovek). Texty klidně přepisuj.
 *
 * V textech fungují zástupky: {ship} = jméno lodi, {rival} = jméno soupeře.
 *
 * Typy kroků:
 *  - chapter   úvodní obrazovka kapitoly
 *  - arrive    „Dorazili jste na místo?“ – brzda, aby David nečetl dopředu
 *  - text      jedna obrazovka textu
 *  - say       replika postavy (bublina s avatarem)
 *  - call      příchozí hovor (vyzvánění, zvednout)
 *  - choice    volba z tlačítek
 *  - game      minihra (reward = max 🐪 za ni)
 *  - recruit   verbování člena posádky (minihra + karta)
 *  - irl       velká výzva v reálu, hodnotí posádka
 *  - bottle    láhvová pošta: panák + hádanka na papírku, odpověď = heslo
 *  - input     David něco zadá (jméno lodi, jméno soupeře)
 *  - dowry     poprvé ukáže ukazatel věna
 *  - payoff    finále: posádka se složí na zbytek věna
 *  - treasure  poklad + lodní deník
 */

export type Speaker = 'stepan' | 'majkl' | 'tygi' | 'esmeralda' | 'otec' | 'rival' | 'david' | 'crew'

export type GameId =
  | 'meeting'
  | 'jobs'
  | 'drunk'
  | 'shells'
  | 'dodge'
  | 'grab'
  | 'shout'
  | 'swim'
  | 'hustle'
  | 'haggle'
  | 'interview'
  | 'mutiny'
  | 'battle'

export type RecruitGameId = 'banana' | 'compass' | 'sword' | 'ducks' | 'cannon' | 'reef' | 'kitchen' | 'lookout'

export type Effect = 'shake' | 'flash' | 'confetti' | 'buzz' | 'splash' | 'gunfire' | 'blackout' | 'hearts'

export type StoryStep =
  | { type: 'chapter'; num: string; title: string; place?: string }
  | { type: 'arrive'; place: string; text: string; icon?: string }
  | { type: 'text'; text: string; style?: 'normal' | 'shout' | 'whisper' | 'note'; effect?: Effect }
  | { type: 'say'; who: Speaker; text: string; effect?: Effect }
  | { type: 'call'; who: Speaker; caller: string }
  | { type: 'choice'; prompt: string; options: { label: string; reply?: string }[] }
  | { type: 'game'; game: GameId; title: string; reward?: number; variant?: 'finale' }
  | { type: 'recruit'; who: CrewId; game: RecruitGameId }
  | { type: 'irl'; id: string; title: string; text: string; reward: number; extra?: 'kodex' }
  | { type: 'bottle'; n: number; text: string }
  | { type: 'input'; key: 'shipName' | 'rivalName'; prompt: string; placeholder: string; button: string }
  | { type: 'dowry' }
  | { type: 'payoff' }
  | { type: 'treasure' }

export const SPEAKERS: Record<Speaker, { name: string; icon: string; color: string }> = {
  stepan: { name: 'Štěpán', icon: '👔', color: '#7aa7d9' },
  majkl: { name: 'Majkl Punk', icon: '🤘', color: '#ff5a45' },
  tygi: { name: 'Kapitán Tygi', icon: '🏴‍☠️', color: '#e0b04a' },
  esmeralda: { name: 'Esmeralda', icon: '🔮', color: '#d58cff' },
  otec: { name: 'Esmeraldin otec', icon: '🐪', color: '#c9a36b' },
  rival: { name: 'Soupeřův kapitán', icon: '☠️', color: '#ff8a5c' },
  david: { name: 'David', icon: '🧔', color: '#8fd3d8' },
  crew: { name: 'Posádka', icon: '👥', color: '#ddc89c' },
}

export const STEPAN_QUOTES = [
  'No jako… moc tomu nerozumím.',
  'Proč je to high issue? Vždyť to je low. Max medium.',
  'Já nemám patent na rozum.',
  'To není apriori ten problém.',
  'Ale já chápu, co tím myslíš… ale jako to je přece chyba komerčky, ne naše.',
  'Já po tobě nechci, abys postavil dům. Chci, abys postavil bagr, kterým pak kluci, Míra a Koudy, budou ten dům stavět.',
  'Měl bys radši auto, co dobře vypadá, nebo auto, co je bezpečný a nejezdí?',
  'Já ti řeknu, ať postavíš hrad, a pak ti stejně řeknu, že tam chci dvě věže místo jedný.',
  'No a Raiffka si pak řekne, že tam chce tohle.',
  'Chápeš mě, jo?',
  'Tak. Zpátky na stromy.',
]

export const STORY: StoryStep[] = [
  // ───────────── Kapitola I – Issue meeting ─────────────
  { type: 'chapter', num: 'Kapitola I', title: 'Issue meeting', place: 'Doma' },
  { type: 'text', text: 'Sobota. Tvoje narozeniny.' },
  { type: 'text', text: 'Dneska nic. Žádná práce, žádné tickety. Jen pivo s kámošema.' },
  {
    type: 'text',
    style: 'note',
    text: '(Tahle hra je fikce. Při její výrobě nebyla poškozena žádná skutečná firma. Štěpán je ve skutečnosti skvělý šéf. Asi.)',
  },
  { type: 'text', text: 'Bzzz. Bzzz.', style: 'shout', effect: 'buzz' },
  { type: 'text', text: 'Teams. Příchozí hovor. Sobota, šest večer.' },
  { type: 'say', who: 'stepan', text: 'Čau Davide, máš chvilku? Je issue.' },
  {
    type: 'choice',
    prompt: 'Co uděláš?',
    options: [
      { label: 'Vezmu to', reply: 'Bereš to. Samozřejmě, že to bereš.' },
      { label: 'Mám narozeniny, Štěpáne', reply: 'Štěpán: „Super, všechno nejlepší. Tak se připoj, bude to pět minut.“ (Nebude.)' },
    ],
  },
  { type: 'game', game: 'meeting', title: 'Issue meeting' },
  { type: 'text', text: 'Zavěsil jsi. Poprvé v životě jsi zavěsil šéfovi.' },
  { type: 'text', text: 'Skvělý pocit. Vydržel asi čtyři vteřiny.' },
  { type: 'text', text: 'Pak ti dojde, že potřebuješ novou práci.' },
  { type: 'game', game: 'jobs', title: 'Hledání práce' },
  { type: 'text', text: 'Nic. Nikde. V IT tě nikdo nechce.' },
  { type: 'text', text: 'Zbývá jediné místo, kam teď můžeš jít.' },
  { type: 'text', text: 'Modrá vopice.', style: 'shout', effect: 'flash' },
  { type: 'text', style: 'note', text: '(Obleč si bundu. Teď vážně odcházíme.)' },
  { type: 'bottle', n: 1, text: 'Ve dveřích ti někdo podá lahvičku. Uvnitř je srolovaný, ohořelý papírek. Na cestu se to bude hodit.' },
  { type: 'game', game: 'drunk', title: 'Cesta do Vopice' },

  // ───────────── Kapitola II – Majkl Punk ─────────────
  { type: 'arrive', place: 'Modrá vopice', icon: '🍺', text: 'Jdi dovnitř, sedni si k baru a objednej si pivo. Až budeš sedět, klepni.' },
  { type: 'chapter', num: 'Kapitola II', title: 'Majkl Punk', place: 'Modrá vopice' },
  { type: 'text', text: 'Sedíš u baru. Koukáš do pěny. Pěna kouká na tebe.' },
  { type: 'text', text: 'Vedle tebe si někdo přisedne. Najednou je cítit pivo, cigára a… punk.' },
  { type: 'say', who: 'majkl', text: 'Hehehehehe. Nazdar Davide, doprdele, jak se máš, žejo?' },
  {
    type: 'choice',
    prompt: 'Co odpovíš?',
    options: [{ label: 'Jsem bez práce.' }, { label: 'Jsem bez práce.' }],
  },
  { type: 'say', who: 'majkl', text: 'Bez práce? Doprdele. Ta firma, kde jsi dělal, to jsou zkurvysyni, žejo. Zkurvysyni, doprdele. Hehehe.' },
  { type: 'say', who: 'majkl', text: 'Pojď, dáme pivo. Já zvu, žejo.' },
  { type: 'text', text: 'Majkl Punk zve. To se nestává. To je podezřelé.' },
  { type: 'game', game: 'shells', title: 'Pivo od Majkla' },
  { type: 'say', who: 'majkl', text: 'Na zdraví, žejo! Hehehe.' },
  { type: 'text', text: 'Napiješ se. Pivo chutná trochu… hořce.' },
  { type: 'text', text: 'Za tebou se objeví dva obrovští chlapi. Gorily.', effect: 'shake' },
  { type: 'say', who: 'majkl', text: 'Sorry Davide. Ale mám dluhy, žejo. Banka zkurvená. Hahahahaha.' },
  { type: 'text', text: '…', style: 'whisper', effect: 'blackout' },

  // ───────────── Někde u Somálska ─────────────
  { type: 'chapter', num: 'O tři dny později', title: 'Někde u Somálska' },
  { type: 'text', text: 'Houpání. Sůl. Hlava jako střep.' },
  { type: 'text', text: 'Ležíš na palubě nákladní lodi. Kolem dokola jen moře.' },
  { type: 'text', text: 'RA-TA-TA-TA-TA!', style: 'shout', effect: 'gunfire' },
  { type: 'text', text: 'Loď právě přepadli piráti. Somálští piráti.' },
  { type: 'game', game: 'dodge', title: 'Přestřelka' },
  { type: 'text', text: 'Stejně tě chytili. Všechny rukojmí naženou na palubu.' },
  { type: 'say', who: 'tygi', text: 'Já jsem kapitán Tygi. A teď vám ukážu, jak dopadne každý, kdo nebude spolupracovat.' },
  { type: 'text', text: 'Kapitán Tygi tě chytí za límec a vede tě na prkno.' },
  { type: 'say', who: 'tygi', text: 'Běž, ty suchozemská kryso! Plav domů!' },
  { type: 'game', game: 'grab', title: 'Prkno' },
  { type: 'text', text: 'ŠPLOUCH!', style: 'shout', effect: 'splash' },
  { type: 'text', text: 'Kapitán Tygi letí přes palubu.' },
  { type: 'text', text: 'Celá pirátská posádka na tebe zírá. Je čas na proslov.' },
  { type: 'game', game: 'shout', title: 'Proslov' },
  { type: 'text', text: 'Ticho. Pak jeden šplouch. Druhý. Třetí.' },
  { type: 'text', text: 'Všichni piráti skáčou přes palubu za svým kapitánem.' },
  { type: 'say', who: 'tygi', text: '(z vody) Ještě se potkáme, Davide! TYGI NEZAPOMÍNÁ!' },
  { type: 'text', text: 'Loď je tvoje. Jenže ty neumíš řídit nákladní loď.' },
  { type: 'text', text: 'Najedeš na mělčinu kousek od pobřeží. Zbytek musíš doplavat.' },
  { type: 'game', game: 'swim', title: 'Ke břehu' },
  { type: 'text', text: 'Somálská pláž. Jsi mokrý, bez bot a bez peněz.' },
  { type: 'text', text: 'Na kameni u vody sedí žena v barevném šátku. Míchá karty. Kouká přímo na tebe.' },
  { type: 'say', who: 'esmeralda', text: 'Pojď sem, cizinče. Dej mi ruku. Esmeralda ti řekne budoucnost.' },
  { type: 'text', text: 'Podáš jí ruku. Dlouho ji hladí. Moc dlouho.' },
  { type: 'say', who: 'esmeralda', text: 'Vidím… poklad. Velký poklad. A vidím svatbu. Naši.' },
  { type: 'text', text: 'Bum. Bum. Bum. To je tvoje srdce.', style: 'shout', effect: 'hearts' },
  { type: 'text', text: 'Zamiloval ses. Na místě. Na somálské pláži. Do kartářky.' },
  { type: 'text', text: 'A pak ti to dojde: domů se stejně nedostaneš. Nemáš práci, peníze ani pas.' },
  { type: 'text', text: 'A vlastně proč by ses vracel? Na Štěpána? Na issue meetingy?' },
  { type: 'text', text: 'Zůstaneš. Tady. S Esmeraldou.', style: 'shout' },
  { type: 'text', text: 'Za Esmeraldou se objeví obrovský chlap s holí. Ještě větší než gorily.', effect: 'shake' },
  { type: 'say', who: 'otec', text: 'Moje dcera? Stojí 100 velbloudů. Ani o kopyto míň.' },
  { type: 'dowry' },
  { type: 'text', text: 'Nemáš ani kozu. A práci tu taky neseženeš. Natož v IT.' },
  { type: 'text', text: 'Zbývá jediné řemeslo. To nejstarší.' },
  {
    type: 'choice',
    prompt: 'Opravdu?',
    options: [
      { label: 'Ne…', reply: 'Ano.' },
      { label: 'Ano.', reply: 'Ano.' },
    ],
  },
  { type: 'game', game: 'hustle', title: 'Nejstarší řemeslo' },
  { type: 'say', who: 'otec', text: 'Koza není velbloud.' },
  { type: 'text', text: 'Takhle to nepůjde. Takhle budeš kozy sbírat do smrti.' },
  { type: 'text', text: 'Vzpomeneš si na loď. Na střelbu. Na Tygiho, jak letí přes palubu.' },
  { type: 'text', text: 'Stanu se pirátem.', style: 'shout', effect: 'flash' },
  {
    type: 'irl',
    id: 'vopice',
    title: 'Pirátská objednávka',
    text: 'Jdi k baru a objednej posádce rundu somálským pirátským přízvukem. Celou objednávku musíš v přízvuku vydržet. Pak se otoč k hospodě, zvedni sklenici a zařvi: „Na svobodu, vy suchozemský krysy!“',
    reward: 10,
  },

  // ───────────── Kapitola III – Majkl se vrací ─────────────
  { type: 'chapter', num: 'Kapitola III', title: 'Majkl se vrací', place: 'Cestou' },
  { type: 'text', style: 'note', text: '(Platí se a jde se. Další zastávka: Pirátská strana. Cestou ti někdo zavolá.)' },
  { type: 'call', who: 'majkl', caller: 'Majkl Punk 🤘' },
  { type: 'say', who: 'majkl', text: 'Hehehe, Davide, ty žiješ, doprdele! Ty piráti mi za tebe nezaplatili, zkurvení, žejo. Tak jsem tady v Somálsku taky.' },
  { type: 'say', who: 'majkl', text: 'Vyhrál jsem od nich v kartách loď, žejo. Starou, rezavou. Ale funguje, doprdele.' },
  { type: 'say', who: 'majkl', text: 'Jenže já na moři blinkám, žejo. Tak ti ji prodám. Je mi tě líto, hehehe.' },
  { type: 'game', game: 'haggle', title: 'Smlouvání' },
  { type: 'say', who: 'majkl', text: 'Loď kotví na Náplavce, žejo. Ale bacha, je nepokřtěná, doprdele. Nepokřtěná loď nepluje. To ví každej. Hehehe.' },
  { type: 'text', text: 'Hovor skončil. Majkl ti ještě poslal hlasovku, kde se 47 vteřin jen směje.' },
  { type: 'text', text: 'Máš loď. Ale nemáš posádku.' },
  { type: 'text', text: 'Rozhlédni se kolem sebe. Ti lidi vypadají jako… piráti?' },
  { type: 'recruit', who: 'matej', game: 'ducks' },
  { type: 'recruit', who: 'eliska', game: 'reef' },
  { type: 'recruit', who: 'kuba', game: 'banana' },

  // ───────────── Kapitola IV – Pasování na kapitána ─────────────
  { type: 'arrive', place: 'Sídlo Pirátské strany', icon: '🏛️', text: 'Až budete stát před sídlem Pirátů, klepni.' },
  { type: 'chapter', num: 'Kapitola IV', title: 'Pasování na kapitána', place: 'Sídlo Pirátské strany' },
  { type: 'text', text: 'Pirát bez papírů je jen obyčejný zloděj. Potřebuješ pirátskou licenci.' },
  { type: 'text', text: 'A kde jinde ji dostat než tady.' },
  { type: 'game', game: 'interview', title: 'Přijímací pohovor', reward: 3 },
  {
    type: 'irl',
    id: 'pasovani',
    title: 'Pasování na kapitána',
    text: 'Přesvědč cizího člověka, aby tě tady pasoval na kapitána. Posádka ti půjčí šavli. Klekni si, nech se pasovat a nahlas přečti Pirátský kodex. Kapitán musí přísahat.',
    reward: 12,
    extra: 'kodex',
  },
  { type: 'text', text: 'Kapitán David!', style: 'shout', effect: 'confetti' },
  { type: 'text', style: 'note', text: '(Posádka ti teď předá kapitánský klobouk. Sundat se smí až doma.)' },
  { type: 'text', text: 'Kapitán s licencí přitahuje další piráty.' },
  { type: 'recruit', who: 'adam', game: 'compass' },
  { type: 'recruit', who: 'tom', game: 'cannon' },
  { type: 'bottle', n: 2, text: 'Kapitán si zaslouží přípitek. Posádka ti podá další láhvovou poštu.' },

  // ───────────── Kapitola V – Skutečná posádka ─────────────
  { type: 'arrive', place: 'Karlovo náměstí', icon: '⛲', text: 'Až budete na Karláku, klepni.' },
  { type: 'chapter', num: 'Kapitola V', title: 'Skutečná posádka', place: 'Karlák' },
  { type: 'text', text: 'Tvoje posádka je fajn. Ale na pořádnou pirátskou loď potřebuješ víc lidí. Cizích. Neznámých. Skutečných.' },
  {
    type: 'irl',
    id: 'karlak',
    title: 'Nábor',
    text: 'Vyfoť se s aspoň 4 cizími lidmi v pirátské póze. Všichni musí zařvat „ARRR!“. Bonus: přesvědč je, aby ti řekli „kapitáne“.',
    reward: 15,
  },
  { type: 'text', text: 'Zpráva o novém kapitánovi se šíří. Z davu se oddělí další, kteří se chtějí přidat.' },
  { type: 'recruit', who: 'lucka', game: 'kitchen' },
  { type: 'recruit', who: 'dejv', game: 'sword' },
  { type: 'recruit', who: 'maja', game: 'lookout' },

  // ───────────── Kapitola VI – Křest lodi ─────────────
  { type: 'arrive', place: 'Náplavka', icon: '⚓', text: 'Až budete u vody na Náplavce, klepni.' },
  { type: 'chapter', num: 'Kapitola VI', title: 'Křest lodi', place: 'Náplavka' },
  { type: 'text', text: 'Tady je. Tvoje loď. Rezavá, trochu nakloněná, z komína se kouří. Krásná.' },
  { type: 'text', text: 'Jenže Majkl říkal: nepokřtěná loď nepluje.' },
  {
    type: 'irl',
    id: 'krest',
    title: 'Křest lodi',
    text: 'Dostaň se na palubu jedné z lodí tady na Náplavce. Najdi cizího člověka, který bude kmotr nebo kmotra. Kmotr lodi vymyslí jméno a pokřtí ji kapkou whisky. Posádka tleská, někdo natáčí.',
    reward: 15,
  },
  { type: 'input', key: 'shipName', prompt: 'Jak loď pokřtil kmotr?', placeholder: 'Jméno lodi', button: 'Zapsat do lodního deníku' },
  { type: 'text', text: 'Loď {ship} je pokřtěná!', style: 'shout', effect: 'confetti' },
  { type: 'text', text: 'Jenže posádka si šeptá. Někdo brousí šavli. Někdo fénuje.' },
  { type: 'say', who: 'crew', text: 'Kde je ten poklad, kapitáne? Jsi vůbec dobrej kapitán? Víš o nás vůbec něco?' },
  { type: 'text', text: 'VZPOURA!', style: 'shout', effect: 'shake' },
  { type: 'game', game: 'mutiny', title: 'Vzpoura' },
  { type: 'text', text: 'Posádka je zase tvoje. Ti, co jsi trefil, nadšeně. Ostatní aspoň opilí.' },
  { type: 'bottle', n: 3, text: 'Na usmířenou koluje další láhvová pošta.' },
  { type: 'text', text: 'Esmeralda ti posílá zprávu po rackovi: „Poklad je blízko. V hospodě. Ale bacha, nejsi jediný, kdo ho hledá.“' },

  // ───────────── Kapitola VII – Bitva o poklad ─────────────
  { type: 'arrive', place: 'Hospoda', icon: '🍻', text: 'Vyberte hospodu. Je tam poklad. A taky nepřítel. Až budete sedět, klepni.' },
  { type: 'chapter', num: 'Kapitola VII', title: 'Bitva o poklad', place: 'Hospoda' },
  { type: 'text', text: 'Poklad je blízko. Cítíš to v kostech. A v játrech.' },
  { type: 'text', text: 'Jenže v hospodě kotví soupeřova loď. Její kapitán jde po stejném pokladu.', effect: 'shake' },
  { type: 'text', text: 'Rozhlédni se po hospodě. Kdo z hostů je soupeřův kapitán? Vyber si ho.' },
  { type: 'input', key: 'rivalName', prompt: 'Jdi za ním a zeptej se ho na jméno.', placeholder: 'Jméno soupeře', button: 'To je on!' },
  { type: 'say', who: 'rival', text: 'Jo, jsem {rival}. A ten poklad je můj, suchozemče.' },
  { type: 'game', game: 'battle', title: 'Námořní bitva', reward: 4 },
  {
    type: 'irl',
    id: 'paka',
    title: 'Souboj kapitánů',
    text: 'Vyzvi soupeře ({rival}) na souboj v páce. O rundu. Kapitán proti kapitánovi. Posádka fandí.',
    reward: 20,
  },
  { type: 'text', text: 'Bitva skončila. {ship} kotví u pokladu.', style: 'shout', effect: 'confetti' },
  { type: 'bottle', n: 4, text: 'Poslední láhvová pošta. Pij pomalu, kapitáne.' },

  // ───────────── Finále ─────────────
  { type: 'chapter', num: 'Finále', title: 'Věno', place: 'Hospoda' },
  { type: 'payoff' },
  { type: 'say', who: 'otec', text: 'Sto velbloudů. Spočítáno. Hm. Dobře.' },
  { type: 'text', text: 'Otec převezme velbloudy a odvede je ven. Ani se neotočí.' },
  { type: 'say', who: 'esmeralda', text: 'Konečně, cizinče. Věno je zaplacené. A teď… ten poklad.' },
  { type: 'text', text: 'Esmeralda přistoupí blíž. Usměje se. Ten úsměv odněkud znáš…' },
  { type: 'text', text: 'Strhne si šátek.', style: 'shout', effect: 'shake' },
  { type: 'text', text: 'JE TO TYGI!', style: 'shout', effect: 'flash' },
  { type: 'say', who: 'tygi', text: 'Myslel sis, že mě moře spolkne, Davide? Celou dobu jsem to byl já. Věštba, svatba, všechno.' },
  { type: 'say', who: 'tygi', text: 'Potřeboval jsem někoho, kdo pro mě najde poklad. A ty jsi byl tak zamilovanej… hahaha.' },
  { type: 'say', who: 'tygi', text: 'A „otec“? To je můj kormidelník. Velbloudy už žene pryč. Tygi nezapomíná!' },
  { type: 'game', game: 'grab', title: 'Prkno podruhé', variant: 'finale' },
  { type: 'text', text: 'ŠPLOUCH!', style: 'shout', effect: 'splash' },
  { type: 'text', text: 'Tygi letí přes palubu. Podruhé. Tentokrát i s velbloudy.' },
  { type: 'text', text: 'A poklad? Ten si Tygi nevymyslel. Ten je skutečný.' },
  { type: 'treasure' },
]

export const CHAPTERS: { label: string; step: number }[] = STORY.flatMap((s, i) =>
  s.type === 'chapter' ? [{ label: `${s.num} · ${s.title}`, step: i }] : [],
)

export function chapterAt(step: number): { num: string; title: string; place?: string } {
  for (let i = Math.min(step, STORY.length - 1); i >= 0; i--) {
    const s = STORY[i]
    if (s.type === 'chapter') return s
  }
  return { num: 'Prolog', title: 'Kapitán David' }
}
