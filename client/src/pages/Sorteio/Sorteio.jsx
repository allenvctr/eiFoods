import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import styles from './Sorteio.module.css'

const PRATO_SORTEIO = {
  nome: 'Caril de Frango com Arroz Basmati',
  descricao: 'Caril aromático com frango fresco, especiarias selecionadas e arroz basmati perfumado.',
  valor: '290 MZN',
  data: 'Sexta-feira, 28 de Fevereiro de 2025',
  imagem: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
}

const PARTICIPANTES = [
  { id: 1, nome: 'Ana Machava',       ref: '#0023', empresa: 'Mozal S.A.' },
  { id: 2, nome: 'Carlos Sitoe',      ref: '#0047', empresa: 'BCI Banco' },
  { id: 3, nome: 'Fátima Nhaca',      ref: '#0061', empresa: 'Vodacom Moç.' },
  { id: 4, nome: 'João Cossa',        ref: '#0082', empresa: 'EDM' },
  { id: 5, nome: 'Maria Tembe',       ref: '#0094', empresa: 'Mcel' },
  { id: 6, nome: 'Pedro Mondlane',    ref: '#0105', empresa: 'Millennium BIM' },
  { id: 7, nome: 'Sofia Bila',        ref: '#0118', empresa: 'SPI Gestão' },
  { id: 8, nome: 'Rui Maputo',        ref: '#0133', empresa: 'JAT Seguros' },
  { id: 9, nome: 'Dina Chapo',        ref: '#0147', empresa: 'Cervejas de Moç.' },
  { id: 10, nome: 'Nelson Guambe',    ref: '#0159', empresa: 'Mozal S.A.' },
  { id: 11, nome: 'Rosa Macia',       ref: '#0171', empresa: 'Corridor Sands' },
  { id: 12, nome: 'Tiago Fumo',       ref: '#0184', empresa: 'Cimentos de Moç.' },
]

const DURACAO_ANIMACAO = 3200
const INTERVALO_INICIAL = 80

export default function Sorteio() {
  const navigate = useNavigate()
  const [fase, setFase] = useState('idle') // idle | animando | resultado
  const [nomeSelecionado, setNomeSelecionado] = useState(null)
  const [vencedor, setVencedor] = useState(null)
  const timerRef = useRef(null)

  function iniciarSorteio() {
    if (fase !== 'idle') return
    setFase('animando')
    setVencedor(null)

    const idxVencedor = Math.floor(Math.random() * PARTICIPANTES.length)
    const inicio = Date.now()
    let intervalo = INTERVALO_INICIAL

    function ciclo() {
      const elapsed = Date.now() - inicio
      const progresso = Math.min(elapsed / DURACAO_ANIMACAO, 1)

      // desacelera exponencialmente
      intervalo = INTERVALO_INICIAL + progresso * progresso * 700

      const idxAleatório = Math.floor(Math.random() * PARTICIPANTES.length)
      setNomeSelecionado(PARTICIPANTES[idxAleatório])

      if (progresso < 1) {
        timerRef.current = setTimeout(ciclo, intervalo)
      } else {
        setNomeSelecionado(PARTICIPANTES[idxVencedor])
        setVencedor(PARTICIPANTES[idxVencedor])
        setFase('resultado')
      }
    }

    timerRef.current = setTimeout(ciclo, intervalo)
  }

  function reiniciar() {
    clearTimeout(timerRef.current)
    setFase('idle')
    setVencedor(null)
    setNomeSelecionado(null)
  }

  return (
    <div className={styles.page}>
      <Navbar />

      <main className={styles.main}>

        {/* Cabeçalho da página */}
        <div className={styles.pageHeader}>
          <span className={styles.pageBadge}>Sorteio ao vivo</span>
          <h1 className={styles.pageTitulo}>Sorteio do Dia</h1>
          <p className={styles.pageSub}>
            Um cliente sortudo recebe hoje o prato do dia gratuitamente. O sorteio é realizado às 10h30, antes do fecho das encomendas.
          </p>
        </div>

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
                    <span className={styles.pratoMetaValor}>{PRATO_SORTEIO.valor}</span>
                  </div>
                  <div className={styles.pratoMetaItem}>
                    <span className={styles.pratoMetaLabel}>Data</span>
                    <span className={styles.pratoMetaValor}>{PRATO_SORTEIO.data}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Máquina de sorteio */}
            <div className={styles.maquina}>
              <p className={styles.maquinaLabel}>
                {fase === 'idle'     && 'Pronto para sortear'}
                {fase === 'animando' && 'A sortear...'}
                {fase === 'resultado' && 'Vencedor apurado'}
              </p>

              <div className={`${styles.tambor} ${fase === 'animando' ? styles.tamborAtivo : ''} ${fase === 'resultado' ? styles.tamborResultado : ''}`}>
                {fase === 'idle' && (
                  <span className={styles.tamborPlaceholder}>
                    Clique em "Sortear" para iniciar
                  </span>
                )}
                {(fase === 'animando' || fase === 'resultado') && nomeSelecionado && (
                  <>
                    <span className={styles.tamborRef}>{nomeSelecionado.ref}</span>
                    <span className={styles.tamborNome}>{nomeSelecionado.nome}</span>
                    <span className={styles.tamborEmpresa}>{nomeSelecionado.empresa}</span>
                  </>
                )}
              </div>

              {fase === 'idle' && (
                <button className={styles.btnSortear} onClick={iniciarSorteio}>
                  Sortear
                </button>
              )}

              {fase === 'animando' && (
                <button className={styles.btnSortear} disabled>
                  A sortear...
                </button>
              )}

              {fase === 'resultado' && (
                <div className={styles.acoesFinal}>
                  <button className={styles.btnReiniciar} onClick={reiniciar}>
                    Novo sorteio
                  </button>
                  <button className={styles.btnMenu} onClick={() => navigate('/menu')}>
                    Ver menu
                  </button>
                </div>
              )}
            </div>

            {/* Banner do vencedor */}
            {fase === 'resultado' && vencedor && (
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
                  <p className={styles.vencedorPremioValor}>{PRATO_SORTEIO.valor}</p>
                  <p className={styles.vencedorPremioNome}>{PRATO_SORTEIO.nome}</p>
                </div>
              </div>
            )}
          </div>

          {/* Painel direito — lista de participantes */}
          <div className={styles.painelDireito}>
            <div className={styles.listaHeader}>
              <h2 className={styles.listaTitulo}>Participantes</h2>
              <span className={styles.listaContagem}>{PARTICIPANTES.length} inscritos</span>
            </div>

            <ul className={styles.lista}>
              {PARTICIPANTES.map((p) => (
                <li
                  key={p.id}
                  className={`${styles.listaItem} ${
                    fase === 'animando' && nomeSelecionado?.id === p.id ? styles.listaItemAtivo : ''
                  } ${
                    fase === 'resultado' && vencedor?.id === p.id ? styles.listaItemVencedor : ''
                  }`}
                >
                  <span className={styles.listaRef}>{p.ref}</span>
                  <div className={styles.listaInfo}>
                    <span className={styles.listaNome}>{p.nome}</span>
                    <span className={styles.listaEmpresa}>{p.empresa}</span>
                  </div>
                  {fase === 'resultado' && vencedor?.id === p.id && (
                    <span className={styles.listaVencedorTag}>Vencedor</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </main>
    </div>
  )
}
