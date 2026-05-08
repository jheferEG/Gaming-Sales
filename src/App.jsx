import { useState, useEffect } from 'react'
import Header from './components/Header'
import DepartmentTabs from './components/DepartmentTabs'
import RaceBoard from './components/RaceBoard'
import Leaderboard from './components/Leaderboard'
import ActivityFeed from './components/ActivityFeed'
import GoalCelebration from './components/GoalCelebration'
import DeptRanking from './components/DeptRanking'
import { useDealsData } from './hooks/useDealsData'
import { useEngineSound } from './hooks/useEngineSound'
import { DEPT_TABS } from './config'

export default function App() {
  const [selectedTab, setSelectedTab] = useState('all')
  const [celebrating, setCelebrating] = useState(null)
  const { agents, recentDeals, loading, lastUpdated, newDealAgentId, refresh } = useDealsData()
  const { toggleSound, revUp, celebrate, soundOn } = useEngineSound()

  // Fire rev-up sound when a new deal lands
  useEffect(() => {
    if (!newDealAgentId) return
    revUp()
    const agent = agents.find((a) => a.id === newDealAgentId)
    if (agent && agent.deals >= agent.goal && !celebrating) {
      setCelebrating(agent)
    }
  }, [newDealAgentId])

  // Fire fanfare when celebration starts
  useEffect(() => {
    if (celebrating) celebrate()
  }, [celebrating])

  const tabCfg = DEPT_TABS.find((t) => t.key === selectedTab) ?? DEPT_TABS[0]
  const filteredAgents = agents.filter((a) => tabCfg.depts.includes(a.department))
  const totalDeals = agents.reduce((s, a) => s + a.deals, 0)

  return (
    <div className="min-h-screen bg-bg text-white font-rajdhani relative overflow-x-hidden">
      {/* Ambient star field */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="star-field" />
        <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] rounded-full opacity-[0.035]"
             style={{ background: 'radial-gradient(circle, #A855F7 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-10%] right-[5%] w-[500px] h-[500px] rounded-full opacity-[0.035]"
             style={{ background: 'radial-gradient(circle, #06B6D4 0%, transparent 70%)' }} />
      </div>

      <Header
        totalDeals={totalDeals}
        lastUpdated={lastUpdated}
        onRefresh={refresh}
        loading={loading}
        soundOn={soundOn}
        onToggleSound={() => toggleSound(!soundOn)}
      />

      <main className="relative z-10 max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        <DepartmentTabs
          selected={selectedTab}
          onChange={setSelectedTab}
          agents={agents}
        />

        {loading && agents.length === 0 ? (
          <LoadingSkeleton />
        ) : (
          <div className="flex flex-col xl:flex-row gap-5">
            <div className="flex-1 min-w-0">
              <RaceBoard
                agents={filteredAgents}
                selectedTab={selectedTab}
                newDealAgentId={newDealAgentId}
              />
            </div>
            <div className="xl:w-72 flex-shrink-0 space-y-5">
              <DeptRanking agents={agents} />
              <Leaderboard agents={filteredAgents} />
              <ActivityFeed recentDeals={recentDeals} />
            </div>
          </div>
        )}
      </main>

      <GoalCelebration
        agent={celebrating}
        onDismiss={() => setCelebrating(null)}
      />
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-20 rounded-xl"
             style={{ background: 'rgba(255,255,255,0.04)' }} />
      ))}
    </div>
  )
}
