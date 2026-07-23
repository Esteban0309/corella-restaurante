import { createResource } from './resource'

export interface Zona {
  id: string
  nombre: string
  descripcion: string
}

export type MesaEstado = 'libre' | 'ocupada' | 'reservada' | 'mantenimiento'

export interface Mesa {
  id: string
  zona: string
  zona_nombre: string
  numero: number
  capacidad: number
  estado: MesaEstado
}

export type ReservaEstado = 'pendiente' | 'confirmada' | 'cancelada' | 'completada'

export interface Reserva {
  id: string
  mesa: string
  mesa_numero: number
  cliente: string
  cliente_nombre: string
  fecha_hora: string
  numero_personas: number
  estado: ReservaEstado
  notas: string
  created_at: string
}

export interface ReservaWrite {
  mesa: string
  fecha_hora: string
  numero_personas: number
  notas?: string
  estado?: ReservaEstado
  // 'cliente' no se envía cuando el usuario logueado es Cliente: el backend
  // lo asigna automáticamente a partir del token (ver ReservaViewSet.perform_create).
  cliente?: string
}

export const zonasApi = createResource<Zona>('/zonas/')
export const mesasApi = createResource<Mesa>('/mesas/')
export const reservasApi = createResource<Reserva, ReservaWrite>('/reservas/')
