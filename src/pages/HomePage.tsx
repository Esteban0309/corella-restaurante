import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../App.css'
import { useAuth } from '../context/AuthContext'
import { SiteHeader } from '../components/SiteHeader'
import { SiteFooter } from '../components/SiteFooter'
import { LoginModal } from '../components/LoginModal'
import { getBanners, type Banner } from '../api/banners'
import { urlImagen } from '../utils/media'

const FEATURES = [
  { icon: '🌿', title: 'Ingredientes frescos', desc: 'Compramos cada día a proveedores locales para que cada plato salga con lo mejor de temporada.' },
  { icon: '⏱️', title: 'Servicio ágil', desc: 'Cocina organizada y personal atento para que tu pedido llegue a tiempo, ya sea en mesa o para llevar.' },
  { icon: '❤️', title: 'Hecho con cariño', desc: 'Recetas propias que cuidamos receta a receta, pensadas para compartir en familia o con amigos.' },
]

const PLACEHOLDER_BANNERS: Banner[] = [
  { id: 'ph-1', titulo: 'Menú del día', subtitulo: 'Platos recién preparados, todos los días.', tipo: 'promo', imagen: null, imagen_url: '', texto_boton: 'Ver menú', enlace: '/menu', orden: 1, activo: true },
  { id: 'ph-2', titulo: 'Reserva tu mesa', subtitulo: 'Aparta tu lugar para ti y los tuyos.', tipo: 'promo', imagen: null, imagen_url: '', texto_boton: 'Iniciar sesión', enlace: '#top', orden: 2, activo: true },
]

function HomePage() {
  const { usuario, isAuthenticated } = useAuth()
  const [mostrarLogin, setMostrarLogin] = useState(false)
  const [banners, setBanners] = useState<Banner[]>([])

  useEffect(() => {
    getBanners()
      .then(setBanners)
      .catch(() => setBanners([]))
  }, [])

  const heroBanner = banners.find((b) => b.tipo === 'hero' && urlImagen(b)) ?? null
  const promoBanners = banners.filter((b) => b.tipo !== 'hero')
  const bannersAMostrar = promoBanners.length > 0 ? promoBanners : PLACEHOLDER_BANNERS

  return (
    <div className="restaurant" id="top">
      <SiteHeader />

      {mostrarLogin && <LoginModal onClose={() => setMostrarLogin(false)} />}

      <section
        className={`hero ${heroBanner ? 'hero-has-image' : ''}`}
        style={heroBanner ? { backgroundImage: `url(${urlImagen(heroBanner)})` } : undefined}
      >
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="hero-tagline">Sabor y tradición</p>
          <h2 className="hero-title">{heroBanner?.titulo || 'Bienvenido a La Estación del Sabor'}</h2>
          <p className="hero-subtitle">
            {heroBanner?.subtitulo ||
              'Descubre los sabores únicos de nuestra cocina, preparados con ingredientes frescos y mucho cariño.'}
          </p>
          <div className="hero-actions">
            <Link to={heroBanner?.enlace || '/menu'} className="btn btn-primary">
              {heroBanner?.texto_boton || 'Ver Menú'}
            </Link>
            {!isAuthenticated && (
              <button type="button" className="btn btn-secondary" onClick={() => setMostrarLogin(true)}>
                Reservar / Pedir
              </button>
            )}
            {usuario?.rol === 'cliente' && (
              <Link className="btn btn-secondary" to="/cliente">Reservar Mesa / Pedir</Link>
            )}
          </div>
        </div>
      </section>

      <section className="banner-strip">
        <div className="banner-strip-grid">
          {bannersAMostrar.slice(0, 3).map((b) => (
            <a
              key={b.id}
              href={b.enlace || '/menu'}
              className={`banner-card banner-card-${b.tipo}`}
              style={urlImagen(b) ? { backgroundImage: `url(${urlImagen(b)})` } : undefined}
              onClick={(e) => {
                if (!isAuthenticated && b.enlace === '#top') {
                  e.preventDefault()
                  setMostrarLogin(true)
                }
              }}
            >
              <div className="banner-card-body">
                <h3>{b.titulo}</h3>
                {b.subtitulo && <p>{b.subtitulo}</p>}
                {b.texto_boton && <span className="banner-card-cta">{b.texto_boton} →</span>}
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="features">
        <div className="section-header">
          <p className="section-eyebrow">Por qué elegirnos</p>
          <h2 className="section-title">La experiencia La Estación</h2>
        </div>
        <div className="features-grid">
          {FEATURES.map((f) => (
            <div className="feature-card" key={f.title}>
              <span className="feature-icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="about" id="nosotros">
        <div className="about-content">
          <div className="about-text">
            <p className="section-eyebrow">Sobre nosotros</p>
            <h2 className="section-title">Nuestra historia</h2>
            <p>
              La Estación del Sabor nació de las ganas de compartir comida hecha con calma y buenos ingredientes.
              Empezamos con desayunos y terminamos preparando toda una carta pensada para cualquier momento del día.
            </p>
            <p>
              Hoy seguimos con la misma idea: cocina honesta, servicio cercano y un espacio donde te sientas como
              en casa.
            </p>
          </div>
          <div className="about-graphic">
            <span className="about-graphic-flame">🔥</span>
          </div>
        </div>
      </section>

      <section className="contact" id="contacto">
        <div className="section-header">
          <p className="section-eyebrow">Contacto</p>
          <h2 className="section-title">Visítanos o escríbenos</h2>
        </div>
        <div className="contact-grid">
          <div className="contact-card">
            <span className="contact-icon">📍</span>
            <h3>Dirección</h3>
            <p>Actualiza esta dirección desde el panel admin.</p>
          </div>
          <div className="contact-card">
            <span className="contact-icon">📞</span>
            <h3>Teléfono</h3>
            <p>+593 99 000 0000</p>
          </div>
          <div className="contact-card">
            <span className="contact-icon">✉️</span>
            <h3>Correo</h3>
            <p>contacto@laestaciondelsabor.com</p>
          </div>
          <div className="contact-card">
            <span className="contact-icon">🕗</span>
            <h3>Horario</h3>
            <p>Lunes a domingo, 12:00 – 22:00</p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}

export default HomePage
