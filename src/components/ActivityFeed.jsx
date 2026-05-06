import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DEPARTMENTS, getCarColor } from '../config'

function timeAgo(isoStr) {
  const diff = (Date.now() - new Date(isoStr).getTime()) / 1000
  if (diff < 60) return `${Math.floor(diff)}s`
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  return `${Math.floor(diff / 86400)}d`
}

export default function ActivityFeed({ recentDeals }) {
  const [items, setItems] = useState(recentDeals.slice(0, 8))
  const prevIds = useRef(new Set(recentDeals.map((d) => d.id)))

  useEffect(() => {
    const newItems = recentDeals.slice(0, 8)
    setItems(newItems)
    prevIds.current = new Set(newItems.map((d) => d.id))
  }, [recentDeals])

  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: 'rgba(255,255,255,0.015)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
        </span>
        <span className="font-orbitron font-bold text-sm text-white/80 uppercase tracking-wider">
          Actividad en vivo
        </span>
      </div>

      <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1 scrollbar-thin">
        <AnimatePresence initial={false}>
          {items.map((deal) => {
            const deptCfg = DEPARTMENTS[deal.dept]
            // Usar color del agente si está disponible, si no el del depto
            const color = deal.agentCarColor ?? getCarColor(deal.agentId)
            return (
              <motion.div
                key={deal.id}
                layout
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ type: 'spring', bounce: 0.2 }}
                className="flex items-start gap-2.5 py-2 border-b border-white/5 last:border-0"
              >
                {/* Dept icon */}
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-base flex-shrink-0 mt-0.5"
                  style={{ background: `${color}20` }}
                >
                  {deptCfg?.icon ?? '💼'}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="font-rajdhani font-semibold text-xs text-white/80 truncate">
                    {deal.agentName}
                  </div>
                  <div className="font-rajdhani text-[11px] text-white/35 flex items-center gap-1">
                    <span style={{ color }}>Deal ganado</span>
                    {deal.value > 0 && (
                      <>
                        <span>·</span>
                        <span>${deal.value.toLocaleString()}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Time */}
                <div className="font-orbitron text-[10px] text-white/25 flex-shrink-0 mt-0.5">
                  {timeAgo(deal.time)}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {items.length === 0 && (
        <p className="text-white/20 text-xs font-rajdhani text-center py-4">
          Sin actividad reciente
        </p>
      )}
    </div>
  )
}
