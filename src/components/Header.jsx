import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(value)
  const [bump, setBump] = useState(false)
  useEffect(() => {
    if (value !== display) {
      setBump(true)
      setTimeout(() => { setDisplay(value); setBump(false) }, 150)
    }
  }, [value])
  return (
    <motion.span
      animate={bump ? { scale: [1, 1.3, 1] } : {}}
      transition={{ duration: 0.35 }}
      className="inline-block font-orbitron"
    >
      {display.toLocaleString()}
    </motion.span>
  )
}

function Clock() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <span className="font-orbitron text-cyan-400 text-sm">
      {time.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </span>
  )
}

export default function Header({ totalDeals, lastUpdated, onRefresh, loading, soundOn, onToggleSound }) {
  return (
    <header className="relative z-10 border-b border-white/5 bg-[#060911]/90 backdrop-blur-md">
      <div className="h-[2px] w-full bg-gradient-to-r from-purple-600 via-cyan-400 to-orange-500 opacity-80" />

      <div className="max-w-screen-2xl mx-auto px-5 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <span className="text-2xl">🏁</span>
            <span className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping"
                  style={{ animationDuration: '2.5s' }} />
          </div>
          <div>
            <h1 className="font-orbitron font-black text-xl text-white tracking-widest uppercase leading-none">
              Sales<span className="text-cyan-400">Race</span>
            </h1>
            <p className="text-[10px] text-white/30 tracking-[0.25em] uppercase">Corporate Goal 2025</p>
          </div>
        </div>

        {/* Center stats */}
        <div className="hidden md:flex items-center gap-6">
          <Stat label="Total Deals Won" value={<AnimatedNumber value={totalDeals} />} accent="#06B6D4" />
          <div className="w-px h-8 bg-white/10" />
          <Stat label="Hora en vivo"   value={<Clock />}                             accent="#A855F7" />
          <div className="w-px h-8 bg-white/10" />
          <Stat
            label="Actualizado"
            value={lastUpdated
              ? lastUpdated.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
              : '—'}
            accent="#10B981"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Sound toggle */}
          <motion.button
            onClick={onToggleSound}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.06 }}
            title={soundOn ? 'Silenciar sonido' : 'Activar sonido de carrera'}
            className="w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-200"
            style={{
              background:     soundOn ? 'rgba(6,182,212,0.15)' : 'rgba(255,255,255,0.04)',
              borderColor:    soundOn ? 'rgba(6,182,212,0.45)' : 'rgba(255,255,255,0.09)',
              boxShadow:      soundOn ? '0 0 14px rgba(6,182,212,0.35)' : 'none',
              fontSize: '1.15rem',
            }}
          >
            {soundOn ? '🔊' : '🔇'}
          </motion.button>

          {/* Refresh */}
          <motion.button
            onClick={onRefresh}
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.04 }}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-sm font-rajdhani font-semibold text-white/70 hover:text-white hover:border-white/20 transition-colors disabled:opacity-40"
          >
            <motion.span
              animate={loading ? { rotate: 360 } : { rotate: 0 }}
              transition={loading ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
              className="text-base"
            >
              ⟳
            </motion.span>
            Refresh
          </motion.button>
        </div>
      </div>
    </header>
  )
}

function Stat({ label, value, accent }) {
  return (
    <div className="text-center">
      <div className="text-[10px] uppercase tracking-widest text-white/30 mb-0.5">{label}</div>
      <div className="text-lg font-semibold" style={{ color: accent }}>{value}</div>
    </div>
  )
}
