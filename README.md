# 🏴‍☠️ Kapitán David – Cesta za pokladem

Narozeninová pirátská hra pro Davida (mobilní web, iPhone). Scénář a plán večera jsou v [SCENAR.md](SCENAR.md).

Trasa: doma → Modrá vopice → cestou na metro (Somálsko) → metro → hospoda na Národní → sídlo Pirátské strany → Karlák → Náplavka → hospoda (finále).

Stack: Vite, React, TypeScript, Tailwind, framer-motion. Stav hry se ukládá do `localStorage` (klíč `kapitan-david-v4`), takže po zavření appky hra pokračuje, kde skončila.

## Spuštění

```bash
npm install
npm run dev
```

Build: `npm run build`. Workflow v `.github/workflows/deploy.yml` nasadí appku na GitHub Pages po pushi do `main`.

## Pro posádku

- **PIN:** `7777` (změna v `src/data/config.ts`). Chce ho hodnocení IRL výzev (0 / 50 / 100 %) a admin.
- **Admin:** podrž lebku ☠️ vlevo nahoře (~1 s). Skok na kapitolu, přeskočení kroku, ± velbloudi, žolíky, vynulování cooldownů soubojů, reset.
- **⚓ vpravo nahoře:** posádka, žolíky, kodex se zakázanými slovy, lodní deník.
- **Souboje (PvP):** od prvního náboru David vyzývá posádku přes ⚓ → Posádka → klepnout na člena. Když vyhraje, člen pije. Cooldown 30 min na člena. Hry jsou v `DUEL_GAMES` v `src/data/config.ts`.
- **Láhvová pošta:** na papírek patří hádanka, odpověď je heslo (velikost písmen a diakritika nevadí):
  1. Doma: „Štěpán ti řekl, kam se máš vrátit. Zpátky na…“ → `STROMY`
  2. Krčma na Národní: „Kdo tě prodal pirátům za pivo, žejo?“ → `MAJKL`
  3. Po pasování: „Rum je pro suchozemce. Co pije pravý kapitán?“ → `WHISKY`
  4. Náplavka po vzpouře: „Tvůj oblíbený kolega.“ → `TYGI`

  Po 3 špatných pokusech appka ukáže hádanku jako nápovědu. Na papírek můžete připsat i číslici kódu truhly; `chestDigit` v `CONFIG.bottles` je jen poznámka, appka ho nepoužívá.
- **Offline:** appku otevři na Davidově mobilu doma na wifi. Po prvním načtení jede i v metru bez signálu.
- **iPhone:** náklon a třesení telefonem vyžadují HTTPS (GitHub Pages ho má) a povolení při první pohybové minihře. Každá taková minihra má i nouzové tlačítko.
- **Nová verze:** když se změní pořadí kroků v příběhu, zvedni klíč `STORAGE_KEY` v `src/state/game.tsx`, jinak by uložený postup ukazoval na špatný krok.

## Kde co upravit

| Co | Soubor |
|---|---|
| Texty příběhu, pořadí kroků, odměny | `src/data/story.ts` |
| Posádka, role, narozeniny | `src/data/crew.ts` |
| Fotky posádky | `public/crew/<id>.jpg` |
| PIN, hesla a hádanky, věno, žolíky, kodex, záchranné výzvy, hry na souboje | `src/data/config.ts` |
| IRL výzvy (texty a odměny) | `src/data/story.ts` (kroky `type: 'irl'`) |
| Minihry v příběhu | `src/games/` |
| Náborové minihry | `src/games/recruit/` |
| Souboje s posádkou (PvP) | `src/components/Duel.tsx` |
| Obrazovky kroků (text, hovor, láhev, finále…) | `src/components/steps/` |
