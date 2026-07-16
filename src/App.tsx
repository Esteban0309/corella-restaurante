import { useState } from 'react'
import './App.css'

const categories = [
  { id: 'entradas', name: 'Entradas', icon: '🥗', description: 'Para comenzar con buen gusto' },
  { id: 'platos-fuertes', name: 'Platos Fuertes', icon: '🍽️', description: 'Nuestros platos principales' },
  { id: 'pizzas', name: 'Pizzas', icon: '🍕', description: 'Horneadas con amor' },
  { id: 'postres', name: 'Postres', icon: '🍰', description: 'Dulces tentaciones' },
  { id: 'bebidas', name: 'Bebidas', icon: '🍷', description: 'Bebidas y cocteles' },
  { id: 'especialidades', name: 'Especialidades', icon: '⭐', description: 'Platos de la casa' },
]

function App() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  return (
    <div className="restaurant">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">🍴</span>
            <h1 className="logo-text">La Estación del Sabor</h1>
          </div>
          <nav className="nav">
            <a href="#menu" className="nav-link">Menú</a>
            <a href="#reservar" className="nav-link">Reservar</a>
            <a href="#contacto" className="nav-link">Contacto</a>
          </nav>
          <button className="login-btn" type="button">
            <svg className="login-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Iniciar Sesión
          </button>
        </div>
      </header>

      <section className="hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="hero-tagline">Sabor y tradición desde 1985</p>
          <h2 className="hero-title">Bienvenido a La Estación del Sabor</h2>
          <p className="hero-subtitle">
            Descubre los sabores únicos de nuestra cocina, preparados con ingredientes frescos y mucho cariño.
          </p>
          <div className="hero-actions">
            <a href="#menu" className="btn btn-primary">Ver Menú</a>
            <a href="#reservar" className="btn btn-secondary">Reservar Mesa</a>
          </div>
        </div>
      </section>

      <section className="categories" id="menu">
        <div className="section-header">
          <h2 className="section-title">Nuestras Categorías</h2>
          <p className="section-subtitle">Explora lo que tenemos para ti</p>
        </div>
        <div className="categories-grid">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`category-card ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
            >
              <span className="category-icon">{cat.icon}</span>
              <h3 className="category-name">{cat.name}</h3>
              <p className="category-desc">{cat.description}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="specialty">
        <div className="specialty-content">
          <span className="specialty-tag">Plato del día</span>
          <h2 className="specialty-title">Paella Valenciana</h2>
          <p className="specialty-desc">
            Arroz con mariscos frescos, azafrán y verduras de temporada. Una receta tradicional que te transportará a Valencia.
          </p>
          <div className="specialty-price">
            <span className="price">$285</span>
            <span className="price-label">MXN</span>
          </div>
          <button className="btn btn-primary" type="button">Ordenar Ahora</button>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="logo-icon">🍴</span>
            <span className="logo-text">La Estación del Sabor</span>
          </div>
          <p className="footer-text">© 2026 Restaurante La Estación del Sabor. Todos los derechos reservados.</p>
          <div className="footer-links">
            <a href="#politica">Política de Privacidad</a>
            <a href="#terminos">Términos</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
