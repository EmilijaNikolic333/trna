// Kartice 10×15 za album sa džepovima: naslovna + po jedna za početak svakog poglavlja.
// /kartice.html prikazuje sve; /kartice.html?k=cheer samo jednu (tako je slika scripts/stampa.mjs)
import React from 'react';
import { createRoot } from 'react-dom/client';
import StikerKep from './StikerKep.jsx';
import { Stiker, StikerDefs } from './Stikeri.jsx';
import { poglavlja, stikeri } from './poruke.js';
import './styles.css';
import './kartice-stampa.css';

export const KARTICE = ['naslovna', 'cheer', 'putovanja', 'fakultet', 'zurke', 'svadba', 'gluposti'];

function Naslovna() {
  return (
    <div className="kartica kartica-naslovna">
      <div className="kartica-ram" />
      <p className="kartica-gore">Album za Trnu</p>
      <StikerKep />
      <p className="kartica-rodj">Srećan rođendan, kep! 🎂</p>
      <p className="kartica-potpis">Tvoja cheer ekipa 📣💖</p>
    </div>
  );
}

function Poglavlje({ k }) {
  const p = poglavlja[k];
  const ukrasi = stikeri[k].filter(s => !s.startsWith('t:') && s !== p.ikona).slice(0, 3);
  return (
    <div className={`kartica poglavlje-${k}`}>
      <div className="kartica-ram" />
      <Stiker vrsta={p.ikona} className="kartica-ikona" />
      <h2 className="kartica-naslov">{p.naslov}</h2>
      <p className="kartica-pod">{p.podnaslov || p.poruke[1]}</p>
      <div className="kartica-ukrasi">
        {ukrasi.map(s => (
          <Stiker key={s} vrsta={s} />
        ))}
      </div>
    </div>
  );
}

const k = new URLSearchParams(location.search).get('k');
const prikaz = k ? [k] : KARTICE;
document.body.classList.toggle('jedna', Boolean(k));

createRoot(document.getElementById('root')).render(
  <>
    <StikerDefs />
    {prikaz.map(x => (x === 'naslovna' ? <Naslovna key={x} /> : <Poglavlje key={x} k={x} />))}
  </>,
);
