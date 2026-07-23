import type { ReactNode } from 'react'

export type IconName =
  | 'utensils'
  | 'image'
  | 'archive'
  | 'grid'
  | 'table'
  | 'calendar-check'
  | 'receipt'
  | 'credit-card'
  | 'users'
  | 'user'
  | 'folder'
  | 'plus-circle'
  | 'truck'
  | 'package'
  | 'clipboard-list'
  | 'map-pin'
  | 'chef-hat'
  | 'file-text'
  | 'pencil'
  | 'trash'
  | 'check'
  | 'x'
  | 'log-out'
  | 'menu'

interface IconProps {
  name: IconName
  size?: number
  className?: string
  strokeWidth?: number
}

/** Set de íconos minimalistas estilo "outline" (trazo simple, sin relleno). */
export function Icon({ name, size = 18, className, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  )
}

/** Insignia Sí/No con ícono de check o x, para reemplazar los "✅/⛔" de las tablas. */
export function BoolBadge({ value }: { value: boolean }) {
  return (
    <span className={`bool-badge ${value ? 'bool-badge-yes' : 'bool-badge-no'}`}>
      <Icon name={value ? 'check' : 'x'} size={13} strokeWidth={2.4} />
      {value ? 'Sí' : 'No'}
    </span>
  )
}

const PATHS: Record<IconName, ReactNode> = {
  utensils: (
    <>
      <path d="M4 2v6a2 2 0 0 0 4 0V2" />
      <line x1="6" y1="2" x2="6" y2="22" />
      <path d="M18 2c-1.7 1-2.5 2.8-2.5 5.5V13" />
      <line x1="18" y1="13" x2="18" y2="22" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9.5" r="1.5" />
      <path d="M21 16l-5.5-5.5a2 2 0 0 0-2.8 0L4 19" />
    </>
  ),
  archive: (
    <>
      <rect x="3" y="4" width="18" height="4" rx="1" />
      <path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8" />
      <line x1="10" y1="12" x2="14" y2="12" />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.3" />
      <rect x="14" y="3" width="7" height="7" rx="1.3" />
      <rect x="3" y="14" width="7" height="7" rx="1.3" />
      <rect x="14" y="14" width="7" height="7" rx="1.3" />
    </>
  ),
  table: (
    <>
      <rect x="3" y="9" width="18" height="3" rx="1" />
      <line x1="6" y1="12" x2="6" y2="20" />
      <line x1="18" y1="12" x2="18" y2="20" />
    </>
  ),
  'calendar-check': (
    <>
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <path d="M8 14.5l2.2 2.2L16 11.3" />
    </>
  ),
  receipt: (
    <>
      <path d="M6 2h12v19l-3-2-3 2-3-2-3 2V2z" />
      <line x1="9" y1="7" x2="15" y2="7" />
      <line x1="9" y1="11" x2="15" y2="11" />
      <line x1="9" y1="15" x2="13" y2="15" />
    </>
  ),
  'credit-card': (
    <>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20c0-3.3 2.6-6 6-6 1.3 0 2.5.4 3.5 1.1" />
      <circle cx="17" cy="9" r="2.6" />
      <path d="M14.5 13.5c2.9.3 5.5 2.8 5.5 6.5" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </>
  ),
  folder: <path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z" />,
  'plus-circle': (
    <>
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </>
  ),
  truck: (
    <>
      <rect x="1" y="7" width="13" height="10" rx="1" />
      <path d="M14 10h4l3 3v4h-7z" />
      <circle cx="5.5" cy="18.3" r="1.7" />
      <circle cx="17.5" cy="18.3" r="1.7" />
    </>
  ),
  package: (
    <>
      <path d="M21 8l-9-5-9 5 9 5 9-5z" />
      <path d="M3 8v8l9 5 9-5V8" />
      <line x1="12" y1="13" x2="12" y2="21" />
    </>
  ),
  'clipboard-list': (
    <>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <rect x="9" y="2" width="6" height="4" rx="1" />
      <line x1="8" y1="11" x2="16" y2="11" />
      <line x1="8" y1="15" x2="16" y2="15" />
    </>
  ),
  'map-pin': (
    <>
      <path d="M12 21s7-6.3 7-11.5A7 7 0 0 0 5 9.5C5 14.7 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.3" />
    </>
  ),
  'chef-hat': (
    <>
      <rect x="8" y="15" width="8" height="4" rx="0.6" />
      <path d="M8 15a4 4 0 0 1-1-7.8A3.5 3.5 0 0 1 12 4a3.5 3.5 0 0 1 5 3.2A4 4 0 0 1 16 15" />
    </>
  ),
  'file-text': (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="16" y2="17" />
    </>
  ),
  pencil: (
    <>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
    </>
  ),
  trash: (
    <>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </>
  ),
  check: <polyline points="20 6 9 17 4 12" />,
  x: (
    <>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </>
  ),
  'log-out': (
    <>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </>
  ),
  menu: (
    <>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </>
  ),
}
