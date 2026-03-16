import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOrder } from '../../context/useOrder'
import Navbar from '../../components/Navbar/Navbar'
import { pratosApi, scheduleApi } from '../../api'
import styles from './Menu.module.css'

const DIAS = ['Domingo', 'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado']

function SkeletonCard() {
  return (
    <div className={styles.skeletonCard}>
      <div className={`${styles.skeleton} ${styles.skeletonImg}`} />
      <div className={styles.skeletonTexto}>
        <div className={`${styles.skeleton} ${styles.skeletonNome}`} />
        <div className={`${styles.skeleton} ${styles.skeletonDesc}`} />
        <div className={`${styles.skeleton} ${styles.skeletonDesc} ${styles.skeletonDescCurto}`} />
        <div className={`${styles.skeleton} ${styles.skeletonPreco}`} />
      </div>
      <div className={`${styles.skeleton} ${styles.skeletonBtn}`} />
    </div>
  )
}

export default function Menu() {
  const navigate = useNavigate()
  const { state, dispatch } = useOrder()
  const { orderItems, selectedEmpresa } = state
  const [pratos, setPratos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [busca, setBusca] = useState('')
  const [pratoDoDia, setPratoDoDia] = useState(null)

  const diaAtual = DIAS[new Date().getDay()]

  useEffect(() => {
    let active = true

    Promise.all([
      pratosApi.list({ disponivel: true }),
      scheduleApi.getHoje().catch(() => ({ prato: null })),
    ])
      .then(([listaPratos, hoje]) => {
        if (!active) return
        setPratoDoDia(hoje?.prato ?? null)

        const companyPratoIds = selectedEmpresa?.menu?.pratoIds
          ? selectedEmpresa.menu.pratoIds.map((p) => (typeof p === 'string' ? p : p._id))
          : null

        const pratosBase = companyPratoIds
          ? listaPratos.filter((p) => companyPratoIds.includes(p._id))
          : listaPratos

        const hojeId = hoje?.prato?._id
        if (!hojeId) {
          setPratos(pratosBase)
          return
        }

        const ordenados = [...pratosBase].sort((a, b) => {
          if (a._id === hojeId) return -1
          if (b._id === hojeId) return 1
          return 0
        })

        setPratos(ordenados)
      })
      .catch(e => {
        if (active) setError(e.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [selectedEmpresa])

  const pratosFiltrados = pratos.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase()) ||
    p.descricao?.toLowerCase().includes(busca.toLowerCase())
  )

  function handleSelecionar(prato) {
    dispatch({ type: 'SELECT_DISH', payload: prato })
    navigate('/customize')
  }

  function handleRemoverItem(index) {
    dispatch({ type: 'REMOVE_ITEM', payload: index })
  }

  const totalPedido = orderItems.reduce((acc, item) => acc + item.total, 0)

  return (
    <div className={styles.page}>
      <Navbar />

      {/* Hero Banner */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.heroBadge}>Menu · {diaAtual}</span>
          <h1 className={styles.heroTitle}>Escolha o seu prato</h1>
          <p className={styles.heroSub}>Personalize ao seu gosto e receba no escritório</p>
        </div>
        <div className={styles.heroDecor} />
      </section>

      {/* Barra de pesquisa — fora do grid, sempre no topo */}
      <div className={styles.searchSection}>
        <div className={styles.searchWrap}>
          <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Pesquisar pratos..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
          {busca && (
            <button className={styles.searchClear} onClick={() => setBusca('')} aria-label="Limpar">
              ✕
            </button>
          )}
        </div>
      </div>

      {pratoDoDia && (
        <div className={styles.todayBar}>
          <div className={styles.todayBarInner}>
            <span className={styles.todayBadge}>Prato do dia</span>
            <p className={styles.todayText}>{pratoDoDia.nome}</p>
          </div>
        </div>
      )}

      {selectedEmpresa && (
        <div className={styles.todayBar}>
          <div className={styles.todayBarInner}>
            <span className={styles.todayBadge}>Empresa</span>
            <p className={styles.todayText}>{selectedEmpresa.empresaNome}</p>
          </div>
        </div>
      )}

      {/* Container 2 colunas */}
      <div className={styles.container}>

        {/* ── Coluna Esquerda: Lista ── */}
        <main className={styles.main}>

          {loading && (
            <div className={styles.lista}>
              {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
            </div>
          )}

          {error && (
            <div className={styles.estadoVazio}>
              <span className={styles.estadoIcon}>⚠️</span>
              <p className={styles.estadoTexto}>Erro ao carregar o menu</p>
              <p className={styles.estadoSub}>{error}</p>
            </div>
          )}

          {!loading && !error && pratosFiltrados.length === 0 && (
            <div className={styles.estadoVazio}>
              <span className={styles.estadoIcon}>{busca ? '🔍' : '🍽️'}</span>
              <p className={styles.estadoTexto}>
                {busca ? `Sem resultados para "${busca}"` : 'Sem pratos disponíveis hoje'}
              </p>
              <p className={styles.estadoSub}>
                {busca ? 'Tente outra pesquisa' : 'Volte amanhã para ver o novo menu'}
              </p>
            </div>
          )}

          {!loading && !error && pratosFiltrados.length > 0 && (
            <div className={styles.lista}>
              {pratosFiltrados.map((prato) => (
                <div key={prato._id} className={styles.card}>
                  {pratoDoDia?._id === prato._id && (
                    <span className={styles.cardTodayBadge}>Hoje</span>
                  )}
                  <div className={styles.cardImagemWrap}>
                    <img
                      src={prato.imagem?.url ?? prato.imagem}
                      alt={prato.nome}
                      className={styles.cardImagem}
                    />
                  </div>
                  <div className={styles.cardTexto}>
                    <p className={styles.cardNome}>{prato.nome}</p>
                    <p className={styles.cardDescricao}>{prato.descricao}</p>
                    <span className={styles.cardPreco}>{prato.preco} MZN</span>
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
          )}

        </main>

        {/* ── Coluna Direita: Carrinho ── */}
        <aside className={styles.cartPanel}>
          <div className={styles.cartHeader}>
            <div className={styles.cartTituloWrap}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              <h3 className={styles.cartTitulo}>Meu Pedido</h3>
            </div>
            {orderItems.length > 0 && (
              <span className={styles.cartBadge}>{orderItems.length}</span>
            )}
          </div>

          {orderItems.length === 0 ? (
            <div className={styles.cartVazio}>
              <span className={styles.cartVazioIcon}>🛒</span>
              <p className={styles.cartVazioTexto}>O seu carrinho está vazio</p>
              <p className={styles.cartVazioSub}>Selecione um prato para começar</p>
            </div>
          ) : (
            <>
              <ul className={styles.cartItens}>
                {orderItems.map((item, i) => (
                  <li key={i} className={styles.cartItem}>
                    <div className={styles.cartItemImgWrap}>
                      {item.prato.imagem?.url
                        ? <img src={item.prato.imagem.url} alt={item.prato.nome} className={styles.cartItemImg} />
                        : <div className={styles.cartItemImgFallback}>🍽️</div>
                      }
                    </div>
                    <div className={styles.cartItemInfo}>
                      <p className={styles.cartItemNome}>{item.prato.nome}</p>
                      {item.customizations?.free?.length > 0 && (
                        <p className={styles.cartItemCustom}>{item.customizations.free.join(', ')}</p>
                      )}
                    </div>
                    <div className={styles.cartItemDireita}>
                      <span className={styles.cartItemPreco}>{item.total} MZN</span>
                      <button
                        className={styles.cartItemRemover}
                        onClick={() => handleRemoverItem(i)}
                        aria-label="Remover item"
                      >✕</button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className={styles.cartRodape}>
                <div className={styles.cartTotal}>
                  <span>Total</span>
                  <span className={styles.cartTotalValor}>{totalPedido} MZN</span>
                </div>
                <button
                  className={styles.btnFinalizar}
                  onClick={() => navigate('/order-summary')}
                >
                  Finalizar pedido
                </button>
              </div>
            </>
          )}
        </aside>

      </div>
    </div>
  )
}
