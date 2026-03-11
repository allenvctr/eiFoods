export const initialState = {
  selectedDish: null,
  customizations: {
    free: [],
    paid: [],
    salt: 'Normal',
  },
  orderItems: [],
  deliveryDetails: {
    name: '',
    company: '',
    location: '',
    contact: '',
  },
  orderId: null,
}