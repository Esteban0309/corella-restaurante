import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { rutaPorRol } from '../router/ProtectedRoute'
import '../styles/modal.css'

interface LoginModalProps {
  onClose: () => void
  // Si es true, al iniciar sesión navega directo al panel correspondiente al rol.
  irAlPanel?: boolean
}

type Modo = 'login' | 'registro'

export function LoginModal({ onClose, irAlPanel = true }: LoginModalProps) {
  const { login, registro } = useAuth()
  const navigate = useNavigate()
  const [modo, setModo] = useState<Modo>('login')

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [telefono, setTelefono] = useState('')

  const [error, setError] = useState<string | null>(null)
  const [cargando, setCargando] = useState(false)
  const [verPassword, setVerPassword] = useState(false)

  const irAlDestino = (rol: Parameters<typeof rutaPorRol>[0]) => {
    onClose()
    if (irAlPanel) {
      navigate(rutaPorRol(rol))
    }
  }

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setCargando(true)
    try {
      const usuario = await login(username, password)
      irAlDestino(usuario.rol)
    } catch {
      setError('Usuario o contraseña incorrectos.')
    } finally {
      setCargando(false)
    }
  }

  const handleRegistro = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)

    if (!username || !email || !password) {
      setError('Usuario, email y contraseña son obligatorios.')
      return
    }

    setCargando(true)
    try {
      // registro() crea la cuenta (siempre como Cliente) y hace login automático.
      const usuario = await registro({
        username,
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        telefono,
      })
      irAlDestino(usuario.rol)
    } catch (err) {
      const mensaje =
        (err as { response?: { data?: Record<string, unknown> } })?.response?.data
      setError(
        mensaje
          ? Object.values(mensaje).flat().join(' ')
          : 'No se pudo crear la cuenta. Verifica los datos.',
      )
    } finally {
      setCargando(false)
    }
  }

  const cambiarModo = (nuevoModo: Modo) => {
    setModo(nuevoModo)
    setError(null)
    setVerPassword(false)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" type="button" onClick={onClose} aria-label="Cerrar">
          ×
        </button>
        <h2 className="modal-title">{modo === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}</h2>

        {modo === 'login' ? (
          <form className="modal-form" onSubmit={handleLogin}>
            <label className="modal-label" htmlFor="username">Usuario</label>
            <input
              id="username"
              className="modal-input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
            <label className="modal-label" htmlFor="password">Contraseña</label>
            <div className="password-field">
              <input
                id="password"
                className="modal-input"
                type={verPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setVerPassword((v) => !v)}
                aria-label={verPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {verPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
            {error && <p className="modal-error">{error}</p>}
            <button className="btn btn-primary modal-submit" type="submit" disabled={cargando}>
              {cargando ? 'Ingresando...' : 'Ingresar'}
            </button>
            <p className="modal-switch">
              ¿No tienes cuenta?{' '}
              <button type="button" className="modal-switch-link" onClick={() => cambiarModo('registro')}>
                Regístrate
              </button>
            </p>
          </form>
        ) : (
          <form className="modal-form" onSubmit={handleRegistro}>
            <label className="modal-label" htmlFor="reg-username">Usuario</label>
            <input
              id="reg-username"
              className="modal-input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
            <label className="modal-label" htmlFor="reg-email">Email</label>
            <input
              id="reg-email"
              className="modal-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label className="modal-label" htmlFor="reg-nombre">Nombre</label>
            <input
              id="reg-nombre"
              className="modal-input"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <label className="modal-label" htmlFor="reg-apellido">Apellido</label>
            <input
              id="reg-apellido"
              className="modal-input"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <label className="modal-label" htmlFor="reg-telefono">Teléfono (opcional)</label>
            <input
              id="reg-telefono"
              className="modal-input"
              type="text"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
            <label className="modal-label" htmlFor="reg-password">Contraseña</label>
            <div className="password-field">
              <input
                id="reg-password"
                className="modal-input"
                type={verPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setVerPassword((v) => !v)}
                aria-label={verPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {verPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
            {error && <p className="modal-error">{error}</p>}
            <button className="btn btn-primary modal-submit" type="submit" disabled={cargando}>
              {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
            <p className="modal-switch">
              ¿Ya tienes cuenta?{' '}
              <button type="button" className="modal-switch-link" onClick={() => cambiarModo('login')}>
                Inicia sesión
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
