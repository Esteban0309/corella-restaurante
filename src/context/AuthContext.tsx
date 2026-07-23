import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import {
  login as loginRequest,
  logout as logoutRequest,
  obtenerPerfil,
  registro as registroRequest,
  type RegistroPayload,
  type Usuario,
} from '../api/auth'
import { tokenStorage } from '../api/client'

interface AuthContextValue {
  usuario: Usuario | null
  cargando: boolean
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<Usuario>
  registro: (payload: RegistroPayload) => Promise<Usuario>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargarPerfil = async () => {
      if (!tokenStorage.getAccess()) {
        setCargando(false)
        return
      }
      try {
        const perfil = await obtenerPerfil()
        setUsuario(perfil)
      } catch {
        tokenStorage.clear()
      } finally {
        setCargando(false)
      }
    }
    void cargarPerfil()
  }, [])

  const login = useCallback(async (username: string, password: string) => {
    const usuarioLogueado = await loginRequest(username, password)
    setUsuario(usuarioLogueado)
    return usuarioLogueado
  }, [])

  const registro = useCallback(async (payload: RegistroPayload) => {
    await registroRequest(payload)
    return login(payload.username, payload.password)
  }, [login])

  const logout = useCallback(async () => {
    try {
      await logoutRequest()
    } catch {
      // Ignoramos el error (ej. token ya vencido): el token local ya se borró
      // dentro de logoutRequest y de todos modos hay que cerrar la sesión.
    } finally {
      setUsuario(null)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{ usuario, cargando, isAuthenticated: usuario !== null, login, registro, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }
  return context
}
