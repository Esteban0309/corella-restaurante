import { createResource } from './resource'

export interface Categoria {
  id: string
  nombre: string
  descripcion: string
  orden: number
  activa: boolean
}

export interface ProductoVariante {
  id: string
  producto: string
  nombre: string
  tipo: string
  precio_extra: string
  disponible: boolean
}

export interface Producto {
  id: string
  categoria: string
  categoria_nombre: string
  nombre: string
  descripcion: string
  precio_base: string
  tiempo_preparacion: number
  disponible: boolean
  imagen: string | null
  imagen_url: string
  variantes: ProductoVariante[]
}

export interface Proveedor {
  id: string
  nombre: string
  contacto: string
  telefono: string
  email: string
  direccion: string
  activo: boolean
}

export interface Ingrediente {
  id: string
  nombre: string
  unidad_medida: string
  stock_actual: number
  stock_minimo: number
  proveedor: string | null
  proveedor_nombre: string | null
  stock_bajo: boolean
}

export interface RecetaIngrediente {
  id: string
  producto: string
  ingrediente: string
  ingrediente_nombre: string
  cantidad_necesaria: string
}

export const categoriasApi = createResource<Categoria>('/categorias/')
export const productosApi = createResource<Producto>('/productos/')
export const variantesApi = createResource<ProductoVariante>('/variantes-producto/')
export const proveedoresApi = createResource<Proveedor>('/proveedores/')
export const ingredientesApi = createResource<Ingrediente>('/ingredientes/')
export const recetasApi = createResource<RecetaIngrediente>('/recetas/')

export async function getCategorias(): Promise<Categoria[]> {
  return categoriasApi.list({ ordering: 'orden' })
}

export async function getProductos(categoriaId?: string): Promise<Producto[]> {
  return productosApi.list({ categoria: categoriaId })
}
