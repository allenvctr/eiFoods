/**
 * Mock Data para Dashboard da aplicação Admin
 */

import type { ApiPrato } from '../lib/api'
import type { DashboardStats, RevenueData, PopularDish } from '../types/admin.types'

const now = new Date().toISOString()

export const mockPratos: ApiPrato[] = [
  {
    _id: 'mock-prato-1',
    nome: 'Arroz + Frango Assado + Batata',
    preco: 250,
    imagem: {
      url: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c4?auto=format&fit=crop&w=400&q=80',
      publicId: 'mock/prato-1',
    },
    descricao: 'Frango assado no forno com arroz branco e batata frita crocante',
    disponivel: true,
    extrasProprios: [],
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: 'mock-prato-2',
    nome: 'Arroz + Frango Grelhado + Salada',
    preco: 280,
    imagem: {
      url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
      publicId: 'mock/prato-2',
    },
    descricao: 'Frango grelhado suculento com arroz e salada fresca',
    disponivel: true,
    extrasProprios: [],
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: 'mock-prato-3',
    nome: 'Massa + Frango + Legumes',
    preco: 300,
    imagem: {
      url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80',
      publicId: 'mock/prato-3',
    },
    descricao: 'Massa italiana com frango grelhado e legumes salteados',
    disponivel: true,
    extrasProprios: [],
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: 'mock-prato-4',
    nome: 'Arroz de Marisco',
    preco: 450,
    imagem: {
      url: 'https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?auto=format&fit=crop&w=400&q=80',
      publicId: 'mock/prato-4',
    },
    descricao: 'Arroz de marisco tradicional moçambicano com camarão, lula e caranguejo',
    disponivel: true,
    extrasProprios: [],
    createdAt: now,
    updatedAt: now,
  },
]

export const mockStats: DashboardStats = {
  todayOrders: 12,
  todayRevenue: 3850,
  pendingOrders: 3,
  totalDishes: mockPratos.length,
  revenueChange: 12.5,
  ordersChange: 8.3,
}

export const mockRevenueData: RevenueData[] = [
  { date: '2026-02-11', value: 2800 },
  { date: '2026-02-12', value: 3200 },
  { date: '2026-02-13', value: 2950 },
  { date: '2026-02-14', value: 3400 },
  { date: '2026-02-15', value: 2600 },
  { date: '2026-02-16', value: 1800 },
  { date: '2026-02-17', value: 2200 },
  { date: '2026-02-18', value: 3850 },
]

export const mockPopularDishes: PopularDish[] = [
  { dish: mockPratos[0], orders: 45, revenue: 11250 },
  { dish: mockPratos[1], orders: 38, revenue: 10640 },
  { dish: mockPratos[3], orders: 28, revenue: 12600 },
  { dish: mockPratos[2], orders: 22, revenue: 6600 },
]
