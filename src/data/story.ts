import type { CrewId } from './crew'

/**
 * Celý příběh jako seznam kroků (obrazovek). Texty klidně přepisuj.
 *
 * V textech funguje zástupka {ship} = jméno lodi.
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
 *  - bottle    láhvová pošta: panák + hádanka na papírku, odpověď = heslo (hádanky v config.ts)
 *  - input     David něco zadá (jméno lodi)
 *  - dowry     poprvé ukáže ukazatel věna
 *  - pvp       upozornění, že od teď může David vyzývat posádku na souboje
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
  | 'deck'
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
  | { type: 'input'; key: 'shipName'; prompt: string; placeholder: string; button: string }
  | { type: 'dowry' }
  | { type: 'pvp' }
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
  // ───────────── Kapitola I – Páteční meeting ─────────────
  { type: 'chapter', num: 'Kapitola I', title: 'Páteční meeting', place: 'Doma' },
  { type: 'text', text: 'Sobota. Tvoje narozeniny.' },
  { type: 'text', text: 'Dneska nic. Žádná práce, žádné tickety. Jen pivo s kámošema.' },
  {
    type: 'text',
    style: 'note',
    text: '(Tahle hra je fikce. Při její výrobě nebyla poškozena žádná skutečná firma. Štěpán je ve skutečnosti skvělý šéf. Asi.)',
  },
  { type: 'text', text: 'Bzzz. Bzzz.', style: 'shout', effect: 'buzz' },
  { type: 'text', text: 'Teams. Příchozí hovor. Štěpán přesunul páteční meeting na sobotu. Na šestou večer.' },
  { type: 'say', who: 'stepan', text: 'Čau Davide, máš chvilku? Je máme tady jeden issue.' },
  {
    type: 'choice',
    prompt: 'Co uděláš?',
    options: [
      { label: 'Vezmu to', reply: 'Bereš to. Samozřejmě, že to bereš.' },
      { label: 'Mám narozeniny, Štěpáne', reply: 'Štěpán: „Super, všechno nejlepší. Tak se připoj, bude to pět minut.“ (Nebude.)' },
    ],
  },
  { type: 'game', game: 'meeting', title: 'Páteční meeting' },
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
  { type: 'text', style: 'note', text: '(Zatímco ležíš v bezvědomí: dopij, zaplať a vyraž s posádkou k metru. Další kapitolu hraješ cestou.)' },

  // ───────────── Někde u Somálska ─────────────
  { type: 'chapter', num: 'O tři dny později', title: 'Někde u Somálska', place: 'Cestou na metro' },
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
  { type: 'text', text: 'Celá pirátská posádka na tebe zírá. Ticho. Jen vítr a racci.' },
  { type: 'say', who: 'david', text: 'JSEM NEJVĚTŠÍ PIRÁT NA SVĚTĚ, VY MRDKY, A NIKDO SE NADE MNE POVYŠOVAT NEBUDE!' },
  { type: 'text', text: 'Piráti se na tebe vrhnou. Všichni najednou.', effect: 'shake' },
  { type: 'game', game: 'deck', title: 'Vyčisti palubu' },
  { type: 'text', text: 'Poslední dva piráti se na sebe podívají… a skočí přes palubu sami.' },
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
  { type: 'text', text: 'A vlastně proč by ses vracel? Na Štěpána? Na páteční meetingy?' },
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
  { type: 'text', text: 'Zbývá poslední možnost. Zavolat domů a poprosit o pomoc.' },
  {
    type: 'irl',
    id: 'volani',
    title: 'Fandovo volání o pomoc',
    text: 'Zavolej někomu známému (ne z posádky), dej hlasitý odposlech a úplně vážně řekni: „Hele, potřebuju pomoct. Zamiloval jsem se. Jmenuje se Esmeralda a chci si ji vzít. Jenže její táta chce věno… Nemáš náhodou 100 velbloudů? Vrátím.“ Nesmíš se zasmát a nesmíš vysvětlit, o co jde.',
    reward: 10,
  },
  { type: 'text', text: 'Nikdo ti velbloudy nepůjčil. Svět je krutý.' },
  { type: 'text', text: 'Vzpomeneš si na loď. Na střelbu. Na Tygiho, jak letí přes palubu.' },
  { type: 'text', text: 'Stanu se pirátem.', style: 'shout', effect: 'flash' },

  // ───────────── Kapitola III – Majkl se vrací ─────────────
  { type: 'chapter', num: 'Kapitola III', title: 'Majkl se vrací', place: 'Metro' },
  { type: 'text', style: 'note', text: '(Další zastávka: Národní třída. Cestou ti někdo zavolá.)' },
  { type: 'call', who: 'majkl', caller: 'Majkl Punk 🤘' },
  { type: 'say', who: 'majkl', text: 'Hehehe, Davide, ty žiješ, doprdele! Ty piráti mi za tebe nezaplatili, zkurvení, žejo. Tak jsem tady v Somálsku taky.' },
  { type: 'say', who: 'majkl', text: 'Vyhrál jsem od nich v kartách loď, žejo. Starou, rezavou. Ale funguje, doprdele.' },
  { type: 'say', who: 'majkl', text: 'Jenže já na moři blinkám, žejo. Tak ti ji prodám. Je mi tě líto, hehehe.' },
  { type: 'game', game: 'haggle', title: 'Smlouvání' },
  { type: 'say', who: 'majkl', text: 'Loď kotví na Náplavce, žejo. Ale bacha, je nepokřtěná, doprdele. Nepokřtěná loď nepluje. To ví každej. Hehehe.' },
  { type: 'text', text: 'Hovor skončil. Majkl ti ještě poslal hlasovku, kde se 47 vteřin jen směje.' },
  { type: 'text', text: 'Máš loď. Ale nemáš posádku.' },
  { type: 'text', text: 'Rozhlédni se kolem sebe. Ti lidi vypadají jako… piráti?' },
  { type: 'pvp' },
  { type: 'recruit', who: 'matej', game: 'ducks' },
  { type: 'recruit', who: 'kuba', game: 'banana' },
  { type: 'recruit', who: 'lucka', game: 'kitchen' },

  // ───────────── Kapitola IV – Pirátská krčma ─────────────
  { type: 'arrive', place: 'Národní třída', icon: '🍺', text: 'Vystupte na Národní a zapadněte do hospody, kterou vybere posádka. Až budeš sedět, klepni.' },
  { type: 'chapter', num: 'Kapitola IV', title: 'Pirátská krčma', place: 'Národní třída' },
  { type: 'text', text: 'Máš loď. Máš první posádku. Chybí už jen pořádná pirátská krčma.' },
  { type: 'text', text: 'Naštěstí zrovna v jedné sedíš.' },
  {
    type: 'irl',
    id: 'krcma',
    title: 'Pirátská objednávka',
    text: 'Jdi k baru a objednej posádce rundu somálským pirátským přízvukem. Celou objednávku musíš v přízvuku vydržet. Pak se otoč k hospodě, zvedni sklenici a zařvi: „Na svobodu, vy suchozemský krysy!“',
    reward: 10,
  },
  { type: 'bottle', n: 2, text: 'Na první loď a první posádku! Posádka ti podá láhvovou poštu.' },
  { type: 'text', style: 'note', text: '(Dopijte. Další zastávka: sídlo Pirátské strany.)' },

  // ───────────── Kapitola V – Pirátská licence ─────────────
  { type: 'arrive', place: 'Sídlo Pirátské strany', icon: '🏛️', text: 'Až budete stát před sídlem Pirátů, klepni.' },
  { type: 'chapter', num: 'Kapitola V', title: 'Pirátská licence', place: 'Sídlo Pirátské strany' },
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

  // ───────────── Kapitola VI – Kapitán David ─────────────
  { type: 'chapter', num: 'Kapitola VI', title: 'Kapitán David', place: 'Cestou na Karlák' },
  { type: 'text', text: 'Kapitán David!', style: 'shout', effect: 'confetti' },
  { type: 'text', style: 'note', text: '(Posádka ti teď předá kapitánský klobouk. Sundat se smí až doma.)' },
  { type: 'bottle', n: 3, text: 'Kapitán si zaslouží přípitek. Posádka ti podá další láhvovou poštu.' },
  { type: 'text', text: 'Kapitán s licencí přitahuje další piráty.' },
  { type: 'recruit', who: 'eliska', game: 'reef' },
  { type: 'recruit', who: 'dejv', game: 'sword' },
  { type: 'recruit', who: 'roman', game: 'lookout' },

  // ───────────── Kapitola VII – Skutečná posádka ─────────────
  { type: 'arrive', place: 'Karlovo náměstí', icon: '⛲', text: 'Až budete na Karláku, klepni.' },
  { type: 'chapter', num: 'Kapitola VII', title: 'Skutečná posádka', place: 'Karlák' },
  { type: 'text', text: 'Tvoje posádka je fajn. Ale na pořádnou pirátskou loď potřebuješ víc lidí. Cizích. Neznámých. Skutečných.' },
  {
    type: 'irl',
    id: 'karlak',
    title: 'Nábor',
    text: 'Vyfoť se s aspoň 4 cizími lidmi v pirátské póze. Všichni musí zařvat „ARRR!“. Bonus: přesvědč je, aby ti řekli „kapitáne“.',
    reward: 15,
  },
  { type: 'text', text: 'Zpráva o novém kapitánovi se šíří. Z davu se oddělí další, kteří se chtějí přidat.' },
  { type: 'recruit', who: 'tom', game: 'cannon' },
  { type: 'recruit', who: 'adam', game: 'compass' },

  // ───────────── Kapitola VIII – Křest lodi ─────────────
  { type: 'arrive', place: 'Náplavka', icon: '⚓', text: 'Až budete u vody na Náplavce, klepni.' },
  { type: 'chapter', num: 'Kapitola VIII', title: 'Křest lodi', place: 'Náplavka' },
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
  { type: 'bottle', n: 4, text: 'Na usmířenou koluje poslední láhvová pošta. Pij pomalu, kapitáne.' },
  { type: 'text', text: 'Esmeralda ti posílá zprávu po rackovi: „Poklad je blízko. V hospodě. Ale bacha, nejsi jediný, kdo ho hledá.“' },

  // ───────────── Kapitola IX – Bitva o poklad ─────────────
  { type: 'arrive', place: 'Hospoda', icon: '🍻', text: 'Vyberte hospodu. Je tam poklad. A taky nepřítel. Až budete sedět, klepni.' },
  { type: 'chapter', num: 'Kapitola IX', title: 'Bitva o poklad', place: 'Hospoda' },
  { type: 'text', text: 'Poklad je blízko. Cítíš to v kostech. A v játrech.' },
  { type: 'text', text: 'Jenže v hospodě kotví soupeřova loď. Její kapitán jde po stejném pokladu.', effect: 'shake' },
  { type: 'say', who: 'rival', text: 'Ten poklad je můj, suchozemče. Moje děla jsou větší než tvoje.' },
  { type: 'game', game: 'battle', title: 'Námořní bitva', reward: 4 },
  {
    type: 'irl',
    id: 'paka',
    title: 'Souboj kapitánů',
    text: 'Najdi v hospodě někoho, kdo vypadá jako kapitán, a vyzvi ho na souboj v páce. O rundu. Kapitán proti kapitánovi. Posádka fandí.',
    reward: 20,
  },
  { type: 'text', text: 'Bitva skončila. {ship} kotví u pokladu.', style: 'shout', effect: 'confetti' },

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
