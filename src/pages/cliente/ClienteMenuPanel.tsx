import { useEffect, useState } from 'react'
import { getCategorias, getProductos, type Categoria, type Producto } from '../../api/catalogo'
import { urlImagen } from '../../utils/media'
import { useCart } from '../../context/CartContext'
import { Icon } from '../../components/Icon'

const ICONOS_POR_DEFECTO = ['🥗', '🍽️', '🍕', '🍰', '🍷', '⭐', '🍔', '🍜']

interface ClienteMenuPanelProps {
  onIrAPedidos: () => void
}

export function ClienteMenuPanel({ onIrAPedidos }: ClienteMenuPanelProps) {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [productos, setProductos] = useState<Producto[]>([])
  const [activa, setActiva] = useState<string | null>(null)
  const [cargando, setCargando] = useState(true)
  const [detalle, setDetalle] = useState<Producto | null>(null)
  const [varianteId, setVarianteId] = useState('')
  const [cantidad, setCantidad] = useState(1)
  const [toast, setToast] = useState(false)

  const { addItem } = useCart()

  useEffect(() => {
    getCategorias().then(setCategorias).catch(() => {})
  }, [])

  useEffect(() => {
    setCargando(true)
    getProductos(activa ?? undefined)
      .then(setProductos)
      .finally(() => setCargando(false))
  }, [activa])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(false), 4000)
    return () => clearTimeout(t)
  }, [toast])

  const abrirDetalle = (p: Producto) => {
    setDetalle(p)
    setVarianteId('')
    setCantidad(1)
  }

  const cerrarDetalle = () => setDetalle(null)

  const agregarAlCarrito = () => {
    if (!detalle) return
    const variante = detalle.variantes.find((v) => v.id === varianteId) ?? null
    addItem(detalle, variante, cantidad)
    cerrarDetalle()
    setToast(true)
  }

  const precioDetalle = detalle
    ? Number(detalle.precio_base) + Number(detalle.variantes.find((v) => v.id === varianteId)?.precio_extra ?? 0)
    : 0

  return (
    <div>
      <h2>Menú</h2>
      <p className="panel-hint">Elige una categoría para ver los platillos disponibles.</p>
      <div className="categories-grid" style={{ marginBottom: 24 }}>
        {categorias.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`category-card ${activa === c.id ? 'active' : ''}`}
            onClick={() => setActiva(activa === c.id ? null : c.id)}
          >
            <h3 className="category-name">{c.nombre}</h3>
            <p className="category-desc">{c.descripcion || 'Sin descripción'}</p>
          </button>
        ))}
      </div>

      {cargando ? (
        <p>Cargando...</p>
      ) : (
        <div className="productos-grid">
          {productos.map((p, index) => (
            <button type="button" className="producto-card producto-card-clickable" key={p.id} onClick={() => abrirDetalle(p)}>
              {urlImagen(p) ? (
                <img className="producto-imagen" src={urlImagen(p) as string} alt={p.nombre} />
              ) : (
                <div className="producto-imagen producto-imagen-placeholder">
                  <span>{ICONOS_POR_DEFECTO[index % ICONOS_POR_DEFECTO.length]}</span>
                </div>
              )}
              <div className="producto-card-body">
                <h4 className="producto-nombre">{p.nombre}</h4>
                <p className="producto-desc">{p.descripcion}</p>
                <div className="producto-footer">
                  <span className="producto-precio">${p.precio_base}</span>
                  <span className="btn-order">Ver</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {detalle && (
        <div className="modal-overlay" onClick={cerrarDetalle}>
          <div className="modal-content producto-detalle-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" type="button" onClick={cerrarDetalle} aria-label="Cerrar">
              ×
            </button>
            {urlImagen(detalle) ? (
              <img className="producto-detalle-imagen" src={urlImagen(detalle) as string} alt={detalle.nombre} />
            ) : (
              <div className="producto-detalle-imagen producto-imagen-placeholder">
                <span>🍽️</span>
              </div>
            )}
            <h3 className="producto-detalle-nombre">{detalle.nombre}</h3>
            <p className="producto-detalle-desc">{detalle.descripcion || 'Delicioso platillo de nuestra cocina.'}</p>

            {detalle.variantes.length > 0 && (
              <div className="form-field">
                <label className="modal-label" htmlFor="variante">Variante</label>
                <select
                  id="variante"
                  className="modal-input"
                  value={varianteId}
                  onChange={(e) => setVarianteId(e.target.value)}
                >
                  <option value="">Estándar</option>
                  {detalle.variantes.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.nombre} (+${v.precio_extra})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="producto-detalle-footer">
              <div className="qty-stepper">
                <button type="button" onClick={() => setCantidad((c) => Math.max(1, c - 1))} aria-label="Restar">
                  <Icon name="x" size={14} />
                </button>
                <span>{cantidad}</span>
                <button type="button" onClick={() => setCantidad((c) => c + 1)} aria-label="Sumar">
                  <Icon name="plus-circle" size={14} />
                </button>
              </div>
              <span className="producto-detalle-precio">${(precioDetalle * cantidad).toFixed(2)}</span>
            </div>

            <button type="button" className="btn btn-primary modal-submit" onClick={agregarAlCarrito}>
              Pedir
            </button>
          </div>
        </div>
      )}

      {toast && (
        <button type="button" className="cart-toast" onClick={onIrAPedidos}>
          <Icon name="check" size={16} />
          Se agregó a pedidos — Ver pedidos
        </button>
      )}
    </div>
  )
}
