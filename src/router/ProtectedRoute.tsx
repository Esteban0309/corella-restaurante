import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../context/AuthContext'
import type { Rol } from '../api/auth'

interface ProtectedRouteProps {
  roles: Rol[]
  children: ReactNode
}

export function ProtectedRoute({ roles, children }: ProtectedRouteProps) {
  const { usuario, cargando, isAuthenticated } = useAuth()

  if (cargando) {
    return <div className="route-loading">Cargando...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  if (usuario && !roles.includes(usuario.rol)) {
    return <Navigate to={rutaPorRol(usuario.rol)} replace />
  }

  return <>{children}</>
}

export function rutaPorRol(rol: Rol): string {
  if (rol === 'admin') return '/admin'
  if (rol === 'empleado') return '/empleado'
  return '/cliente'
}
