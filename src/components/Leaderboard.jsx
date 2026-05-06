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

      <div className="space-y-2">
        <AnimatePresence>
          {sorted.map((agent, i) => {
            const color = agent.carColor ?? getCarColor(agent.id)
            const pct = Math.min((agent.deals / agent.goal) * 100, 100)
            return (
              <motion.div
                key={agent.id}
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.04, type: 'spring', bounce: 0.2 }}
                className="flex items-center gap-2.5"
              >
                {/* Rank */}
                <div className="w-6 text-center text-sm flex-shrink-0">
                  {i < 3 ? (
                    <span>{TROPHIES[i]}</span>
                  ) : (
                    <span className="font-orbitron text-xs text-white/25">{i + 1}</span>
                  )}
                </div>

                {/* Name + bar */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-rajdhani font-semibold text-xs text-white/80 truncate">
                      {agent.name.split(' ')[0]} {agent.name.split(' ')[1]?.[0]}.
                    </span>
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
