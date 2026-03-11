import { createContext, useContext, useState, useCallback } from 'react'
import styles from './Toast.module.css'

const ToastContext = createContext(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast deve ser usado dentro de ToastProvider')
  return ctx
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type, saindo: false }])

    // Marcar como "saindo" antes de remover (animação de saída)
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, saindo: true } : t))
    }, 3000)

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3400)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className={styles.container} aria-live="polite">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`${styles.toast} ${styles[toast.type]} ${toast.saindo ? styles.saindo : ''}`}
          >
            <span className={styles.icon}>
              {toast.type === 'success' && '✅'}
              {toast.type === 'error' && '❌'}
              {toast.type === 'info' && 'ℹ️'}
            </span>
            <span className={styles.message}>{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
