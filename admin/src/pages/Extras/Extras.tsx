import { useState } from 'react'
import { useAdmin } from '../../context/AdminContext'
import { Header, Card, Button } from '../../components'
import { formatPrice } from '../../../../shared/utils'
import type { Extra } from '../../../../shared/types'
import type { ExtraFormData } from '../../types/admin.types'
import styles from './Extras.module.css'

function IcoPlus() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  )
}

function IcoEditar() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  )
}

function IcoLixo() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
  )
}

function IcoExtrasVazio() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--ui-text-3)' }}>
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
    </svg>
  )
}

export function Extras() {
  const { state, dispatch } = useAdmin()
  const [showModal, setShowModal] = useState(false)
  const [editingExtra, setEditingExtra] = useState<Extra | null>(null)
  
  const handleAddExtra = () => {
    setEditingExtra(null)
    setShowModal(true)
  }
  
  const handleEditExtra = (extra: Extra) => {
    setEditingExtra(extra)
    setShowModal(true)
  }
  
  const handleDeleteExtra = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este extra?')) {
      dispatch({ type: 'DELETE_EXTRA', payload: id })
    }
  }
  
  return (
    <div className={styles.extras}>
      <Header 
        title="Gestão de Extras" 
        subtitle={`${state.extras.length} extras disponíveis`}
        actions={
          <Button onClick={handleAddExtra}>
            <IcoPlus /> Adicionar Extra
          </Button>
        }
      />
      
      <div className={styles.extrasGrid}>
        {state.extras.map(extra => (
          <Card key={extra.id} className={styles.extraCard} hover>
            <div className={styles.extraHeader}>
              <h3 className={styles.extraName}>{extra.nome}</h3>
              <div className={styles.extraPrice}>{formatPrice(extra.preco)}</div>
            </div>
            <div className={styles.extraActions}>
              <Button 
                variant="secondary" 
                size="small"
                fullWidth
                onClick={() => handleEditExtra(extra)}
              >
                <IcoEditar /> Editar
              </Button>
              <Button
                variant="danger"
                size="small"
                fullWidth
                onClick={() => handleDeleteExtra(extra.id)}
              >
                <IcoLixo /> Excluir
              </Button>
            </div>
          </Card>
        ))}
      </div>
      
      {state.extras.length === 0 && (
         <Card className={styles.emptyState}>
          <div className={styles.emptyIcon}><IcoExtrasVazio /></div>
          <h3 className={styles.emptyTitle}>Nenhum extra cadastrado</h3>
          <p className={styles.emptyText}>Adicione extras que os clientes podem incluir nos pedidos</p>
        </Card>
      )}
      
      {showModal && (
        <ExtraModal
          extra={editingExtra}
          onClose={() => setShowModal(false)}
          onSave={(extraData) => {
            if (editingExtra) {
              dispatch({
                type: 'UPDATE_EXTRA',
                payload: { ...editingExtra, ...extraData }
              })
            } else {
              const newId = Date.now().toString()
              dispatch({
                type: 'ADD_EXTRA',
                payload: { id: newId, ...extraData } as Extra
              })
            }
            setShowModal(false)
          }}
        />
      )}
    </div>
  )
}

// Modal de formulário
interface ExtraModalProps {
  extra: Extra | null
  onClose: () => void
  onSave: (data: ExtraFormData) => void
}

function ExtraModal({ extra, onClose, onSave }: ExtraModalProps) {
  const [formData, setFormData] = useState<ExtraFormData>({
    nome: extra?.nome || '',
    preco: extra?.preco || 0
  })
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.nome || !formData.preco) {
      alert('Preencha todos os campos obrigatórios')
      return
    }
    onSave(formData)
  }
  
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>
          {extra ? 'Editar Extra' : 'Novo Extra'}
        </h2>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Nome do Extra *</label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className={styles.input}
              placeholder="Ex: + Frango extra"
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Preço (MZN) *</label>
            <input
              type="number"
              value={formData.preco}
              onChange={(e) => setFormData({ ...formData, preco: Number(e.target.value) })}
              className={styles.input}
              min="0"
              step="5"
              required
            />
          </div>
          
          <div className={styles.formActions}>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {extra ? 'Salvar Alterações' : 'Adicionar Extra'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
