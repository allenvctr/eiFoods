import { useState } from 'react'
import { useAdmin } from '../../context/AdminContext'
import { Header, Card, Button } from '../../components'
import { formatPrice } from '../../../../shared/utils'
import type { Prato } from '../../../../shared/types'
import type { DishFormData } from '../../types/admin.types'
import styles from './Dishes.module.css'

export function Dishes() {
  const { state, dispatch } = useAdmin()
  const [showModal, setShowModal] = useState(false)
  const [editingDish, setEditingDish] = useState<Prato | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  
  const filteredDishes = state.pratos.filter(prato =>
    prato.nome.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  const handleAddDish = () => {
    setEditingDish(null)
    setShowModal(true)
  }
  
  const handleEditDish = (dish: Prato) => {
    setEditingDish(dish)
    setShowModal(true)
  }
  
  const handleDeleteDish = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este prato?')) {
      dispatch({ type: 'DELETE_PRATO', payload: id })
    }
  }
  
  return (
    <div className={styles.dishes}>
      <Header 
        title="Gestão de Pratos" 
        subtitle={`${state.pratos.length} pratos no menu`}
        actions={
          <Button onClick={handleAddDish}>
            ➕ Adicionar Prato
          </Button>
        }
      />
      
      {/* Barra de pesquisa */}
      <Card className={styles.searchCard}>
        <input
          type="text"
          placeholder="🔍 Pesquisar pratos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </Card>
      
      {/* Grid de pratos */}
      <div className={styles.dishesGrid}>
        {filteredDishes.map(dish => (
          <Card key={dish.id} className={styles.dishCard} hover>
            <div className={styles.dishEmoji}>{dish.emoji}</div>
            <h3 className={styles.dishName}>{dish.nome}</h3>
            <p className={styles.dishDescription}>{dish.descricao}</p>
            <div className={styles.dishPrice}>{formatPrice(dish.preco)}</div>
            <div className={styles.dishActions}>
              <Button 
                variant="secondary" 
                size="small"
                onClick={() => handleEditDish(dish)}
              >
                ✏️ Editar
              </Button>
              <Button 
                variant="danger" 
                size="small"
                onClick={() => handleDeleteDish(dish.id)}
              >
                🗑️ Excluir
              </Button>
            </div>
          </Card>
        ))}
      </div>
      
      {filteredDishes.length === 0 && (
        <Card className={styles.emptyState}>
          <div className={styles.emptyIcon}>🍽️</div>
          <h3 className={styles.emptyTitle}>Nenhum prato encontrado</h3>
          <p className={styles.emptyText}>
            {searchQuery 
              ? 'Tente ajustar sua pesquisa' 
              : 'Adicione seu primeiro prato ao menu'}
          </p>
        </Card>
      )}
      
      {/* Modal de formulário */}
      {showModal && (
        <DishModal
          dish={editingDish}
          onClose={() => setShowModal(false)}
          onSave={(dishData) => {
            if (editingDish) {
              dispatch({
                type: 'UPDATE_PRATO',
                payload: { ...editingDish, ...dishData }
              })
            } else {
              const newId = Math.max(...state.pratos.map(p => p.id), 0) + 1
              dispatch({
                type: 'ADD_PRATO',
                payload: { id: newId, ...dishData } as Prato
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
interface DishModalProps {
  dish: Prato | null
  onClose: () => void
  onSave: (data: DishFormData) => void
}

function DishModal({ dish, onClose, onSave }: DishModalProps) {
  const [formData, setFormData] = useState<DishFormData>({
    nome: dish?.nome || '',
    preco: dish?.preco || 0,
    emoji: dish?.emoji || '🍽️',
    descricao: dish?.descricao || ''
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
          {dish ? 'Editar Prato' : 'Novo Prato'}
        </h2>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Nome do Prato *</label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className={styles.input}
              required
            />
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Emoji</label>
              <input
                type="text"
                value={formData.emoji}
                onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                className={styles.input}
                maxLength={2}
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
                step="10"
                required
              />
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Descrição</label>
            <textarea
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              className={styles.textarea}
              rows={3}
            />
          </div>
          
          <div className={styles.formActions}>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {dish ? 'Salvar Alterações' : 'Adicionar Prato'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
