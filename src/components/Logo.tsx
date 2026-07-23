import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'

interface LogoProps {
  /** 'full' = llama + texto, 'mark' = solo la llama (para espacios chicos). */
  variant?: 'full' | 'mark'
  /** Alto del ícono de llama en px. El texto escala junto con este valor. */
  size?: number
  /** Color del texto del wordmark; por defecto usa el color heredado (útil en sidebars oscuros). */
  textColor?: string
  className?: string
}

const FLAME_TIPS = [
  { x: 0, h: 0.62, c: 'var(--accent)' },
  { x: 15, h: 0.8, c: 'var(--accent-2)' },
  { x: 30, h: 1, c: 'var(--accent)' },
  { x: 45, h: 0.8, c: 'var(--accent-2)' },
  { x: 60, h: 0.62, c: 'var(--accent)' },
]

export function FlameMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="-6 0 78 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {FLAME_TIPS.map((tip, i) => (
        <path
          key={i}
          transform={`translate(${tip.x} ${(1 - tip.h) * 12}) scale(1 ${tip.h})`}
          d="M12 0C7 6 3 11 4.5 16.5 5.7 20.7 8.6 24 12 24 15.4 24 18.3 20.7 19.5 16.5 21 11 17 6 12 0Z"
          fill={tip.c}
        />
      ))}
    </svg>
  )
}

/** Reemplaza la "Ó" de ESTACIÓN por un sello circular de cubiertos cruzados. */
function CutleryMark({ size }: { size: number }) {
  return (
    <svg
      className="brand-logo-cutlery"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="2.4" />
      <line x1="21.5" y1="10.5" x2="10.5" y2="21.5" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
      <line x1="10.5" y1="10.5" x2="21.5" y2="21.5" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
      <line x1="8.4" y1="8" x2="9.7" y2="9.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="10.5" y1="6.5" x2="10.5" y2="8.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="12.6" y1="8" x2="11.3" y2="9.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

export function Logo({ variant = 'full', size = 32, textColor, className }: LogoProps) {
  return (
    <Link
      to="/"
      className={`brand-logo ${className ?? ''}`}
      style={{ '--logo-size': `${size}px` } as CSSProperties}
      aria-label="Ir al inicio"
    >
      <FlameMark size={size} />
      {variant === 'full' && (
        <span className="brand-logo-text" style={textColor ? { color: textColor } : undefined}>
          <span className="brand-logo-title">
            LA ESTACI
            <CutleryMark size={size * 0.34} />
            N
          </span>
          <small>del Sabor</small>
        </span>
      )}
    </Link>
  )
}
