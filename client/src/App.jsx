import { BrowserRouter, Routes, Route } from 'react-router-dom'
import OrderProvider from './context/OrderProvider'
import Home from './pages/Home/Home'
import Menu from './pages/Menu/Menu'
import Customize from './pages/Customize/Customize'
import OrderSummary from './pages/OrderSummary/OrderSummary'
import Delivery from './pages/Delivery/Delivery'
import Confirmation from './pages/Confirmation/Confirmation'
import Sorteio from './pages/Sorteio/Sorteio'

export default function App() {
  return (
    <BrowserRouter>
      <OrderProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/customize" element={<Customize />} />
          <Route path="/order-summary" element={<OrderSummary />} />
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/sorteio" element={<Sorteio />} />
        </Routes>
      </OrderProvider>
    </BrowserRouter>
  )
}