import { useNavigate } from 'react-router-dom'
import { useOrder } from '../../context/useOrder'
import styles from './Confirmation.module.css'


export default function Confirmation() {
  const navigate = useNavigate()
  const { state, dispatch } = useOrder()
  const { orderItems, deliveryDetails } = state

  // Guard clause
  if (orderItems.length === 0) {
    navigate('/menu')
    return null
  }

  const total = orderItems.reduce((acc, item) => acc + item.prato.preco, 0)

  function handleNovosPedido() {
    dispatch({ type: 'RESET_ORDER' })
    navigate('/')
  }

  const whatsappNumero = '258841234567'
  const whatsappMsg = encodeURIComponent(
    `Olá! Fiz um pedido no eiFoods.\n\nNome: ${deliveryDetails.name}\nLocal: ${deliveryDetails.location}\nTotal: ${total} MZN`
  )
  const whatsappUrl = `https://wa.me/${whatsappNumero}?text=${whatsappMsg}`

  return (
    <div className={styles.page}>

      <header className={styles.header}>
        <div className={styles.logo}>
          <span>🍽️</span>
          <span className={styles.logoText}>eiFoods</span>
        </div>
      </header>

      <main className={styles.main}>

        <div className={styles.card}>

          <div className={styles.icone}>✅</div>

          <h1 className={styles.titulo}>Pedido Confirmado!</h1>
          <p className={styles.subtitulo}>
            O seu pedido foi registado com sucesso
          </p>

          <div className={styles.infoRow}>
            <span>🕛</span>
            <span>Entrega às <strong>12h</strong></span>
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
                <span>{item.prato.emoji} {item.prato.nome}</span>
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
            Obrigado pelo seu pedido, <strong>{deliveryDetails.name || 'Cliente'}</strong>! 🙏
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className={styles.btnWhatsapp}
          >
            💬 Contacte-nos pelo WhatsApp
          </a>

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