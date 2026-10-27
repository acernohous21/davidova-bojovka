# 🏴‍☠️ Kapitán David – Cesta za pokladem

Narozeninová pirátská hra pro Davida. Scénář a plán večera jsou v [SCENAR.md](SCENAR.md).

## Spuštění

```bash
npm install
npm run dev
```

Build: `npm run build`. Workflow v `.github/workflows/deploy.yml` nasadí appku na GitHub Pages po pushi do `main`.

## Pro posádku

- **PIN:** `7777` (změna v `src/data/config.ts`). Chce ho hodnocení velkých výzev a admin.
- **Admin:** podrž lebku ☠️ vlevo nahoře (~1 s). Skok na kapitolu, přeskočení kroku, peníze, žolíky, vypnutí Máji, reset.
- **Láhvová pošta:** na papírek patří hádanka, odpověď je heslo (velikost písmen a diakritika nevadí):
  1. „Šéf ti řekl, kam se máš vrátit. Zpátky na…“ → `STROMY`
  2. „Rum je pro suchozemce. Co pije pravý kapitán?“ → `WHISKY`
  3. „Kdo tě prodal pirátům za pivo, žejo?“ → `MAJKL`
  4. „Kdo nikdy nezapomíná?“ → `TYGI`

  Na každý papírek patří i jedna číslice kódu truhly (zapiš si je do `CONFIG.bottles`). Po 3 špatných pokusech appka ukáže hádanku jako nápovědu.
- **Offline:** appku otevři na Davidově mobilu doma na wifi. Po prvním načtení jede i v metru bez signálu.
- **iPhone:** pohyb telefonu a mikrofon vyžadují HTTPS (GitHub Pages ho má). Každá minihra má i nouzové tlačítko.

## Kde co upravit

| Co | Soubor |
|---|---|
| Texty příběhu, pořadí kroků, odměny | `src/data/story.ts` |
| Posádka, role, narozeniny | `src/data/crew.ts` |
| Fotky posádky | `public/crew/<id>.jpg` |
| PIN, hesla a hádanky, věno, žolíky, kodex, záchranné výzvy | `src/data/config.ts` |
| Minihry | `src/games/` |
