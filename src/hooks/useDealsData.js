import { useState, useEffect, useCallback, useRef } from 'react'
import { useBitrix24 } from './useBitrix24'
import { REFRESH_INTERVAL, getCarColor } from '../config'

export function useDealsData() {
  const { ready, fetchData } = useBitrix24()
  const [agents, setAgents] = useState([])
  const [recentDeals, setRecentDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [newDealAgentId, setNewDealAgentId] = useState(null)

  const prevDealsRef = useRef({})
  const timerRef = useRef(null)

  const load = useCallback(async () => {
    if (!ready) return
    const result = await fetchData()
    if (!result) return

    const { agents: newAgents, recentDeals: newDeals } = result

    // Detectar agentes con deal nuevo (para animación)
    for (const agent of newAgents) {
      const prev = prevDealsRef.current[agent.id] ?? agent.deals
      if (agent.deals > prev) {
        setNewDealAgentId(agent.id)
        setTimeout(() => setNewDealAgentId(null), 2000)
      }
      prevDealsRef.current[agent.id] = agent.deals
    }

    // Asignar color único y estable a cada agente
    const coloredAgents = newAgents.map((a) => ({
      ...a,
      carColor: getCarColor(a.id),
    }))

    setAgents(coloredAgents)
    setRecentDeals(newDeals)
    setLastUpdated(new Date())
    setLoading(false)
  }, [ready, fetchData])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if (!ready) return
    timerRef.current = setInterval(load, REFRESH_INTERVAL)
    return () => clearInterval(timerRef.current)
  }, [ready, load])

  return { agents, recentDeals, loading, lastUpdated, newDealAgentId, refresh: load }
}
