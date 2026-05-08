import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import RaceCar from './RaceCar'
import { DEPARTMENTS, getCarColor } from '../config'

// ── Avatar with photo support ─────────────────────────────
function AvatarPhoto({ name, color, avatar }) {
  const [imgError, setImgError] = useState(false)
  const initials = name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()

  if (avatar && !imgError) {
    return (
      <img
        src={avatar}
        alt={name}
        onError={() => setImgError(true)}
        className="w-8 h-8 rounded-full flex-shrink-0 object-cover"
        style={{ border: `1.5px solid ${color}55` }}
      />
    )
  }
  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-orbitron font-bold flex-shrink-0"
      style={{ background: `${color}18`, border: `1.5px solid ${color}44`, color }}
    >
      {initials}
    </div>
  )
}

const RANK_MEDALS = ['🥇', '🥈', '🥉']
const CAR_SCALE   = 0.66   // Tamaño del auto en la pista

// ── Contador animado ──────────────────────────────────
function AnimatedCount({ value, color }) {
  const [shown, setShown] = useState(value)
  const [bump, setBump]   = useState(false)
  useEffect(() => {
    if (value !== shown) {
      setBump(true)
      setTimeout(() => { setShown(value); setBump(false) }, 180)
    }
  }, [value])
  return (
    <motion.span
      animate={bump ? { scale: [1, 1.4, 1] } : {}}
      transition={{ duration: 0.35 }}
      className="font-orbitron font-bold text-sm"
      style={{ color }}
    >
      {shown}
    </motion.span>
  )
}

// ── Humo del escape (integrado junto al auto) ─────────
function Exhaust() {
  return (
    <>
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="exhaust-puff"
          style={{
            '--delay': `${i * 0.16}s`,
            '--dx': `${-12 - i * 7}px`,
            '--dy': `${i % 2 === 0 ? -5 : 4}px`,
            background: 'radial-gradient(circle, rgba(160,160,160,0.45), transparent 70%)',
          }}
        />
      ))}
    </>
  )
}

// ── Fila principal ────────────────────────────────────
export default function AgentRaceRow({ agent, rank, isNew }) {
  const deptCfg = DEPARTMENTS[agent.department]
  const color   = agent.carColor ?? getCarColor(agent.id)
  const progress = Math.min((agent.deals / agent.goal) * 100, 100)
  const exceeded = agent.deals > agent.goal

  // posición del auto (% dentro de la pista): 2% → 85%
  const carLeft = Math.max(2, Math.min(progress * 0.85, 85))

  const [pulse, setPulse] = useState(false)
  useEffect(() => {
    if (isNew) { setPulse(true); setTimeout(() => setPulse(false), 1500) }
  }, [isNew])

  const subLabel = deptCfg?.group === 'pc' ? deptCfg.name : null

  // Altura del SVG renderizado
  const carH = Math.round(52 * CAR_SCALE)  // ≈ 34 px

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', bounce: 0.25 }}
      className="flex items-center gap-3 mb-2.5"
    >
      {/* ── Info agente ─────────────────── */}
      <div className="w-[188px] flex-shrink-0 flex items-center gap-2">
        <div className="w-7 flex-shrink-0 text-center">
          {rank <= 3
            ? <span className="text-lg leading-none">{RANK_MEDALS[rank - 1]}</span>
            : <span className="font-orbitron text-xs text-white/25">#{rank}</span>}
        </div>
        <AvatarPhoto name={agent.name} color={color} avatar={agent.avatar} />
        <div className="min-w-0">
          <div className="font-rajdhani font-semibold text-sm text-white/85 truncate leading-tight">
            {agent.name.split(' ')[0]}
          </div>
          <div className="font-rajdhani text-[10px] truncate leading-tight" style={{ color: `${color}80` }}>
            {subLabel ?? deptCfg?.name ?? agent.department}
          </div>
        </div>
      </div>

      {/* ── Pista ───────────────────────── */}
      <div
        className="relative flex-1 overflow-hidden"
        style={{
          height: '60px',
          borderRadius: '7px',
          // Borde sutil; brilla con el color del auto cuando llega un deal
          border: `1px solid ${pulse ? color + '50' : 'rgba(255,255,255,0.06)'}`,
          boxShadow: pulse ? `0 0 20px ${color}55` : 'none',
          transition: 'box-shadow 0.5s ease, border-color 0.5s ease',
        }}
      >

        {/* ── ASFALTO — uniforme y limpio ── */}
        <div className="absolute inset-0" style={{ background: '#1c1c1c' }} />

        {/* Textura de asfalto: bandas horizontales muy sutiles */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 1px, transparent 1px, transparent 5px)',
          opacity: 0.55,
        }} />

        {/* Vigneta lateral (profundidad) */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(90deg, rgba(0,0,0,0.22) 0%, transparent 7%, transparent 93%, rgba(0,0,0,0.22) 100%)',
        }} />

        {/* ── BORDILLO SUPERIOR — rojo/blanco suave ── */}
        <div className="absolute top-0 left-0 right-[18px] animate-curb-scroll" style={{ height: '5px' }} />

        {/* ── BORDILLO INFERIOR ── */}
        <div className="absolute bottom-0 left-0 right-[18px] animate-curb-scroll-inv" style={{ height: '5px' }} />

        {/* Línea de borde superior (blanca, muy tenue) */}
        <div className="absolute left-0 right-[18px]" style={{
          top: '5px', height: '1px', background: 'rgba(255,255,255,0.18)',
        }} />

        {/* Línea de borde inferior */}
        <div className="absolute left-0 right-[18px]" style={{
          bottom: '5px', height: '1px', background: 'rgba(255,255,255,0.18)',
        }} />

        {/* ── RAYAS CENTRALES BLANCAS — desplazamiento suave ── */}
        <div
          className="absolute left-0 right-[18px] animate-road-scroll"
          style={{
            top: '50%', height: '2px', marginTop: '-1px',
            backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.38) 0px, rgba(255,255,255,0.38) 18px, transparent 18px, transparent 40px)',
            backgroundSize: '40px 100%',
          }}
        />

        {/* ── RASTRO DE PROGRESO — glow del color del auto ── */}
        <motion.div
          className="absolute left-0 top-[6px] bottom-[6px]"
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', damping: 30, stiffness: 60 }}
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${color}08 55%, ${color}18 100%)`,
            borderRadius: '0 4px 4px 0',
          }}
        />

        {/* ── LÍNEA DE META (bandera a cuadros) ── */}
        <div
          className="absolute top-0 right-0 h-full"
          style={{
            width: '18px',
            backgroundImage: `repeating-conic-gradient(rgba(255,255,255,0.78) 0% 25%, rgba(0,0,0,0.78) 0% 50%)`,
            backgroundSize: '9px 9px',
            opacity: 0.5,
          }}
        />

        {/* ── SOMBRA DEL AUTO ── */}
        <motion.div
          className="absolute pointer-events-none"
          animate={{ left: `${carLeft}%` }}
          transition={{ type: 'spring', damping: 22, stiffness: 55 }}
          style={{
            bottom: '5px',
            transform: 'translateX(-42%)',
            width: '80px',
            height: '6px',
            background: 'radial-gradient(ellipse, rgba(0,0,0,0.55) 0%, transparent 70%)',
          }}
        />

        {/* ── AUTO + HUMO (se mueven juntos) ── */}
        <motion.div
          className="absolute pointer-events-none"
          animate={{ left: `${carLeft}%` }}
          transition={{ type: 'spring', damping: 22, stiffness: 55 }}
          style={{
            top: '50%',
            // centra el cuerpo del auto (≈42% desde arriba en el viewBox)
            transform: `translate(-38%, calc(-50% + 1px))`,
          }}
        >
          {/* Humo posicionado en la parte trasera del SVG */}
          <div style={{
            position: 'absolute',
            left: '4px',
            top: `${carH * 0.58}px`,
            transform: 'translateY(-50%)',
          }}>
            <Exhaust />
          </div>

          {/* Auto */}
          <div className={progress > 0 ? 'car-bobble' : ''}>
            <RaceCar color={color} blazing={pulse} scale={CAR_SCALE} avatar={agent.avatar} />
          </div>
        </motion.div>

        {/* Trofeo si superó la meta */}
        {exceeded && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-lg"
          >
            🏆
          </motion.div>
        )}
      </div>

      {/* ── Stats ───────────────────────── */}
      <div className="w-[86px] flex-shrink-0 text-right">
        <div className="flex items-baseline justify-end gap-1">
          <AnimatedCount value={agent.deals} color={color} />
          <span className="text-white/20 text-[11px] font-rajdhani">/{agent.goal}</span>
        </div>
        <div
          className="text-[11px] font-orbitron font-semibold leading-tight"
          style={{ color: exceeded ? '#facc15' : `${color}bb` }}
        >
          {exceeded ? `+${agent.deals - agent.goal} 🏁` : `${progress.toFixed(0)}%`}
        </div>
      </div>
    </motion.div>
  )
}
