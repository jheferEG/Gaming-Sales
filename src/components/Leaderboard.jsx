import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DEPARTMENTS, getCarColor } from '../config'

const TROPHIES = ['🥇', '🥈', '🥉', '4°', '5°']

function MiniBar({ pct, color }) {
  return (
    <div className="flex-1 h-1 rounded-full bg-white/5 overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
        style={{ background: color }}
      />
    </div>
  )
}

function AgentAvatar({ name, color, avatar }) {
  const [imgError, setImgError] = useState(false)
  const initials = name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()

  if (avatar && !imgError) {
    return (
      <img
        src={avatar}
        alt={name}
        onError={() => setImgError(true)}
        className="w-6 h-6 rounded-full object-cover flex-shrink-0"
        style={{ border: `1.5px solid ${color}55` }}
      />
    )
  }
  return (
    <div
      className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-orbitron font-bold flex-shrink-0"
      style={{ background: `${color}18`, border: `1.5px solid ${color}44`, color }}
    >
      {initials}
    </div>
  )
}

export default function Leaderboard({ agents, tabColor = '#6366f1' }) {
  const sorted = [...agents].sort((a, b) => b.deals - a.deals).slice(0, 8)

  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: 'rgba(255,255,255,0.015)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">🏆</span>
        <span className="font-orbitron font-bold text-sm text-white/80 uppercase tracking-wider">
          Clasificación
        </span>
      </div>

      <div className="space-y-2.5">
        <AnimatePresence>
          {sorted.map((agent, i) => {
            const color = agent.carColor ?? getCarColor(agent.id)
            const pct = Math.min((agent.deals / agent.goal) * 100, 100)
            const deptCfg = DEPARTMENTS[agent.department]
            return (
              <motion.div
                key={agent.id}
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.04, type: 'spring', bounce: 0.2 }}
                className="flex items-center gap-2"
              >
                {/* Rank */}
                <div className="w-6 text-center text-sm flex-shrink-0">
                  {i < 3 ? (
                    <span>{TROPHIES[i]}</span>
                  ) : (
                    <span className="font-orbitron text-xs text-white/25">{i + 1}</span>
                  )}
                </div>

                {/* Avatar */}
                <AgentAvatar name={agent.name} color={color} avatar={agent.avatar} />

                {/* Name + dept + bar */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1 gap-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="font-rajdhani font-semibold text-xs text-white/80 truncate">
                        {agent.name.split(' ')[0]} {agent.name.split(' ')[1]?.[0]}.
                      </span>
                      {/* Department badge */}
                      {deptCfg && (
                        <span
                          className="font-orbitron text-[8px] px-1.5 py-0.5 rounded-full flex-shrink-0 leading-none"
                          style={{
                            background: `${deptCfg.color}22`,
                            color: `${deptCfg.color}cc`,
                            border: `1px solid ${deptCfg.color}33`,
                          }}
                        >
                          {deptCfg.name}
                        </span>
                      )}
                    </div>
                    <span className="font-orbitron text-[10px] flex-shrink-0 ml-1" style={{ color }}>
                      {agent.deals}
                    </span>
                  </div>
                  <MiniBar pct={pct} color={color} />
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {sorted.length === 0 && (
        <p className="text-white/20 text-xs font-rajdhani text-center py-4">Sin datos aún</p>
      )}
    </div>
  )
}
