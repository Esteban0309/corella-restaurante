import { createResource } from './resource'

export interface UserMini {
  id: number
  username: string
  first_name: string
  last_name: string
  email: string
}

export type EmpleadoRol = 'mesero' | 'cocinero' | 'cajero' | 'admin'

export interface Empleado {
  id: string
  user: UserMini
  rol: EmpleadoRol
  telefono: string
  fecha_ingreso: string
  activo: boolean
}

export interface Cliente {
  id: string
  user: UserMini
  telefono: string
  direccion: string
  puntos_fidelidad: number
  fecha_nacimiento: string | null
}

// Nota: 'user' es de solo lectura en estos serializers del backend, así que
// no se pueden crear Empleados/Clientes nuevos desde aquí (los Cliente se
// crean vía /auth/registro/, y los Empleado se dan de alta en Django admin).
// Por eso en el panel de Admin estos paneles solo permiten listar y editar
// los campos propios (rol/telefono/activo, o telefono/direccion/nacimiento).
export const empleadosApi = createResource<Empleado>('/empleados/')
export const clientesApi = createResource<Cliente>('/clientes/')
