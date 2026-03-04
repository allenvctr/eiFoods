/**
 * eiFoods - Shared Module Entry Point
 * Re-exporta todos os tipos, constantes e utilitários
 */

// Types
export type {
  ImagemPrato,
  Prato,
  Extra,
  OpcaoGratuita,
  OpcaoSal,
  Customizacoes,
  OrderItem,
  DeliveryDetails,
  OrderState,
  OrderAction,
  AppConfig,
  OrderContextType,
  NonNullable,
  PartialDeep,
  DiaSemana,
  DiaAgendado,
  AgendaSemanal,
  OrderStatus,
} from './types'

export { DIAS_SEMANA } from './types'

// Constants
export {
  OPCOES_GRATUITAS,
  OPCOES_SAL,
  PHONE_REGEX,
  MIN_NAME_LENGTH,
  MIN_LOCATION_LENGTH,
  BREAKPOINTS,
  ANIMATION_DURATION,
  MAX_ORDER_ITEMS,
  ROUTES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from './constants'

// Validators
export {
  validateName,
  validateLocation,
  validateContact,
  validateDeliveryDetails,
  isValidPhone,
} from './validators'

// Utils
export {
  calculateItemTotal,
  calculateOrderTotal,
  formatPrice,
  formatWhatsAppMessage,
  getCustomizationSummary,
} from './utils'
