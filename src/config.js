// ─────────────────────────────────────────────
//  CONFIGURACIÓN DE DEPARTAMENTOS
//  Ajusta los bitrixDeptIds con los IDs reales
//  de tus departamentos en Bitrix24.
// ─────────────────────────────────────────────

export const CORPORATE_YEAR = 2025
export const YEAR_START = `${CORPORATE_YEAR}-01-01`
export const REFRESH_INTERVAL = 60_000 // ms

export const DEPARTMENTS = {
  vida: {
    key: 'vida',
    name: 'Vida',
    label: 'Seguros de Vida',
    color: '#A855F7',
    glow: 'rgba(168,85,247,0.45)',
    icon: '💜',
    defaultGoal: 200,
    bitrixDeptIds: [], // ← llena con IDs de Bitrix24
  },
  auto: {
    key: 'auto',
    name: 'Auto',
    label: 'Auto / Casa / Comercial',
    color: '#06B6D4',
    glow: 'rgba(6,182,212,0.45)',
    icon: '🚗',
    group: 'pc',
    defaultGoal: 300,
    bitrixDeptIds: [],
  },
  casa: {
    key: 'casa',
    name: 'Casa',
    label: 'Auto / Casa / Comercial',
    color: '#06B6D4',
    glow: 'rgba(6,182,212,0.45)',
    icon: '🏠',
    group: 'pc',
    defaultGoal: 200,
    bitrixDeptIds: [],
  },
  comercial: {
    key: 'comercial',
    name: 'Comercial',
    label: 'Auto / Casa / Comercial',
    color: '#06B6D4',
    glow: 'rgba(6,182,212,0.45)',
    icon: '🏢',
    group: 'pc',
    defaultGoal: 350,
    bitrixDeptIds: [],
  },
  medicare: {
    key: 'medicare',
    name: 'Medicare',
    label: 'Medicare',
    color: '#10B981',
    glow: 'rgba(16,185,129,0.45)',
    icon: '💊',
    defaultGoal: 150,
    bitrixDeptIds: [],
  },
  aca: {
    key: 'aca',
    name: 'ACA',
    label: 'Affordable Care Act',
    color: '#F97316',
    glow: 'rgba(249,115,22,0.45)',
    icon: '🏥',
    defaultGoal: 200,
    bitrixDeptIds: [],
  },
}

// ─────────────────────────────────────────────
//  PALETA DE COLORES POR AUTO
//  Cada agente recibe un color único y estable
//  basado en un hash de su ID de Bitrix24.
// ─────────────────────────────────────────────
export const CAR_COLORS = [
  '#FF3D3D', // rojo llama
  '#FF8C00', // naranja carrera
  '#FFE135', // amarillo campeón
  '#39FF14', // verde neón
  '#00E5FF', // cian eléctrico
  '#BF5FFF', // violeta neón
  '#FF4081', // rosa fucsia
  '#FF6D00', // naranja profundo
  '#00E676', // verde esmeralda
  '#651FFF', // índigo oscuro
  '#FF80AB', // rosa claro
  '#00B0FF', // azul celeste
  '#76FF03', // lima brillante
  '#FFAB40', // ámbar dorado
  '#EA80FC', // lavanda vibrante
  '#1DE9B6', // turquesa
  '#FF1744', // rojo vivo
  '#40C4FF', // azul hielo
  '#CCFF90', // verde menta
  '#FFD740', // oro radiante
]

/** Asigna un color estable por agentId (hash determinístico) */
export function getCarColor(agentId) {
  const s = String(agentId)
  let h = 5381
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h + s.charCodeAt(i)) >>> 0
  }
  return CAR_COLORS[h % CAR_COLORS.length]
}

// Grupos de pestañas
export const DEPT_TABS = [
  {
    key: 'all',
    name: 'Todos',
    color: '#6366F1',
    glow: 'rgba(99,102,241,0.45)',
    depts: ['vida', 'auto', 'casa', 'comercial', 'medicare', 'aca'],
  },
  {
    key: 'vida',
    name: 'Vida',
    color: '#A855F7',
    glow: 'rgba(168,85,247,0.45)',
    depts: ['vida'],
  },
  {
    key: 'pc',
    name: 'Auto / Casa / Com.',
    color: '#06B6D4',
    glow: 'rgba(6,182,212,0.45)',
    depts: ['auto', 'casa', 'comercial'],
  },
  {
    key: 'medicare',
    name: 'Medicare',
    color: '#10B981',
    glow: 'rgba(16,185,129,0.45)',
    depts: ['medicare'],
  },
  {
    key: 'aca',
    name: 'ACA',
    color: '#F97316',
    glow: 'rgba(249,115,22,0.45)',
    depts: ['aca'],
  },
]
