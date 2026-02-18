import type { ReactNode, ButtonHTMLAttributes } from 'react'
import styles from './Button.module.css'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  size?: 'small' | 'medium' | 'large'
  fullWidth?: boolean
}

export function Button({ 
  children, 
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  className = '',
  ...props 
}: ButtonProps) {
  const classes = `${styles.button} ${styles[variant]} ${styles[size]} ${fullWidth ? styles.fullWidth : ''} ${className}`
  
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
