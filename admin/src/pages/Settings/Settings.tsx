import { useState } from 'react'
import { Header, Card, Button } from '../../components'
import styles from './Settings.module.css'

interface AppSettings {
  restaurantName: string
  whatsappNumber: string
  deliveryTime: string
  address: string
  email: string
}

export function Settings() {
  const [settings, setSettings] = useState<AppSettings>({
    restaurantName: 'eiFoods',
    whatsappNumber: '258841234567',
    deliveryTime: '11:00 - 14:00',
    address: 'Av. Julius Nyerere, Maputo',
    email: 'contato@eifoods.mz'
  })
  
  const [isSaving, setIsSaving] = useState(false)
  
  const handleSave = () => {
    setIsSaving(true)
    // Simular salvamento
    setTimeout(() => {
      setIsSaving(false)
      alert('Configurações salvas com sucesso!')
    }, 1000)
  }
  
  return (
    <div className={styles.settings}>
      <Header 
        title="Configurações" 
        subtitle="Configure as informações do seu restaurante"
      />
      
      <div className={styles.settingsGrid}>
        {/* Informações Gerais */}
        <Card>
          <h2 className={styles.sectionTitle}>📋 Informações Gerais</h2>
          
          <div className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Nome do Restaurante</label>
              <input
                type="text"
                value={settings.restaurantName}
                onChange={(e) => setSettings({ ...settings, restaurantName: e.target.value })}
                className={styles.input}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>E-mail</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className={styles.input}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Endereço</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className={styles.input}
              />
            </div>
          </div>
        </Card>
        
        {/* Configurações de Entrega */}
        <Card>
          <h2 className={styles.sectionTitle}>🚚 Entrega</h2>
          
          <div className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Número WhatsApp</label>
              <input
                type="tel"
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                className={styles.input}
                placeholder="258841234567"
              />
              <span className={styles.hint}>
                Número usado para receber pedidos via WhatsApp
              </span>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Horário de Entrega</label>
              <input
                type="text"
                value={settings.deliveryTime}
                onChange={(e) => setSettings({ ...settings, deliveryTime: e.target.value })}
                className={styles.input}
                placeholder="11:00 - 14:00"
              />
              <span className={styles.hint}>
                Horário em que os pedidos são entregues
              </span>
            </div>
          </div>
        </Card>
        
        {/* Estatísticas */}
        <Card>
          <h2 className={styles.sectionTitle}>📊 Estatísticas</h2>
          
          <div className={styles.stats}>
            <div className={styles.statItem}>
              <div className={styles.statLabel}>Total de Pedidos</div>
              <div className={styles.statValue}>128</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statLabel}>Receita Total</div>
              <div className={styles.statValue}>38,450 MZN</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statLabel}>Ticket Médio</div>
              <div className={styles.statValue}>300 MZN</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statLabel}>Avaliação Média</div>
              <div className={styles.statValue}>⭐ 4.8</div>
            </div>
          </div>
        </Card>
        
        {/* Sobre o Sistema */}
        <Card>
          <h2 className={styles.sectionTitle}>ℹ️ Sobre o Sistema</h2>
          
          <div className={styles.about}>
            <div className={styles.aboutRow}>
              <span className={styles.aboutLabel}>Versão:</span>
              <span className={styles.aboutValue}>1.0.0</span>
            </div>
            <div className={styles.aboutRow}>
              <span className={styles.aboutLabel}>Última Atualização:</span>
              <span className={styles.aboutValue}>18 de Fevereiro, 2026</span>
            </div>
            <div className={styles.aboutRow}>
              <span className={styles.aboutLabel}>Desenvolvido por:</span>
              <span className={styles.aboutValue}>eiFoods Team</span>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Botão de salvar fixo */}
      <div className={styles.saveBar}>
        <Button 
          size="large"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? '💾 Salvando...' : '💾 Salvar Configurações'}
        </Button>
      </div>
    </div>
  )
}
