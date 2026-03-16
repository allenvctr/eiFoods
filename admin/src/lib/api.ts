/**
 * Typed API client for the eiFoods admin panel.
 * All functions throw on non-ok responses.
 */

const BASE = (import.meta.env['VITE_API_URL'] as string | undefined) ?? 'http://localhost:3000/api'

// ── Types mirroring the MongoDB responses ────────────────────────────────────

export interface ApiImagem {
  url: string
  publicId: string
}

export interface ApiExtra {
  _id: string
  nome: string
  preco: number
  global: boolean
  ativo: boolean
  createdAt: string
  updatedAt: string
}

export interface ApiPrato {
  _id: string
  nome: string
  descricao: string
  preco: number
  imagem: ApiImagem
  disponivel: boolean
  extrasProprios: ApiExtra[] | string[]
  createdAt: string
  updatedAt: string
}

export interface ApiOrderExtra {
  extraId: string
  nome: string
  preco: number
}

export interface ApiOrderItem {
  pratoId: string
  pratoNome: string
  pratoPreco: number
  customizations: { free: string[]; salt: string }
  extras: ApiOrderExtra[]
  isForaDoDia: boolean
  foraDoDiaTaxa: number
  total: number
}

export interface ApiDeliveryDetails {
  name: string
  company: string
  location: string
  contact: string
}

export interface ApiOrder {
  _id: string
  empresaId?: string
  empresaCodigo?: string
  items: ApiOrderItem[]
  deliveryDetails: ApiDeliveryDetails
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
  foraDoDiaCount: number
  taxaForaDoDia: number
  total: number
  createdAt: string
  updatedAt: string
}

export interface ApiEmpresaMenu {
  _id: string
  nome: string
  ativo: boolean
  pratoIds: ApiPrato[] | string[]
}

export interface ApiEmpresaCodigo {
  _id: string
  code: string
  ativo: boolean
  maxUsosDia: number
  usosDiaAtual: number
  ultimoResetDia: string
}

export interface ApiEmpresa {
  _id: string
  nome: string
  ativo: boolean
  nrFuncionariosPagos: number
  menus: ApiEmpresaMenu[]
  codigos: ApiEmpresaCodigo[]
  createdAt: string
  updatedAt: string
}

export interface ApiEmpresaCodigoValidation {
  empresaId: string
  empresaNome: string
  codigoId: string
  codigo: string
  usosRestantesHoje: number
  menu: ApiEmpresaMenu
}

export interface ApiDiaAgendado {
  diaSemana: 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta' | 'sabado'
  prato: ApiPrato | null
}

export interface ApiSchedule {
  _id: string
  semana: ApiDiaAgendado[]
  updatedAt: string
}

export interface ApiSorteioParticipante {
  id: string
  ref: string
  nome: string
  empresa: string
  contacto: string
  inscritoEm: string
}

export interface ApiSorteioInscricao {
  id: string
  nome: string
  empresa: string
  contacto: string
  criadoEm: string
}

export interface ApiSorteioVencedor {
  participanteId: string
  ref: string
  nome: string
  empresa: string
  contacto: string
  data: string
  pratoNome: string | null
  premioValor: number | null
}

export interface ApiSorteio {
  _id: string
  inscricoesPendentes: ApiSorteioInscricao[]
  participantes: ApiSorteioParticipante[]
  vencedorAtual: ApiSorteioVencedor | null
  historico: ApiSorteioVencedor[]
  updatedAt: string
}

// ── Request helper ────────────────────────────────────────────────────────────

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, options)
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText })) as { error?: string }
    throw new Error(body.error ?? `HTTP ${res.status}`)
  }
  return res.json() as Promise<T>
}

function json(method: string, body: unknown): RequestInit {
  return {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }
}

// ── Pratos ────────────────────────────────────────────────────────────────────

export const pratosApi = {
  list: (params?: { disponivel?: boolean }) => {
    const qs = params?.disponivel !== undefined ? `?disponivel=${params.disponivel}` : ''
    return request<ApiPrato[]>(`/pratos${qs}`)
  },

  get: (id: string) =>
    request<ApiPrato>(`/pratos/${id}`),

  create: (formData: FormData) =>
    request<ApiPrato>('/pratos', { method: 'POST', body: formData }),

  update: (id: string, formData: FormData) =>
    request<ApiPrato>(`/pratos/${id}`, { method: 'PUT', body: formData }),

  delete: (id: string) =>
    request<{ message: string }>(`/pratos/${id}`, { method: 'DELETE' }),

  toggleDisponivel: (id: string, disponivel: boolean) =>
    request<ApiPrato>(`/pratos/${id}/disponivel`, json('PATCH', { disponivel })),
}

// ── Extras ────────────────────────────────────────────────────────────────────

export const extrasApi = {
  list: (params?: { global?: boolean }) => {
    const qs = params?.global !== undefined ? `?global=${params.global}` : ''
    return request<ApiExtra[]>(`/extras${qs}`)
  },

  listForPrato: (pratoId: string) =>
    request<ApiExtra[]>(`/extras/prato/${pratoId}`),

  create: (data: { nome: string; preco: number; global?: boolean }) =>
    request<ApiExtra>('/extras', json('POST', data)),

  update: (id: string, data: Partial<{ nome: string; preco: number; global: boolean; ativo: boolean }>) =>
    request<ApiExtra>(`/extras/${id}`, json('PUT', data)),

  delete: (id: string) =>
    request<{ message: string }>(`/extras/${id}`, { method: 'DELETE' }),
}

// ── Prato do Dia ──────────────────────────────────────────────────────────────

export const scheduleApi = {
  get: () =>
    request<ApiSchedule>('/prato-do-dia'),

  getHoje: () =>
    request<{ diaSemana: string; prato: ApiPrato | null; message?: string }>('/prato-do-dia/hoje'),

  setDay: (diaSemana: string, pratoId: string | null) =>
    request<ApiSchedule>(`/prato-do-dia/${diaSemana}`, json('PUT', { pratoId })),
}

// ── Orders ────────────────────────────────────────────────────────────────────

export const ordersApi = {
  list: (status?: string) => {
    const qs = status && status !== 'all' ? `?status=${status}` : ''
    return request<ApiOrder[]>(`/orders${qs}`)
  },

  get: (id: string) =>
    request<ApiOrder>(`/orders/${id}`),

  create: (payload: {
    items: Array<{ pratoId: string; customizations: { free: string[]; salt: string }; extraIds: string[] }>
    deliveryDetails: ApiDeliveryDetails
    empresaCodigo?: string
  }) => request<ApiOrder>('/orders', json('POST', payload)),

  updateStatus: (id: string, status: ApiOrder['status']) =>
    request<ApiOrder>(`/orders/${id}/status`, json('PATCH', { status })),
}

// ── Empresas ────────────────────────────────────────────────────────────────

export const empresasApi = {
  list: () =>
    request<ApiEmpresa[]>('/empresas'),

  get: (id: string) =>
    request<ApiEmpresa>(`/empresas/${id}`),

  create: (data: { nome: string; ativo?: boolean; nrFuncionariosPagos: number; menuNome?: string; pratoIds?: string[] }) =>
    request<ApiEmpresa>('/empresas', json('POST', data)),

  update: (id: string, data: Partial<{ nome: string; ativo: boolean; nrFuncionariosPagos: number }>) =>
    request<ApiEmpresa>(`/empresas/${id}`, json('PUT', data)),

  delete: (id: string) =>
    request<{ message: string }>(`/empresas/${id}`, { method: 'DELETE' }),

  regenerateCodes: (id: string) =>
    request<ApiEmpresa>(`/empresas/${id}/regenerate-codes`, json('POST', {})),

  toggleCodigo: (empresaId: string, codigoId: string, ativo: boolean) =>
    request<ApiEmpresa>(`/empresas/${empresaId}/codigos/${codigoId}/ativo`, json('PATCH', { ativo })),

  createMenu: (empresaId: string, data: { nome: string; pratoIds: string[]; ativo?: boolean }) =>
    request<ApiEmpresa>(`/empresas/${empresaId}/menus`, json('POST', data)),

  updateMenu: (empresaId: string, menuId: string, data: Partial<{ nome: string; pratoIds: string[]; ativo: boolean }>) =>
    request<ApiEmpresa>(`/empresas/${empresaId}/menus/${menuId}`, json('PUT', data)),

  deleteMenu: (empresaId: string, menuId: string) =>
    request<ApiEmpresa>(`/empresas/${empresaId}/menus/${menuId}`, { method: 'DELETE' }),

  validateCode: (code: string) =>
    request<ApiEmpresaCodigoValidation>(`/empresas/codigo/${encodeURIComponent(code.trim().toUpperCase())}`),
}

// ── Sorteio ──────────────────────────────────────────────────────────────────

export const sorteioApi = {
  get: () =>
    request<ApiSorteio>('/sorteio'),

  addParticipante: (payload: { nome: string; empresa?: string; contacto?: string }) =>
    request<ApiSorteio>('/sorteio/participantes', json('POST', payload)),

  confirmarInscricao: (id: string) =>
    request<ApiSorteio>(`/sorteio/inscricoes/${id}/confirmar`, json('POST', {})),

  rejeitarInscricao: (id: string) =>
    request<ApiSorteio>(`/sorteio/inscricoes/${id}`, { method: 'DELETE' }),

  removeParticipante: (id: string) =>
    request<ApiSorteio>(`/sorteio/participantes/${id}`, { method: 'DELETE' }),

  realizar: () =>
    request<ApiSorteio>('/sorteio/realizar', json('POST', {})),

  reset: () =>
    request<ApiSorteio>('/sorteio/reset', json('POST', {})),
}
