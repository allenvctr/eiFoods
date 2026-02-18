import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useOrder } from '../../context/useOrder'
import Navbar from '../../components/Navbar/Navbar'
import styles from './OrderSummary.module.css'

export default function OrderSummary() {
  const navigate = useNavigate()
  const { state, dispatch } = useOrder()
  const { orderItems } = state

  useEffect(() => {
    if (orderItems.length === 0) {
      navigate('/menu')
    }
  }, [orderItems.length, navigate])

  if (orderItems.length === 0) {
    return null
  }

  const total = orderItems.reduce((acc, item) => acc + item.total, 0)

  function handleRemover(index) {
    dispatch({ type: 'REMOVE_ITEM', payload: index })
  }

  function handleEditar(index) {
    const item = orderItems[index]
    dispatch({ type: 'SELECT_DISH', payload: item.prato })
    dispatch({ type: 'SET_CUSTOMIZATION', payload: item.customizations })
    navigate('/customize', { state: { editIndex: index } })
  }

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <h1 className={styles.title}>Resumo do Pedido</h1>

        <div className={styles.card}>
          <p className={styles.cardLabel}>SEU PEDIDO</p>

          <ul className={styles.lista}>
            {orderItems.map((item, index) => (
              <li key={index} className={styles.item}>
                <div className={styles.itemInfo}>
                  <span className={styles.itemEmoji}>{item.prato.emoji}</span>
                  <div>
                    <p className={styles.itemNome}>
                      1x {item.prato.nome}
                    </p>
                    <p className={styles.itemCustom}>
                      {[
                        ...item.customizations.free,
                        item.customizations.salt !== 'Normal' && item.customizations.salt,
                        item.customizations.paid?.nome,
                      ]
                        .filter(Boolean)
                        .join(' · ') || 'Sem personalização'}
                    </p>
                    <p className={styles.itemPreco}>{item.total} MZN</p>
                  </div>
                </div>
                <div className={styles.itemAcoes}>
                  <button
                    className={styles.btnEditar}
                    onClick={() => handleEditar(index)}
                    title="Editar personalização"
                  >
                    ✏️
                  </button>
                  <button
                    className={styles.btnRemover}
                    onClick={() => handleRemover(index)}
                    title="Remover item"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>TOTAL</span>
            <span className={styles.totalValor}>{total} MZN</span>
          </div>
        </div>

        <div className={styles.acoes}>
          <button className={styles.btnAlterar} onClick={() => navigate('/menu')}>
            + Adicionar prato
          </button>
          <button className={styles.btnConfirmar} onClick={() => navigate('/delivery')}>
            Fazer o seu pedido
          </button>
        </div>

      </main>
    </div>
  )
}