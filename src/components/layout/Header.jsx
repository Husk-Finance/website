import './Header.scss'
import logoGradient from '../../assets/logo-gradient.svg'
import { NAV_LINKS, BUTTON_LABELS } from '../../constants'

export default function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-section">
          <img src={logoGradient} alt="Husk Finance" className="logo" />
          <span className="logo-text">Husk Finance</span>
        </div>

        <nav className="nav-links">
          {NAV_LINKS.map((link) => (
            <a key={link.label} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <button className="connect-button">{BUTTON_LABELS.connect}</button>
      </div>
    </header>
  )
}
