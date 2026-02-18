/**
 * Context para gestão do estado global da aplicação Admin
 */

import React, { createContext, useContext, useReducer } from 'react'
import type { ReactNode } from 'react'
import type { Prato, Extra } from '../../../shared/types'
import type { Order } from '../types/admin.types'
import { mockPratos, mockExtras, mockOrders } from '../data/mockData'

// ═══════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════

interface AdminState {
  pratos: Prato[]
  extras: Extra[]
  orders: Order[]
}

type AdminAction =
  | { type: 'ADD_PRATO'; payload: Prato }
  | { type: 'UPDATE_PRATO'; payload: Prato }
  | { type: 'DELETE_PRATO'; payload: number }
  | { type: 'ADD_EXTRA'; payload: Extra }
  | { type: 'UPDATE_EXTRA'; payload: Extra }
  | { type: 'DELETE_EXTRA'; payload: string }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { id: string; status: Order['status'] } }
  | { type: 'DELETE_ORDER'; payload: string }

interface AdminContextType {
  state: AdminState
  dispatch: React.Dispatch<AdminAction>
}

// ═══════════════════════════════════════════════════════════════════════════
// Initial State
// ═══════════════════════════════════════════════════════════════════════════

const initialState: AdminState = {
  pratos: mockPratos,
  extras: mockExtras,
  orders: mockOrders
}

// ═══════════════════════════════════════════════════════════════════════════
// Reducer
// ═══════════════════════════════════════════════════════════════════════════

function adminReducer(state: AdminState, action: AdminAction): AdminState {
  switch (action.type) {
    case 'ADD_PRATO':
      return {
        ...state,
        pratos: [...state.pratos, action.payload]
      }
    
    case 'UPDATE_PRATO':
      return {
        ...state,
        pratos: state.pratos.map(p => 
          p.id === action.payload.id ? action.payload : p
        )
      }
    
    case 'DELETE_PRATO':
      return {
        ...state,
        pratos: state.pratos.filter(p => p.id !== action.payload)
      }
    
    case 'ADD_EXTRA':
      return {
        ...state,
        extras: [...state.extras, action.payload]
      }
    
    case 'UPDATE_EXTRA':
      return {
        ...state,
        extras: state.extras.map(e => 
          e.id === action.payload.id ? action.payload : e
        )
      }
    
    case 'DELETE_EXTRA':
      return {
        ...state,
        extras: state.extras.filter(e => e.id !== action.payload)
      }
    
    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(o => 
          o.id === action.payload.id 
            ? { ...o, status: action.payload.status, updatedAt: new Date() }
            : o
        )
      }
    
    case 'DELETE_ORDER':
      return {
        ...state,
        orders: state.orders.filter(o => o.id !== action.payload)
      }
    
    default:
      return state
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Context
// ═══════════════════════════════════════════════════════════════════════════

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(adminReducer, initialState)

  return (
    <AdminContext.Provider value={{ state, dispatch }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider')
  }
  return context
}
