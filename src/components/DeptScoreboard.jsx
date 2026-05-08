import { useState } from 'react'
import { motion } from 'framer-motion'

const MEDALS = ['🥇', '🥈', '🥉']

function AgentAvatar({ name, color, avatar, size = 28 }) {
  const [imgError, setImgError] = useState(false)
  const initials = name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()

  if (avatar && !imgError) {
    return (
      <img
        src={avatar}
        alt={name}
        onError={() => setImgError(true)}
        style={{
          width: size, height: size,
          borderRadius: '50%',
          objectFit: 'cover',
          flexShrink: 0,
          border: `1.5px solid ${color}55`,
        }}
      />
    )
  }
  return (
    <div style={{
      width: size, height: size,
      borderRadius: '50%',
      background: `${color}18`,
      border: `1.5px solid ${color}44`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.38,
      fontFamily: 'Orbitron, sans-serif',
      fontWeight: 700,
      color,
      flexShrink: 0,
    }}>
      {initials}
    </div>
  )
}

export default function DeptScoreboard({ agents, color }) {
  const sorted = [...agents].sort((a, b) => b.deals - a.deals)

  return (
    <div
      className="mt-3 rounded-xl overflow-hidden"
      style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(0,0,0,0.18)' }}
    >
      {/* Header row */}
      <div
        className="grid font-orbitron text-[9px] uppercase tracking-widest text-white/25 px-3 py-2"
        style={{
          gridTemplateColumns: '28px 1fr 80px 60px 36px',
          gap: '8px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(255,255,255,0.02)',
        }}
      >
        <span className="text-center">#</span>
        <span>Agente</span>
        <span className="text-center">Progreso</span>
        <span className="text-right">Won / Meta</span>
        <span className="text-right">%</span>
      </div>

      {/* Agent rows */}
      {sorted.map((agent, i) => {
        const pct = Math.min((agent.deals / agent.goal) * 100, 100)
        const exceeded = agent.deals > agent.goal
        const agentColor = agent.carColor ?? color
        return (
          <motion.div
            key={agent.id}
            layout
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className="grid items-center px-3 py-2"
            style={{
              gridTemplateColumns: '28px 1fr 80px 60px 36px',
              gap: '8px',
              borderBottom: i < sorted.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              background: i < 3 ? 'rgba(255,255,255,0.015)' : 'transparent',
            }}
          >
            {/* Rank */}
            <span className="text-center text-sm leading-none">
              {i < 3
                ? MEDALS[i]
                : <span className="font-orbitron text-[10px] text-white/25">#{i + 1}</span>}
            </span>

            {/* Name + avatar */}
            <div className="flex items-center gap-2 min-w-0">
              <AgentAvatar name={agent.name} color={agentColor} avatar={agent.avatar} size={24} />
              <div className="min-w-0">
                <div className="font-rajdhani font-semibold text-xs text-white/80 truncate leading-tight">
                  {agent.name.split(' ')[0]} {agent.name.split(' ')[1]?.[0]}.
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-[5px] rounded-full overflow-hidden bg-white/5">
              <motion.div
                className="h-full rounded-full"
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                style={{
                  background: agentColor,
                  boxShadow: `0 0 6px ${agentColor}88`,
                }}
              />
            </div>

            {/* Deals / Goal */}
            <div className="text-right font-orbitron text-[10px]" style={{ color: exceeded ? '#facc15' : `${agentColor}cc` }}>
              {agent.deals}<span className="text-white/25">/{agent.goal}</span>
            </div>

            {/* % */}
            <div
              className="text-right font-orbitron font-bold text-[10px]"
              style={{ color: exceeded ? '#facc15' : `${agentColor}bb` }}
            >
              {exceeded ? `+${agent.deals - agent.goal}` : `${pct.toFixed(0)}%`}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
