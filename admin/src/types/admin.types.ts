/**
 * Admin App - Type Definitions
 * Tipos específicos da aplicação de administração
 */

import type { ApiPrato, ApiExtra, ApiOrder, ApiSchedule } from '../lib/api'

// Re-export API types as the canonical domain types for the admin panel
export type { ApiPrato as Prato, ApiExtra as Extra, ApiOrder as Order, ApiSchedule as Schedule }
export type { ApiPrato, ApiExtra, ApiOrder }

// ═══════════════════════════════════════════════════════════════════════════
// Pedidos & Status
// ═══════════════════════════════════════════════════════════════════════════

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled'

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
  /** File to upload — undefined when not changing image */
  imageFile?: File
  /** Extra IDs to attach as exclusive extras */
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


// ═══════════════════════════════════════════════════════════════════════════
// Pedidos & Status
// ═══════════════════════════════════════════════════════════════════════════

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled'

export interface Order {
  id: string
  items: OrderItem[]
  deliveryDetails: DeliveryDetails
  status: OrderStatus
  total: number
  createdAt: Date
  updatedAt: Date
}

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
  dish: Prato
  orders: number
  revenue: number
}

// ═══════════════════════════════════════════════════════════════════════════
// Gestão de Menu
// ═══════════════════════════════════════════════════════════════════════════

export interface DishFormData {
  nome: string
  preco: number
  imagem: string
  descricao: string
  disponivel?: boolean
}

export interface ExtraFormData {
  nome: string
  preco: number
  disponivel?: boolean
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
