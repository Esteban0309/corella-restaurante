import { useEffect, useState } from 'react'
import { getCategorias, getProductos, type Categoria, type Producto } from '../../api/catalogo'
import { urlImagen } from '../../utils/media'

const ICONOS_POR_DEFECTO = ['🥗', '🍽️', '🍕', '🍰', '🍷', '⭐', '🍔', '🍜']

export function ClienteMenuPanel() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [productos, setProductos] = useState<Producto[]>([])
  const [activa, setActiva] = useState<string | null>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    getCategorias().then(setCategorias).catch(() => {})
  }, [])

  useEffect(() => {
    setCargando(true)
    getProductos(activa ?? undefined)
      .then(setProductos)
      .finally(() => setCargando(false))
  }, [activa])

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
            <div className="producto-card" key={p.id}>
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
                {p.variantes.length > 0 && (
                  <ul className="producto-variantes">
                    {p.variantes.map((v) => (
                      <li key={v.id}>{v.nombre}: +${v.precio_extra}</li>
                    ))}
                  </ul>
                )}
                <div className="producto-footer">
                  <span className="producto-precio">${p.precio_base}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
