/**
 * eiFoods - Constants
 * Constantes compartilhadas da aplicação
 */

import type { OpcaoGratuita, OpcaoSal } from './types'

// ═══════════════════════════════════════════════════════════════════════════
// Opções de Menu
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Opções gratuitas disponíveis para personalização
 */
export const OPCOES_GRATUITAS: readonly OpcaoGratuita[] = [
  'Sem Molho',
  'Com Molho',
  'Sem Piripiri',
  'Com Piripiri',
] as const

/**
 * Níveis de sal disponíveis
 */
export const OPCOES_SAL: readonly OpcaoSal[] = [
  'Sem Sal',
  'Pouco Sal',
  'Normal',
] as const

// ═══════════════════════════════════════════════════════════════════════════
// Validação
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Regex para validação de número de telefone moçambicano
 * Formato: 258XXXXXXXXX ou 8XXXXXXXX ou +258XXXXXXXXX
 */
export const PHONE_REGEX = /^(\+?258)?8[2-7]\d{7}$/

/**
 * Comprimento mínimo para o nome
 */
export const MIN_NAME_LENGTH = 3

/**
 * Comprimento mínimo para a localização
 */
export const MIN_LOCATION_LENGTH = 5

// ═══════════════════════════════════════════════════════════════════════════
// Configurações de UI
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Breakpoints responsivos (em pixels)
 */
export const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
} as const

/**
 * Durações de animação (em ms)
 */
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 220,
  slow: 300,
} as const

/**
 * Tamanho máximo de itens por pedido
 */
export const MAX_ORDER_ITEMS = 20

// ═══════════════════════════════════════════════════════════════════════════
// Rotas
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Rotas da aplicação
 */
export const ROUTES = {
  HOME: '/',
  MENU: '/menu',
  CUSTOMIZE: '/customize',
  ORDER_SUMMARY: '/order-summary',
  DELIVERY: '/delivery',
  CONFIRMATION: '/confirmation',
} as const

// ═══════════════════════════════════════════════════════════════════════════
// Mensagens
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Mensagens de erro
 */
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Este campo é obrigatório',
  INVALID_PHONE: 'Número de telefone inválido',
  INVALID_NAME: `Nome deve ter pelo menos ${MIN_NAME_LENGTH} caracteres`,
  INVALID_LOCATION: `Local deve ter pelo menos ${MIN_LOCATION_LENGTH} caracteres`,
  EMPTY_CART: 'Carrinho vazio',
  MAX_ITEMS_REACHED: `Máximo de ${MAX_ORDER_ITEMS} itens por pedido`,
} as const

/**
 * Mensagens de sucesso
 */
export const SUCCESS_MESSAGES = {
  ITEM_ADDED: 'Item adicionado ao carrinho',
  ITEM_REMOVED: 'Item removido do carrinho',
  ORDER_PLACED: 'Pedido realizado com sucesso',
} as const
