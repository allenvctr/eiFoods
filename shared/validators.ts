/**
 * eiFoods - Validators
 * Funções de validação para formulários e dados
 */

import {
  PHONE_REGEX,
  MIN_NAME_LENGTH,
  MIN_LOCATION_LENGTH,
  ERROR_MESSAGES,
} from './constants'
import type { DeliveryDetails } from './types'

// ═══════════════════════════════════════════════════════════════════════════
// Validação Individual
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Valida se um número de telefone é válido
 * @param phone - Número de telefone a validar
 * @returns true se válido, false caso contrário
 */
export function isValidPhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false
  const cleanPhone = phone.trim().replace(/\s+/g, '')
  return PHONE_REGEX.test(cleanPhone)
}

/**
 * Valida o campo nome
 * @param name - Nome a validar
 * @returns Mensagem de erro ou string vazia se válido
 */
export function validateName(name: string): string {
  if (!name || !name.trim()) {
    return ERROR_MESSAGES.REQUIRED_FIELD
  }
  if (name.trim().length < MIN_NAME_LENGTH) {
    return ERROR_MESSAGES.INVALID_NAME
  }
  return ''
}

/**
 * Valida o campo localização
 * @param location - Localização a validar
 * @returns Mensagem de erro ou string vazia se válido
 */
export function validateLocation(location: string): string {
  if (!location || !location.trim()) {
    return ERROR_MESSAGES.REQUIRED_FIELD
  }
  if (location.trim().length < MIN_LOCATION_LENGTH) {
    return ERROR_MESSAGES.INVALID_LOCATION
  }
  return ''
}

/**
 * Valida o campo contacto
 * @param contact - Contacto a validar
 * @returns Mensagem de erro ou string vazia se válido
 */
export function validateContact(contact: string): string {
  if (!contact || !contact.trim()) {
    return ERROR_MESSAGES.REQUIRED_FIELD
  }
  if (!isValidPhone(contact)) {
    return ERROR_MESSAGES.INVALID_PHONE
  }
  return ''
}

// ═══════════════════════════════════════════════════════════════════════════
// Validação de Objetos
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Resultado da validação de detalhes de entrega
 */
export interface ValidationResult {
  isValid: boolean
  errors: {
    name?: string
    location?: string
    contact?: string
  }
}

/**
 * Valida todos os detalhes de entrega
 * @param details - Detalhes de entrega a validar
 * @returns Objeto com status de validação e erros
 */
export function validateDeliveryDetails(
  details: DeliveryDetails
): ValidationResult {
  const errors: ValidationResult['errors'] = {}

  const nameError = validateName(details.name)
  if (nameError) errors.name = nameError

  const locationError = validateLocation(details.location)
  if (locationError) errors.location = locationError

  const contactError = validateContact(details.contact)
  if (contactError) errors.contact = contactError

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
