import { useAdmin } from '../../context/AdminContext'
import { Header, StatCard, Card } from '../../components'
import { mockStats, mockRevenueData, mockPopularDishes } from '../../data/mockData'
import { formatPrice } from '../../../../shared/utils'
import styles from './Dashboard.module.css'

export function Dashboard() {
  const { state } = useAdmin()
  
  // Calcular estatísticas em tempo real
  const pendingOrders = state.orders.filter(o => o.status === 'pending').length
  const todayOrders = state.orders.length
  const todayRevenue = state.orders.reduce((sum, order) => sum + order.total, 0)
  
  return (
    <div className={styles.dashboard}>
      <Header 
        title="Dashboard" 
        subtitle="Visão geral do seu negócio"
      />
      
      {/* Estatísticas principais */}
      <div className={styles.statsGrid}>
        <StatCard
          title="Pedidos Hoje"
          value={todayOrders}
          icon="📦"
          trend={{ value: mockStats.ordersChange, label: 'vs ontem' }}
          color="#2563eb"
        />
        <StatCard
          title="Receita Hoje"
          value={formatPrice(todayRevenue)}
          icon="💰"
          trend={{ value: mockStats.revenueChange, label: 'vs ontem' }}
          color="#16a34a"
        />
        <StatCard
          title="Pedidos Pendentes"
          value={pendingOrders}
          icon="⏱️"
          color="#f59e0b"
        />
        <StatCard
          title="Pratos Disponíveis"
          value={state.pratos.length}
          icon="🍽️"
          color="#8b5cf6"
        />
      </div>
      
      {/* Gráfico de receita */}
      <Card className={styles.chartCard}>
        <h2 className={styles.cardTitle}>Receita dos Últimos 7 Dias</h2>
        <div className={styles.chart}>
          {mockRevenueData.map((data, index) => {
            const maxValue = Math.max(...mockRevenueData.map(d => d.value))
            const height = (data.value / maxValue) * 100
            
            return (
              <div key={index} className={styles.chartBar}>
                <div 
                  className={styles.bar} 
                  style={{ height: `${height}%` }}
                  title={`${data.date}: ${formatPrice(data.value)}`}
                />
                <span className={styles.chartLabel}>
                  {new Date(data.date).getDate()}
                </span>
              </div>
            )
          })}
        </div>
      </Card>
      
      {/* Pratos populares */}
      <Card>
        <h2 className={styles.cardTitle}>Pratos Mais Populares</h2>
        <div className={styles.popularDishes}>
          {mockPopularDishes.map((item, index) => (
            <div key={item.dish.id} className={styles.dishRow}>
              <div className={styles.dishRank}>#{index + 1}</div>
              <div className={styles.dishEmoji}>{item.dish.emoji}</div>
              <div className={styles.dishInfo}>
                <div className={styles.dishName}>{item.dish.nome}</div>
                <div className={styles.dishMeta}>
                  {item.orders} pedidos · {formatPrice(item.revenue)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
      
      {/* Pedidos recentes */}
      <Card>
        <h2 className={styles.cardTitle}>Pedidos Recentes</h2>
        <div className={styles.recentOrders}>
          {state.orders.slice(0, 5).map(order => (
            <div key={order.id} className={styles.orderRow}>
              <div className={styles.orderInfo}>
                <div className={styles.orderId}>{order.id}</div>
                <div className={styles.orderCustomer}>{order.deliveryDetails.name}</div>
              </div>
              <div className={styles.orderMeta}>
                <div className={styles.orderTotal}>{formatPrice(order.total)}</div>
                <div className={`${styles.orderStatus} ${styles[order.status]}`}>
                  {getStatusLabel(order.status)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: 'Pendente',
    preparing: 'Preparando',
    ready: 'Pronto',
    delivered: 'Entregue',
    cancelled: 'Cancelado'
  }
  return labels[status] || status
}
