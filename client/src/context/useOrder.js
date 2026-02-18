import { useContext } from 'react'
import { OrderContext } from './OrderContext'

export function useOrder() {
  const context = useContext(OrderContext)
  if (!context) throw new Error('useOrder deve ser usado dentro de um OrderProvider')
  return context
}