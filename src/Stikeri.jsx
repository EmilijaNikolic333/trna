// Ilustrovani stikeri (SVG) u paleti albuma: bordo, puder roze, zlatna, krem
const Z = 'url(#st-zlato)';

// gradijenti se definišu jednom na nivou strane; ako bi bili u svakom stikeru, sakrivena strana (display:none) bi ih "pojela"
export function StikerDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden>
    <defs>
      <linearGradient id="st-zlato" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fff1b8" />
        <stop offset="0.35" stopColor="#e9b949" />
        <stop offset="0.65" stopColor="#c98f1e" />
        <stop offset="1" stopColor="#f6d77a" />
      </linearGradient>
      <linearGradient id="st-bordo" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#d23d5c" />
        <stop offset="1" stopColor="#8c1730" />
      </linearGradient>
      <linearGradient id="st-roze" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffd6e0" />
        <stop offset="1" stopColor="#f39ab3" />
      </linearGradient>
      <linearGradient id="st-srebro" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="0.5" stopColor="#c9ccd6" />
        <stop offset="1" stopColor="#8d92a3" />
      </linearGradient>
    </defs>
    </svg>
  );
}

const IKONE = {
  zvezda: (
    <>
      <path d="M50 6 L62 37 L95 38 L69 58 L78 91 L50 72 L22 91 L31 58 L5 38 L38 37 Z" fill={Z} />
      <path d="M50 18 L58 40 L50 36 L42 40 Z" fill="#fff" opacity="0.55" />
    </>
  ),
  iskra: (
    <>
      <path d="M50 4 Q56 44 96 50 Q56 56 50 96 Q44 56 4 50 Q44 44 50 4 Z" fill={Z} />
      <path d="M80 12 Q82 22 92 24 Q82 26 80 36 Q78 26 68 24 Q78 22 80 12 Z" fill={Z} />
    </>
  ),
  srce: (
    <>
      <path d="M50 88 C10 62 4 38 18 22 C30 10 46 16 50 28 C54 16 70 10 82 22 C96 38 90 62 50 88 Z" fill="url(#st-bordo)" />
      <ellipse cx="30" cy="32" rx="9" ry="5" fill="#fff" opacity="0.5" transform="rotate(-35 30 32)" />
    </>
  ),
  masna: (
    <>
      <path d="M50 46 C30 20 8 24 10 42 C12 58 34 60 50 50 Z" fill="url(#st-roze)" stroke="#d9758f" strokeWidth="2" />
      <path d="M50 46 C70 20 92 24 90 42 C88 58 66 60 50 50 Z" fill="url(#st-roze)" stroke="#d9758f" strokeWidth="2" />
      <path d="M46 52 L30 90 L40 86 L46 94 L50 56 Z" fill="#f39ab3" />
      <path d="M54 52 L70 90 L60 86 L54 94 L50 56 Z" fill="#f39ab3" />
      <ellipse cx="50" cy="48" rx="9" ry="10" fill="#e5809c" />
    </>
  ),
  kapa: (
    <>
      <path d="M28 52 L28 70 Q50 82 72 70 L72 52 Z" fill="#26232f" />
      <polygon points="4,42 50,22 96,42 50,62" fill="#34303f" />
      <polygon points="4,42 50,22 96,42 50,62" fill="none" stroke="#4b465a" strokeWidth="1.5" />
      <circle cx="50" cy="42" r="3.5" fill={Z} />
      <path d="M50 42 L82 50 L82 74" stroke={Z} strokeWidth="3" fill="none" />
      <path d="M78 72 L86 72 L88 88 L76 88 Z" fill={Z} />
    </>
  ),
  diploma: (
    <>
      <g transform="rotate(-20 50 50)">
        <rect x="10" y="38" width="80" height="24" rx="12" fill="#fffaf0" stroke="#e0d3b5" strokeWidth="2" />
        <ellipse cx="12" cy="50" rx="6" ry="12" fill="#f0e6cc" stroke="#e0d3b5" strokeWidth="2" />
        <rect x="52" y="36" width="9" height="28" fill="url(#st-bordo)" />
        <path d="M56 64 L50 84 L56 80 L62 84 Z" fill="#9b1f38" />
      </g>
    </>
  ),
  pompon: (
    <>
      <circle cx="50" cy="50" r="40" fill="#c72a48" />
      {Array.from({ length: 36 }).map((_, i) => (
        <path
          key={i}
          d="M50 50 Q41 26 50 3 Q59 26 50 50 Z"
          fill={i % 3 === 0 ? '#fff4e2' : i % 3 === 1 ? '#c72a48' : Z}
          stroke={i % 3 === 1 ? '#9b1f38' : 'none'}
          strokeWidth="0.6"
          transform={`rotate(${i * 10 + (i % 2) * 4} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="9" fill="#8c1730" />
      <circle cx="47" cy="47" r="3" fill="#fff" opacity="0.4" />
    </>
  ),
  megafon: (
    <>
      <path d="M18 40 L64 18 L64 82 L18 60 Z" fill="url(#st-bordo)" />
      <ellipse cx="64" cy="50" rx="10" ry="32" fill="#fff4ea" stroke="#8c1730" strokeWidth="3" />
      <rect x="8" y="40" width="14" height="20" rx="4" fill="#fff4ea" stroke="#8c1730" strokeWidth="3" />
      <path d="M24 60 L30 82 L40 80 L36 64" fill="#8c1730" />
      <text x="40" y="54" fontSize="12" fontWeight="900" fill="#fff" textAnchor="middle" fontFamily="Nunito, sans-serif">KEP</text>
      <path d="M80 30 L90 24 M82 50 L94 50 M80 70 L90 76" stroke={Z} strokeWidth="4" strokeLinecap="round" />
    </>
  ),
  kruna: (
    <>
      <path d="M10 76 L16 30 L34 52 L50 20 L66 52 L84 30 L90 76 Z" fill={Z} />
      <rect x="10" y="74" width="80" height="12" rx="3" fill={Z} />
      <circle cx="50" cy="60" r="6" fill="#c72a48" />
      <circle cx="28" cy="64" r="4" fill="#f39ab3" />
      <circle cx="72" cy="64" r="4" fill="#f39ab3" />
      <circle cx="16" cy="28" r="4" fill={Z} />
      <circle cx="50" cy="18" r="4" fill={Z} />
      <circle cx="84" cy="28" r="4" fill={Z} />
    </>
  ),
  baloni: (
    <>
      <path d="M38 62 Q36 80 46 96" stroke="#b89a5a" strokeWidth="1.5" fill="none" />
      <path d="M64 58 Q66 80 50 96" stroke="#b89a5a" strokeWidth="1.5" fill="none" />
      <ellipse cx="64" cy="32" rx="22" ry="26" fill="url(#st-roze)" />
      <ellipse cx="36" cy="38" rx="22" ry="26" fill={Z} />
      <ellipse cx="28" cy="28" rx="5" ry="9" fill="#fff" opacity="0.55" transform="rotate(20 28 28)" />
      <ellipse cx="56" cy="22" rx="5" ry="9" fill="#fff" opacity="0.55" transform="rotate(20 56 22)" />
    </>
  ),
  avion: (
    <>
      <path d="M6 48 L94 12 L64 88 L48 60 Z" fill="#fffaf3" stroke="#c9ccd6" strokeWidth="2" />
      <path d="M48 60 L94 12 L40 54 Z" fill="#f2dfe4" />
      <path d="M48 60 L52 80 L60 70" fill="#e4c9d0" />
      <path d="M4 80 Q20 70 28 76" stroke="#d9758f" strokeWidth="2.5" strokeDasharray="4 5" fill="none" />
    </>
  ),
  kamera: (
    <>
      <rect x="8" y="28" width="84" height="56" rx="10" fill="url(#st-roze)" stroke="#d9758f" strokeWidth="2" />
      <rect x="30" y="18" width="26" height="14" rx="4" fill="#e5809c" />
      <circle cx="50" cy="56" r="20" fill="#3a2a35" />
      <circle cx="50" cy="56" r="13" fill="#5a4656" />
      <circle cx="44" cy="50" r="4" fill="#fff" opacity="0.7" />
      <circle cx="80" cy="38" r="4" fill={Z} />
    </>
  ),
  disko: (
    <>
      <line x1="50" y1="0" x2="50" y2="16" stroke="#8d92a3" strokeWidth="2" />
      <circle cx="50" cy="56" r="40" fill="url(#st-srebro)" />
      {Array.from({ length: 7 }).map((_, i) => (
        <line key={'h' + i} x1="10" y1={26 + i * 10} x2="90" y2={26 + i * 10} stroke="#fff" strokeWidth="1" opacity="0.6" />
      ))}
      {Array.from({ length: 7 }).map((_, i) => (
        <line key={'v' + i} x1={20 + i * 10} y1="16" x2={20 + i * 10} y2="96" stroke="#7d8294" strokeWidth="1" opacity="0.35" />
      ))}
      <path d="M32 34 Q50 28 66 38" stroke="#fff" strokeWidth="5" opacity="0.8" fill="none" strokeLinecap="round" />
      <path d="M82 18 L85 26 L93 28 L85 30 L82 38 L79 30 L71 28 L79 26 Z" fill={Z} />
    </>
  ),
  case: (
    <>
      <g transform="rotate(-14 34 60)">
        <path d="M22 10 L46 10 Q46 40 34 42 Q22 40 22 10 Z" fill="#fff4c7" stroke="#d9b45b" strokeWidth="2" />
        <path d="M24 18 L44 18 Q44 38 34 40 Q24 38 24 18 Z" fill={Z} opacity="0.75" />
        <line x1="34" y1="42" x2="34" y2="80" stroke="#d9b45b" strokeWidth="3" />
        <ellipse cx="34" cy="82" rx="12" ry="4" fill="#d9b45b" />
      </g>
      <g transform="rotate(14 66 60)">
        <path d="M54 10 L78 10 Q78 40 66 42 Q54 40 54 10 Z" fill="#fff4c7" stroke="#d9b45b" strokeWidth="2" />
        <path d="M56 18 L76 18 Q76 38 66 40 Q56 38 56 18 Z" fill={Z} opacity="0.75" />
        <line x1="66" y1="42" x2="66" y2="80" stroke="#d9b45b" strokeWidth="3" />
        <ellipse cx="66" cy="82" rx="12" ry="4" fill="#d9b45b" />
      </g>
      <circle cx="50" cy="8" r="3" fill={Z} />
      <circle cx="42" cy="2" r="2" fill={Z} />
      <circle cx="58" cy="3" r="2" fill={Z} />
    </>
  ),
  torta: (
    <>
      <rect x="14" y="54" width="72" height="30" rx="6" fill="url(#st-roze)" />
      <rect x="24" y="34" width="52" height="22" rx="5" fill="#fffaf3" stroke="#f0d5dc" strokeWidth="2" />
      <path d="M14 60 Q23 68 32 60 Q41 68 50 60 Q59 68 68 60 Q77 68 86 60" stroke="#fff" strokeWidth="4" fill="none" />
      <rect x="47" y="18" width="6" height="16" rx="2" fill="#c72a48" />
      <path d="M50 4 Q56 12 50 18 Q44 12 50 4 Z" fill={Z} />
      <ellipse cx="50" cy="88" rx="42" ry="5" fill="#e9e2dc" />
    </>
  ),
};

export function Stiker({ vrsta, className = '', style }) {
  if (vrsta.startsWith('t:')) {
    return (
      <span className={`stiker-tekst ${className}`} style={style}>
        {vrsta.slice(2)}
      </span>
    );
  }
  return (
    <svg className={`stiker-svg ${className}`} style={style} viewBox="0 0 100 100" aria-hidden>
      {IKONE[vrsta]}
    </svg>
  );
}
