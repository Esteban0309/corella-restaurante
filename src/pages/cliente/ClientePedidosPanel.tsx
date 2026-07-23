import { useEffect, useState } from 'react'
import { pedidosApi, type Pedido, type PedidoTipo } from '../../api/pedidos'
import { mesasApi, type Mesa } from '../../api/mesas'
import { useCart } from '../../context/CartContext'
import { Icon } from '../../components/Icon'
import { urlImagen } from '../../utils/media'

const TIPOS: { value: PedidoTipo; label: string }[] = [
  { value: 'mesa', label: 'En mesa' },
  { value: 'llevar', label: 'Para llevar' },
  { value: 'delivery', label: 'Delivery' },
]

const ESTADO_LABELS: Record<string, string> = {
  pendiente: 'Pendiente',
  preparando: 'Preparando',
  listo: 'Listo',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
}

export function ClientePedidosPanel() {
  const { items, setCantidad, removeItem, clear, total } = useCart()
  const [mesas, setMesas] = useState<Mesa[]>([])
  const [tipo, setTipo] = useState<PedidoTipo>('mesa')
  const [mesaId, setMesaId] = useState('')
  const [notas, setNotas] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pedidoEnviado, setPedidoEnviado] = useState<Pedido | null>(null)

  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    mesasApi.list().then(setMesas).catch(() => {})
  }, [])

  const cargarPedidos = () => {
    setCargando(true)
    pedidosApi
      .list({ ordering: '-created_at' })
      .then(setPedidos)
      .catch(() => setError('No se pudieron cargar tus pedidos.'))
      .finally(() => setCargando(false))
  }

  useEffect(cargarPedidos, [])

  const handleEnviar = async () => {
    if (items.length === 0) return
    setError(null)
    if (tipo === 'mesa' && !mesaId) {
      setError('Selecciona una mesa para un pedido en mesa.')
      return
    }
    setEnviando(true)
    try {
      const detalles = items.map((it) => ({
        producto: it.producto.id,
        variante: it.variante?.id ?? null,
        cantidad: it.cantidad,
        precio_unitario: it.producto.precio_base,
      }))
      const pedido = await pedidosApi.create({ tipo, mesa: tipo === 'mesa' ? mesaId : null, notas, detalles })
      clear()
      setMesaId('')
      setNotas('')
      setTipo('mesa')
      setPedidoEnviado(pedido)
      cargarPedidos()
    } catch {
      setError('No se pudo enviar el pedido. Revisa los datos.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div>
      <h2>Mis pedidos</h2>
      <p className="panel-hint">
        Arma tu pedido desde el Menú; aquí puedes ajustar cantidades, elegir mesa y enviarlo.
      </p>

      {error && <p className="resource-error">{error}</p>}

      {pedidoEnviado && (
        <div className="pedido-confirmacion">
          <Icon name="check" size={20} />
          <div>
            <strong>¡Pedido enviado! Total: ${pedidoEnviado.total}</strong>
            <p>Un mesero confirmará tu pedido en cocina. Cuando esté listo, podrás pagar en mesa.</p>
          </div>
          <button type="button" className="btn-icon" onClick={() => setPedidoEnviado(null)} aria-label="Cerrar">
            <Icon name="x" size={16} />
          </button>
        </div>
      )}

      {items.length > 0 ? (
        <div className="cart-builder">
          <h3>Tu pedido</h3>
          {items.map((it) => {
            const precio = Number(it.producto.precio_base) + Number(it.variante?.precio_extra ?? 0)
            return (
              <div className="cart-item-row" key={it.id}>
                {urlImagen(it.producto) ? (
                  <img className="cart-item-imagen" src={urlImagen(it.producto) as string} alt={it.producto.nombre} />
                ) : (
                  <div className="cart-item-imagen producto-imagen-placeholder">🍽️</div>
                )}
                <div className="cart-item-info">
                  <strong>{it.producto.nombre}</strong>
                  {it.variante && <span className="cart-item-variante">{it.variante.nombre}</span>}
                  <span className="cart-item-precio">${(precio * it.cantidad).toFixed(2)}</span>
                </div>
                <div className="qty-stepper">
                  <button type="button" onClick={() => setCantidad(it.id, it.cantidad - 1)} aria-label="Restar">
                    <Icon name="x" size={14} />
                  </button>
                  <span>{it.cantidad}</span>
                  <button type="button" onClick={() => setCantidad(it.id, it.cantidad + 1)} aria-label="Sumar">
                    <Icon name="plus-circle" size={14} />
                  </button>
                </div>
                <button type="button" className="btn-icon btn-icon-danger" onClick={() => removeItem(it.id)} aria-label="Quitar">
                  <Icon name="trash" size={16} />
                </button>
              </div>
            )
          })}

          <div className="cart-builder-fields">
            <div className="form-field">
              <label className="modal-label" htmlFor="tipo-pedido">Tipo</label>
              <select id="tipo-pedido" className="modal-input" value={tipo} onChange={(e) => setTipo(e.target.value as PedidoTipo)}>
                {TIPOS.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            {tipo === 'mesa' && (
              <div className="form-field">
                <label className="modal-label" htmlFor="mesa-pedido">Mesa</label>
                <select id="mesa-pedido" className="modal-input" value={mesaId} onChange={(e) => setMesaId(e.target.value)}>
                  <option value="">-- Selecciona --</option>
                  {mesas.map((m) => (
                    <option key={m.id} value={m.id}>Mesa {m.numero} ({m.zona_nombre})</option>
                  ))}
                </select>
              </div>
            )}
            <div className="form-field">
              <label className="modal-label" htmlFor="notas-pedido">Notas (opcional)</label>
              <textarea id="notas-pedido" className="modal-input" value={notas} onChange={(e) => setNotas(e.target.value)} />
            </div>
          </div>

          <div className="cart-total-row">
            <span className="cart-total-label">Total: ${total.toFixed(2)}</span>
            <button type="button" className="btn btn-primary" disabled={enviando} onClick={() => void handleEnviar()}>
              {enviando ? 'Enviando...' : 'Enviar pedido'}
            </button>
          </div>
        </div>
      ) : (
        !pedidoEnviado && <p className="menu-notice">Tu carrito está vacío. Ve al Menú y elige algo para pedir.</p>
      )}

      <hr className="panel-divider" />

      <h3>Historial de pedidos</h3>
      {cargando ? (
        <p>Cargando...</p>
      ) : (
        <div className="resource-grid">
          {pedidos.map((pedido) => (
            <div className="resource-card" key={pedido.id}>
              <div className="resource-card-body">
                <div className="resource-card-row">
                  <span className="resource-card-label">Pedido</span>
                  <span className="resource-card-value">#{pedido.id.slice(0, 8)}</span>
                </div>
                <div className="resource-card-row">
                  <span className="resource-card-label">Estado</span>
                  <span className="resource-card-value">
                    <span className={`badge badge-estado-${pedido.estado}`}>{ESTADO_LABELS[pedido.estado]}</span>
                  </span>
                </div>
                <div className="resource-card-row">
                  <span className="resource-card-label">Total</span>
                  <span className="resource-card-value">${pedido.total}</span>
                </div>
                <div className="resource-card-row">
                  <span className="resource-card-label">Fecha</span>
                  <span className="resource-card-value">{new Date(pedido.created_at).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
          {pedidos.length === 0 && <p className="resource-empty">Todavía no tienes pedidos.</p>}
        </div>
      )}
    </div>
  )
}
