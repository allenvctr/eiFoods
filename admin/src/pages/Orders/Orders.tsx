import { useState } from 'react'
import { useAdmin } from '../../context/AdminContext'
import { Header, Card, Button, Badge } from '../../components'
import { formatPrice, getCustomizationSummary } from '../../../../shared/utils'
import type { Order } from '../../types/admin.types'
import type { OrderStatus } from '../../types/admin.types'
import styles from './Orders.module.css'

export function Orders() {
  const { state, dispatch } = useAdmin()
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'all'>('all')
  
  const filteredOrders = selectedStatus === 'all'
    ? state.orders
    : state.orders.filter(o => o.status === selectedStatus)
  
  const statusCounts = {
    all: state.orders.length,
    pending: state.orders.filter(o => o.status === 'pending').length,
    preparing: state.orders.filter(o => o.status === 'preparing').length,
    ready: state.orders.filter(o => o.status === 'ready').length,
    delivered: state.orders.filter(o => o.status === 'delivered').length
  }
  
  return (
    <div className={styles.orders}>
      <Header 
        title="Gestão de Pedidos" 
        subtitle={`${state.orders.length} pedidos no total`}
      />
      
      {/* Filtros de status */}
      <Card className={styles.filtersCard}>
        <div className={styles.filters}>
          <FilterButton
            label="Todos"
            count={statusCounts.all}
            active={selectedStatus === 'all'}
            onClick={() => setSelectedStatus('all')}
          />
          <FilterButton
            label="Pendente"
            count={statusCounts.pending}
            active={selectedStatus === 'pending'}
            onClick={() => setSelectedStatus('pending')}
            variant="warning"
          />
          <FilterButton
            label="Preparando"
            count={statusCounts.preparing}
            active={selectedStatus === 'preparing'}
            onClick={() => setSelectedStatus('preparing')}
            variant="info"
          />
          <FilterButton
            label="Pronto"
            count={statusCounts.ready}
            active={selectedStatus === 'ready'}
            onClick={() => setSelectedStatus('ready')}
            variant="success"
          />
          <FilterButton
            label="Entregue"
            count={statusCounts.delivered}
            active={selectedStatus === 'delivered'}
            onClick={() => setSelectedStatus('delivered')}
            variant="default"
          />
        </div>
      </Card>
      
      {/* Lista de pedidos */}
      <div className={styles.ordersList}>
        {filteredOrders.map(order => (
          <Card 
            key={order.id} 
            className={styles.orderCard}
            hover
          >
            <div className={styles.orderHeader}>
              <div className={styles.orderHeaderLeft}>
                <div className={styles.orderId}>{order.id}</div>
                <Badge variant={getStatusVariant(order.status)}>
                  {getStatusLabel(order.status)}
                </Badge>
              </div>
              <div className={styles.orderTotal}>
                {formatPrice(order.total)}
              </div>
            </div>
            
            <div className={styles.orderBody}>
              <div className={styles.orderInfo}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>👤</span>
                  <span className={styles.infoValue}>{order.deliveryDetails.name}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>🏢</span>
                  <span className={styles.infoValue}>{order.deliveryDetails.company}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>📍</span>
                  <span className={styles.infoValue}>{order.deliveryDetails.location}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>📞</span>
                  <span className={styles.infoValue}>{order.deliveryDetails.contact}</span>
                </div>
              </div>
              
              <div className={styles.orderItems}>
                <div className={styles.itemsTitle}>Itens ({order.items.length})</div>
                {order.items.map((item, index) => (
                  <div key={index} className={styles.orderItem}>
                    <span className={styles.itemEmoji}>{item.prato.emoji}</span>
                    <div className={styles.itemDetails}>
                      <div className={styles.itemName}>{item.prato.nome}</div>
                      {getCustomizationSummary(item.customizations) && (
                        <div className={styles.itemCustomizations}>
                          {getCustomizationSummary(item.customizations)}
                        </div>
                      )}
                    </div>
                    <div className={styles.itemPrice}>{formatPrice(item.total)}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className={styles.orderFooter}>
              <div className={styles.orderTime}>
                {formatDateTime(order.createdAt)}
              </div>
              <div className={styles.orderActions}>
                <StatusButton
                  order={order}
                  onStatusChange={(status) => {
                    dispatch({
                      type: 'UPDATE_ORDER_STATUS',
                      payload: { id: order.id, status }
                    })
                  }}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {filteredOrders.length === 0 && (
        <Card className={styles.emptyState}>
          <div className={styles.emptyIcon}>📦</div>
          <h3 className={styles.emptyTitle}>Nenhum pedido encontrado</h3>
          <p className={styles.emptyText}>
            {selectedStatus === 'all' 
              ? 'Ainda não há pedidos' 
              : `Não há pedidos com status "${getStatusLabel(selectedStatus as OrderStatus)}"`}
          </p>
        </Card>
      )}
    </div>
  )
}

// Componente de botão de filtro
interface FilterButtonProps {
  label: string
  count: number
  active: boolean
  onClick: () => void
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
}

function FilterButton({ label, count, active, onClick, variant = 'default' }: FilterButtonProps) {
  return (
    <button
      className={`${styles.filterButton} ${active ? styles.activeFilter : ''}`}
      onClick={onClick}
    >
      <span className={styles.filterLabel}>{label}</span>
      <Badge variant={variant} size="small">{count}</Badge>
    </button>
  )
}

// Componente de botão de status
interface StatusButtonProps {
  order: Order
  onStatusChange: (status: OrderStatus) => void
}

function StatusButton({ order, onStatusChange }: StatusButtonProps) {
  const statusFlow: Record<OrderStatus, OrderStatus | null> = {
    pending: 'preparing',
    preparing: 'ready',
    ready: 'delivered',
    delivered: null,
    cancelled: null
  }
  
  const nextStatus = statusFlow[order.status]
  
  if (!nextStatus) return null
  
  return (
    <Button
      size="small"
      variant={nextStatus === 'delivered' ? 'success' : 'primary'}
      onClick={(e) => {
        e.stopPropagation()
        onStatusChange(nextStatus)
      }}
    >
      {getStatusActionLabel(nextStatus)}
    </Button>
  )
}

// Funções auxiliares
function getStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    pending: 'Pendente',
    preparing: 'Preparando',
    ready: 'Pronto',
    delivered: 'Entregue',
    cancelled: 'Cancelado'
  }
  return labels[status]
}

function getStatusVariant(status: OrderStatus): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  const variants: Record<OrderStatus, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
    pending: 'warning',
    preparing: 'info',
    ready: 'success',
    delivered: 'default',
    cancelled: 'danger'
  }
  return variants[status]
}

function getStatusActionLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    pending: 'Iniciar Preparo',
    preparing: 'Marcar como Pronto',
    ready: 'Marcar como Entregue',
    delivered: '',
    cancelled: ''
  }
  return labels[status]
}

function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('pt-MZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}
