import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOrder } from '../../context/useOrder'
import Navbar from '../../components/Navbar/Navbar'
import { pratosApi } from '../../api'
import styles from './Menu.module.css'

export default function Menu() {
  const navigate = useNavigate()
  const { dispatch } = useOrder()
  const [pratos, setPratos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    pratosApi.list({ disponivel: true })
      .then(setPratos)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  function handleSelecionar(prato) {
    dispatch({ type: 'SELECT_DISH', payload: prato })
    navigate('/customize')
  }

  if (loading) return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <p style={{ textAlign: 'center', padding: 40, color: 'var(--text-2, #888)' }}>A carregar menu...</p>
      </main>
    </div>
  )

  if (error) return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <p style={{ textAlign: 'center', padding: 40, color: '#c62828' }}>Erro ao carregar menu: {error}</p>
      </main>
    </div>
  )

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <h1 className={styles.title}>Menu do dia</h1>
        <p className={styles.subtitulo}>Escolha o seu prato e personalize ao seu gosto</p>

        <div className={styles.lista}>
          {pratos.map((prato) => (
            <div key={prato._id} className={styles.card}>
              <img
                src={prato.imagem?.url ?? prato.imagem}
                alt={prato.nome}
                className={styles.cardImagem}
              />
              <div className={styles.cardTexto}>
                <p className={styles.cardNome}>{prato.nome}</p>
                <p className={styles.cardDescricao}>{prato.descricao}</p>
                <p className={styles.cardPreco}>{prato.preco} MZN</p>
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

        {pratos.length === 0 && (
          <p style={{ textAlign: 'center', padding: 32, color: 'var(--text-2, #888)' }}>
            Nenhum prato disponível hoje.
          </p>
        )}
      </main>
    </div>
  )
}
