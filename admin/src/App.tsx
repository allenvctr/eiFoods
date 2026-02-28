import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AdminProvider } from './context/AdminContext'
import { Sidebar } from './components/Sidebar/Sidebar'
import { Dashboard } from './pages/Dashboard/Dashboard'
import { Dishes } from './pages/Dishes/Dishes'
import { Orders } from './pages/Orders/Orders'
import { Extras } from './pages/Extras/Extras'
import { Settings } from './pages/Settings/Settings'
import { PratoDoDia } from './pages/PratoDoDia/PratoDoDia'
import { SorteioAdmin } from './pages/SorteioAdmin/SorteioAdmin'
import './App.css'

function App() {
  return (
    <AdminProvider>
      <BrowserRouter>
        <div className="app">
          <Sidebar />
          <main className="main">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dishes" element={<Dishes />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/extras" element={<Extras />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/prato-do-dia" element={<PratoDoDia />} />
              <Route path="/sorteio" element={<SorteioAdmin />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AdminProvider>
  )
}

export default App
