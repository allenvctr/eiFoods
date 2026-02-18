import type { ReactNode, CSSProperties } from 'react'
import styles from './Card.module.css'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  style?: CSSProperties
  hover?: boolean
}

export function Card({ children, className = '', onClick, style, hover = false }: CardProps) {
  const classes = `${styles.card} ${hover ? styles.hover : ''} ${className}`
  
  return (
    <div className={classes} onClick={onClick} style={style}>
      {children}
    </div>
  )
}
