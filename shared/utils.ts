/**
 * eiFoods - Utility Functions
 * Funções auxiliares reutilizáveis
 */

import type { OrderItem, Customizacoes, Prato, Extra } from './types'

// ═══════════════════════════════════════════════════════════════════════════
// Cálculos
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calcula o total de um item (prato + extras)
 * @param prato - Prato selecionado
 * @param extra - Extra pago selecionado (opcional)
 * @returns Total do item em MZN
 */
export function calculateItemTotal(prato: Prato, extra?: Extra | null): number {
  const pratoPreco = prato.preco
  const extraPreco = extra?.preco ?? 0
  return pratoPreco + extraPreco
}

/**
 * Calcula o total do pedido
 * @param items - Itens do pedido
 * @returns Total do pedido em MZN
 */
export function calculateOrderTotal(items: OrderItem[]): number {
  return items.reduce((total, item) => total + item.total, 0)
}

// ═══════════════════════════════════════════════════════════════════════════
// Formatação
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Formata um preço em MZN
 * @param price - Preço a formatar
 * @param showCurrency - Se deve mostrar "MZN" (padrão: true)
 * @returns Preço formatado
 * @example formatPrice(250) // "250 MZN"
 * @example formatPrice(250, false) // "250"
 */
export function formatPrice(price: number, showCurrency = true): string {
  const formatted = price.toLocaleString('pt-MZ')
  return showCurrency ? `${formatted} MZN` : formatted
}

/**
 * Gera um resumo das customizações aplicadas
 * @param customizations - Customizações do item
 * @returns String com resumo das customizações
 */
export function getCustomizationSummary(customizations: Customizacoes): string {
  const parts: string[] = []

  // Adiciona opções gratuitas
  if (customizations.free.length > 0) {
    parts.push(...customizations.free)
  }

  // Adiciona nível de sal se não for "Normal"
  if (customizations.salt !== 'Normal') {
    parts.push(customizations.salt)
  }

  // Adiciona extra pago
  if (customizations.paid) {
    parts.push(customizations.paid.nome)
  }

  return parts.length > 0 ? parts.join(' · ') : 'Sem personalização'
}

// ═══════════════════════════════════════════════════════════════════════════
// WhatsApp
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Gera a mensagem formatada para WhatsApp
 * @param items - Itens do pedido
 * @param deliveryDetails - Detalhes de entrega
 * @param whatsappNumber - Número do WhatsApp
 * @returns URL formatada para abrir WhatsApp
 */
export function formatWhatsAppMessage(
  items: OrderItem[],
  deliveryDetails: { name: string; company?: string; location: string },
  whatsappNumber: string
): string {
  const total = calculateOrderTotal(items)
  
  // Monta a lista de itens
  const itemsList = items
    .map((item, index) => {
      const customization = getCustomizationSummary(item.customizations)
      return `${index + 1}. ${item.prato.emoji} ${item.prato.nome}\n   ${customization}\n   ${formatPrice(item.total)}`
    })
    .join('\n\n')

  // Monta a mensagem completa
  const message = `🍽️ *Pedido eiFoods*\n\n` +
    `*Cliente:* ${deliveryDetails.name}\n` +
    (deliveryDetails.company ? `*Empresa:* ${deliveryDetails.company}\n` : '') +
    `*Local:* ${deliveryDetails.location}\n\n` +
    `*Itens:*\n${itemsList}\n\n` +
    `*Total:* ${formatPrice(total)}\n\n` +
    `Obrigado pelo seu pedido! 🙏`

  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
}

// ═══════════════════════════════════════════════════════════════════════════
// Arrays & Objects
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Verifica se um array está vazio
 * @param arr - Array a verificar
 * @returns true se vazio, false caso contrário
 */
export function isEmpty<T>(arr: T[] | null | undefined): boolean {
  return !arr || arr.length === 0
}

/**
 * Remove um item de um array por índice (imutável)
 * @param arr - Array original
 * @param index - Índice do item a remover
 * @returns Novo array sem o item
 */
export function removeAtIndex<T>(arr: T[], index: number): T[] {
  return arr.filter((_, i) => i !== index)
}

/**
 * Atualiza um item em um array por índice (imutável)
 * @param arr - Array original
 * @param index - Índice do item a atualizar
 * @param newItem - Novo item
 * @returns Novo array com o item atualizado
 */
export function updateAtIndex<T>(arr: T[], index: number, newItem: T): T[] {
  return arr.map((item, i) => (i === index ? newItem : item))
}

// ═══════════════════════════════════════════════════════════════════════════
// Strings
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Capitaliza a primeira letra de uma string
 * @param str - String a capitalizar
 * @returns String capitalizada
 */
export function capitalize(str: string): string {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Trunca uma string se exceder o tamanho máximo
 * @param str - String a truncar
 * @param maxLength - Tamanho máximo
 * @param suffix - Sufixo a adicionar (padrão: "...")
 * @returns String truncada
 */
export function truncate(
  str: string,
  maxLength: number,
  suffix = '...'
): string {
  if (!str || str.length <= maxLength) return str
  return str.slice(0, maxLength - suffix.length) + suffix
}
