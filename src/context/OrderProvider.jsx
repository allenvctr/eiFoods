import { useReducer } from 'react'
import { OrderContext } from './OrderContext'

const initialState = {
  selectedDish: null,
  customizations: {
    free: [],
    paid: '',
    salt: 'Normal',
  },
  orderItems: [],
  deliveryDetails: {
    name: '',
    company: '',
    location: '',
    contact: '',
  },
}

function orderReducer(state, action) {
  switch (action.type) {
    case 'SELECT_DISH':
      return { ...state, selectedDish: action.payload }
    case 'SET_CUSTOMIZATION':
      return { ...state, customizations: { ...state.customizations, ...action.payload } }
    case 'ADD_TO_ORDER':
      return { ...state, orderItems: [...state.orderItems, action.payload], selectedDish: null, customizations: initialState.customizations }
    case 'REMOVE_ITEM':
      return { ...state, orderItems: state.orderItems.filter((_, i) => i !== action.payload) }
    case 'SET_DELIVERY_DETAILS':
      return { ...state, deliveryDetails: { ...state.deliveryDetails, ...action.payload } }
    case 'RESET_ORDER':
      return initialState
    default:
      return state
  }
}

export default function OrderProvider({ children }) {
  const [state, dispatch] = useReducer(orderReducer, initialState)
  return (
    <OrderContext.Provider value={{ state, dispatch }}>
      {children}
    </OrderContext.Provider>
  )
}