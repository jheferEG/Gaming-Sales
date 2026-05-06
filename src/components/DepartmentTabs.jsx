import { motion } from 'framer-motion'
import { DEPT_TABS } from '../config'

export default function DepartmentTabs({ selected, onChange, agents }) {
  const countFor = (tab) =>
    agents.filter((a) => tab.depts.includes(a.department)).length

  return (
    <div className="flex gap-2 flex-wrap">
      {DEPT_TABS.map((tab) => {
        const active = selected === tab.key
        const count = countFor(tab)
        return (
          <motion.button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="relative px-5 py-2.5 rounded-xl font-rajdhani font-semibold text-sm transition-all duration-200"
            style={{
              background: active
                ? `linear-gradient(135deg, ${tab.color}22, ${tab.color}11)`
                : 'rgba(255,255,255,0.03)',
              border: `1px solid ${active ? tab.color + '55' : 'rgba(255,255,255,0.07)'}`,
              color: active ? tab.color : 'rgba(255,255,255,0.45)',
              boxShadow: active ? `0 0 18px ${tab.glow}` : 'none',
            }}
          >
            {active && (
              <motion.div
                layoutId="tab-pill"
                className="absolute inset-0 rounded-xl"
                style={{ background: `${tab.color}10` }}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {tab.name}
              <span
                className="text-[11px] px-1.5 py-0.5 rounded-full font-orbitron"
                style={{
                  background: active ? `${tab.color}30` : 'rgba(255,255,255,0.06)',
                  color: active ? tab.color : 'rgba(255,255,255,0.3)',
                }}
              >
                {count}
              </span>
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}
