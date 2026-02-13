import { useNavigate, useLocation } from 'react-router-dom'
import { useOrder } from '../../context/useOrder'
import Navbar from '../../components/Navbar/Navbar'
import { OPCOES_GRATUITAS, OPCOES_SAL, EXTRAS_PAGOS } from '../../data/menuData'
import styles from './Customize.module.css'

export default function Customize() {
  const navigate = useNavigate()
  const location = useLocation()
  const { state, dispatch } = useOrder()
  const { selectedDish, customizations } = state

  // Permite editar um item já existente
  const editIndex = location.state?.editIndex ?? null

  if (!selectedDish) {
    navigate('/menu')
    return null
  }

  const extraSelecionado = EXTRAS_PAGOS.find(
    (e) => e.id === customizations.paid?.id
  )
  const totalPrato = selectedDish.preco + (extraSelecionado?.preco ?? 0)

  function toggleFree(opcao) {
    const jaSeleccionada = customizations.free.includes(opcao)
    const novaLista = jaSeleccionada
      ? customizations.free.filter((o) => o !== opcao)
      : [...customizations.free, opcao]
    dispatch({ type: 'SET_CUSTOMIZATION', payload: { free: novaLista } })
  }

  function handleSal(opcao) {
    dispatch({ type: 'SET_CUSTOMIZATION', payload: { salt: opcao } })
  }

  function handlePago(extra) {
    const jaSeleccionado = customizations.paid?.id === extra.id
    dispatch({ type: 'SET_CUSTOMIZATION', payload: { paid: jaSeleccionado ? null : extra } })
  }

  function handleAdicionar() {
    const novoItem = {
      prato: selectedDish,
      customizations: { ...customizations },
      total: totalPrato,
    }

    if (editIndex !== null) {
      // Substitui item existente
      dispatch({ type: 'REMOVE_ITEM', payload: editIndex })
    }

    dispatch({ type: 'ADD_TO_ORDER', payload: novoItem })
    navigate('/order-summary')
  }

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>

        <div className={styles.pratoSeleccionado}>
          <span className={styles.pratoEmoji}>{selectedDish.emoji}</span>
          <div>
            <h1 className={styles.pratoNome}>{selectedDish.nome}</h1>
            <p className={styles.pratoPreco}>
              {selectedDish.preco} MZN
              {extraSelecionado && (
                <span className={styles.extraPreco}>
                  {' '}+ {extraSelecionado.preco} MZN = <strong>{totalPrato} MZN</strong>
                </span>
              )}
            </p>
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>✅ Personalização Gratuita</h2>
            <div className={styles.grupo}>
              <p className={styles.grupoLabel}>Molho e Picante</p>
              <div className={styles.checkboxLista}>
                {OPCOES_GRATUITAS.map((opcao) => (
                  <label key={opcao} className={styles.checkboxItem}>
                    <input
                      type="checkbox"
                      checked={customizations.free.includes(opcao)}
                      onChange={() => toggleFree(opcao)}
                    />
                    <span>{opcao}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className={styles.grupo}>
              <p className={styles.grupoLabel}>Sal</p>
              <div className={styles.radioLista}>
                {OPCOES_SAL.map((opcao) => (
                  <label key={opcao} className={styles.radioItem}>
                    <input
                      type="radio"
                      name="sal"
                      checked={customizations.salt === opcao}
                      onChange={() => handleSal(opcao)}
                    />
                    <span>{opcao}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>⭐ Personalização Paga</h2>
            <div className={styles.checkboxLista}>
              {EXTRAS_PAGOS.map((extra) => (
                <label key={extra.id} className={styles.checkboxItem}>
                  <input
                    type="checkbox"
                    checked={customizations.paid?.id === extra.id}
                    onChange={() => handlePago(extra)}
                  />
                  <span>{extra.nome} <strong>+{extra.preco} MZN</strong></span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <button className={styles.btnAdicionar} onClick={handleAdicionar}>
          {editIndex !== null ? '✏️ Guardar alterações' : 'Adicionar ao pedido'}
        </button>

      </main>
    </div>
  )
}