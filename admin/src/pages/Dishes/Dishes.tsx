import { useState } from 'react'
import { useAdmin } from '../../context/AdminContext'
import { Header, Card, Button } from '../../components'
import { formatPrice } from '../../../../shared/utils'
import type { Prato } from '../../../../shared/types'
import type { DishFormData } from '../../types/admin.types'
import styles from './Dishes.module.css'

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

function IcoPratoVazio() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--ui-text-3)' }}>
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/>
      <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>
    </svg>
  )
}

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
            <IcoPlus /> Adicionar Prato
          </Button>
        }
      />

      {/* Barra de pesquisa */}
      <Card className={styles.searchCard}>
        <input
          type="text"
          placeholder="Pesquisar pratos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </Card>

      {/* Grid de pratos */}
      <div className={styles.dishesGrid}>
        {filteredDishes.map(dish => (
          <Card key={dish.id} className={styles.dishCard} hover>
            <img src={dish.imagem} alt={dish.nome} className={styles.dishImagem} />
            <h3 className={styles.dishName}>{dish.nome}</h3>
            <p className={styles.dishDescription}>{dish.descricao}</p>
            <div className={styles.dishPrice}>{formatPrice(dish.preco)}</div>
            <div className={styles.dishActions}>
              <Button
                variant="secondary"
                size="small"
                onClick={() => handleEditDish(dish)}
              >
                <IcoEditar /> Editar
              </Button>
              <Button
                variant="danger"
                size="small"
                onClick={() => handleDeleteDish(dish.id)}
              >
                <IcoLixo /> Excluir
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredDishes.length === 0 && (
        <Card className={styles.emptyState}>
          <div className={styles.emptyIcon}><IcoPratoVazio /></div>
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
    imagem: dish?.imagem || '',
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

            <div className={styles.formGroup}>
              <label className={styles.label}>URL da Imagem</label>
              <input
                type="url"
                value={formData.imagem}
                onChange={(e) => setFormData({ ...formData, imagem: e.target.value })}
                className={styles.input}
                placeholder="https://..."
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
