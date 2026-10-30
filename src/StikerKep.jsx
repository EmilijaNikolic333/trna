// Karikatura za korice: Trnina prava glava (public/korica-glava.png, pravi je scripts/glava.mjs iz originali/_korica-trna-3.png)
// na malom nacrtanom telu u togi, sa diplomom i pomponom
const GLAVA = `${import.meta.env.BASE_URL}korica-glava.png`;
const KOZA = '#efc2a4';

export default function StikerKep() {
  return (
    <svg className="stiker-kep" viewBox="0 0 320 320" role="img" aria-label="Karikatura: Trna sa diplomom">
      <defs>
        <clipPath id="kep-krug">
          <circle cx="160" cy="166" r="136" />
        </clipPath>
        <radialGradient id="kep-nebo" cx="50%" cy="40%" r="65%">
          <stop offset="0" stopColor="#fff6c9" />
          <stop offset="1" stopColor="#f5c44a" />
        </radialGradient>
        <linearGradient id="kep-zlato" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff1b8" />
          <stop offset="0.3" stopColor="#e9b949" />
          <stop offset="0.6" stopColor="#b97f17" />
          <stop offset="1" stopColor="#f6d77a" />
        </linearGradient>
        <linearGradient id="kep-bordo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c3304f" />
          <stop offset="1" stopColor="#7d1229" />
        </linearGradient>
        <linearGradient id="kep-toga" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#34303f" />
          <stop offset="1" stopColor="#1a1822" />
        </linearGradient>
        {/* beli "isečen" rub oko glave + senka, kao prava nalepnica */}
        <filter id="kep-rub" x="-20%" y="-20%" width="140%" height="140%">
          <feMorphology in="SourceAlpha" operator="dilate" radius="3.5" result="debelo" />
          <feFlood floodColor="#fff" />
          <feComposite in2="debelo" operator="in" result="rub" />
          <feGaussianBlur in="debelo" stdDeviation="3" result="senka-b" />
          <feOffset in="senka-b" dy="3" result="senka-o" />
          <feFlood floodColor="#5a1020" floodOpacity="0.35" />
          <feComposite in2="senka-o" operator="in" result="senka" />
          <feMerge>
            <feMergeNode in="senka" />
            <feMergeNode in="rub" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* podloga */}
      <circle cx="160" cy="166" r="150" fill="#fff" />
      <circle cx="160" cy="166" r="143" fill="url(#kep-zlato)" />
      <circle cx="160" cy="166" r="136" fill="url(#kep-nebo)" />

      <g clipPath="url(#kep-krug)">
        {Array.from({ length: 18 }).map((_, i) => (
          <path key={i} d="M160 166 L151 0 L169 0 Z" fill="#fff" opacity="0.3" transform={`rotate(${i * 20} 160 166)`} />
        ))}

        <g transform="translate(-13 -18)">
        {/* telo u togi */}
        <path d="M110 330 Q108 236 140 214 L204 214 Q236 236 232 330 Z" fill="url(#kep-toga)" />
        <path d="M150 212 L172 250 L194 212 Z" fill="#fff" />
        <rect x="162" y="192" width="22" height="26" rx="9" fill={KOZA} />
        <path d="M150 214 L170 252 L162 330 L144 330 L140 220 Z" fill="url(#kep-zlato)" />
        <path d="M194 214 L174 252 L184 330 L202 330 L206 220 Z" fill="url(#kep-zlato)" />

        {/* desna ruka (levo na slici) podignuta sa diplomom */}
        <path d="M126 236 Q96 220 90 178" stroke="url(#kep-toga)" strokeWidth="24" fill="none" strokeLinecap="round" />
        <circle cx="89" cy="172" r="11" fill={KOZA} />
        <g transform="rotate(-32 84 150)">
          <rect x="52" y="141" width="66" height="19" rx="9.5" fill="#fffaf0" stroke="#d8c9a6" strokeWidth="2" />
          <ellipse cx="54" cy="150.5" rx="5.5" ry="9.5" fill="#efe3c6" stroke="#d8c9a6" strokeWidth="1.5" />
          <rect x="80" y="139" width="8" height="23" fill="url(#kep-bordo)" />
        </g>

        {/* leva ruka sa pomponom */}
        <path d="M216 232 Q234 240 238 254" stroke="url(#kep-toga)" strokeWidth="24" fill="none" strokeLinecap="round" />
        <g transform="translate(240 252)">
          <circle r="30" fill="#c72a48" />
          {Array.from({ length: 30 }).map((_, i) => (
            <path
              key={i}
              d="M0 0 Q-6 -18 0 -36 Q6 -18 0 0 Z"
              fill={i % 3 === 0 ? '#fff4e2' : i % 3 === 1 ? '#c72a48' : 'url(#kep-zlato)'}
              transform={`rotate(${i * 12})`}
            />
          ))}
          <circle r="8" fill="#8c1730" />
        </g>
        </g>
      </g>

      {/* prava glava, velika kao na karikaturi */}
      <image href={GLAVA} x="82" y="18" width="166" height="196" filter="url(#kep-rub)" />

      {/* kapa za diplomu na punđi */}
      <g transform="translate(157 26) rotate(-6) scale(0.9)">
        <path d="M-30 4 L-30 22 Q0 34 30 22 L30 4 Z" fill="#1d1b25" />
        <polygon points="-62,-6 0,-30 62,-6 0,18" fill="#2a2734" stroke="#fff" strokeWidth="3" strokeLinejoin="round" />
        <path d="M-52 -5 L0 -24 L52 -5" fill="none" stroke="#46415a" strokeWidth="1" />
        <circle cx="0" cy="-6" r="4.5" fill="url(#kep-zlato)" />
        <path d="M0 -6 Q36 0 50 6 L52 36" stroke="url(#kep-zlato)" strokeWidth="3.5" fill="none" />
        <path d="M47 34 L57 34 L60 56 L44 56 Z" fill="url(#kep-zlato)" />
      </g>

      {/* traka */}
      <g transform="translate(160 294) scale(0.88)">
        <path d="M-124 -8 L-108 2 L-124 12 L-96 12 L-96 -8 Z" fill="#6d0f24" />
        <path d="M124 -8 L108 2 L124 12 L96 12 L96 -8 Z" fill="#6d0f24" />
        <rect x="-108" y="-22" width="216" height="36" rx="5" fill="url(#kep-bordo)" stroke="#fff" strokeWidth="3" />
        <text className="stiker-traka" y="5" textAnchor="middle">
          DIPLOMIRALA!
        </text>
      </g>

      {/* bedž */}
      <g transform="translate(42 74) rotate(-14)">
        <circle r="32" fill="#fff" />
        <circle r="27" fill="url(#kep-zlato)" />
        <circle r="23" fill="url(#kep-bordo)" />
        <text className="stiker-bedz" y="0" textAnchor="middle">Trna</text>
        <text className="stiker-bedz-mali" y="13" textAnchor="middle">KEP</text>
      </g>

      {/* natpis za rođendan */}
      <g transform="translate(266 104) rotate(12)">
        <rect x="-48" y="-17" width="96" height="34" rx="17" fill="#fff" />
        <rect x="-44" y="-13" width="88" height="26" rx="13" fill="#fff4e2" stroke="url(#kep-zlato)" strokeWidth="2" />
        <text className="stiker-rodj" y="5" textAnchor="middle">Srećan rođendan</text>
      </g>
    </svg>
  );
}
