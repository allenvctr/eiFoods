import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useOrder } from '../../context/useOrder'
import Navbar from '../../components/Navbar/Navbar'
import styles from './OrderSummary.module.css'

const TAXA_ENTREGA = 50

function IconEditar() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  )
}

function IconRemover() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6M14 11v6"/>
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
  )
}

function IconSeta() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  )
}

export default function OrderSummary() {
  const navigate = useNavigate()
  const { state, dispatch } = useOrder()
  const { orderItems } = state

  useEffect(() => {
    if (orderItems.length === 0) navigate('/menu')
  }, [orderItems.length, navigate])

  if (orderItems.length === 0) return null

  const subtotal = orderItems.reduce((acc, item) => acc + item.total, 0)
  const total = subtotal + TAXA_ENTREGA

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

        {/* Breadcrumb / título */}
        <div className={styles.pageHeader}>
          <button className={styles.voltar} onClick={() => navigate('/menu')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Continuar a encomendar
          </button>
          <h1 className={styles.title}>
            O seu carrinho
            <span className={styles.titleBadge}>{orderItems.length}</span>
          </h1>
        </div>

        <div className={styles.layout}>

          {/* Coluna esquerda — itens */}
          <div className={styles.colunaItens}>
            <ul className={styles.lista}>
              {orderItems.map((item, index) => {
                const tags = [
                  ...item.customizations.free,
                  item.customizations.salt !== 'Normal' && item.customizations.salt,
                  item.customizations.paid?.nome,
                ].filter(Boolean)

                return (
                  <li key={index} className={styles.item}>
                    <div className={styles.itemImagemWrap}>
                      {item.prato.imagem ? (
                        <img
                          src={item.prato.imagem}
                          alt={item.prato.nome}
                          className={styles.itemImagem}
                        />
                      ) : (
                        <div className={styles.itemImagemFallback} />
                      )}
                    </div>

                    <div className={styles.itemCorpo}>
                      <div className={styles.itemCabecalho}>
                        <p className={styles.itemNome}>{item.prato.nome}</p>
                        <p className={styles.itemPreco}>{item.total} MZN</p>
                      </div>

                      {tags.length > 0 && (
                        <div className={styles.itemTags}>
                          {tags.map((tag) => (
                            <span key={tag} className={styles.itemTag}>{tag}</span>
                          ))}
                        </div>
                      )}
                      {tags.length === 0 && (
                        <p className={styles.itemSemPersonalizacao}>Sem personalização</p>
                      )}
                    </div>

                    <div className={styles.itemAcoes}>
                      <button
                        className={styles.btnEditar}
                        onClick={() => handleEditar(index)}
                        title="Editar personalização"
                      >
                        <IconEditar />
                      </button>
                      <button
                        className={styles.btnRemover}
                        onClick={() => handleRemover(index)}
                        title="Remover item"
                      >
                        <IconRemover />
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>

            <button className={styles.btnAdicionarMais} onClick={() => navigate('/menu')}>
              + Adicionar outro prato
            </button>
          </div>

          {/* Coluna direita — resumo */}
          <div className={styles.colunaResumo}>
            <div className={styles.resumoCard}>
              <h2 className={styles.resumoTitulo}>Resumo</h2>

              <div className={styles.resumoLinhas}>
                <div className={styles.resumoLinha}>
                  <span className={styles.resumoLabel}>Subtotal ({orderItems.length} {orderItems.length === 1 ? 'item' : 'itens'})</span>
                  <span className={styles.resumoValor}>{subtotal} MZN</span>
                </div>
                <div className={styles.resumoLinha}>
                  <span className={styles.resumoLabel}>Taxa de entrega</span>
                  <span className={styles.resumoValor}>{TAXA_ENTREGA} MZN</span>
                </div>
              </div>

              <div className={styles.resumoTotal}>
                <span className={styles.resumoTotalLabel}>Total</span>
                <span className={styles.resumoTotalValor}>{total} MZN</span>
              </div>

              <button
                className={styles.btnConfirmar}
                onClick={() => navigate('/delivery')}
              >
                Finalizar pedido
                <IconSeta />
              </button>

              <div className={styles.resumoEntregaInfo}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                <span>Entrega prevista para as 12h no seu local de trabalho</span>
              </div>
            </div>

            <div className={styles.segurancaInfo}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span>Pedido confirmado via WhatsApp após o pagamento</span>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
