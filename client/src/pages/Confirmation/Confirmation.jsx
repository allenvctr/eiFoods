import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOrder } from '../../context/useOrder'
import Navbar from '../../components/Navbar/Navbar'
import styles from './Confirmation.module.css'


export default function Confirmation() {
  const navigate = useNavigate()
  const { state, dispatch } = useOrder()
  const { orderItems, deliveryDetails, orderId } = state

  // Guard clause with useEffect
  useEffect(() => {
    if (orderItems.length === 0) {
      navigate('/menu')
    }
  }, [orderItems.length, navigate])

  if (orderItems.length === 0) {
    return null
  }

  const total = orderItems.reduce((acc, item) => acc + item.total, 0)

  function handleNovosPedido() {
    dispatch({ type: 'RESET_ORDER' })
    navigate('/')
  }

  return (
    <div className={styles.page}>

      <Navbar />

      <main className={styles.main}>

        <div className={styles.card}>

          <div className={styles.icone}>🎉</div>

          <h1 className={styles.titulo}>Comprovativo enviado!</h1>
          <p className={styles.subtitulo}>
            Assim que confirmarmos o pagamento, o seu pedido entra em preparação.
          </p>

          {orderId && (
            <div className={styles.infoRow}>
              <span>🔖</span>
              <span>Ref: <strong>#{orderId.slice(-8).toUpperCase()}</strong></span>
            </div>
          )}

          <div className={styles.infoRow}>
            <span>🕛</span>
            <span>Entrega prevista às <strong>12h</strong></span>
          </div>

          <div className={styles.infoRow}>
            <span>📍</span>
            <span>{deliveryDetails.location || 'Local não definido'}</span>
          </div>

          <div className={styles.divider} />

          <div className={styles.resumo}>
            <p className={styles.resumoLabel}>RESUMO</p>
            {orderItems.map((item, index) => (
              <div key={index} className={styles.resumoItem}>
                <span>{item.prato.nome}</span>
                <span>{item.prato.preco} MZN</span>
              </div>
            ))}
            <div className={styles.totalRow}>
              <span>Total</span>
              <span className={styles.totalValor}>{total} MZN</span>
            </div>
          </div>

          <div className={styles.divider} />

          <p className={styles.obrigado}>
            Obrigado, <strong>{deliveryDetails.name || 'Cliente'}</strong>! Iremos confirmar via WhatsApp assim que o pagamento for validado. 🙏
          </p>

          <button
            className={styles.btnNovo}
            onClick={handleNovosPedido}
          >
            Fazer novo pedido
          </button>

        </div>
      </main>
    </div>
  )
}