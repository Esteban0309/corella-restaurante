import { useState, type ReactNode } from 'react'
import { useAuth } from '../context/AuthContext'
import { Logo } from './Logo'
import { Icon } from './Icon'
import './DashboardLayout.css'

export interface DashboardTab {
  key: string
  label: string
  content: ReactNode
  icon?: ReactNode
}

interface DashboardLayoutProps {
  title: string
  tabs: DashboardTab[]
  /** Control externo del tab activo (opcional). Sin esto, el componente maneja su propio estado. */
  activeTab?: string
  onTabChange?: (key: string) => void
}

export function DashboardLayout({ title, tabs, activeTab: activeTabProp, onTabChange }: DashboardLayoutProps) {
  const { usuario, logout } = useAuth()
  const [internalActiveTab, setInternalActiveTab] = useState(tabs[0]?.key)
  const activeTab = activeTabProp ?? internalActiveTab
  const setActiveTab = onTabChange ?? setInternalActiveTab

  const tabActiva = tabs.find((t) => t.key === activeTab)

  return (
    <div className="dashboard">
      <aside className="dashboard-sidebar">
        <div className="dashboard-brand">
          <Logo size={44} textColor="#f8f1e7" />
        </div>
        <p className="dashboard-title">{title}</p>
        <nav className="dashboard-nav">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`dashboard-nav-item ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.icon && <span className="dashboard-nav-icon">{tab.icon}</span>}
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="dashboard-user">
          <div className="dashboard-user-info">
            <span className="dashboard-user-avatar">
              {(usuario?.first_name || usuario?.username || '?').slice(0, 1).toUpperCase()}
            </span>
            <div>
              <p className="dashboard-user-name">{usuario?.first_name || usuario?.username}</p>
              <p className="dashboard-user-role">{usuario?.rol}</p>
            </div>
          </div>
          <button type="button" className="btn btn-secondary" onClick={() => void logout()}>
            <Icon name="log-out" size={15} />
            Cerrar sesión
          </button>
        </div>
      </aside>
      <main className="dashboard-content">{tabActiva?.content}</main>
    </div>
  )
}
