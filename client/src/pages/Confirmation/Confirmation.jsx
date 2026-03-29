import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOrder } from '../../context/useOrder'
import Navbar from '../../components/Navbar/Navbar'
import styles from './Confirmation.module.css'

function groupOrderItems(orderItems) {
  const map = new Map()

  for (const item of orderItems) {
    const free = item.customizations?.free ?? []
    const salt = item.customizations?.salt ?? 'Normal'
    const paid = Array.isArray(item.customizations?.paid)
      ? item.customizations.paid.map((p) => p.nome)
      : item.customizations?.paid?.nome ? [item.customizations.paid.nome] : []
    const unitPrice = item.total
    const quantity = Math.max(1, item.quantity ?? 1)

    const key = JSON.stringify({
      pratoId: item.prato?._id ?? item.prato?.nome,
      free,
      salt,
      paid,
      unitPrice,
    })

    const existing = map.get(key)
    if (existing) {
      existing.quantity += quantity
      existing.lineTotal += unitPrice * quantity
    } else {
      map.set(key, {
        key,
        pratoNome: item.prato?.nome ?? 'Prato',
        free,
        salt,
        paid,
        quantity,
        unitPrice,
        lineTotal: unitPrice * quantity,
      })
    }
  }

  return Array.from(map.values())
}

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

  const groupedItems = groupOrderItems(orderItems)
  const total = groupedItems.reduce((acc, item) => acc + item.lineTotal, 0)

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
            {groupedItems.map((item) => (
              <div key={item.key} className={styles.resumoItemWrap}>
                <div className={styles.resumoItem}>
                  <span>{item.pratoNome} · {item.quantity}x</span>
                  <span>{item.lineTotal} MZN</span>
                </div>
                <div className={styles.resumoItemMeta}>
                  {item.free.length > 0 && <span>Gratis: {item.free.join(', ')}</span>}
                  <span>Sal: {item.salt}</span>
                  {item.paid.length > 0 && <span>Extras: {item.paid.join(', ')}</span>}
                  {item.quantity > 1 && <span>Unitário: {item.unitPrice} MZN</span>}
                </div>
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