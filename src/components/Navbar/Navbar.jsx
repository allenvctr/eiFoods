import { useNavigate } from 'react-router-dom'
import { useOrder } from '../../context/useOrder'
import styles from './Navbar.module.css'

export default function Navbar() {
  const navigate = useNavigate()
  const { state } = useOrder()
  const totalItens = state.orderItems.length

  return (
    <header className={styles.header}>
      <div className={styles.logo} onClick={() => navigate('/')}>
        <span>🍽️</span>
        <span className={styles.logoText}>eiFoods</span>
      </div>

      <nav className={styles.nav}>
        <span onClick={() => navigate('/')}>Início</span>
        <span onClick={() => navigate('/menu')}>Menu</span>
        <span onClick={() => navigate('/confirmation')}>Contactos</span>
      </nav>

      <button
        className={styles.cartBtn}
        onClick={() => navigate('/order-summary')}
      >
        🛒
        {totalItens > 0 && (
          <span className={styles.badge}>{totalItens}</span>
        )}
      </button>
    </header>
  )
}