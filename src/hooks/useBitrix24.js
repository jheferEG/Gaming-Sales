/**
 * useBitrix24 — wrapper del SDK de Bitrix24.
 * Cuando la app corre dentro de un iframe de Bitrix24, window.BX24 está
 * disponible y se usa directamente.  En cualquier otro entorno (dev, preview)
 * las llamadas caen al modo mock automáticamente.
 */
import { useState, useEffect, useCallback } from 'react'
import { MOCK_AGENTS, MOCK_RECENT_DEALS } from '../data/mockData'
import { DEPARTMENTS, YEAR_START } from '../config'

const isBX24 = () => typeof window !== 'undefined' && !!window.BX24

// Helpers para convertir respuestas paginadas
function bx24Promise(method, params = {}) {
  return new Promise((resolve, reject) => {
    window.BX24.callMethod(method, params, (res) => {
      if (res.error()) {
        reject(res.error())
      } else {
        resolve({ data: res.data(), total: res.total(), more: res.more() })
      }
    })
  })
}

async function bx24All(method, params = {}) {
  const all = []
  let start = 0
  while (true) {
    const { data, more } = await bx24Promise(method, { ...params, start })
    all.push(...data)
    if (!more) break
    start += 50
  }
  return all
}

// ── Mock fallback ────────────────────────────────────────────────────────────

function buildMockResult() {
  return {
    agents: MOCK_AGENTS.map((a) => ({ ...a })),
    recentDeals: MOCK_RECENT_DEALS.map((d) => ({ ...d })),
  }
}

// ── Bitrix24 real fetch ──────────────────────────────────────────────────────

async function fetchFromBitrix24() {
  // 1. Obtener todos los usuarios activos
  const rawUsers = await bx24All('user.get', {
    FILTER: { ACTIVE: true },
    SELECT: ['ID', 'NAME', 'LAST_NAME', 'UF_DEPARTMENT', 'PERSONAL_PHOTO'],
  })

  // 2. Mapear departamento Bitrix → clave interna
  const deptMap = {}
  for (const [key, cfg] of Object.entries(DEPARTMENTS)) {
    for (const bid of cfg.bitrixDeptIds) {
      deptMap[String(bid)] = key
    }
  }

  const userDeptMap = {}
  const validUserIds = []
  for (const u of rawUsers) {
    const depts = Array.isArray(u.UF_DEPARTMENT) ? u.UF_DEPARTMENT : [u.UF_DEPARTMENT]
    const deptKey = depts.map((d) => deptMap[String(d)]).find(Boolean)
    if (deptKey) {
      userDeptMap[String(u.ID)] = { deptKey, name: `${u.NAME} ${u.LAST_NAME}`.trim(), avatar: u.PERSONAL_PHOTO || null }
      validUserIds.push(String(u.ID))
    }
  }

  if (validUserIds.length === 0) {
    // bitrixDeptIds no configurados → fallback mock
    return buildMockResult()
  }

  // 3. Obtener deals won del año en curso
  const rawDeals = await bx24All('crm.deal.list', {
    FILTER: {
      IS_WON: 'Y',
      '>CLOSEDATE': YEAR_START,
    },
    SELECT: ['ID', 'ASSIGNED_BY_ID', 'CLOSEDATE', 'OPPORTUNITY', 'CURRENCY_ID'],
    ORDER: { CLOSEDATE: 'DESC' },
  })

  // 4. Agrupar por agente
  const dealsByAgent = {}
  const recentDeals = []
  for (const deal of rawDeals) {
    const uid = String(deal.ASSIGNED_BY_ID)
    if (!userDeptMap[uid]) continue
    dealsByAgent[uid] = (dealsByAgent[uid] || 0) + 1
    if (recentDeals.length < 20) {
      recentDeals.push({
        id: deal.ID,
        agentId: uid,
        agentName: userDeptMap[uid].name,
        dept: userDeptMap[uid].deptKey,
        time: deal.CLOSEDATE,
        value: parseFloat(deal.OPPORTUNITY) || 0,
      })
    }
  }

  // 5. Construir lista de agentes
  const agents = validUserIds.map((uid) => {
    const { deptKey, name, avatar } = userDeptMap[uid]
    const cfg = DEPARTMENTS[deptKey]
    return {
      id: uid,
      name,
      department: deptKey,
      deals: dealsByAgent[uid] || 0,
      goal: cfg.defaultGoal,
      avatar,
      bitrixId: Number(uid),
    }
  })

  return { agents, recentDeals }
}

// ── Hook público ─────────────────────────────────────────────────────────────

export function useBitrix24() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (isBX24()) {
      window.BX24.init(() => setReady(true))
    } else {
      setReady(true)
    }
  }, [])

  const fetchData = useCallback(async () => {
    if (!ready) return null
    if (isBX24()) {
      return fetchFromBitrix24()
    }
    // Simular latencia en mock
    await new Promise((r) => setTimeout(r, 600))
    return buildMockResult()
  }, [ready])

  return { ready, fetchData }
}
