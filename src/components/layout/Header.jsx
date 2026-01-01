import '@rainbow-me/rainbowkit/styles.css'
import './Header.scss'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { NavLink } from 'react-router-dom'

import logoGradient from '../../assets/logo-gradient.svg'
import { NAV_LINKS } from '../../constants'

export default function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-section">
          <img
            src={logoGradient}
            alt="Husk Finance"
            className="logo"
          />
          <span className="logo-text">Husk Finance</span>
        </div>


        <nav className="nav-links">
          {NAV_LINKS.map((link) => (
            link.href.startsWith('http') ? (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">
                {link.label}
              </a>
            ) : (
              <NavLink key={link.label} to={link.href}>
                {link.label}
              </NavLink>
            )
          ))}
        </nav>

        <nav className="connect-button">
          <ConnectButton />
        </nav>
      </div>
    </header>
  )
}
