import { createResource } from './resource'

export type BannerTipo = 'hero' | 'promo' | 'oferta'

export interface Banner {
  id: string
  titulo: string
  subtitulo: string
  tipo: BannerTipo
  imagen: string | null
  imagen_url: string
  texto_boton: string
  enlace: string
  orden: number
  activo: boolean
}

export const bannersApi = createResource<Banner>('/banners/')

export async function getBanners(tipo?: BannerTipo): Promise<Banner[]> {
  return bannersApi.list({ tipo, activo: true, ordering: 'orden' })
}
