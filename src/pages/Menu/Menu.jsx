import { useNavigate } from 'react-router-dom'
import { useOrder } from '../../context/useOrder'
import styles from './Menu.module.css'

const MENU_DO_DIA = [
  {
    id: 1,
    nome: 'Arroz + Frango Assado + Batata',
    preco: 250,
    emoji: '🍗',
  },
  {
    id: 2,
    nome: 'Peixe Grelhado + Arroz',
    preco: 220,
    emoji: '🐟',
  },
  {
    id: 3,
    nome: 'Arroz + Carne Guisada + Salada',
    preco: 270,
    emoji: '🥩',
  },
]

export default function Menu() {
  const navigate = useNavigate()
  const { dispatch } = useOrder()

  function handleSelecionar(prato) {
    dispatch({ type: 'SELECT_DISH', payload: prato })
    navigate('/customize')
  }

  return (
    <div className={styles.page}>

      <header className={styles.header}>
        <div className={styles.logo}>
          <span>🍽️</span>
          <span className={styles.logoText}>eiFoods</span>
        </div>
        <nav className={styles.nav}>
          <span onClick={() => navigate('/')}>Início</span>
          <span className={styles.navActive}>Menu</span>
          <span onClick={() => navigate('/confirmation')}>Contactos</span>
        </nav>
      </header>

      <main className={styles.main}>
        <h1 className={styles.title}>Menu do dia</h1>

        <div className={styles.lista}>
          {MENU_DO_DIA.map((prato) => (
            <div key={prato.id} className={styles.card}>
              <div className={styles.cardInfo}>
                <span className={styles.cardEmoji}>{prato.emoji}</span>
                <div>
                  <p className={styles.cardNome}>{prato.nome}</p>
                  <p className={styles.cardPreco}>{prato.preco} MZN</p>
                </div>
              </div>
              <button
                className={styles.btnSelecionar}
                onClick={() => handleSelecionar(prato)}
              >
                Selecionar
              </button>
            </div>
          ))}
        </div>
      </main>

    </div>
  )
}