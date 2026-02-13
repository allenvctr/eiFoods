import { useNavigate } from 'react-router-dom'
import { useOrder } from '../../context/useOrder'
import Navbar from '../../components/Navbar/Navbar'
import { MENU_DO_DIA } from '../../data/menuData'
import styles from './Menu.module.css'

export default function Menu() {
  const navigate = useNavigate()
  const { dispatch } = useOrder()

  function handleSelecionar(prato) {
    dispatch({ type: 'SELECT_DISH', payload: prato })
    navigate('/customize')
  }

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <h1 className={styles.title}>Menu do dia</h1>
        <p className={styles.subtitulo}>Escolha o seu prato favorito 👇</p>

        <div className={styles.lista}>
          {MENU_DO_DIA.map((prato) => (
            <div key={prato.id} className={styles.card}>
              <div className={styles.cardInfo}>
                <span className={styles.cardEmoji}>{prato.emoji}</span>
                <div className={styles.cardTexto}>
                  <p className={styles.cardNome}>{prato.nome}</p>
                  <p className={styles.cardDescricao}>{prato.descricao}</p>
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