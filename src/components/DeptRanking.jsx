import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { DEPT_TABS, DEPARTMENTS } from '../config'

const MEDALS = ['🥇', '🥈', '🥉']

export default function DeptRanking({ agents }) {
  const ranked = useMemo(() => {
    return DEPT_TABS
      .filter((t) => t.key !== 'all')
      .map((t) => {
        const deptAgents = agents.filter((a) => t.depts.includes(a.department))
        const totalDeals = deptAgents.reduce((s, a) => s + a.deals, 0)
        const totalGoal  = deptAgents.reduce((s, a) => s + a.goal,  0)
        const pct = totalGoal > 0 ? Math.min((totalDeals / totalGoal) * 100, 100) : 0
        const icon = DEPARTMENTS[t.depts[0]]?.icon ?? '⭐'
        return { ...t, totalDeals, totalGoal, pct, agentCount: deptAgents.length, icon }
      })
      .sort((a, b) => b.totalDeals - a.totalDeals)
  }, [agents])

  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: 'rgba(255,255,255,0.015)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Title */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">🏢</span>
        <span className="font-orbitron font-bold text-sm text-white/80 uppercase tracking-wider">
          Ranking Departamentos
        </span>
      </div>

      <div className="space-y-3">
        {ranked.map((dept, i) => (
          <motion.div
            key={dept.key}
            layout
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, type: 'spring', bounce: 0.2 }}
            className="flex items-center gap-2.5"
          >
            {/* Medal */}
            <div className="w-6 text-center flex-shrink-0 text-sm leading-none">
              {i < 3
                ? MEDALS[i]
                : <span className="font-orbitron text-[10px] text-white/25">#{i + 1}</span>}
            </div>

            {/* Icon */}
            <span className="text-base leading-none flex-shrink-0">{dept.icon}</span>

            {/* Name + bar */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between mb-1.5 gap-1">
                <span className="font-rajdhani font-semibold text-xs text-white/80 truncate">
                  {dept.name}
                </span>
                <span className="font-orbitron text-[10px] flex-shrink-0" style={{ color: dept.color }}>
                  {dept.totalDeals.toLocaleString()}
                  <span className="text-white/25">/{dept.totalGoal.toLocaleString()}</span>
                </span>
              </div>
              <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  animate={{ width: `${dept.pct}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  style={{
                    background: `linear-gradient(90deg, ${dept.color}88, ${dept.color})`,
                    boxShadow: `0 0 6px ${dept.glow}`,
                  }}
                />
              </div>
            </div>

            {/* % */}
            <div
              className="font-orbitron font-bold text-[11px] w-9 text-right flex-shrink-0"
              style={{ color: dept.color }}
            >
              {dept.pct.toFixed(0)}%
            </div>
          </motion.div>
        ))}
      </div>

      {/* Agent count footer */}
      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
        <span className="font-rajdhani text-[11px] text-white/25 uppercase tracking-wider">
          Total agentes
        </span>
        <span className="font-orbitron text-xs text-white/40">
          {agents.length}
        </span>
      </div>
    </div>
  )
}
