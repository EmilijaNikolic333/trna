# Album za Trnu 🎓🎂

Virtuelni album sa okretanjem strana (React + Vite + react-pageflip).

## Pokretanje

```
npm install
npm run dev
```

Otvori http://localhost:5173

## Gde se šta menja

- `src/poruke.js`: sve porukice, posveta, naslovi poglavlja i stikeri
- `src/poglavlja.json`: koja slika ide u koje poglavlje i kojim redom
- `src/StikerKep.jsx`: stiker sa korice
- `originali/`: originalne slike sa Drive-a; `npm run slike` ih ponovo pretvara u `public/slike/`

## Za deljenje

`npm run build` pravi folder `dist/` koji može da se okači na Netlify, Vercel ili GitHub Pages.

## Štampa (pravi album)

- `npm run dev`, pa `node scripts/stampa.mjs` pravi `stampa/slike/`: naslovnu i kartice poglavlja (10×15, izgled u `src/kartice-stampa.jsx`, pregled na `/kartice.html`) i sve slike iz originala u pravom odnosu (najviše 10×15 cm, 300 dpi), numerisano redom kao u albumu.
- `npm run dev`, pa `node scripts/stikeri-pdf.mjs` pravi `stampa/stikeri.pdf` (A4 listovi sa stikerima i porukicama; izgled je u `src/stikeri-stampa.jsx`, pregled na `/stikeri.html`).
