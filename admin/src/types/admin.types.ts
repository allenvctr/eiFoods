/**
 * Admin App - Type Definitions
 * Tipos específicos da aplicação de administração
 */

import type { Prato, OrderItem, DeliveryDetails } from '../../../shared/types'

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
  emoji: string
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
