/**
 * RaceCar — SVG de carro F1/IndyCar con piloto visible,
 * ruedas girando (CSS), efecto de velocidad y partículas de escape.
 */
export default function RaceCar({ color = '#ffffff', blazing = false, scale = 1 }) {
  const id = `car-${color.replace(/[^a-z0-9]/gi, 'x')}`
  const W = Math.round(130 * scale)
  const H = Math.round(52 * scale)

  return (
    <svg
      viewBox="0 0 130 52"
      width={W}
      height={H}
      xmlns="http://www.w3.org/2000/svg"
      overflow="visible"
      style={{ filter: `drop-shadow(0 0 6px ${color}88)` }}
    >
      <defs>
        {/* Glow filter */}
        <filter id={`${id}-glow`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Body gradient horizontal */}
        <linearGradient id={`${id}-hgrad`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={color} stopOpacity="0.45" />
          <stop offset="55%"  stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0.85" />
        </linearGradient>

        {/* Body sheen (top-down) */}
        <linearGradient id={`${id}-sheen`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.28)" />
          <stop offset="50%"  stopColor="rgba(255,255,255,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.35)" />
        </linearGradient>

        {/* Helmet radial highlight */}
        <radialGradient id={`${id}-helm`} cx="35%" cy="30%" r="55%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.45)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>

        {/* Visor glass */}
        <linearGradient id={`${id}-visor`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="rgba(120,220,255,0.85)" />
          <stop offset="100%" stopColor="rgba(60,140,200,0.6)" />
        </linearGradient>
      </defs>

      {/* ── Speed lines (only when blazing) ───────── */}
      {blazing && (
        <g>
          <line x1="-36" y1="20" x2="-3" y2="20" stroke={color} strokeWidth="2"   strokeLinecap="round" opacity="0.75" />
          <line x1="-28" y1="27" x2="-3" y2="27" stroke={color} strokeWidth="1.4" strokeLinecap="round" opacity="0.5" />
          <line x1="-40" y1="34" x2="-3" y2="34" stroke={color} strokeWidth="2"   strokeLinecap="round" opacity="0.75" />
        </g>
      )}

      {/* ── Rear wing ─────────────────────────────── */}
      <rect x="6" y="11" width="20" height="5" rx="2.5"
            fill={color} filter={`url(#${id}-glow)`} opacity="0.95" />
      <rect x="8"  y="15" width="3" height="10" rx="1.5" fill={color} opacity="0.75" />
      <rect x="22" y="15" width="3" height="10" rx="1.5" fill={color} opacity="0.75" />

      {/* ── Main body ─────────────────────────────── */}
      <path d="M14 24 L24 15 L96 15 L110 24 L110 38 L14 38 Z"
            fill={`url(#${id}-hgrad)`} filter={`url(#${id}-glow)`} />
      {/* Top sheen */}
      <path d="M14 24 L24 15 L96 15 L110 24 L110 30 L14 30 Z"
            fill={`url(#${id}-sheen)`} opacity="0.55" />

      {/* ── Nose cone ─────────────────────────────── */}
      <path d="M108 22 L130 27 L130 35 L108 38 Z" fill={color} />
      <path d="M108 22 L130 27 L130 30 L108 29 Z" fill="rgba(255,255,255,0.18)" />

      {/* ── Front wing ────────────────────────────── */}
      <path d="M112 35 L130 35 L130 40 L112 40 Z" fill={color} opacity="0.75" />
      <path d="M112 26 L130 26 L130 30 L112 30 Z" fill={color} opacity="0.3" />

      {/* ── Wheel housings ────────────────────────── */}
      <path d="M80 24 L96 24 L96 38 L80 38 Q77 38 77 34 L77 28 Q77 24 80 24 Z"
            fill="rgba(0,0,0,0.45)" />
      <path d="M16 24 L32 24 L32 38 L16 38 Q14 38 14 34 L14 28 Q14 24 16 24 Z"
            fill="rgba(0,0,0,0.45)" />

      {/* ── Side pod / intake ─────────────────────── */}
      <path d="M60 15 L68 15 L72 22 L56 22 Z" fill="rgba(0,0,0,0.25)" />

      {/* ── Racing stripe ─────────────────────────── */}
      <rect x="56" y="15" width="6" height="23" rx="3" fill="rgba(255,255,255,0.18)" />

      {/* ── Cockpit well ──────────────────────────── */}
      <path d="M44 15 L56 5 L82 5 L92 15 Z" fill="rgba(0,0,0,0.8)" />
      <path d="M47 15 L58 7.5 L80 7.5 L90 15 Z" fill="#060a14" />

      {/* ════ DRIVER ══════════════════════════════════ */}

      {/* Racing suit torso */}
      <ellipse cx="68" cy="15" rx="8.5" ry="6" fill="#111827" />

      {/* Helmet shell */}
      <ellipse cx="68" cy="10" rx="7.5" ry="7"
               fill={color} filter={`url(#${id}-glow)`} />
      {/* Helmet highlight */}
      <ellipse cx="68" cy="10" rx="7.5" ry="7"
               fill={`url(#${id}-helm)`} />

      {/* Helmet color stripe (racing livery) */}
      <rect x="65.5" y="4" width="5" height="12" rx="2.5" fill="rgba(255,255,255,0.18)" />

      {/* Visor opening */}
      <path d="M62 8.5 Q68 5.5 74 8.5 Q74 13.5 68 15 Q62 13.5 62 8.5 Z"
            fill={`url(#${id}-visor)`} opacity="0.9" />

      {/* Visor reflection streak */}
      <path d="M63.5 8.5 Q67 7 71.5 8.5 L71 10 Q67.5 9 64 10 Z"
            fill="rgba(255,255,255,0.42)" />

      {/* Steering wheel */}
      <circle cx="68" cy="17.5" r="4.5"
              fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" />
      <line x1="68" y1="13.5" x2="68" y2="21.5"
            stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      <line x1="64" y1="17.5" x2="72" y2="17.5"
            stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

      {/* Driver arms on wheel */}
      <line x1="65" y1="16" x2="64.2" y2="19"
            stroke="#1f2937" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="71" y1="16" x2="71.8" y2="19"
            stroke="#1f2937" strokeWidth="2.2" strokeLinecap="round" />

      {/* ════ WHEELS ══════════════════════════════════ */}

      {/* Front wheel */}
      <ellipse cx="87" cy="42" rx="10" ry="8"
               fill="#111" stroke="#2d2d2d" strokeWidth="1.5" />
      {/* Front spokes — spin via CSS class */}
      <g className="wheel-spin" style={{ transformOrigin: '87px 42px' }}>
        <line x1="87" y1="35" x2="87" y2="49" stroke={color} strokeWidth="1.3" opacity="0.8" />
        <line x1="80.5" y1="37.2" x2="93.5" y2="46.8" stroke={color} strokeWidth="1.3" opacity="0.8" />
        <line x1="80.5" y1="46.8" x2="93.5" y2="37.2" stroke={color} strokeWidth="1.3" opacity="0.8" />
      </g>
      {/* Front rim */}
      <ellipse cx="87" cy="42" rx="5.5" ry="4.5" fill={color} opacity="0.22" />
      <ellipse cx="87" cy="42" rx="2" ry="1.7" fill={color} opacity="0.7" />

      {/* Rear wheel */}
      <ellipse cx="25" cy="42" rx="10" ry="8"
               fill="#111" stroke="#2d2d2d" strokeWidth="1.5" />
      {/* Rear spokes */}
      <g className="wheel-spin" style={{ transformOrigin: '25px 42px' }}>
        <line x1="25" y1="35" x2="25" y2="49" stroke={color} strokeWidth="1.3" opacity="0.8" />
        <line x1="18.5" y1="37.2" x2="31.5" y2="46.8" stroke={color} strokeWidth="1.3" opacity="0.8" />
        <line x1="18.5" y1="46.8" x2="31.5" y2="37.2" stroke={color} strokeWidth="1.3" opacity="0.8" />
      </g>
      {/* Rear rim */}
      <ellipse cx="25" cy="42" rx="5.5" ry="4.5" fill={color} opacity="0.22" />
      <ellipse cx="25" cy="42" rx="2" ry="1.7" fill={color} opacity="0.7" />

    </svg>
  )
}
