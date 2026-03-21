import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import { sorteioApi } from '../../api'
import { CONFIG } from '../../data/menuData'
import styles from './Sorteio.module.css'

const PRATO_SORTEIO = {
  nome: 'Caril de Frango com Arroz Basmati',
  descricao: 'Caril aromático com frango fresco, especiarias selecionadas e arroz basmati perfumado.',
  valor: '290 MZN',
  data: 'Sábado, 01 de Março de 2025',
  imagem: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
}

const PARTICIPANTES = []
const TAXA_PARTICIPACAO = 10

export default function Sorteio() {
  const navigate = useNavigate()
  const [participantes, setParticipantes] = useState(PARTICIPANTES)
  const [vencedorAtual, setVencedorAtual] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [inscricao, setInscricao] = useState({ nome: '', empresa: '', contacto: '' })
  const [inscrevendo, setInscrevendo] = useState(false)
  const [inscricaoMsg, setInscricaoMsg] = useState(null)

  useEffect(() => {
    let active = true
    void (async () => {
      try {
        const data = await sorteioApi.get()
        if (!active) return
        setParticipantes(data.participantes ?? [])
        setVencedorAtual(data.vencedorAtual ?? null)
      } catch (e) {
        if (active) setError(e.message)
      } finally {
        if (active) setLoading(false)
      }
    })()

    return () => {
      active = false
    }
  }, [])

  const vencedor = useMemo(
    () => participantes.find((p) => p.id === vencedorAtual?.participanteId) ?? null,
    [participantes, vencedorAtual]
  )

  const dataPublicacao = vencedorAtual?.data
    ? new Date(vencedorAtual.data).toLocaleString('pt-PT', { dateStyle: 'full', timeStyle: 'short' })
    : null

  const whatsappTexto = encodeURIComponent(
    `Olá! Quero participar no sorteio. Já fiz o pagamento de ${TAXA_PARTICIPACAO} MZN e envio o comprovativo.`
  )
  const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumero}?text=${whatsappTexto}`

  async function submeterInscricao(e) {
    e.preventDefault()
    if (!inscricao.nome.trim() || !inscricao.contacto.trim()) {
      setInscricaoMsg('Preencha nome e contacto para se inscrever.')
      return
    }

    setInscrevendo(true)
    setInscricaoMsg(null)
    try {
      await sorteioApi.inscrever(inscricao)
      setInscricao({ nome: '', empresa: '', contacto: '' })
      setInscricaoMsg('Inscrição enviada! Agora envie o comprovativo no WhatsApp e aguarde confirmação do admin.')
    } catch (err) {
      setInscricaoMsg(err.message)
    } finally {
      setInscrevendo(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <Navbar />
        <main className={styles.main}>A carregar resultado do sorteio...</main>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <Navbar />

      <main className={styles.main}>

        {/* Cabeçalho da página */}
        <div className={styles.pageHeader}>
          <span className={styles.pageBadge}>Resultado oficial</span>
          <h1 className={styles.pageTitulo}>Resultado do Sorteio</h1>
          <p className={styles.pageSub}>
            O sorteio é realizado no painel de administração. Aqui você acompanha apenas o resultado publicado e os participantes do dia.
          </p>
          <p className={styles.adminNotice}>
            {dataPublicacao
              ? `Publicado pelo admin em ${dataPublicacao}`
              : 'Resultado ainda não publicado pelo admin'}
          </p>
          {error && <p className={styles.adminNotice}>Erro ao carregar sorteio: {error}</p>}
        </div>

        <section className={styles.participarCard}>
          <h2 className={styles.participarTitulo}>Como participar</h2>
          <ol className={styles.participarLista}>
            <li>Pague a taxa de participação de <strong>{TAXA_PARTICIPACAO} MZN</strong>.</li>
            <li>Envie o comprovativo de pagamento no WhatsApp.</li>
            <li>Aguarde a confirmação do admin para entrar na lista de participantes.</li>
          </ol>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className={styles.btnParticipar}
          >
            Enviar comprovativo no WhatsApp
          </a>

          <form className={styles.inscricaoForm} onSubmit={submeterInscricao}>
            <h3 className={styles.inscricaoTitulo}>Inscrever-se no sorteio</h3>
            <div className={styles.inscricaoGrid}>
              <input
                className={styles.inscricaoInput}
                placeholder="Nome completo"
                value={inscricao.nome}
                onChange={(e) => setInscricao((prev) => ({ ...prev, nome: e.target.value }))}
              />
              <input
                className={styles.inscricaoInput}
                placeholder="Empresa"
                value={inscricao.empresa}
                onChange={(e) => setInscricao((prev) => ({ ...prev, empresa: e.target.value }))}
              />
              <input
                className={styles.inscricaoInput}
                placeholder="Contacto"
                value={inscricao.contacto}
                onChange={(e) => setInscricao((prev) => ({ ...prev, contacto: e.target.value }))}
              />
            </div>
            <button className={styles.btnInscrever} type="submit" disabled={inscrevendo}>
              {inscrevendo ? 'A enviar...' : 'Enviar inscrição'}
            </button>
            {inscricaoMsg && <p className={styles.inscricaoMsg}>{inscricaoMsg}</p>}
          </form>
        </section>

        <div className={styles.conteudo}>

          {/* Painel esquerdo — prato + sorteio */}
          <div className={styles.painelEsquerdo}>

            {/* Card do prato em sorteio */}
            <div className={styles.pratoCard}>
              <div className={styles.pratoImagemWrap}>
                <img src={PRATO_SORTEIO.imagem} alt={PRATO_SORTEIO.nome} className={styles.pratoImagem} />
                <span className={styles.pratoImagemLabel}>Prato em sorteio</span>
              </div>
              <div className={styles.pratoInfo}>
                <h2 className={styles.pratoNome}>{PRATO_SORTEIO.nome}</h2>
                <p className={styles.pratoDescricao}>{PRATO_SORTEIO.descricao}</p>
                <div className={styles.pratoMeta}>
                  <div className={styles.pratoMetaItem}>
                    <span className={styles.pratoMetaLabel}>Valor</span>
                      <span className={styles.pratoMetaValor}>{vencedorAtual?.premioValor ? `${vencedorAtual.premioValor} MZN` : PRATO_SORTEIO.valor}</span>
                  </div>
                  <div className={styles.pratoMetaItem}>
                    <span className={styles.pratoMetaLabel}>Data</span>
                      <span className={styles.pratoMetaValor}>{dataPublicacao ?? PRATO_SORTEIO.data}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Resultado publicado */}
            <div className={styles.maquina}>
              <p className={styles.maquinaLabel}>Resultado divulgado pelo admin</p>

              <div className={`${styles.tambor} ${styles.tamborResultado}`}>
                {vencedor ? (
                  <>
                    <span className={styles.tamborRef}>{vencedor.ref}</span>
                    <span className={styles.tamborNome}>{vencedor.nome}</span>
                    <span className={styles.tamborEmpresa}>{vencedor.empresa}</span>
                  </>
                ) : (
                  <span className={styles.tamborPlaceholder}>Resultado ainda não publicado</span>
                )}
              </div>

              <button className={styles.btnMenu} onClick={() => navigate('/menu')}>
                Ver menu
              </button>
            </div>

            {/* Banner do vencedor */}
            {vencedor && (
              <div className={styles.vencedorBanner}>
                <div className={styles.vencedorTrofeu}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 6 2 18 2 18 9"/>
                    <path d="M6 18H4a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-2"/>
                    <rect x="6" y="18" width="12" height="4"/>
                  </svg>
                </div>
                <div className={styles.vencedorInfo}>
                  <p className={styles.vencedorLabel}>Vencedor do sorteio</p>
                  <p className={styles.vencedorNome}>{vencedor.nome}</p>
                  <p className={styles.vencedorDetalhe}>{vencedor.empresa} · {vencedor.ref}</p>
                </div>
                <div className={styles.vencedorPremio}>
                  <p className={styles.vencedorPremioLabel}>Prémio</p>
                  <p className={styles.vencedorPremioValor}>{vencedorAtual?.premioValor ? `${vencedorAtual.premioValor} MZN` : PRATO_SORTEIO.valor}</p>
                  <p className={styles.vencedorPremioNome}>{vencedorAtual?.pratoNome ?? PRATO_SORTEIO.nome}</p>
                </div>
              </div>
            )}
          </div>

          {/* Painel direito — lista de participantes */}
          <div className={styles.painelDireito}>
            <div className={styles.listaHeader}>
              <h2 className={styles.listaTitulo}>Participantes</h2>
              <span className={styles.listaContagem}>{participantes.length} inscritos</span>
            </div>

            <ul className={styles.lista}>
              {participantes.map((p) => (
                <li
                  key={p.id}
                  className={`${styles.listaItem} ${vencedor?.id === p.id ? styles.listaItemVencedor : ''}`}
                >
                  <span className={styles.listaRef}>{p.ref}</span>
                  <div className={styles.listaInfo}>
                    <span className={styles.listaNome}>{p.nome}</span>
                    <span className={styles.listaEmpresa}>{p.empresa}</span>
                  </div>
                  {vencedor?.id === p.id && (
                    <span className={styles.listaVencedorTag}>Vencedor</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}
