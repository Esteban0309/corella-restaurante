import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import '../App.css'
import './MenuPage.css'
import { useAuth } from '../context/AuthContext'
import { SiteHeader } from '../components/SiteHeader'
import { SiteFooter } from '../components/SiteFooter'
import { LoginModal } from '../components/LoginModal'
import { getCategorias, getProductos, type Categoria, type Producto } from '../api/catalogo'
import { rutaPorRol } from '../router/ProtectedRoute'
import { urlImagen } from '../utils/media'

const ICONOS_POR_DEFECTO = ['🥗', '🍽️', '🍕', '🍰', '🍷', '⭐', '🍔', '🍜']

function ProductoImagen({ producto, index }: { producto: Producto; index: number }) {
  const src = urlImagen(producto)
  if (src) {
    return <img className="producto-imagen" src={src} alt={producto.nombre} />
  }
  return (
    <div className="producto-imagen producto-imagen-placeholder">
      <span>{ICONOS_POR_DEFECTO[index % ICONOS_POR_DEFECTO.length]}</span>
    </div>
  )
}

function MenuPage() {
  const { usuario, isAuthenticated } = useAuth()
  const [mostrarLogin, setMostrarLogin] = useState(false)
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [productos, setProductos] = useState<Producto[]>([])
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [busqueda, setBusqueda] = useState('')
  const [cargandoMenu, setCargandoMenu] = useState(true)
  const [errorMenu, setErrorMenu] = useState<string | null>(null)

  useEffect(() => {
    getCategorias()
      .then(setCategorias)
      .catch(() => setErrorMenu('No se pudo cargar el menú. Verifica que el backend esté corriendo.'))
  }, [])

  useEffect(() => {
    setCargandoMenu(true)
    getProductos(activeCategory ?? undefined)
      .then(setProductos)
      .catch(() => setErrorMenu('No se pudieron cargar los productos.'))
      .finally(() => setCargandoMenu(false))
  }, [activeCategory])

  const productosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase()
    if (!texto) return productos
    return productos.filter((p) => p.nombre.toLowerCase().includes(texto))
  }, [productos, busqueda])

  return (
    <div className="restaurant">
      <SiteHeader />

      {mostrarLogin && <LoginModal onClose={() => setMostrarLogin(false)} />}

      <section className="menu-page">
        <div className="section-header">
          <p className="section-eyebrow">Nuestro menú</p>
          <h1 className="section-title">Elige tu categoría favorita</h1>
          <p className="section-subtitle">Explora los platos que preparamos cada día</p>
        </div>

        {errorMenu && <p className="menu-notice menu-error">{errorMenu}</p>}

        <div className="menu-search">
          <input
            type="search"
            className="menu-search-input"
            placeholder="Buscar en el menú..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="category-chip-row">
          <button
            type="button"
            className={`category-chip ${activeCategory === null ? 'active' : ''}`}
            onClick={() => setActiveCategory(null)}
          >
            🍽️ Todo el menú
          </button>
          {categorias.map((cat, index) => (
            <button
              key={cat.id}
              type="button"
              className={`category-chip ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
            >
              {ICONOS_POR_DEFECTO[index % ICONOS_POR_DEFECTO.length]} {cat.nombre}
            </button>
          ))}
        </div>

        {cargandoMenu ? (
          <p className="menu-notice">Cargando menú...</p>
        ) : (
          <div className="productos-grid">
            {productosFiltrados.map((prod, index) => (
              <div className="producto-card" key={prod.id}>
                <ProductoImagen producto={prod} index={index} />
                <div className="producto-card-body">
                  <h4 className="producto-nombre">{prod.nombre}</h4>
                  <p className="producto-desc">{prod.descripcion || 'Delicioso platillo de nuestra cocina.'}</p>
                  <div className="producto-footer">
                    <span className="producto-precio">${prod.precio_base}</span>
                    {!isAuthenticated ? (
                      <button type="button" className="btn-order" onClick={() => setMostrarLogin(true)}>
                        Pedir
                      </button>
                    ) : (
                      <Link className="btn-order" to={usuario ? rutaPorRol(usuario.rol) : '/'}>
                        Pedir
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {productosFiltrados.length === 0 && (
              <p className="menu-notice">No hay productos que coincidan con tu búsqueda.</p>
            )}
          </div>
        )}
      </section>

      <SiteFooter />
    </div>
  )
}

export default MenuPage
