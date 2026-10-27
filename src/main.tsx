import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { CREW, crewPhoto } from './data/crew'
import './index.css'
import { unlockAudio } from './lib/sound'

// Fotky posádky stáhnout hned, ať jsou v cache i bez signálu v metru.
for (const c of CREW) new Image().src = crewPhoto(c.id)

// Když se appka znovu otevře uprostřed hry, odemkne se zvuk při prvním dotyku.
for (const ev of ['touchend', 'click'] as const) document.addEventListener(ev, () => unlockAudio(), { once: true, capture: true })

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`)
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
