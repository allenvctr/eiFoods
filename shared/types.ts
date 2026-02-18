/**
 * eiFoods - Type Definitions
 * Definições de tipos baseadas nos mocks da aplicação
 */

// ═══════════════════════════════════════════════════════════════════════════
// Menu & Pratos
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Representa um prato disponível no menu do dia
 */
export interface Prato {
  id: number
  nome: string
  preco: number
  emoji: string
  descricao: string
}

/**
 * Representa um extra pago que pode ser adicionado a um prato
 */
export interface Extra {
  id: string
  nome: string
  preco: number
}

// ═══════════════════════════════════════════════════════════════════════════
// Customizações & Opções
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Opções gratuitas disponíveis para personalização
 */
export type OpcaoGratuita = 
  | 'Sem Molho'
  | 'Com Molho'
  | 'Sem Piripiri'
  | 'Com Piripiri'

/**
 * Níveis de sal disponíveis
 */
export type OpcaoSal = 'Sem Sal' | 'Pouco Sal' | 'Normal'

/**
 * Personalizações aplicadas a um prato
 */
export interface Customizacoes {
  free: OpcaoGratuita[]
  paid: Extra | null
  salt: OpcaoSal
}

// ═══════════════════════════════════════════════════════════════════════════
// Pedidos
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Item individual de um pedido (prato + customizações)
 */
export interface OrderItem {
  prato: Prato
  customizations: Customizacoes
  total: number
}

/**
 * Detalhes de entrega do pedido
 */
export interface DeliveryDetails {
  name: string
  company: string
  location: string
  contact: string
}

// ═══════════════════════════════════════════════════════════════════════════
// Estado da Aplicação
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Estado global da aplicação gerenciado pelo OrderContext
 */
export interface OrderState {
  selectedDish: Prato | null
  customizations: Customizacoes
  orderItems: OrderItem[]
  deliveryDetails: DeliveryDetails
}

/**
 * Ações disponíveis no OrderContext reducer
 */
export type OrderAction =
  | { type: 'SELECT_DISH'; payload: Prato }
  | { type: 'SET_CUSTOMIZATION'; payload: Partial<Customizacoes> }
  | { type: 'ADD_TO_ORDER'; payload: OrderItem }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'SET_DELIVERY_DETAILS'; payload: Partial<DeliveryDetails> }
  | { type: 'RESET_ORDER' }

// ═══════════════════════════════════════════════════════════════════════════
// Configuração
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Configurações gerais da aplicação
 */
export interface AppConfig {
  whatsappNumero: string
  horaEntrega: string
  nomeEmpresa: string
}

// ═══════════════════════════════════════════════════════════════════════════
// Context
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Tipo do contexto de pedidos
 */
export interface OrderContextType {
  state: OrderState
  dispatch: (action: OrderAction) => void
}

// ═══════════════════════════════════════════════════════════════════════════
// Utilities
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Tipo auxiliar para garantir que um valor não é nulo nem undefined
 */
export type NonNullable<T> = T extends null | undefined ? never : T

/**
 * Tipo auxiliar para tornar todas as propriedades opcionais
 */
export type PartialDeep<T> = {
  [P in keyof T]?: T[P] extends object ? PartialDeep<T[P]> : T[P]
}
