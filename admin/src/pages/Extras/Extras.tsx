import { useState } from 'react'
import { useAdmin } from '../../context/AdminContext'
import { Header, Card, Button } from '../../components'
import { formatPrice } from '../../../../shared/utils'
import type { Extra } from '../../../../shared/types'
import type { ExtraFormData } from '../../types/admin.types'
import styles from './Extras.module.css'

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
            ➕ Adicionar Extra
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
                ✏️ Editar
              </Button>
              <Button 
                variant="danger" 
                size="small"
                fullWidth
                onClick={() => handleDeleteExtra(extra.id)}
              >
                🗑️ Excluir
              </Button>
            </div>
          </Card>
        ))}
      </div>
      
      {state.extras.length === 0 && (
         <Card className={styles.emptyState}>
          <div className={styles.emptyIcon}>➕</div>
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
