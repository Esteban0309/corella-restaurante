import { apiClient } from './client'
import { createResource } from './resource'

export type PedidoEstado = 'pendiente' | 'preparando' | 'listo' | 'entregado' | 'cancelado'
export type PedidoTipo = 'mesa' | 'llevar' | 'delivery'

export interface DetallePedido {
  id: string
  pedido: string
  producto: string
  producto_nombre: string
  variante: string | null
  cantidad: number
  precio_unitario: string
  notas: string
  subtotal: string
}

export interface Pedido {
  id: string
  mesa: string | null
  mesa_numero: number | null
  cliente: string | null
  empleado: string | null
  empleado_nombre: string | null
  tipo: PedidoTipo
  estado: PedidoEstado
  total: string
  notas: string
  detalles: DetallePedido[]
  created_at: string
  updated_at: string
}

export interface DetallePedidoInput {
  producto: string
  variante?: string | null
  cantidad: number
  // El backend NO calcula el precio: hay que enviar el precio vigente del
  // producto (producto.precio_base) al armar el pedido.
  precio_unitario: string
  notas?: string
}

export interface PedidoCreatePayload {
  mesa?: string | null
  tipo: PedidoTipo
  notas?: string
  detalles: DetallePedidoInput[]
  // 'cliente'/'empleado' se omiten cuando el backend los infiere del usuario logueado.
  cliente?: string
  empleado?: string
}

export const pedidosApi = createResource<Pedido, PedidoCreatePayload>('/pedidos/')
export const detallesPedidoApi = createResource<DetallePedido>('/detalles-pedido/')

export async function cambiarEstadoPedido(id: string, estado: PedidoEstado): Promise<Pedido> {
  const { data } = await apiClient.patch<Pedido>(`/pedidos/${id}/cambiar-estado/`, { estado })
  return data
}

export interface Pago {
  id: string
  pedido: string
  monto: string
  metodo: 'efectivo' | 'tarjeta' | 'transferencia' | 'app'
  estado: 'pendiente' | 'completado' | 'rechazado' | 'reembolsado'
  fecha_pago: string | null
  created_at: string
}

export interface Factura {
  id: string
  pago: string
  numero_factura: string
  subtotal: string
  impuesto: string
  total: string
  fecha_emision: string
}

export const pagosApi = createResource<Pago>('/pagos/')
export const facturasApi = createResource<Factura>('/facturas/')
