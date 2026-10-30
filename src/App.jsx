import React, { forwardRef, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import confetti from 'canvas-confetti';
import StikerKep from './StikerKep.jsx';
import { Stiker, StikerDefs } from './Stikeri.jsx';
import meta from './slike-meta.json';
import grupe from './poglavlja.json';
import { posveta, poglavlja, kraj, stikeri } from './poruke.js';

const dimenzije = Object.fromEntries(meta.map(s => [s.ime, s.w / s.h]));
const src = ime => `${import.meta.env.BASE_URL}slike/${ime}`;

// deterministički "random" da raspored bude isti pri svakom otvaranju
function rng(seed) {
  let s = seed * 9301 + 49297;
  return () => ((s = (s * 9301 + 49297) % 233280) / 233280);
}

// slotovi u procentima strane: x, y, širina, visina, rotacija; + pozicija porukice
const RASPOREDI = {
  2: {
    slotovi: [
      [6, 5, 62, 46, -4],
      [32, 45, 62, 41, 4],
    ],
    poruka: [4, 60, 30],
  },
  3: {
    slotovi: [
      [9, 4, 82, 42, -2],
      [4, 50, 46, 34, -5],
      [50, 52, 46, 32, 4],
    ],
    poruka: [20, 86, 60],
  },
  '3b': {
    slotovi: [
      [5, 5, 50, 56, -3],
      [55, 4, 41, 30, 5],
      [53, 36, 43, 28, -4],
    ],
    poruka: [8, 68, 62],
  },
  4: {
    slotovi: [
      [5, 5, 44, 38, -3],
      [51, 7, 44, 36, 4],
      [4, 46, 44, 37, 3],
      [52, 47, 44, 37, -4],
    ],
    poruka: [18, 86, 64],
  },
  1: {
    slotovi: [[6, 6, 88, 74, -2]],
    poruka: [20, 84, 60],
  },
  // strane na kojima su sve slike uspravne
  P1: {
    slotovi: [[8, 4, 84, 78, -2]],
    poruka: [20, 85, 60],
  },
  P2: {
    slotovi: [
      [3, 5, 47, 74, -3],
      [50, 8, 47, 74, 3],
    ],
    poruka: [20, 84, 60],
  },
  P3: {
    slotovi: [
      [3, 4, 47, 60, -3],
      [51, 2, 46, 43, 4],
      [51, 46, 46, 43, -3],
    ],
    poruka: [5, 70, 42],
  },
  P4: {
    slotovi: [
      [4, 2, 46, 41, -3],
      [50, 3, 46, 41, 3],
      [4, 44, 46, 41, 3],
      [50, 45, 46, 41, -3],
    ],
    poruka: [22, 87, 56],
  },
};

const STRANA_ODNOS = 460 / 640;

// "|" u poglavlja.json znači: odavde počni novu stranu
function podeli(sve) {
  const obrazac = [3, 2, 3, 4];
  const delovi = [];
  let k = 0;
  const segmenti = sve.join('\n').split(/\n?\|\n?/).map(s => s.split('\n').filter(Boolean));
  for (const lista of segmenti) {
    let i = 0;
    while (i < lista.length) {
      let n = obrazac[k++ % obrazac.length];
      // ne ostavljamo jednu sliku samu na poslednjoj strani
      if (lista.length - (i + n) === 1) n = n === 4 ? 3 : n + 1;
      delovi.push(lista.slice(i, i + n));
      i += n;
    }
  }
  return delovi;
}

// sortira slike i slotove po odnosu strana pa ih spaja, da široke slike dobiju široke okvire
function rasporedi(slike, kljuc) {
  const r = RASPOREDI[kljuc];
  const slotovi = r.slotovi.map((s, i) => ({ s, i, odnos: (s[2] / s[3]) * STRANA_ODNOS }));
  const poSlici = [...slike].sort((a, b) => dimenzije[a] - dimenzije[b]);
  const poSlotu = [...slotovi].sort((a, b) => a.odnos - b.odnos);
  const out = [];
  poSlotu.forEach((slot, j) => (out[slot.i] = { ime: poSlici[j], slot: slot.s }));
  return { slike: out, poruka: r.poruka };
}

function napraviStrane() {
  const strane = [{ tip: 'korica' }, { tip: 'posveta', slavlje: true }];
  const redosled = ['cheer', 'putovanja', 'fakultet', 'zurke', 'svadba', 'gluposti'];
  let brojac = 0;
  for (const kljuc of redosled) {
    const p = poglavlja[kljuc];
    strane.push({ tip: 'poglavlje', kljuc, slavlje: true });
    podeli(grupe[kljuc]).forEach((deo, j) => {
      const sveUspravne = deo.every(ime => dimenzije[ime] < 0.9);
      const rk = sveUspravne ? `P${deo.length}` : deo.length === 3 && j % 2 ? '3b' : String(deo.length);
      const r = rng(++brojac);
      const sve = [...stikeri[kljuc], ...stikeri.rodjendan];
      const ikone = sve.filter(s => !s.startsWith('t:'));
      const tekstovi = sve.filter(s => s.startsWith('t:'));
      const uzmi = (lista = ikone) => lista[Math.floor(r() * lista.length)];
      strane.push({
        tip: 'slike',
        kljuc,
        ...rasporedi(deo, rk),
        tekst: p.poruke[j % p.poruke.length],
        stikeri: [
          { e: uzmi(), x: 76 + r() * 5, y: 0.5 + r() * 3, rot: r() * 30 - 15, vel: 15 },
          { e: uzmi(), x: 1 + r() * 4, y: 86 + r() * 4, rot: r() * 30 - 15, vel: 12 },
          r() > 0.4
            ? { e: uzmi(tekstovi), x: 2 + r() * 4, y: 1 + r() * 2, rot: -6 - r() * 6 }
            : { e: uzmi(), x: 86, y: 42 + r() * 16, rot: r() * 30, vel: 10 },
        ],
      });
    });
  }
  strane.push({ tip: 'torta', slavlje: true }, { tip: 'kraj', slavlje: true });
  // unutrašnjih strana mora biti paran broj da zadnja korica legne kako treba
  if ((strane.length - 1) % 2 === 1) strane.push({ tip: 'prazna' });
  strane.push({ tip: 'zadnja' });
  return strane;
}

/* ---------- strane ---------- */

const Strana = forwardRef(({ children, className = '', tvrda, broj }, ref) => (
  <div className={`strana ${className}`} ref={ref} data-density={tvrda ? 'hard' : 'soft'}>
    <div className="strana-sadrzaj">
      {children}
      {broj ? <div className="broj-strane">{broj}</div> : null}
    </div>
  </div>
));

function Baloni() {
  const boje = ['#e9b949', '#f6c6d3', '#fff4e2', '#d8a24a', '#f39ab3', '#f7e3b0'];
  return (
    <div className="baloni" aria-hidden>
      {boje.map((b, i) => (
        <span key={i} className="balon" style={{ '--boja': b, '--i': i }} />
      ))}
    </div>
  );
}

function Svetlucanje({ broj = 10 }) {
  return (
    <div className="svetlucanje" aria-hidden>
      {Array.from({ length: broj }).map((_, i) => (
        <span key={i} style={{ '--x': `${(i * 37) % 100}%`, '--y': `${(i * 61) % 100}%`, '--d': `${(i % 5) * 0.4}s` }}>
          ✦
        </span>
      ))}
    </div>
  );
}

function Korica() {
  return (
    <div className="korica">
      <Baloni />
      <Svetlucanje broj={14} />
      <div className="korica-gore">Album uspomena</div>
      <h1 className="korica-naslov">Za našeg Kepa</h1>
      <div className="stiker-omot">
        <StikerKep />
      </div>
      <div className="korica-ime">Trna</div>
      <div className="korica-dole">od tvoje cheer ekipe</div>
      <div className="korica-hint">klikni da otvoriš →</div>
    </div>
  );
}

// Okvir se smanjuje unutar slota tako da prati odnos strana slike, pa se ništa ne seče.
// Padding polaroida (2.4% / 7% u CSS-u) računa se od širine strane.
function uklopi([x, y, w, h], odnos) {
  const PW = 460, PH = 640, p = 0.024 * PW, dole = 0.07 * PW;
  const W = (w / 100) * PW, H = (h / 100) * PH;
  let iw = W - 2 * p, ih = H - p - dole;
  if (iw / ih > odnos) iw = ih * odnos;
  else ih = iw / odnos;
  const W2 = iw + 2 * p, H2 = ih + p + dole;
  return [x + ((W - W2) / 2 / PW) * 100, y + ((H - H2) / 2 / PH) * 100, (W2 / PW) * 100, (H2 / PH) * 100];
}

// react-pageflip sluša mousedown/touchstart na knjizi; zaustavljamo ih da klik na element ne okrene stranu
function useBezOkretanja(ref) {
  useEffect(() => {
    const el = ref.current;
    const stani = e => e.stopPropagation();
    const dogadjaji = ['mousedown', 'mouseup', 'touchstart', 'touchend', 'pointerdown'];
    dogadjaji.forEach(d => el.addEventListener(d, stani));
    return () => dogadjaji.forEach(d => el.removeEventListener(d, stani));
  }, []);
}

// Knjiga se ne renderuje ponovo, pa klik na sliku javljamo kroz window događaj
const otvoriSliku = ime => window.dispatchEvent(new CustomEvent('otvori-sliku', { detail: ime }));

function Polaroid({ ime, slot, indeks }) {
  const rot = slot[4];
  const [x, y, w, h] = uklopi(slot, dimenzije[ime] || 0.75);
  const ref = useRef(null);
  useBezOkretanja(ref);
  return (
    <figure
      ref={ref}
      className="polaroid"
      onClick={() => otvoriSliku(ime)}
      style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%`, '--rot': `${rot}deg`, zIndex: indeks + 1 }}
    >
      <span className="traka" style={{ '--trot': `${rot * -2}deg` }} />
      <img src={src(ime)} alt="" loading="lazy" draggable={false} />
    </figure>
  );
}

function Porukica({ tekst, pozicija, kljuc }) {
  const [x, y, w] = pozicija;
  return (
    <div className={`porukica porukica-${kljuc}`} style={{ left: `${x}%`, top: `${y}%`, width: `${w}%` }}>
      {tekst}
    </div>
  );
}

function Torta() {
  const [ugasene, setUgasene] = useState(false);
  const dugme = useRef(null);
  useBezOkretanja(dugme);
  const duni = e => {
    e.stopPropagation();
    if (ugasene) return setUgasene(false);
    setUgasene(true);
    const r = e.currentTarget.getBoundingClientRect();
    confetti({
      particleCount: 160,
      spread: 90,
      origin: { x: (r.left + r.width / 2) / window.innerWidth, y: r.top / window.innerHeight },
      colors: ['#e8304f', '#ffc93c', '#ffffff', '#ff8fb1'],
    });
  };
  return (
    <div className="torta-strana">
      <Baloni />
      <h2 className="naslov-rukom">Zamisli želju…</h2>
      <button ref={dugme} className={`torta ${ugasene ? 'ugasena' : ''}`} onClick={duni} aria-label="Duni svećice">
        <span className="svecice">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className="svecica">
              <span className="plamen" />
            </span>
          ))}
        </span>
        <span className="sloj sloj-1" />
        <span className="sloj sloj-2" />
        <span className="sloj sloj-3" />
        <span className="tanjir" />
      </button>
      <p className="torta-tekst">
        {ugasene ? 'Želja je zapisana! Srećan rođendan, Trna! 🥳' : '…i klikni na tortu da duneš svećice 🎂'}
      </p>
    </div>
  );
}

function SadrzajStrane({ strana }) {
  switch (strana.tip) {
    case 'korica':
      return <Korica />;
    case 'posveta':
      return (
        <div className="pismo">
          <Svetlucanje />
          <Stiker vrsta="kapa" className="stiker" style={{ right: '5%', top: '3%', '--rot': '14deg', width: '17%' }} />
          <Stiker vrsta="baloni" className="stiker" style={{ left: '3%', bottom: '3%', '--rot': '-10deg', width: '15%' }} />
          <h2 className="naslov-rukom">{posveta.naslov}</h2>
          {posveta.tekst.map((t, i) => (
            <p key={i} className="pismo-red" style={{ '--d': `${0.3 + i * 0.25}s` }}>
              {t}
            </p>
          ))}
          <p className="potpis">{posveta.potpis}</p>
        </div>
      );
    case 'poglavlje': {
      const p = poglavlja[strana.kljuc];
      return (
        <div className={`poglavlje poglavlje-${strana.kljuc}`}>
          <Svetlucanje broj={12} />
          <Stiker vrsta={p.ikona} className="poglavlje-ikona" />
          <h2 className="poglavlje-naslov">{p.naslov}</h2>
          <p className="poglavlje-pod">{p.podnaslov}</p>
          <div className="poglavlje-stikeri">
            {stikeri[strana.kljuc]
              .filter(s => !s.startsWith('t:') && s !== p.ikona)
              .slice(0, 3)
              .map((s, i) => (
                <Stiker key={s} vrsta={s} className="stiker-mali" style={{ '--i': i }} />
              ))}
          </div>
        </div>
      );
    }
    case 'slike':
      return (
        <>
          {strana.slike.map((s, i) => (
            <Polaroid key={s.ime} ime={s.ime} slot={s.slot} indeks={i} />
          ))}
          <Porukica tekst={strana.tekst} pozicija={strana.poruka} kljuc={strana.kljuc} />
          {strana.stikeri.map((s, i) => (
            <Stiker
              key={i}
              vrsta={s.e}
              className="stiker"
              style={{ left: `${s.x}%`, top: `${s.y}%`, '--rot': `${s.rot}deg`, width: s.vel ? `${s.vel}%` : undefined }}
            />
          ))}
        </>
      );
    case 'torta':
      return <Torta />;
    case 'kraj':
      return (
        <div className="pismo kraj">
          <Svetlucanje />
          <h2 className="naslov-rukom">{kraj.naslov}</h2>
          <p className="pismo-red">{kraj.tekst}</p>
          <div className="srca" aria-hidden>
            {['srce', 'megafon', 'kapa', 'torta', 'masna', 'zvezda'].map((v, i) => (
              <Stiker key={v} vrsta={v} style={{ '--i': i }} />
            ))}
          </div>
          <p className="potpis">{kraj.potpis}</p>
        </div>
      );
    case 'prazna':
      return (
        <div className="prazna">
          <Stiker vrsta="masna" className="stiker" style={{ left: '38%', top: '40%', '--rot': '-8deg', width: '24%' }} />
        </div>
      );
    case 'zadnja':
      return (
        <div className="korica zadnja">
          <Svetlucanje broj={10} />
          <div className="zadnja-tekst">Jednom kep, zauvek kep</div>
          <div className="korica-dole">Diploma &amp; rođendan · 2026</div>
        </div>
      );
    default:
      return null;
  }
}

const strane = napraviStrane();
const SVE_SLIKE = strane.flatMap(s => (s.tip === 'slike' ? s.slike.map(x => x.ime) : []));

// Knjiga se nikad ne renderuje ponovo (react-pageflip bi inače resetovao strane)
const Knjiga = memo(function Knjiga({ knjigaRef, naOkret }) {
  const deca = useMemo(
    () =>
      strane.map((s, i) => (
        <Strana
          key={i}
          tvrda={s.tip === 'korica' || s.tip === 'zadnja'}
          className={`tip-${s.tip}`}
          broj={s.tip === 'slike' ? i : null}
        >
          <SadrzajStrane strana={s} />
        </Strana>
      )),
    []
  );
  return (
    <HTMLFlipBook
      ref={knjigaRef}
      width={460}
      height={640}
      size="stretch"
      minWidth={280}
      maxWidth={620}
      minHeight={390}
      maxHeight={860}
      showCover
      maxShadowOpacity={0.45}
      flippingTime={900}
      mobileScrollSupport
      usePortrait
      className="knjiga"
      onFlip={naOkret}
    >
      {deca}
    </HTMLFlipBook>
  );
});

export default function App() {
  const knjigaRef = useRef(null);
  const [strana, setStrana] = useState(0);

  const naOkret = useCallback(e => {
    setStrana(e.data);
    const vidljive = [strane[e.data], strane[e.data + 1]];
    if (vidljive.some(s => s?.slavlje)) {
      confetti({ particleCount: 90, spread: 75, startVelocity: 38, origin: { y: 0.65 }, colors: ['#e9b949', '#f6d77a', '#fff4e2', '#f39ab3', '#9b1f38'] });
    }
  }, []);

  const flip = () => knjigaRef.current?.pageFlip();
  const skoci = n => {
    flip()?.turnToPage(n);
    setStrana(n);
  };
  const POSLEDNJA = strane.length - 1;

  // pregled cele slike: sve slike albuma redom, da strelice idu na sledeću/prethodnu
  const [otvorena, setOtvorena] = useState(null);
  const otvorenaRef = useRef(null);
  otvorenaRef.current = otvorena;
  useEffect(() => {
    const otvori = e => setOtvorena(SVE_SLIKE.indexOf(e.detail));
    window.addEventListener('otvori-sliku', otvori);
    return () => window.removeEventListener('otvori-sliku', otvori);
  }, []);
  const pomeri = d => setOtvorena(i => (i + d + SVE_SLIKE.length) % SVE_SLIKE.length);

  useEffect(() => {
    const taster = e => {
      if (otvorenaRef.current !== null) {
        if (e.key === 'Escape') setOtvorena(null);
        if (e.key === 'ArrowRight') pomeri(1);
        if (e.key === 'ArrowLeft') pomeri(-1);
        return;
      }
      if (e.key === 'ArrowRight') flip()?.flipNext();
      if (e.key === 'ArrowLeft') flip()?.flipPrev();
      if (e.key === 'Home') skoci(0);
      if (e.key === 'End') skoci(POSLEDNJA);
    };
    window.addEventListener('keydown', taster);
    return () => window.removeEventListener('keydown', taster);
  }, []);

  return (
    <main className="scena">
      <StikerDefs />
      <div className="knjiga-omot">
        <Knjiga knjigaRef={knjigaRef} naOkret={naOkret} />
      </div>
      <nav className="kontrole">
        <button className="malo" onClick={() => skoci(0)} disabled={strana === 0} title="Na početak" aria-label="Na početak albuma">
          «
        </button>
        <button onClick={() => flip()?.flipPrev()} disabled={strana === 0} aria-label="Prethodna strana">
          ‹
        </button>
        <span>{strana === 0 ? 'Korica' : `Strana ${strana} / ${POSLEDNJA}`}</span>
        <button onClick={() => flip()?.flipNext()} disabled={strana >= POSLEDNJA} aria-label="Sledeća strana">
          ›
        </button>
        <button className="malo" onClick={() => skoci(POSLEDNJA)} disabled={strana >= POSLEDNJA} title="Na kraj" aria-label="Na kraj albuma">
          »
        </button>
      </nav>
      {otvorena !== null && (
        <div className="pregled" onClick={() => setOtvorena(null)} role="dialog" aria-label="Pregled slike">
          <img src={src(SVE_SLIKE[otvorena])} alt="" onClick={e => e.stopPropagation()} />
          <button className="pregled-zatvori" aria-label="Zatvori">×</button>
          <button className="pregled-strelica levo" onClick={e => (e.stopPropagation(), pomeri(-1))} aria-label="Prethodna slika">
            ‹
          </button>
          <button className="pregled-strelica desno" onClick={e => (e.stopPropagation(), pomeri(1))} aria-label="Sledeća slika">
            ›
          </button>
          <span className="pregled-broj">
            {otvorena + 1} / {SVE_SLIKE.length}
          </span>
        </div>
      )}
    </main>
  );
}
