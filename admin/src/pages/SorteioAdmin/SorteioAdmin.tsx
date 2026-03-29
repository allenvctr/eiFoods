import { useEffect, useState, useRef } from 'react'
import { Header } from '../../components'
import { sorteioApi, type ApiSorteio } from '../../lib/api'
import styles from './SorteioAdmin.module.css'

interface Participante {
  id: string
  ref: string
  nome: string
  empresa: string
  contacto: string
  inscritoEm: string
  ganhouEm?: string
}

const DURACAO = 3000

function isFridayInMaputo() {
  const weekday = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Africa/Maputo',
    weekday: 'short',
  }).format(new Date()).toLowerCase()

  return weekday === 'fri'
}

export function SorteioAdmin() {
  const [valorRifa, setValorRifa] = useState(10)
  const [valorRifaInput, setValorRifaInput] = useState('10')
  const [pendentes, setPendentes] = useState<ApiSorteio['inscricoesPendentes']>([])
  const [participantes, setParticipantes] = useState<Participante[]>([])
  const [historico, setHistorico] = useState<ApiSorteio['historico']>([])
  const [fase, setFase] = useState<'idle' | 'animando' | 'resultado'>('idle')
  const [nomeAtual, setNomeAtual] = useState<Participante | null>(null)
  const [vencedor, setVencedor] = useState<Participante | null>(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [novoNome, setNovoNome] = useState('')
  const [novaEmpresa, setNovaEmpresa] = useState('')
  const [novoContacto, setNovoContacto] = useState('')
  const [mostrarForm, setMostrarForm] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const podeSortearHoje = isFridayInMaputo()

  function applySorteio(doc: ApiSorteio) {
    setValorRifa(doc.valorRifa ?? 10)
    setValorRifaInput(String(doc.valorRifa ?? 10))
    setPendentes(doc.inscricoesPendentes ?? [])
    setParticipantes(doc.participantes)
    setHistorico(doc.historico)

    if (doc.vencedorAtual) {
      const vencedorAtual = doc.participantes.find((p) => p.id === doc.vencedorAtual?.participanteId)
      setVencedor(vencedorAtual ?? {
        id: doc.vencedorAtual.participanteId,
        ref: doc.vencedorAtual.ref,
        nome: doc.vencedorAtual.nome,
        empresa: doc.vencedorAtual.empresa,
        contacto: doc.vencedorAtual.contacto,
        inscritoEm: '',
      })
      setNomeAtual(vencedorAtual ?? null)
      setFase('resultado')
    } else {
      setVencedor(null)
      setNomeAtual(null)
      setFase('idle')
    }
  }

  useEffect(() => {
    void (async () => {
      setLoading(true)
      setErro(null)
      try {
        const doc = await sorteioApi.get()
        applySorteio(doc)
      } catch (e) {
        setErro((e as Error).message)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  function sortear() {
    if (!podeSortearHoje) {
      setErro('O sorteio só pode ser realizado à sexta-feira (Africa/Maputo).')
      return
    }

    if (fase !== 'idle' || participantes.length === 0) return
    setFase('animando')
    setVencedor(null)

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
        void (async () => {
          try {
            const doc = await sorteioApi.realizar()
            applySorteio(doc)
          } catch (e) {
            setErro((e as Error).message)
            setFase('idle')
          }
        })()
      }
    }

    timerRef.current = setTimeout(ciclo, intervalo)
  }

  function reiniciar() {
    if (timerRef.current) clearTimeout(timerRef.current)
    void (async () => {
      try {
        const doc = await sorteioApi.reset()
        applySorteio(doc)
      } catch (e) {
        setErro((e as Error).message)
      }
    })()
  }

  function remover(id: string) {
    void (async () => {
      try {
        const doc = await sorteioApi.removeParticipante(id)
        applySorteio(doc)
      } catch (e) {
        setErro((e as Error).message)
      }
    })()
  }

  function confirmarInscricao(id: string) {
    void (async () => {
      try {
        const doc = await sorteioApi.confirmarInscricao(id)
        applySorteio(doc)
      } catch (e) {
        setErro((e as Error).message)
      }
    })()
  }

  function rejeitarInscricao(id: string) {
    void (async () => {
      try {
        const doc = await sorteioApi.rejeitarInscricao(id)
        applySorteio(doc)
      } catch (e) {
        setErro((e as Error).message)
      }
    })()
  }

  function adicionarParticipante() {
    if (!novoNome.trim()) return
    void (async () => {
      try {
        const doc = await sorteioApi.addParticipante({
          nome: novoNome.trim(),
          empresa: novaEmpresa.trim(),
          contacto: novoContacto.trim(),
        })
        applySorteio(doc)
        setNovoNome('')
        setNovaEmpresa('')
        setNovoContacto('')
        setMostrarForm(false)
      } catch (e) {
        setErro((e as Error).message)
      }
    })()
  }

  function salvarValorRifa() {
    const valor = Number(valorRifaInput)
    if (!Number.isFinite(valor) || valor < 0) {
      setErro('Valor da rifa inválido')
      return
    }

    void (async () => {
      try {
        const doc = await sorteioApi.updateValorRifa(valor)
        applySorteio(doc)
      } catch (e) {
        setErro((e as Error).message)
      }
    })()
  }

  if (loading) return <div style={{ padding: 24 }}>A carregar sorteio...</div>

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

      {erro && (
        <div className={styles.formCard} style={{ borderColor: 'var(--ui-danger)', color: 'var(--ui-danger)' }}>
          {erro}
        </div>
      )}

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

      <div className={styles.formCard}>
        <h3 className={styles.formTitulo}>Valor da rifa</h3>
        <div className={styles.formAcoes} style={{ justifyContent: 'flex-start' }}>
          <input
            className={styles.input}
            type="number"
            min={0}
            value={valorRifaInput}
            onChange={(e) => setValorRifaInput(e.target.value)}
            style={{ maxWidth: 160 }}
          />
          <button className={styles.btnConfirmar} onClick={salvarValorRifa}>Guardar</button>
          <span className={styles.label}>Atual: {valorRifa} MZN</span>
        </div>
      </div>

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
              <span className={styles.statNum}>{historico.length}</span>
              <span className={styles.statLabel}>Sorteios realizados</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNum}>{historico[0]?.nome.split(' ')[0] ?? '—'}</span>
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
              <button className={styles.btnSortear} onClick={sortear} disabled={participantes.length === 0 || !podeSortearHoje}>
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
            {!podeSortearHoje && (
              <p className={styles.maquinaLabel}>Sorteio disponível apenas na sexta-feira (Africa/Maputo).</p>
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
                {historico.map((v, i) => (
                  <tr key={i}>
                    <td className={styles.tdRef}>{v.ref}</td>
                    <td className={styles.tdNome}>{v.nome}</td>
                    <td className={styles.tdPrato}>{v.pratoNome ?? '—'}</td>
                    <td className={styles.tdData}>{new Date(v.data).toLocaleDateString('pt-PT')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Coluna direita — participantes */}
        <div className={styles.colunaDireita}>
          <div className={styles.listaCard} style={{ marginBottom: 16 }}>
            <div className={styles.listaHeader}>
              <h3 className={styles.listaTitulo}>Inscrições pendentes</h3>
              <span className={styles.listaContagem}>{pendentes.length} pendentes</span>
            </div>
            {pendentes.length === 0 ? (
              <div style={{ padding: '14px 16px', color: 'var(--ui-text-3)', fontSize: 13 }}>
                Nenhuma inscrição pendente de confirmação.
              </div>
            ) : (
              <table className={styles.tabela}>
                <thead>
                  <tr>
                    <th>Nome</th><th>Empresa</th><th>Contacto</th><th></th>
                  </tr>
                </thead>
                <tbody>
                  {pendentes.map((p) => (
                    <tr key={p.id}>
                      <td className={styles.tdNome}>{p.nome}</td>
                      <td className={styles.tdEmpresa}>{p.empresa}</td>
                      <td className={styles.tdData}>{p.contacto}</td>
                      <td style={{ display: 'flex', gap: 8 }}>
                        <button className={styles.btnAprovar} onClick={() => confirmarInscricao(p.id)}>Confirmar</button>
                        <button className={styles.btnRemover} onClick={() => rejeitarInscricao(p.id)} title="Rejeitar">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

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
