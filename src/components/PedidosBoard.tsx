import { useEffect, useState } from 'react'
import {
  pedidosApi,
  cambiarEstadoPedido,
  type Pedido,
  type PedidoEstado,
  type PedidoTipo,
  type DetallePedidoInput,
} from '../api/pedidos'
import type { Producto } from '../api/catalogo'
import type { Mesa } from '../api/mesas'
import type { Cliente } from '../api/personal'
import { Icon, type IconName } from './Icon'
import '../styles/modal.css'
import './ResourceCrud.css'
import './PedidosBoard.css'

const ESTADOS: { value: PedidoEstado; label: string }[] = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'preparando', label: 'Preparando' },
  { value: 'listo', label: 'Listo' },
  { value: 'entregado', label: 'Entregado' },
  { value: 'cancelado', label: 'Cancelado' },
]

const TIPOS: { value: PedidoTipo; label: string; icon: IconName }[] = [
  { value: 'mesa', label: 'En mesa', icon: 'table' },
  { value: 'llevar', label: 'Para llevar', icon: 'package' },
  { value: 'delivery', label: 'Delivery', icon: 'truck' },
]

interface LineaForm {
  producto: string
  variante: string
  cantidad: number
  notas: string
}

const lineaVacia: LineaForm = { producto: '', variante: '', cantidad: 1, notas: '' }

interface PedidosBoardProps {
  productos: Producto[]
  mesas?: Mesa[]
  clientes?: Cliente[]
  modoStaff: boolean
  // Si se pasa, se usa como cliente fijo del pedido (dashboard de cliente logueado)
  clienteFijo?: string
}

export function PedidosBoard({ productos, mesas = [], clientes = [], modoStaff, clienteFijo }: PedidosBoardProps) {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)

  const [tipo, setTipo] = useState<PedidoTipo>('mesa')
  const [mesaId, setMesaId] = useState('')
  const [clienteId, setClienteId] = useState('')
  const [notas, setNotas] = useState('')
  const [lineas, setLineas] = useState<LineaForm[]>([{ ...lineaVacia }])
  const [enviando, setEnviando] = useState(false)

  const cargar = () => {
    setCargando(true)
    setError(null)
    pedidosApi
      .list({ ordering: '-created_at' })
      .then(setPedidos)
      .catch(() => setError('No se pudieron cargar los pedidos.'))
      .finally(() => setCargando(false))
  }

  useEffect(cargar, [])

  const totalEstimado = lineas.reduce((acc, l) => {
    const producto = productos.find((p) => p.id === l.producto)
    if (!producto) return acc
    const variante = producto.variantes.find((v) => v.id === l.variante)
    const precio = Number(producto.precio_base) + Number(variante?.precio_extra ?? 0)
    return acc + precio * l.cantidad
  }, 0)

  const actualizarLinea = (index: number, cambios: Partial<LineaForm>) => {
    setLineas((prev) => prev.map((l, i) => (i === index ? { ...l, ...cambios } : l)))
  }

  const agregarLinea = () => setLineas((prev) => [...prev, { ...lineaVacia }])
  const quitarLinea = (index: number) => setLineas((prev) => prev.filter((_, i) => i !== index))

  const resetForm = () => {
    setTipo('mesa')
    setMesaId('')
    setClienteId('')
    setNotas('')
    setLineas([{ ...lineaVacia }])
  }

  const handleSubmit = async () => {
    setError(null)
    const detalles: DetallePedidoInput[] = lineas
      .filter((l) => l.producto)
      .map((l) => {
        const producto = productos.find((p) => p.id === l.producto)!
        return {
          producto: l.producto,
          variante: l.variante || null,
          cantidad: l.cantidad,
          precio_unitario: producto.precio_base,
          notas: l.notas,
        }
      })

    if (detalles.length === 0) {
      setError('Agrega al menos un producto al pedido.')
      return
    }
    if (tipo === 'mesa' && !mesaId) {
      setError('Selecciona una mesa para un pedido en mesa.')
      return
    }

    setEnviando(true)
    try {
      await pedidosApi.create({
        tipo,
        mesa: tipo === 'mesa' ? mesaId : null,
        cliente: clienteFijo || clienteId || undefined,
        notas,
        detalles,
      })
      resetForm()
      setMostrarForm(false)
      cargar()
    } catch {
      setError('No se pudo crear el pedido. Revisa los datos.')
    } finally {
      setEnviando(false)
    }
  }

  const handleCambiarEstado = async (pedido: Pedido, estado: PedidoEstado) => {
    try {
      await cambiarEstadoPedido(pedido.id, estado)
      cargar()
    } catch {
      setError('No se pudo cambiar el estado del pedido.')
    }
  }

  const handleEliminar = async (pedido: Pedido) => {
    if (!confirm('¿Eliminar este pedido?')) return
    try {
      await pedidosApi.remove(pedido.id)
      cargar()
    } catch {
      setError('No se pudo eliminar el pedido.')
    }
  }

  const productoSeleccionado = (id: string) => productos.find((p) => p.id === id)

  return (
    <div className="pedidos-board">
      <div className="resource-header">
        <h3>Pedidos</h3>
        <button type="button" className="btn btn-primary" onClick={() => setMostrarForm(true)}>
          + Nuevo pedido
        </button>
      </div>

      {error && <p className="resource-error">{error}</p>}

      {cargando ? (
        <p>Cargando pedidos...</p>
      ) : pedidos.length === 0 ? (
        <p>No hay pedidos todavía.</p>
      ) : (
        pedidos.map((pedido) => (
          <div className="pedido-card" key={pedido.id}>
            <div className="pedido-card-header">
              <div>
                <strong>Pedido #{pedido.id.slice(0, 8)}</strong>{' '}
                <span className={`badge badge-estado-${pedido.estado}`}>
                  {ESTADOS.find((e) => e.value === pedido.estado)?.label}
                </span>
              </div>
              <span className="pedido-total">${pedido.total}</span>
            </div>
            <p className="pedido-meta">
              <span className="pedido-tipo-icon">
                <Icon name={TIPOS.find((t) => t.value === pedido.tipo)?.icon ?? 'table'} size={14} />
              </span>
              {TIPOS.find((t) => t.value === pedido.tipo)?.label}
              {pedido.mesa_numero ? ` · Mesa ${pedido.mesa_numero}` : ''}
              {' · '}
              {new Date(pedido.created_at).toLocaleString()}
            </p>
            <ul className="pedido-detalle-list">
              {pedido.detalles.map((d) => (
                <li key={d.id}>
                  {d.cantidad}x {d.producto_nombre} — ${d.subtotal}
                  {d.notas ? ` (${d.notas})` : ''}
                </li>
              ))}
            </ul>
            {pedido.notas && <p className="pedido-meta">Notas: {pedido.notas}</p>}

            {modoStaff && (
              <div className="pedido-actions">
                {ESTADOS.map((e) => (
                  <button
                    key={e.value}
                    type="button"
                    className="btn btn-secondary"
                    disabled={pedido.estado === e.value}
                    onClick={() => void handleCambiarEstado(pedido, e.value)}
                  >
                    {e.label}
                  </button>
                ))}
                <button type="button" className="btn-link btn-link-danger" onClick={() => void handleEliminar(pedido)}>
                  Eliminar
                </button>
              </div>
            )}
          </div>
        ))
      )}

      {mostrarForm && (
        <div className="modal-overlay" onClick={() => setMostrarForm(false)}>
          <div className="modal-content modal-wide" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" type="button" onClick={() => setMostrarForm(false)} aria-label="Cerrar">
              ×
            </button>
            <h3 className="modal-title">Nuevo pedido</h3>

            <label className="modal-label">Tipo</label>
            <select className="modal-input" value={tipo} onChange={(e) => setTipo(e.target.value as PedidoTipo)}>
              {TIPOS.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>

            {tipo === 'mesa' && (
              <>
                <label className="modal-label">Mesa</label>
                <select className="modal-input" value={mesaId} onChange={(e) => setMesaId(e.target.value)}>
                  <option value="">-- Selecciona --</option>
                  {mesas.map((m) => (
                    <option key={m.id} value={m.id}>Mesa {m.numero} ({m.zona_nombre})</option>
                  ))}
                </select>
              </>
            )}

            {modoStaff && !clienteFijo && (
              <>
                <label className="modal-label">Cliente (opcional)</label>
                <select className="modal-input" value={clienteId} onChange={(e) => setClienteId(e.target.value)}>
                  <option value="">-- Sin cliente registrado --</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {(`${c.user.first_name} ${c.user.last_name}`.trim()) || c.user.username}
                    </option>
                  ))}
                </select>
              </>
            )}

            <label className="modal-label">Productos</label>
            {lineas.map((linea, index) => {
              const producto = productoSeleccionado(linea.producto)
              return (
                <div className="detalle-linea" key={index}>
                  <select
                    className="modal-input"
                    value={linea.producto}
                    onChange={(e) => actualizarLinea(index, { producto: e.target.value, variante: '' })}
                  >
                    <option value="">-- Producto --</option>
                    {productos.map((p) => (
                      <option key={p.id} value={p.id}>{p.nombre} (${p.precio_base})</option>
                    ))}
                  </select>
                  <select
                    className="modal-input"
                    value={linea.variante}
                    disabled={!producto || producto.variantes.length === 0}
                    onChange={(e) => actualizarLinea(index, { variante: e.target.value })}
                  >
                    <option value="">Sin variante</option>
                    {producto?.variantes.map((v) => (
                      <option key={v.id} value={v.id}>{v.nombre} (+${v.precio_extra})</option>
                    ))}
                  </select>
                  <input
                    className="modal-input"
                    type="number"
                    min={1}
                    value={linea.cantidad}
                    onChange={(e) => actualizarLinea(index, { cantidad: Number(e.target.value) })}
                  />
                  <button type="button" className="btn-link btn-link-danger" onClick={() => quitarLinea(index)}>
                    Quitar
                  </button>
                </div>
              )
            })}
            <button type="button" className="btn btn-secondary" onClick={agregarLinea}>
              + Agregar producto
            </button>

            <label className="modal-label">Notas</label>
            <textarea className="modal-input" value={notas} onChange={(e) => setNotas(e.target.value)} />

            <p className="pedido-total" style={{ marginTop: 12 }}>Total estimado: ${totalEstimado.toFixed(2)}</p>

            <button type="button" className="btn btn-primary modal-submit" disabled={enviando} onClick={() => void handleSubmit()}>
              {enviando ? 'Enviando...' : 'Enviar pedido'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
