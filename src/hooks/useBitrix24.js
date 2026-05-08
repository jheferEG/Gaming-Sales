/**
 * useBitrix24 — wrapper del SDK de Bitrix24.
 *
 * Estrategia de mapeo de departamentos (en orden):
 *  1. bitrixDeptIds configurados en config.js  → match exacto por ID
 *  2. Nombre del depto. de Bitrix24            → match por substring (sin config manual)
 *  3. Usuarios sin depto. reconocido           → se omiten
 *
 * En dev/preview (sin window.BX24) usa datos mock automáticamente.
 */
import { useState, useEffect, useCallback } from 'react'
import { MOCK_AGENTS, MOCK_RECENT_DEALS } from '../data/mockData'
import { DEPARTMENTS, YEAR_START } from '../config'

const isBX24 = () => typeof window !== 'undefined' && !!window.BX24

// ── BX24 helpers ─────────────────────────────────────────────────────────────

function bx24Promise(method, params = {}) {
  return new Promise((resolve, reject) => {
    window.BX24.callMethod(method, params, (res) => {
      if (res.error()) reject(res.error())
      else resolve({ data: res.data(), more: res.more() })
    })
  })
}

async function bx24All(method, params = {}) {
  const all = []
  let start = 0
  while (true) {
    const { data, more } = await bx24Promise(method, { ...params, start })
    all.push(...(data ?? []))
    if (!more) break
    start += 50
  }
  return all
}

// ── Dept mapping helpers ──────────────────────────────────────────────────────

/** Construye mapa bxDeptId → clave interna usando los IDs configurados */
function buildIdMap() {
  const map = {}
  for (const [key, cfg] of Object.entries(DEPARTMENTS)) {
    for (const bid of (cfg.bitrixDeptIds ?? [])) {
      map[String(bid)] = key
    }
  }
  return map
}

/** Construye mapa bxDeptId → clave interna usando nombres reales de BX24 */
function buildNameMap(bxDeptNames) {
  const map = {}
  for (const [bxId, bxName] of Object.entries(bxDeptNames)) {
    const lower = bxName.toLowerCase()
    for (const [key, cfg] of Object.entries(DEPARTMENTS)) {
      if (
        lower.includes(key) ||
        lower.includes(cfg.name.toLowerCase())
      ) {
        map[bxId] = key
        break
      }
    }
  }
  return map
}

/** Devuelve la clave interna para los departamentos BX24 de un usuario */
function resolveUserDept(bxDeptIds, idMap, nameMap) {
  for (const bid of bxDeptIds) {
    if (idMap[bid])   return idMap[bid]
    if (nameMap[bid]) return nameMap[bid]
  }
  return null
}

// ── Mock fallback ─────────────────────────────────────────────────────────────

function buildMockResult() {
  return {
    agents: MOCK_AGENTS.map((a) => ({ ...a })),
    recentDeals: MOCK_RECENT_DEALS.map((d) => ({ ...d })),
  }
}

// ── Bitrix24 real fetch ───────────────────────────────────────────────────────

async function fetchFromBitrix24() {
  // 1. Todos los usuarios activos con foto de perfil
  const rawUsers = await bx24All('user.get', {
    ACTIVE: true,
    SELECT: ['ID', 'NAME', 'LAST_NAME', 'UF_DEPARTMENT', 'PERSONAL_PHOTO'],
  })

  // 2. Nombres reales de departamentos desde BX24 (para match por nombre)
  let bxDeptNames = {}
  try {
    const depts = await bx24All('department.get', {})
    depts.forEach((d) => { bxDeptNames[String(d.ID)] = d.NAME })
  } catch (e) {
    console.warn('[useBitrix24] department.get:', e)
  }

  // 3. Construir mapas de resolución (ID configurado → nombre como fallback)
  const idMap   = buildIdMap()
  const nameMap = buildNameMap(bxDeptNames)

  // 4. Procesar cada usuario: obtener dept interno + foto + nombre
  const userDeptMap = {}
  for (const u of rawUsers) {
    const uid = String(u.ID)
    const bxDepts = Array.isArray(u.UF_DEPARTMENT)
      ? u.UF_DEPARTMENT.map(String).filter(Boolean)
      : u.UF_DEPARTMENT ? [String(u.UF_DEPARTMENT)] : []

    const deptKey = resolveUserDept(bxDepts, idMap, nameMap)
    if (!deptKey) continue // usuario fuera de departamentos conocidos

    userDeptMap[uid] = {
      deptKey,
      name:   `${u.NAME ?? ''} ${u.LAST_NAME ?? ''}`.trim(),
      avatar: u.PERSONAL_PHOTO || null,
    }
  }

  const validUserIds = Object.keys(userDeptMap)

  // Si no se pudo mapear ningún usuario, devolver mock para no mostrar vacío
  if (validUserIds.length === 0) {
    console.warn('[useBitrix24] No users matched any department. Check bitrixDeptIds or department names in config.js.')
    return buildMockResult()
  }

  // 5. Deals won del año
  const rawDeals = await bx24All('crm.deal.list', {
    FILTER: {
      IS_WON: 'Y',
      '>CLOSEDATE': YEAR_START,
    },
    SELECT: ['ID', 'ASSIGNED_BY_ID', 'CLOSEDATE', 'OPPORTUNITY'],
    ORDER: { CLOSEDATE: 'DESC' },
  })

  const dealsByAgent = {}
  const recentDeals  = []
  for (const deal of rawDeals) {
    const uid = String(deal.ASSIGNED_BY_ID)
    if (!userDeptMap[uid]) continue
    dealsByAgent[uid] = (dealsByAgent[uid] || 0) + 1
    if (recentDeals.length < 20) {
      recentDeals.push({
        id:        deal.ID,
        agentId:   uid,
        agentName: userDeptMap[uid].name,
        dept:      userDeptMap[uid].deptKey,
        time:      deal.CLOSEDATE,
        value:     parseFloat(deal.OPPORTUNITY) || 0,
      })
    }
  }

  // 6. Construir lista de agentes
  const agents = validUserIds.map((uid) => {
    const { deptKey, name, avatar } = userDeptMap[uid]
    const cfg = DEPARTMENTS[deptKey]
    return {
      id:         uid,
      name,
      department: deptKey,
      deals:      dealsByAgent[uid] || 0,
      goal:       cfg.defaultGoal,
      avatar,
      bitrixId:   Number(uid),
    }
  })

  return { agents, recentDeals }
}

// ── Hook público ──────────────────────────────────────────────────────────────

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
    if (isBX24()) return fetchFromBitrix24()
    await new Promise((r) => setTimeout(r, 600))
    return buildMockResult()
  }, [ready])

  return { ready, fetchData }
}
