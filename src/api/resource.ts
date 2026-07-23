import { apiClient } from './client'

interface Paginated<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

function unwrap<T>(data: Paginated<T> | T[]): T[] {
  return Array.isArray(data) ? data : data.results
}

export interface ResourceApi<T, TWrite = Partial<T>> {
  list: (params?: Record<string, unknown>) => Promise<T[]>
  get: (id: string) => Promise<T>
  create: (payload: TWrite) => Promise<T>
  // PATCH parcial: acepta un subconjunto de los campos de escritura.
  update: (id: string, payload: Partial<TWrite>) => Promise<T>
  remove: (id: string) => Promise<void>
}

// Si el payload trae un File (ej. campo de imagen), hay que enviarlo como
// multipart/form-data en vez de JSON para que DRF lo acepte.
function tieneArchivo(payload: unknown): boolean {
  if (!payload || typeof payload !== 'object') return false
  return Object.values(payload as Record<string, unknown>).some((v) => v instanceof File)
}

function aFormData(payload: Record<string, unknown>): FormData {
  const fd = new FormData()
  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined || value === null) continue
    if (value instanceof File) {
      fd.append(key, value)
    } else if (typeof value === 'boolean') {
      fd.append(key, value ? 'true' : 'false')
    } else {
      fd.append(key, String(value))
    }
  }
  return fd
}

/**
 * Fábrica de API CRUD genérica sobre un endpoint DRF estándar
 * (list paginado, retrieve, create, update parcial, delete).
 */
export function createResource<T, TWrite = Partial<T>>(endpoint: string): ResourceApi<T, TWrite> {
  const base = endpoint.endsWith('/') ? endpoint : `${endpoint}/`

  return {
    async list(params) {
      const { data } = await apiClient.get<Paginated<T> | T[]>(base, {
        params: { limite: 100, ...params },
      })
      return unwrap(data)
    },
    async get(id) {
      const { data } = await apiClient.get<T>(`${base}${id}/`)
      return data
    },
    async create(payload) {
      const body = tieneArchivo(payload) ? aFormData(payload as Record<string, unknown>) : payload
      const { data } = await apiClient.post<T>(base, body)
      return data
    },
    async update(id, payload) {
      const body = tieneArchivo(payload) ? aFormData(payload as Record<string, unknown>) : payload
      const { data } = await apiClient.patch<T>(`${base}${id}/`, body)
      return data
    },
    async remove(id) {
      await apiClient.delete(`${base}${id}/`)
    },
  }
}
