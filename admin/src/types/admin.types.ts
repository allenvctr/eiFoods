/**
 * Admin App - Type Definitions
 * Tipos específicos da aplicação de administração
 */

import type { ApiPrato, ApiExtra, ApiOrder, ApiSchedule } from '../lib/api'

// Re-export API types as the canonical domain types for the admin panel
export type { ApiPrato as Prato, ApiExtra as Extra, ApiOrder as Order, ApiSchedule as Schedule }
export type { ApiPrato, ApiExtra, ApiOrder, ApiSchedule }

// ═══════════════════════════════════════════════════════════════════════════
// Pedidos & Status
// ═══════════════════════════════════════════════════════════════════════════

export type OrderStatus = ApiOrder['status']

// ═══════════════════════════════════════════════════════════════════════════
// Estatísticas
// ═══════════════════════════════════════════════════════════════════════════

export interface DashboardStats {
  todayOrders: number
  todayRevenue: number
  pendingOrders: number
  totalDishes: number
  revenueChange: number
  ordersChange: number
}

export interface RevenueData {
  date: string
  value: number
}

export interface PopularDish {
  dish: ApiPrato
  orders: number
  revenue: number
}

// ═══════════════════════════════════════════════════════════════════════════
// Form Data
// ═══════════════════════════════════════════════════════════════════════════

export interface DishFormData {
  nome: string
  preco: number
  descricao: string
  disponivel: boolean
  imageFile?: File
  extrasProprios?: string[]
}

export interface ExtraFormData {
  nome: string
  preco: number
  global: boolean
}

// ═══════════════════════════════════════════════════════════════════════════
// UI & Navigation
// ═══════════════════════════════════════════════════════════════════════════

export interface NavItem {
  path: string
  label: string
  icon: string
}

export type ViewMode = 'grid' | 'list'
export type FilterStatus = OrderStatus | 'all'
