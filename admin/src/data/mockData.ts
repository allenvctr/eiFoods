/**
 * Mock Data para testes da aplicação Admin
 */

import type { Prato, Extra } from '../../../shared/types'
import type { Order, DashboardStats, RevenueData, PopularDish } from '../types/admin.types'

// ═══════════════════════════════════════════════════════════════════════════
// Pratos do Menu
// ═══════════════════════════════════════════════════════════════════════════

export const mockPratos: Prato[] = [
  {
    id: 1,
    nome: 'Arroz + Frango Assado + Batata',
    preco: 250,
    emoji: '🍗',
    descricao: 'Frango assado no forno com arroz branco e batata frita crocante'
  },
  {
    id: 2,
    nome: 'Arroz + Frango Grelhado + Salada',
    preco: 280,
    emoji: '🔥',
    descricao: 'Frango grelhado suculento com arroz e salada fresca'
  },
  {
    id: 3,
    nome: 'Massa + Frango + Legumes',
    preco: 300,
    emoji: '🍝',
    descricao: 'Massa italiana com frango grelhado e legumes salteados'
  },
  {
    id: 4,
    nome: 'Arroz de Marisco',
    preco: 450,
    emoji: '🦐',
    descricao: 'Arroz de marisco tradicional moçambicano com camarão, lula e caranguejo'
  },
  {
    id: 5,
    nome: 'Xima + Frango + Molho de Amendoim',
    preco: 220,
    emoji: '🥘',
    descricao: 'Xima de milho com frango e delicioso molho de amendoim'
  },
  {
    id: 6,
    nome: 'Matapa com Caril',
    preco: 350,
    emoji: '🥬',
    descricao: 'Matapa tradicional com caril de camarão'
  }
]

// ═══════════════════════════════════════════════════════════════════════════
// Extras
// ═══════════════════════════════════════════════════════════════════════════

export const mockExtras: Extra[] = [
  { id: 'frango', nome: '+ Frango extra', preco: 50 },
  { id: 'batata', nome: '+ Batata extra', preco: 30 },
  { id: 'salada', nome: '+ Salada extra', preco: 25 },
  { id: 'arroz', nome: '+ Arroz extra', preco: 20 },
  { id: 'refrigerante', nome: '+ Refrigerante', preco: 40 }
]

// ═══════════════════════════════════════════════════════════════════════════
// Pedidos
// ═══════════════════════════════════════════════════════════════════════════

export const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    items: [
      {
        prato: mockPratos[0],
        customizations: {
          free: ['Com Molho', 'Com Piripiri'],
          paid: mockExtras[0],
          salt: 'Normal'
        },
        total: 300
      }
    ],
    deliveryDetails: {
      name: 'João Silva',
      company: 'Tech Moçambique',
      location: 'Av. Julius Nyerere, 3º andar',
      contact: '258841234567'
    },
    status: 'pending',
    total: 300,
    createdAt: new Date('2026-02-18T10:30:00'),
    updatedAt: new Date('2026-02-18T10:30:00')
  },
  {
    id: 'ORD-002',
    items: [
      {
        prato: mockPratos[1],
        customizations: {
          free: ['Sem Molho'],
          paid: mockExtras[2],
          salt: 'Pouco Sal'
        },
        total: 305
      },
      {
        prato: mockPratos[2],
        customizations: {
          free: ['Com Molho'],
          paid: null,
          salt: 'Normal'
        },
        total: 300
      }
    ],
    deliveryDetails: {
      name: 'Maria Santos',
      company: 'Vodacom',
      location: 'Av. 25 de Setembro, Edifício JAT',
      contact: '258843456789'
    },
    status: 'preparing',
    total: 605,
    createdAt: new Date('2026-02-18T11:15:00'),
    updatedAt: new Date('2026-02-18T11:20:00')
  },
  {
    id: 'ORD-003',
    items: [
      {
        prato: mockPratos[3],
        customizations: {
          free: ['Com Piripiri'],
          paid: mockExtras[4],
          salt: 'Normal'
        },
        total: 490
      }
    ],
    deliveryDetails: {
      name: 'Carlos Tembe',
      company: 'Mcel',
      location: 'Av. Acordos de Lusaka',
      contact: '258847891234'
    },
    status: 'ready',
    total: 490,
    createdAt: new Date('2026-02-18T12:00:00'),
    updatedAt: new Date('2026-02-18T12:25:00')
  },
  {
    id: 'ORD-004',
    items: [
      {
        prato: mockPratos[4],
        customizations: {
          free: ['Com Molho'],
          paid: null,
          salt: 'Normal'
        },
        total: 220
      }
    ],
    deliveryDetails: {
      name: 'Ana Macuácua',
      company: 'BCI',
      location: 'Av. Karl Marx, 3º andar',
      contact: '258842345678'
    },
    status: 'delivered',
    total: 220,
    createdAt: new Date('2026-02-18T09:30:00'),
    updatedAt: new Date('2026-02-18T10:15:00')
  }
]

// ═══════════════════════════════════════════════════════════════════════════
// Estatísticas do Dashboard
// ═══════════════════════════════════════════════════════════════════════════

export const mockStats: DashboardStats = {
  todayOrders: 12,
  todayRevenue: 3850,
  pendingOrders: 3,
  totalDishes: mockPratos.length,
  revenueChange: 12.5,
  ordersChange: 8.3
}

export const mockRevenueData: RevenueData[] = [
  { date: '2026-02-11', value: 2800 },
  { date: '2026-02-12', value: 3200 },
  { date: '2026-02-13', value: 2950 },
  { date: '2026-02-14', value: 3400 },
  { date: '2026-02-15', value: 2600 },
  { date: '2026-02-16', value: 1800 },
  { date: '2026-02-17', value: 2200 },
  { date: '2026-02-18', value: 3850 }
]

export const mockPopularDishes: PopularDish[] = [
  { dish: mockPratos[0], orders: 45, revenue: 11250 },
  { dish: mockPratos[1], orders: 38, revenue: 10640 },
  { dish: mockPratos[3], orders: 28, revenue: 12600 },
  { dish: mockPratos[2], orders: 22, revenue: 6600 }
]
