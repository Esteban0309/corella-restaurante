import { Logo } from './Logo'

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <Logo size={40} />
        </div>
        <p className="footer-text">© 2026 La Estación del Sabor. Todos los derechos reservados.</p>
        <div className="footer-links">
          <a href="#politica">Política de Privacidad</a>
          <a href="#terminos">Términos</a>
        </div>
      </div>
    </footer>
  )
}
