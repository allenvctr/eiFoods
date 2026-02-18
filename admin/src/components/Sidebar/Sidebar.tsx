import { NavLink } from 'react-router-dom'
import styles from './Sidebar.module.css'

interface NavItem {
  path: string
  label: string
  icon: string
}

const navItems: NavItem[] = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/dishes', label: 'Pratos', icon: '🍽️' },
  { path: '/orders', label: 'Pedidos', icon: '📦' },
  { path: '/extras', label: 'Extras', icon: '➕' },
  { path: '/settings', label: 'Configurações', icon: '⚙️' }
]

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.logoIcon}>🍜</span>
        <h1 className={styles.logoText}>eiFoods Admin</h1>
      </div>
      
      <nav className={styles.nav}>
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
            end={item.path === '/'}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span className={styles.navLabel}>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className={styles.footer}>
        <div className={styles.user}>
          <div className={styles.userAvatar}>👤</div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>Admin</div>
            <div className={styles.userEmail}>admin@eifoods.mz</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
