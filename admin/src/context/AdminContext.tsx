/**
 * Context para gestão do estado global da aplicação Admin.
 * Carrega dados da API no mount e expõe funções assíncronas para CRUD.
 */

import React, { createContext, useContext, useEffect, useReducer, useCallback } from 'react'
import type { ReactNode } from 'react'
import {
  pratosApi, extrasApi, scheduleApi, ordersApi,
  type ApiPrato, type ApiExtra, type ApiOrder, type ApiSchedule,
} from '../lib/api'
import type { DishFormData, ExtraFormData } from '../types/admin.types'

// ═══════════════════════════════════════════════════════════════════════════
// State & Actions
// ═══════════════════════════════════════════════════════════════════════════

interface AdminState {
  pratos: ApiPrato[]
  extras: ApiExtra[]
  orders: ApiOrder[]
  schedule: ApiSchedule | null
  loading: boolean
  error: string | null
}

type AdminAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_PRATOS'; payload: ApiPrato[] }
  | { type: 'ADD_PRATO'; payload: ApiPrato }
  | { type: 'UPDATE_PRATO'; payload: ApiPrato }
  | { type: 'DELETE_PRATO'; payload: string }
  | { type: 'LOAD_EXTRAS'; payload: ApiExtra[] }
  | { type: 'ADD_EXTRA'; payload: ApiExtra }
  | { type: 'UPDATE_EXTRA'; payload: ApiExtra }
  | { type: 'DELETE_EXTRA'; payload: string }
  | { type: 'LOAD_ORDERS'; payload: ApiOrder[] }
  | { type: 'UPDATE_ORDER'; payload: ApiOrder }
  | { type: 'DELETE_ORDER'; payload: string }
  | { type: 'SET_SCHEDULE'; payload: ApiSchedule }

interface AdminContextType {
  state: AdminState
  // Pratos
  loadPratos: () => Promise<void>
  createPrato: (data: DishFormData) => Promise<void>
  updatePrato: (id: string, data: DishFormData) => Promise<void>
  deletePrato: (id: string) => Promise<void>
  toggleDisponivel: (id: string, val: boolean) => Promise<void>
  // Extras
  loadExtras: () => Promise<void>
  createExtra: (data: ExtraFormData) => Promise<void>
  updateExtra: (id: string, data: Partial<ExtraFormData>) => Promise<void>
  deleteExtra: (id: string) => Promise<void>
  // Prato do Dia
  loadSchedule: () => Promise<void>
  setDayPrato: (dia: string, pratoId: string | null) => Promise<void>
  // Orders
  loadOrders: (status?: string) => Promise<void>
  updateOrderStatus: (id: string, status: ApiOrder['status']) => Promise<void>
  deleteOrder: (id: string) => Promise<void>
}

// ═══════════════════════════════════════════════════════════════════════════
// Reducer
// ═══════════════════════════════════════════════════════════════════════════

const initialState: AdminState = {
  pratos: [],
  extras: [],
  orders: [],
  schedule: null,
  loading: true,
  error: null,
}

function adminReducer(state: AdminState, action: AdminAction): AdminState {
  switch (action.type) {
    case 'SET_LOADING':   return { ...state, loading: action.payload }
    case 'SET_ERROR':     return { ...state, error: action.payload, loading: false }
    case 'LOAD_PRATOS':   return { ...state, pratos: action.payload }
    case 'LOAD_EXTRAS':   return { ...state, extras: action.payload }
    case 'LOAD_ORDERS':   return { ...state, orders: action.payload }
    case 'SET_SCHEDULE':  return { ...state, schedule: action.payload }

    case 'ADD_PRATO':
      return { ...state, pratos: [action.payload, ...state.pratos] }
    case 'UPDATE_PRATO':
      return { ...state, pratos: state.pratos.map(p => p._id === action.payload._id ? action.payload : p) }
    case 'DELETE_PRATO':
      return { ...state, pratos: state.pratos.filter(p => p._id !== action.payload) }

    case 'ADD_EXTRA':
      return { ...state, extras: [action.payload, ...state.extras] }
    case 'UPDATE_EXTRA':
      return { ...state, extras: state.extras.map(e => e._id === action.payload._id ? action.payload : e) }
    case 'DELETE_EXTRA':
      return { ...state, extras: state.extras.filter(e => e._id !== action.payload) }

    case 'UPDATE_ORDER':
      return { ...state, orders: state.orders.map(o => o._id === action.payload._id ? action.payload : o) }
    case 'DELETE_ORDER':
      return { ...state, orders: state.orders.filter(o => o._id !== action.payload) }

    default: return state
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Context
// ═══════════════════════════════════════════════════════════════════════════

const AdminContext = createContext<AdminContextType | undefined>(undefined)

// ── Helper: build FormData from DishFormData ─────────────────────────────────
function buildPratoFormData(data: DishFormData): FormData {
  const fd = new FormData()
  fd.append('nome', data.nome)
  fd.append('descricao', data.descricao)
  fd.append('preco', String(data.preco))
  fd.append('disponivel', String(data.disponivel))
  if (data.imageFile) fd.append('imagem', data.imageFile)
  if (data.extrasProprios?.length)
    fd.append('extrasProprios', JSON.stringify(data.extrasProprios))
  return fd
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(adminReducer, initialState)

  // ── Initial load ──────────────────────────────────────────────────────────
  useEffect(() => {
    void (async () => {
      dispatch({ type: 'SET_LOADING', payload: true })
      try {
        const [pratos, extras, orders, schedule] = await Promise.all([
          pratosApi.list(),
          extrasApi.list(),
          ordersApi.list(),
          scheduleApi.get(),
        ])
        dispatch({ type: 'LOAD_PRATOS',  payload: pratos })
        dispatch({ type: 'LOAD_EXTRAS',  payload: extras })
        dispatch({ type: 'LOAD_ORDERS',  payload: orders })
        dispatch({ type: 'SET_SCHEDULE', payload: schedule })
      } catch (e) {
        dispatch({ type: 'SET_ERROR', payload: (e as Error).message })
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    })()
  }, [])

  // ── Pratos ────────────────────────────────────────────────────────────────
  const loadPratos = useCallback(async () => {
    dispatch({ type: 'LOAD_PRATOS', payload: await pratosApi.list() })
  }, [])

  const createPrato = useCallback(async (data: DishFormData) => {
    if (!data.imageFile) throw new Error('Imagem obrigatória')
    const prato = await pratosApi.create(buildPratoFormData(data))
    dispatch({ type: 'ADD_PRATO', payload: prato })
  }, [])

  const updatePrato = useCallback(async (id: string, data: DishFormData) => {
    const prato = await pratosApi.update(id, buildPratoFormData(data))
    dispatch({ type: 'UPDATE_PRATO', payload: prato })
  }, [])

  const deletePrato = useCallback(async (id: string) => {
    await pratosApi.delete(id)
    dispatch({ type: 'DELETE_PRATO', payload: id })
  }, [])

  const toggleDisponivel = useCallback(async (id: string, val: boolean) => {
    const prato = await pratosApi.toggleDisponivel(id, val)
    dispatch({ type: 'UPDATE_PRATO', payload: prato })
  }, [])

  // ── Extras ────────────────────────────────────────────────────────────────
  const loadExtras = useCallback(async () => {
    dispatch({ type: 'LOAD_EXTRAS', payload: await extrasApi.list() })
  }, [])

  const createExtra = useCallback(async (data: ExtraFormData) => {
    const extra = await extrasApi.create(data)
    dispatch({ type: 'ADD_EXTRA', payload: extra })
  }, [])

  const updateExtra = useCallback(async (id: string, data: Partial<ExtraFormData>) => {
    const extra = await extrasApi.update(id, data)
    dispatch({ type: 'UPDATE_EXTRA', payload: extra })
  }, [])

  const deleteExtra = useCallback(async (id: string) => {
    await extrasApi.delete(id)
    dispatch({ type: 'DELETE_EXTRA', payload: id })
  }, [])

  // ── Prato do Dia ──────────────────────────────────────────────────────────
  const loadSchedule = useCallback(async () => {
    dispatch({ type: 'SET_SCHEDULE', payload: await scheduleApi.get() })
  }, [])

  const setDayPrato = useCallback(async (dia: string, pratoId: string | null) => {
    const schedule = await scheduleApi.setDay(dia, pratoId)
    dispatch({ type: 'SET_SCHEDULE', payload: schedule })
  }, [])

  // ── Orders ────────────────────────────────────────────────────────────────
  const loadOrders = useCallback(async (status?: string) => {
    dispatch({ type: 'LOAD_ORDERS', payload: await ordersApi.list(status) })
  }, [])

  const updateOrderStatus = useCallback(async (id: string, status: ApiOrder['status']) => {
    const order = await ordersApi.updateStatus(id, status)
    dispatch({ type: 'UPDATE_ORDER', payload: order })
  }, [])

  const deleteOrder = useCallback(async (id: string) => {
    // No DELETE endpoint yet — just remove from local state
    dispatch({ type: 'DELETE_ORDER', payload: id })
  }, [])

  return (
    <AdminContext.Provider value={{
      state,
      loadPratos, createPrato, updatePrato, deletePrato, toggleDisponivel,
      loadExtras, createExtra, updateExtra, deleteExtra,
      loadSchedule, setDayPrato,
      loadOrders, updateOrderStatus, deleteOrder,
    }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useAdmin deve ser usado dentro de <AdminProvider>')
  return ctx
}
