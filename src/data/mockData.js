// Datos de demostración — se reemplazan por la API de Bitrix24 en producción

export const MOCK_AGENTS = [
  // ── VIDA ──────────────────────────────────────────
  { id: '101', name: 'María García',     department: 'vida',      deals: 167, goal: 200, bitrixId: 101 },
  { id: '102', name: 'Carlos López',     department: 'vida',      deals: 143, goal: 200, bitrixId: 102 },
  { id: '103', name: 'Ana Martínez',     department: 'vida',      deals:  88, goal: 200, bitrixId: 103 },
  { id: '104', name: 'Pedro Sánchez',    department: 'vida',      deals: 198, goal: 200, bitrixId: 104 },
  { id: '105', name: 'Lucía Fernández',  department: 'vida',      deals: 112, goal: 200, bitrixId: 105 },

  // ── AUTO ──────────────────────────────────────────
  { id: '201', name: 'Laura Torres',     department: 'auto',      deals: 241, goal: 300, bitrixId: 201 },
  { id: '202', name: 'Miguel Rodríguez', department: 'auto',      deals: 178, goal: 300, bitrixId: 202 },
  { id: '203', name: 'Roberto Jiménez',  department: 'auto',      deals:  94, goal: 300, bitrixId: 203 },

  // ── CASA ──────────────────────────────────────────
  { id: '301', name: 'Sofía Chen',       department: 'casa',      deals: 156, goal: 200, bitrixId: 301 },
  { id: '302', name: 'Diego Vargas',     department: 'casa',      deals: 199, goal: 200, bitrixId: 302 },

  // ── COMERCIAL ─────────────────────────────────────
  { id: '401', name: 'Fernando Castro',  department: 'comercial', deals: 312, goal: 350, bitrixId: 401 },
  { id: '402', name: 'Isabella Mora',    department: 'comercial', deals:  67, goal: 350, bitrixId: 402 },

  // ── MEDICARE ──────────────────────────────────────
  { id: '501', name: 'Valentina Cruz',   department: 'medicare',  deals: 134, goal: 150, bitrixId: 501 },
  { id: '502', name: 'Alejandro Díaz',   department: 'medicare',  deals:  78, goal: 150, bitrixId: 502 },
  { id: '503', name: 'Camila Ruiz',      department: 'medicare',  deals:  45, goal: 150, bitrixId: 503 },

  // ── ACA ───────────────────────────────────────────
  { id: '601', name: 'Ricardo Flores',   department: 'aca',       deals: 207, goal: 200, bitrixId: 601 },
  { id: '602', name: 'Natalia Silva',    department: 'aca',       deals:  89, goal: 200, bitrixId: 602 },
  { id: '603', name: 'Andrés Morales',   department: 'aca',       deals: 156, goal: 200, bitrixId: 603 },
]

const now = Date.now()
const ago = (h) => new Date(now - h * 3_600_000).toISOString()

export const MOCK_RECENT_DEALS = [
  { id: 'd1',  agentId: '601', agentName: 'Ricardo Flores',   dept: 'aca',       time: ago(0.3),  value: 1200 },
  { id: 'd2',  agentId: '104', agentName: 'Pedro Sánchez',    dept: 'vida',      time: ago(0.7),  value: 980  },
  { id: 'd3',  agentId: '201', agentName: 'Laura Torres',     dept: 'auto',      time: ago(1.2),  value: 3400 },
  { id: 'd4',  agentId: '501', agentName: 'Valentina Cruz',   dept: 'medicare',  time: ago(1.8),  value: 720  },
  { id: 'd5',  agentId: '401', agentName: 'Fernando Castro',  dept: 'comercial', time: ago(2.4),  value: 8500 },
  { id: 'd6',  agentId: '302', agentName: 'Diego Vargas',     dept: 'casa',      time: ago(3.1),  value: 2100 },
  { id: 'd7',  agentId: '603', agentName: 'Andrés Morales',   dept: 'aca',       time: ago(3.9),  value: 1450 },
  { id: 'd8',  agentId: '101', agentName: 'María García',     dept: 'vida',      time: ago(4.5),  value: 1100 },
  { id: 'd9',  agentId: '202', agentName: 'Miguel Rodríguez', dept: 'auto',      time: ago(5.2),  value: 2950 },
  { id: 'd10', agentId: '502', agentName: 'Alejandro Díaz',   dept: 'medicare',  time: ago(6.0),  value: 880  },
  { id: 'd11', agentId: '301', agentName: 'Sofía Chen',       dept: 'casa',      time: ago(7.1),  value: 1800 },
  { id: 'd12', agentId: '102', agentName: 'Carlos López',     dept: 'vida',      time: ago(8.3),  value: 950  },
]
