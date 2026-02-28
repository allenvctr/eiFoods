import { useState } from 'react'
import { Header } from '../../components'
import { mockPratos } from '../../data/mockData'
import styles from './PratoDoDia.module.css'

interface PratoDoDiaConfig {
  pratoId: number
  nomeCustom: string
  descricaoCustom: string
  precoCustom: number
  imagem: string
  publicado: boolean
  horaCorte: string
}

const IMAGENS_SUGERIDAS = [
  { label: 'Caril', url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80' },
  { label: 'Frango', url: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c4?auto=format&fit=crop&w=600&q=80' },
  { label: 'Peixe', url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80' },
  { label: 'Massa', url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80' },
  { label: 'Carne', url: 'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=600&q=80' },
  { label: 'Arroz', url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80' },
]

const pratoInicial = mockPratos[5]

export function PratoDoDia() {
  const [config, setConfig] = useState<PratoDoDiaConfig>({
    pratoId: pratoInicial.id,
    nomeCustom: pratoInicial.nome,
    descricaoCustom: pratoInicial.descricao,
    precoCustom: pratoInicial.preco,
    imagem: IMAGENS_SUGERIDAS[0].url,
    publicado: true,
    horaCorte: '11:00',
  })
  const [guardado, setGuardado] = useState(false)
  const [imgInput, setImgInput] = useState('')

  function handlePratoChange(id: number) {
    const p = mockPratos.find(x => x.id === id)
    if (!p) return
    setConfig(c => ({
      ...c,
      pratoId: p.id,
      nomeCustom: p.nome,
      descricaoCustom: p.descricao,
      precoCustom: p.preco,
    }))
    setGuardado(false)
  }

  function handleGuardar() {
    setGuardado(true)
    setTimeout(() => setGuardado(false), 3000)
  }

  return (
    <div className={styles.page}>
      <Header
        title="Prato do Dia"
        subtitle="Configure o prato em destaque para hoje"
        actions={
          <div className={styles.headerAcoes}>
            <span className={`${styles.statusBadge} ${config.publicado ? styles.publicado : styles.rascunho}`}>
              {config.publicado ? 'Publicado' : 'Rascunho'}
            </span>
            <button className={styles.btnPublicar} onClick={() => setConfig(c => ({ ...c, publicado: !c.publicado }))}>
              {config.publicado ? 'Despublicar' : 'Publicar'}
            </button>
          </div>
        }
      />

      <div className={styles.layout}>

        {/* Pré-visualização */}
        <div className={styles.preview}>
          <p className={styles.previewLabel}>Pré-visualização</p>
          <div className={styles.previewCard}>
            <div className={styles.previewImagemWrap}>
              {config.imagem ? (
                <img src={config.imagem} alt={config.nomeCustom} className={styles.previewImagem} />
              ) : (
                <div className={styles.previewImagemVazia}>Sem imagem</div>
              )}
              <span className={styles.previewBadge}>Prato do dia</span>
              {!config.publicado && <span className={styles.previewRascunhoBadge}>Rascunho</span>}
            </div>
            <div className={styles.previewInfo}>
              <p className={styles.previewNome}>{config.nomeCustom || '—'}</p>
              <p className={styles.previewDescricao}>{config.descricaoCustom || '—'}</p>
              <div className={styles.previewRodape}>
                <span className={styles.previewPreco}>{config.precoCustom} MZN</span>
                <span className={styles.previewHora}>Corte: {config.horaCorte}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Formulário */}
        <div className={styles.form}>

          {/* Selecionar prato base */}
          <div className={styles.secao}>
            <h2 className={styles.secaoTitulo}>Prato base</h2>
            <div className={styles.pratoGrid}>
              {mockPratos.map(p => (
                <button
                  key={p.id}
                  className={`${styles.pratoOpcao} ${config.pratoId === p.id ? styles.pratoOpcaoAtivo : ''}`}
                  onClick={() => handlePratoChange(p.id)}
                >
                  <span className={styles.pratoOpcaoNome}>{p.nome}</span>
                  <span className={styles.pratoOpcaoPreco}>{p.preco} MZN</span>
                </button>
              ))}
            </div>
          </div>

          {/* Detalhes editáveis */}
          <div className={styles.secao}>
            <h2 className={styles.secaoTitulo}>Detalhes do destaque</h2>
            <div className={styles.campos}>
              <div className={styles.campo}>
                <label className={styles.label}>Nome em destaque</label>
                <input
                  className={styles.input}
                  value={config.nomeCustom}
                  onChange={e => { setConfig(c => ({ ...c, nomeCustom: e.target.value })); setGuardado(false) }}
                  placeholder="Nome do prato..."
                />
              </div>
              <div className={styles.campo}>
                <label className={styles.label}>Descrição</label>
                <textarea
                  className={styles.textarea}
                  value={config.descricaoCustom}
                  onChange={e => { setConfig(c => ({ ...c, descricaoCustom: e.target.value })); setGuardado(false) }}
                  rows={3}
                  placeholder="Descrição apelativa do prato..."
                />
              </div>
              <div className={styles.campoRow}>
                <div className={styles.campo}>
                  <label className={styles.label}>Preço (MZN)</label>
                  <input
                    className={styles.input}
                    type="number"
                    value={config.precoCustom}
                    onChange={e => { setConfig(c => ({ ...c, precoCustom: Number(e.target.value) })); setGuardado(false) }}
                  />
                </div>
                <div className={styles.campo}>
                  <label className={styles.label}>Hora de corte</label>
                  <input
                    className={styles.input}
                    type="time"
                    value={config.horaCorte}
                    onChange={e => { setConfig(c => ({ ...c, horaCorte: e.target.value })); setGuardado(false) }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Imagem */}
          <div className={styles.secao}>
            <h2 className={styles.secaoTitulo}>Imagem</h2>
            <div className={styles.imagensSugeridas}>
              {IMAGENS_SUGERIDAS.map(img => (
                <button
                  key={img.url}
                  className={`${styles.imagemOpcao} ${config.imagem === img.url ? styles.imagemOpcaoAtiva : ''}`}
                  onClick={() => { setConfig(c => ({ ...c, imagem: img.url })); setImgInput(''); setGuardado(false) }}
                >
                  <img src={img.url} alt={img.label} className={styles.imagemThumb} />
                  <span className={styles.imagemLabel}>{img.label}</span>
                </button>
              ))}
            </div>
            <div className={styles.campo} style={{ marginTop: '12px' }}>
              <label className={styles.label}>URL personalizado</label>
              <div className={styles.inputRow}>
                <input
                  className={styles.input}
                  value={imgInput}
                  onChange={e => setImgInput(e.target.value)}
                  placeholder="https://..."
                />
                <button
                  className={styles.btnAplicar}
                  onClick={() => { if (imgInput) { setConfig(c => ({ ...c, imagem: imgInput })); setGuardado(false) } }}
                >
                  Aplicar
                </button>
              </div>
            </div>
          </div>

          {/* Guardar */}
          <div className={styles.acoes}>
            {guardado && <span className={styles.feedbackGuardado}>Guardado com sucesso</span>}
            <button className={styles.btnGuardar} onClick={handleGuardar}>
              Guardar alterações
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
