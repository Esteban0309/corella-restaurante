import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LoginModal } from './LoginModal'
import { Logo } from './Logo'
import { Icon } from './Icon'
import { rutaPorRol } from '../router/ProtectedRoute'

/** Topbar + header con logo, navegación y sesión. Se usa en todas las páginas públicas. */
export function SiteHeader() {
  const { usuario, isAuthenticated, cargando: cargandoSesion, logout } = useAuth()
  const [mostrarLogin, setMostrarLogin] = useState(false)
  const [mostrarMenuUsuario, setMostrarMenuUsuario] = useState(false)

  return (
    <>
      <div className="topbar">
        <div className="topbar-content">
          <div className="topbar-info">
            <span>🕗 Lun a Dom, 12:00 – 22:00</span>
            <span>📞 +593 99 000 0000</span>
          </div>
          <div className="topbar-social">
            <a href="/#contacto" aria-label="Instagram">IG</a>
            <a href="/#contacto" aria-label="Facebook">FB</a>
            <a href="/#contacto" aria-label="WhatsApp">WA</a>
          </div>
        </div>
      </div>

      <header className="header">
        <div className="header-content">
          <div className="header-left">
            {isAuthenticated && (
              <Link
                className="hamburger-btn"
                to={usuario ? rutaPorRol(usuario.rol) : '/'}
                aria-label="Ir a mi panel"
                title="Ir a mi panel"
              >
                <Icon name="menu" size={22} />
              </Link>
            )}
            <Logo size={48} />
          </div>
          <nav className="nav">
            <Link className="nav-link" to="/menu">Menú</Link>
            <a href="/#nosotros" className="nav-link">Nosotros</a>
            <a href="/#contacto" className="nav-link">Contacto</a>
          </nav>
          {isAuthenticated ? (
            <div className="user-avatar-menu">
              <button
                type="button"
                className="user-avatar-btn"
                onClick={() => setMostrarMenuUsuario((v) => !v)}
                aria-label="Cuenta"
              >
                {(usuario?.first_name || usuario?.username || '?').slice(0, 1).toUpperCase()}
              </button>
              {mostrarMenuUsuario && (
                <>
                  <div className="dropdown-backdrop" onClick={() => setMostrarMenuUsuario(false)} />
                  <div className="user-avatar-dropdown">
                    <p className="user-avatar-dropdown-name">{usuario?.first_name || usuario?.username}</p>
                    <button type="button" onClick={() => void logout()}>
                      <Icon name="log-out" size={15} />
                      Cerrar sesión
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button className="login-btn" type="button" onClick={() => setMostrarLogin(true)} disabled={cargandoSesion}>
              <svg className="login-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Iniciar Sesión
            </button>
          )}
        </div>
      </header>

      {mostrarLogin && <LoginModal onClose={() => setMostrarLogin(false)} />}
    </>
  )
}
