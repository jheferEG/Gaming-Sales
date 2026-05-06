import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AgentRaceRow from './AgentRaceRow'
import { DEPARTMENTS, DEPT_TABS } from '../config'

function DeptGroupHeader({ deptKeys, agents, color, glow, name }) {
  const groupAgents = agents.filter((a) => deptKeys.includes(a.department))
  const totalDeals = groupAgents.reduce((s, a) => s + a.deals, 0)
  const totalGoal = groupAgents.reduce((s, a) => s + a.goal, 0)
  const pct = totalGoal > 0 ? Math.min((totalDeals / totalGoal) * 100, 100) : 0
  const deptCfg = DEPARTMENTS[deptKeys[0]]

  return (
    <div className="mb-3 mt-1">
      {/* Label row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{deptCfg?.icon ?? '⭐'}</span>
          <span
            className="font-orbitron font-bold text-sm uppercase tracking-widest"
            style={{ color, textShadow: `0 0 12px ${glow}` }}
          >
            {name}
          </span>
          <span className="text-white/20 font-rajdhani text-xs">{groupAgents.length} agentes</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-orbitron text-xs" style={{ color }}>
            {totalDeals.toLocaleString()} / {totalGoal.toLocaleString()}
          </span>
          <span
            className="font-orbitron text-xs px-2 py-0.5 rounded-full"
            style={{ background: `${color}20`, color }}
          >
            {pct.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Dept progress bar */}
      <div className="h-1.5 rounded-full bg-white/5 mb-3 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{ background: `linear-gradient(90deg, ${color}99, ${color})`, boxShadow: `0 0 8px ${glow}` }}
        />
      </div>
    </div>
  )
}

export default function RaceBoard({ agents, selectedTab, newDealAgentId }) {
  const tabCfg = DEPT_TABS.find((t) => t.key === selectedTab) ?? DEPT_TABS[0]

  // Groups to show: when 'all', each department is its own group.
  // When 'pc', auto+casa+comercial merge into one group.
  const groups = useMemo(() => {
    if (selectedTab === 'all') {
      // Each department key becomes its own group
      const seen = new Set()
      return DEPT_TABS.filter((t) => t.key !== 'all').map((t) => ({
        key: t.key,
        name: t.name,
        color: t.color,
        glow: t.glow,
        deptKeys: t.depts,
        sortedAgents: agents
          .filter((a) => t.depts.includes(a.department))
          .sort((a, b) => b.deals - a.deals),
      }))
    }
    return [
      {
        key: tabCfg.key,
        name: tabCfg.name,
        color: tabCfg.color,
        glow: tabCfg.glow,
        deptKeys: tabCfg.depts,
        sortedAgents: agents
          .filter((a) => tabCfg.depts.includes(a.department))
          .sort((a, b) => b.deals - a.deals),
      },
    ]
  }, [agents, selectedTab, tabCfg])

  if (agents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-white/20 gap-3">
        <span className="text-5xl">🏁</span>
        <span className="font-rajdhani text-lg">Cargando datos de Bitrix24…</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {groups.map((group) =>
          group.sortedAgents.length === 0 ? null : (
            <motion.section
              key={group.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="rounded-2xl p-4"
              style={{
                background: 'rgba(255,255,255,0.015)',
                border: `1px solid rgba(255,255,255,0.06)`,
                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.04)`,
              }}
            >
              <DeptGroupHeader
                deptKeys={group.deptKeys}
                agents={agents}
                color={group.color}
                glow={group.glow}
                name={group.name}
              />

              {/* Header labels */}
              <div className="flex items-center gap-3 mb-2 px-1">
                <div className="w-[195px] flex-shrink-0 text-[10px] uppercase tracking-widest text-white/20 font-rajdhani pl-10">
                  Agente
                </div>
                <div className="flex-1 text-[10px] uppercase tracking-widest text-white/20 font-rajdhani">
                  Pista
                </div>
                <div className="w-[90px] flex-shrink-0 text-right text-[10px] uppercase tracking-widest text-white/20 font-rajdhani">
                  Deals / Meta
                </div>
              </div>

              {group.sortedAgents.map((agent, i) => (
                <AgentRaceRow
                  key={agent.id}
                  agent={agent}
                  rank={i + 1}
                  tabColor={group.color}
                  isNew={newDealAgentId === agent.id}
                />
              ))}
            </motion.section>
          )
        )}
      </AnimatePresence>
    </div>
  )
}
