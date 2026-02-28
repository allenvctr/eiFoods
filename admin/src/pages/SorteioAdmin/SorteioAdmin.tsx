import { useState, useRef } from 'react'
import { Header } from '../../components'
import styles from './SorteioAdmin.module.css'

interface Participante {
  id: number
  ref: string
  nome: string
  empresa: string
  contacto: string
  inscritoEm: string
  ganhouEm?: string
}

const PARTICIPANTES_INICIAIS: Participante[] = [
  { id: 1,  ref: '#0023', nome: 'Ana Machava',    empresa: 'Mozal S.A.',         contacto: '258841001001', inscritoEm: '2025-02-24' },
  { id: 2,  ref: '#0047', nome: 'Carlos Sitoe',   empresa: 'BCI Banco',           contacto: '258841002002', inscritoEm: '2025-02-24' },
  { id: 3,  ref: '#0061', nome: 'Fátima Nhaca',   empresa: 'Vodacom Moç.',        contacto: '258841003003', inscritoEm: '2025-02-25' },
  { id: 4,  ref: '#0082', nome: 'João Cossa',     empresa: 'EDM',                 contacto: '258841004004', inscritoEm: '2025-02-25' },
  { id: 5,  ref: '#0094', nome: 'Maria Tembe',    empresa: 'Mcel',                contacto: '258841005005', inscritoEm: '2025-02-25' },
  { id: 6,  ref: '#0105', nome: 'Pedro Mondlane', empresa: 'Millennium BIM',      contacto: '258841006006', inscritoEm: '2025-02-26' },
  { id: 7,  ref: '#0118', nome: 'Sofia Bila',     empresa: 'SPI Gestão',          contacto: '258841007007', inscritoEm: '2025-02-26' },
  { id: 8,  ref: '#0133', nome: 'Rui Maputo',     empresa: 'JAT Seguros',         contacto: '258841008008', inscritoEm: '2025-02-27' },
  { id: 9,  ref: '#0147', nome: 'Dina Chapo',     empresa: 'Cervejas de Moç.',    contacto: '258841009009', inscritoEm: '2025-02-27' },
  { id: 10, ref: '#0159', nome: 'Nelson Guambe',  empresa: 'Mozal S.A.',          contacto: '258841010010', inscritoEm: '2025-02-27' },
  { id: 11, ref: '#0171', nome: 'Rosa Macia',     empresa: 'Corridor Sands',      contacto: '258841011011', inscritoEm: '2025-02-28' },
  { id: 12, ref: '#0184', nome: 'Tiago Fumo',     empresa: 'Cimentos de Moç.',    contacto: '258841012012', inscritoEm: '2025-02-28' },
]

const HISTORICO_VENCEDORES = [
  { ref: '#0041', nome: 'Beatriz Cumbe',  prato: 'Arroz + Frango Assado',   data: '21/02/2025' },
  { ref: '#0012', nome: 'Manuel Zavala',  prato: 'Peixe Grelhado + Arroz',  data: '14/02/2025' },
  { ref: '#0078', nome: 'Lurdes Sitoe',   prato: 'Caril de Frango + Basmati', data: '07/02/2025' },
]

const DURACAO = 3000

export function SorteioAdmin() {
  const [participantes, setParticipantes] = useState<Participante[]>(PARTICIPANTES_INICIAIS)
  const [fase, setFase] = useState<'idle' | 'animando' | 'resultado'>('idle')
  const [nomeAtual, setNomeAtual] = useState<Participante | null>(null)
  const [vencedor, setVencedor] = useState<Participante | null>(null)
  const [novoNome, setNovoNome] = useState('')
  const [novaEmpresa, setNovaEmpresa] = useState('')
  const [novoContacto, setNovoContacto] = useState('')
  const [mostrarForm, setMostrarForm] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function sortear() {
    if (fase !== 'idle' || participantes.length === 0) return
    setFase('animando')
    setVencedor(null)

    const idxVenc = Math.floor(Math.random() * participantes.length)
    const inicio = Date.now()
    let intervalo = 60

    function ciclo() {
      const elapsed = Date.now() - inicio
      const prog = Math.min(elapsed / DURACAO, 1)
      intervalo = 60 + prog * prog * 700

      setNomeAtual(participantes[Math.floor(Math.random() * participantes.length)])

      if (prog < 1) {
        timerRef.current = setTimeout(ciclo, intervalo)
      } else {
        setNomeAtual(participantes[idxVenc])
        setVencedor(participantes[idxVenc])
        setFase('resultado')
      }
    }

    timerRef.current = setTimeout(ciclo, intervalo)
  }

  function reiniciar() {
    if (timerRef.current) clearTimeout(timerRef.current)
    setFase('idle')
    setVencedor(null)
    setNomeAtual(null)
  }

  function remover(id: number) {
    if (vencedor?.id === id) setVencedor(null)
    setParticipantes(p => p.filter(x => x.id !== id))
  }

  function adicionarParticipante() {
    if (!novoNome.trim()) return
    const novo: Participante = {
      id: Date.now(),
      ref: `#${String(participantes.length + 200).padStart(4, '0')}`,
      nome: novoNome.trim(),
      empresa: novaEmpresa.trim() || '—',
      contacto: novoContacto.trim() || '—',
      inscritoEm: new Date().toISOString().slice(0, 10),
    }
    setParticipantes(p => [...p, novo])
    setNovoNome('')
    setNovaEmpresa('')
    setNovoContacto('')
    setMostrarForm(false)
  }

  return (
    <div className={styles.page}>
      <Header
        title="Gestão de Sorteio"
        subtitle="Gira os participantes e realize o sorteio do dia"
        actions={
          <button className={styles.btnAddParticipante} onClick={() => setMostrarForm(v => !v)}>
            + Adicionar participante
          </button>
        }
      />

      {/* Form inline */}
      {mostrarForm && (
        <div className={styles.formCard}>
          <h3 className={styles.formTitulo}>Novo participante</h3>
          <div className={styles.formCampos}>
            <div className={styles.campo}>
              <label className={styles.label}>Nome *</label>
              <input className={styles.input} value={novoNome} onChange={e => setNovoNome(e.target.value)} placeholder="Nome completo" />
            </div>
            <div className={styles.campo}>
              <label className={styles.label}>Empresa</label>
              <input className={styles.input} value={novaEmpresa} onChange={e => setNovaEmpresa(e.target.value)} placeholder="Empresa" />
            </div>
            <div className={styles.campo}>
              <label className={styles.label}>Contacto</label>
              <input className={styles.input} value={novoContacto} onChange={e => setNovoContacto(e.target.value)} placeholder="258841..." />
            </div>
          </div>
          <div className={styles.formAcoes}>
            <button className={styles.btnCancelar} onClick={() => setMostrarForm(false)}>Cancelar</button>
            <button className={styles.btnConfirmar} onClick={adicionarParticipante}>Adicionar</button>
          </div>
        </div>
      )}

      <div className={styles.layout}>

        {/* Coluna esquerda — sorteio */}
        <div className={styles.colunaEsquerda}>

          {/* Stats */}
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <span className={styles.statNum}>{participantes.length}</span>
              <span className={styles.statLabel}>Participantes</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNum}>{HISTORICO_VENCEDORES.length}</span>
              <span className={styles.statLabel}>Sorteios realizados</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNum}>{HISTORICO_VENCEDORES[0]?.nome.split(' ')[0] ?? '—'}</span>
              <span className={styles.statLabel}>Último vencedor</span>
            </div>
          </div>

          {/* Máquina */}
          <div className={styles.maquinaCard}>
            <p className={styles.maquinaLabel}>
              {fase === 'idle' && 'Pronto para sortear'}
              {fase === 'animando' && 'A sortear...'}
              {fase === 'resultado' && 'Vencedor apurado'}
            </p>

            <div className={`${styles.tambor} ${fase === 'animando' ? styles.tamborAtivo : ''} ${fase === 'resultado' ? styles.tamborResultado : ''}`}>
              {fase === 'idle' && (
                <span className={styles.tamborPlaceholder}>Clique em "Realizar Sorteio" para iniciar</span>
              )}
              {(fase === 'animando' || fase === 'resultado') && nomeAtual && (
                <>
                  <span className={styles.tamborRef}>{nomeAtual.ref}</span>
                  <span className={styles.tamborNome}>{nomeAtual.nome}</span>
                  <span className={styles.tamborEmpresa}>{nomeAtual.empresa}</span>
                </>
              )}
            </div>

            {fase === 'idle' && (
              <button className={styles.btnSortear} onClick={sortear} disabled={participantes.length === 0}>
                Realizar Sorteio
              </button>
            )}
            {fase === 'animando' && (
              <button className={styles.btnSortear} disabled>A sortear...</button>
            )}
            {fase === 'resultado' && (
              <div className={styles.tamborAcoes}>
                <button className={styles.btnReiniciar} onClick={reiniciar}>Novo sorteio</button>
              </div>
            )}
          </div>

          {/* Banner vencedor */}
          {fase === 'resultado' && vencedor && (
            <div className={styles.vencedorCard}>
              <div className={styles.vencedorIcone}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 6 2 18 2 18 9"/>
                  <path d="M6 18H4a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-2"/>
                  <rect x="6" y="18" width="12" height="4"/>
                </svg>
              </div>
              <div className={styles.vencedorInfo}>
                <p className={styles.vencedorLabel}>Vencedor do sorteio</p>
                <p className={styles.vencedorNome}>{vencedor.nome}</p>
                <p className={styles.vencedorDetalhe}>{vencedor.empresa} · {vencedor.ref} · {vencedor.contacto}</p>
              </div>
            </div>
          )}

          {/* Histórico */}
          <div className={styles.historicoCard}>
            <h3 className={styles.historicoTitulo}>Histórico de vencedores</h3>
            <table className={styles.historicoTable}>
              <thead>
                <tr>
                  <th>Ref</th><th>Nome</th><th>Prato</th><th>Data</th>
                </tr>
              </thead>
              <tbody>
                {HISTORICO_VENCEDORES.map((v, i) => (
                  <tr key={i}>
                    <td className={styles.tdRef}>{v.ref}</td>
                    <td className={styles.tdNome}>{v.nome}</td>
                    <td className={styles.tdPrato}>{v.prato}</td>
                    <td className={styles.tdData}>{v.data}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Coluna direita — participantes */}
        <div className={styles.colunaDireita}>
          <div className={styles.listaCard}>
            <div className={styles.listaHeader}>
              <h3 className={styles.listaTitulo}>Participantes</h3>
              <span className={styles.listaContagem}>{participantes.length} inscritos</span>
            </div>
            <table className={styles.tabela}>
              <thead>
                <tr>
                  <th>Ref</th><th>Nome</th><th>Empresa</th><th>Inscrito em</th><th></th>
                </tr>
              </thead>
              <tbody>
                {participantes.map(p => (
                  <tr
                    key={p.id}
                    className={`
                      ${fase === 'animando' && nomeAtual?.id === p.id ? styles.trAtivo : ''}
                      ${fase === 'resultado' && vencedor?.id === p.id ? styles.trVencedor : ''}
                    `}
                  >
                    <td className={styles.tdRef}>{p.ref}</td>
                    <td className={styles.tdNome}>{p.nome}</td>
                    <td className={styles.tdEmpresa}>{p.empresa}</td>
                    <td className={styles.tdData}>{p.inscritoEm}</td>
                    <td>
                      {fase === 'resultado' && vencedor?.id === p.id ? (
                        <span className={styles.vencedorTag}>Vencedor</span>
                      ) : (
                        <button className={styles.btnRemover} onClick={() => remover(p.id)} title="Remover">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}
