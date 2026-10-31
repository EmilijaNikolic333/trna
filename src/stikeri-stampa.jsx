// A4 listovi sa stikerima za pravi album (štampa se na samolepljivom papiru).
// Otvara se na /stikeri.html; PDF pravi scripts/stikeri-pdf.mjs
import React from 'react';
import { createRoot } from 'react-dom/client';
import StikerKep from './StikerKep.jsx';
import { Stiker, StikerDefs } from './Stikeri.jsx';
import { poglavlja, stikeri } from './poruke.js';
import './styles.css';
import './stikeri-stampa.css';

const REDOSLED = ['cheer', 'putovanja', 'fakultet', 'zurke', 'svadba', 'gluposti'];
const jedinstveni = niz => [...new Set(niz)];

const ikone = jedinstveni(Object.values(stikeri).flat().filter(s => !s.startsWith('t:')));
const natpisi = jedinstveni(Object.values(stikeri).flat().filter(s => s.startsWith('t:')));
const porukice = REDOSLED.flatMap(k => jedinstveni(poglavlja[k].poruke).map(tekst => ({ k, tekst })));

function ListStikera() {
  return (
    <>
      <StikerDefs />
      <section className="list">
        <div className="red-korica">
          <div className="isecak kep-isecak">
            <StikerKep />
          </div>
          <div className="ikone">
            {ikone.map(v => (
              <div className="isecak ikona" key={v}>
                <Stiker vrsta={v} />
              </div>
            ))}
          </div>
        </div>
        <div className="naslovi">
          {REDOSLED.map(k => (
            <div className="isecak naslov" key={k}>
              <Stiker vrsta={poglavlja[k].ikona} />
              <span>{poglavlja[k].naslov}</span>
            </div>
          ))}
        </div>
        <div className="natpisi">
          {natpisi.map(v => (
            <div className="isecak natpis" key={v}>
              <Stiker vrsta={v} />
            </div>
          ))}
        </div>
      </section>
      <section className="list list-porukice">
        <div className="porukice-stampa">
          {porukice.map(({ k, tekst }) => (
            <div className={`isecak porukica-st porukica-st-${k}`} key={k + tekst}>
              {tekst}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

createRoot(document.getElementById('root')).render(<ListStikera />);
