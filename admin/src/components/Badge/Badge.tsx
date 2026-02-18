import type { ReactNode } from 'react'
import styles from './Badge.module.css'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'small' | 'medium'
}

export function Badge({ children, variant = 'default', size = 'medium' }: BadgeProps) {
  const classes = `${styles.badge} ${styles[variant]} ${styles[size]}`
  
  return (
    <span className={classes}>
      {children}
    </span>
  )
}
