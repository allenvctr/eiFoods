import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOrder } from '../../context/useOrder'
import styles from './Navbar.module.css'

export default function Navbar() {
  const navigate = useNavigate()
  const { state } = useOrder()
  const totalItens = state.orderItems.length
  const [menuAberto, setMenuAberto] = useState(false)

  // Prevenir scroll quando o menu está aberto
  useEffect(() => {
    if (menuAberto) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [menuAberto])

  function handleNavegar(rota) {
    navigate(rota)
    setMenuAberto(false)
  }

  return (
    <>
      <header className={styles.header}>
        <div className={styles.logo} onClick={() => handleNavegar('/')}>
          <span>🍽️</span>
          <span className={styles.logoText}>eiFoods</span>
        </div>

        {/* Nav Desktop */}
        <nav className={styles.navDesktop}>
          <span onClick={() => navigate('/')}>Início</span>
          <span onClick={() => navigate('/menu')}>Menu</span>
          <span onClick={() => navigate('/confirmation')}>Contactos</span>
        </nav>

        <div className={styles.rightSection}>
          {/* Botão Hamburguer */}
          <button
            className={`${styles.hamburger} ${menuAberto ? styles.hamburgerAberto : ''}`}
            onClick={() => setMenuAberto(!menuAberto)}
            aria-label="Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Carrinho */}
          <button
            className={styles.cartBtn}
            onClick={() => handleNavegar('/order-summary')}
          >
            🛒
            {totalItens > 0 && (
              <span className={styles.badge}>{totalItens}</span>
            )}
          </button>
        </div>
      </header>

      {/* Nav Mobile */}
      {menuAberto && (
        <>
          <div className={styles.overlay} onClick={() => setMenuAberto(false)} />
          <nav className={styles.navMobile}>
            <span onClick={() => handleNavegar('/')}>🏠 Início</span>
            <span onClick={() => handleNavegar('/menu')}>🍽️ Menu</span>
            <span onClick={() => handleNavegar('/confirmation')}>📞 Contactos</span>
            {totalItens > 0 && (
              <span onClick={() => handleNavegar('/order-summary')}>
                🛒 Carrinho ({totalItens})
              </span>
            )}
          </nav>
        </>
      )}
    </>
  )
}