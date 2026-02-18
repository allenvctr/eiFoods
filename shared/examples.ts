/**
 * eiFoods - Usage Examples
 * Exemplos práticos de como usar os tipos e utilitários do módulo shared
 */

import type { 
  Prato, 
  OrderItem, 
  DeliveryDetails, 
  Customizacoes 
} from './types'

import {
  calculateItemTotal,
  calculateOrderTotal,
  formatPrice,
  getCustomizationSummary,
  formatWhatsAppMessage,
} from './utils'

import { validateDeliveryDetails } from './validators'
import { ROUTES, ERROR_MESSAGES } from './constants'

// ═══════════════════════════════════════════════════════════════════════════
// Exemplo 1: Criando um prato tipado
// ═══════════════════════════════════════════════════════════════════════════

const prato: Prato = {
  id: 1,
  nome: 'Arroz + Frango Assado + Batata',
  preco: 250,
  emoji: '🍗',
  descricao: 'Frango assado no forno com arroz branco e batata frita crocante'
}

// ═══════════════════════════════════════════════════════════════════════════
// Exemplo 2: Criando customizações
// ═══════════════════════════════════════════════════════════════════════════

const customizacoes: Customizacoes = {
  free: ['Com Molho', 'Com Piripiri'],
  paid: {
    id: 'frango',
    nome: '+ Frango extra',
    preco: 50
  },
  salt: 'Normal'
}

// ═══════════════════════════════════════════════════════════════════════════
// Exemplo 3: Calculando totais
// ═══════════════════════════════════════════════════════════════════════════

const total = calculateItemTotal(prato, customizacoes.paid)
console.log(formatPrice(total)) // "300 MZN"

// ═══════════════════════════════════════════════════════════════════════════
// Exemplo 4: Criando um item de pedido
// ═══════════════════════════════════════════════════════════════════════════

const orderItem: OrderItem = {
  prato,
  customizations: customizacoes,
  total: calculateItemTotal(prato, customizacoes.paid)
}

// Gerar resumo das customizações
const resumo = getCustomizationSummary(customizacoes)
console.log(resumo) // "Com Molho · Com Piripiri · + Frango extra"

// ═══════════════════════════════════════════════════════════════════════════
// Exemplo 5: Validando detalhes de entrega
// ═══════════════════════════════════════════════════════════════════════════

const deliveryDetails: DeliveryDetails = {
  name: 'João Silva',
  company: 'Tech Moçambique',
  location: 'Av. Julius Nyerere, 3º andar',
  contact: '258841234567'
}

const validacao = validateDeliveryDetails(deliveryDetails)

if (!validacao.isValid) {
  console.error('Erros de validação:', validacao.errors)
  // { name?: "error message", location?: "error message", ... }
} else {
  console.log('Detalhes válidos!')
}

// ═══════════════════════════════════════════════════════════════════════════
// Exemplo 6: Gerando mensagem WhatsApp
// ═══════════════════════════════════════════════════════════════════════════

const items: OrderItem[] = [orderItem]
const whatsappUrl = formatWhatsAppMessage(
  items,
  deliveryDetails,
  '258841234567'
)

console.log('URL do WhatsApp:', whatsappUrl)
// https://wa.me/258841234567?text=...

// ═══════════════════════════════════════════════════════════════════════════
// Exemplo 7: Usando constantes de rotas
// ═══════════════════════════════════════════════════════════════════════════

console.log('Navegando para menu:', ROUTES.MENU)
// Em vez de: navigate('/menu')
// Use: navigate(ROUTES.MENU)

// ═══════════════════════════════════════════════════════════════════════════
// Exemplo 8: Usando mensagens de erro
// ═══════════════════════════════════════════════════════════════════════════

console.log('Mensagens disponíveis:')
console.log('- Nome inválido:', ERROR_MESSAGES.INVALID_NAME)
console.log('- Telefone inválido:', ERROR_MESSAGES.INVALID_PHONE)
console.log('- Carrinho vazio:', ERROR_MESSAGES.EMPTY_CART)

// ═══════════════════════════════════════════════════════════════════════════
// Exemplo 9: Calculando total do pedido
// ═══════════════════════════════════════════════════════════════════════════

const orderItems: OrderItem[] = [
  orderItem,
  orderItem,
  orderItem
]

const totalPedido = calculateOrderTotal(orderItems)
console.log('Total do pedido:', formatPrice(totalPedido)) // "900 MZN"

// ═══════════════════════════════════════════════════════════════════════════
// Exemplo 10: Type Guards e Validações
// ═══════════════════════════════════════════════════════════════════════════

function isPratoValido(prato: Partial<Prato>): prato is Prato {
  return !!(
    prato.id &&
    prato.nome &&
    prato.preco !== undefined &&
    prato.emoji &&
    prato.descricao
  )
}

const pratoIncompleto: Partial<Prato> = {
  nome: 'Arroz',
  preco: 150
}

if (isPratoValido(pratoIncompleto)) {
  // TypeScript sabe que aqui pratoIncompleto é do tipo Prato completo
  console.log(pratoIncompleto.id)
} else {
  console.log('Prato inválido')
}

// ═══════════════════════════════════════════════════════════════════════════
// Exemplo 11: Uso em Componentes React
// ═══════════════════════════════════════════════════════════════════════════

/*
// OrderSummary.tsx
import type { OrderItem } from '@/shared'
import { calculateOrderTotal, formatPrice } from '@/shared'

interface OrderSummaryProps {
  items: OrderItem[]
}

export function OrderSummary({ items }: OrderSummaryProps) {
  const total = calculateOrderTotal(items)
  
  return (
    <div>
      <h2>Resumo do Pedido</h2>
      <p>Total: {formatPrice(total)}</p>
    </div>
  )
}
*/

// ═══════════════════════════════════════════════════════════════════════════
// Exemplo 12: Uso em Context/Reducer
// ═══════════════════════════════════════════════════════════════════════════

/*
// OrderProvider.tsx
import type { OrderState, OrderAction } from '@/shared'

function orderReducer(state: OrderState, action: OrderAction): OrderState {
  switch (action.type) {
    case 'SELECT_DISH':
      return { ...state, selectedDish: action.payload }
    
    case 'ADD_TO_ORDER':
      return {
        ...state,
        orderItems: [...state.orderItems, action.payload]
      }
    
    default:
      return state
  }
}
*/

export {
  prato,
  customizacoes,
  orderItem,
  deliveryDetails,
  validacao,
  whatsappUrl,
}
