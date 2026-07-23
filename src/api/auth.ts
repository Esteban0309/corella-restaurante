import { apiClient, tokenStorage } from './client'

export type Rol = 'admin' | 'empleado' | 'cliente'

export interface Usuario {
  id: number
  username: string
  email: string
  first_name?: string
  last_name?: string
  rol: Rol
}

interface LoginResponse {
  access: string
  refresh: string
  usuario: Usuario
}

export async function login(username: string, password: string): Promise<Usuario> {
  const { data } = await apiClient.post<LoginResponse>('/auth/login/', {
    username,
    password,
  })
  tokenStorage.setTokens(data.access, data.refresh)
  return data.usuario
}

export interface RegistroPayload {
  username: string
  email: string
  password: string
  first_name?: string
  last_name?: string
  telefono?: string
}

export async function registro(payload: RegistroPayload) {
  const { data } = await apiClient.post('/auth/registro/', payload)
  return data
}

export async function obtenerPerfil(): Promise<Usuario> {
  const { data } = await apiClient.get<Usuario>('/auth/perfil/')
  return data
}

export async function logout() {
  const refresh = tokenStorage.getRefresh()
  try {
    if (refresh) {
      await apiClient.post('/auth/logout/', { refresh })
    }
  } finally {
    tokenStorage.clear()
  }
}

export async function cambiarPassword(passwordActual: string, passwordNueva: string) {
  const { data } = await apiClient.post('/auth/cambiar-password/', {
    password_actual: passwordActual,
    password_nueva: passwordNueva,
  })
  return data
}
