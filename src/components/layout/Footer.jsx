import { NAV_LINKS } from '../../constants'
import './Footer.scss'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const getLinkHref = (label) => NAV_LINKS.find((link) => link.label === label)?.href || '#'

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-section-title">COMMUNITY</h3>
          <ul className="footer-links">
            <li><a href="https://x.com/huskfinancex" target="_blank" rel="noopener noreferrer">𝕏 (Twitter)</a></li>
            <li><a href="https://discord.gg/aheQKSdD7m" target="_blank" rel="noopener noreferrer">Discord</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-section-title">ENVIRONMENT</h3>
          <ul className="footer-links">
            <li><a href={getLinkHref('Explore')}>Explore</a></li>
            <li><a href={getLinkHref('Create Husk')}>Create Husk</a></li>
            <li><a href="#analytics">Analytics</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-section-title">RESOURCES</h3>
          <ul className="footer-links">
            <li><a href={getLinkHref('Docs')} target="_blank" rel="noopener noreferrer">Docs</a></li>
            <li><a href="#blog">Blog</a></li>
            <li><a href="#whitepaper">Whitepaper</a></li>
            <li><a href="#media-kit">Media Kit</a></li>
            <li><a href="#terms">Terms of Use</a></li>
            <li><a href="#privacy">Privacy Policy</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copyright">
          Husk Finance ©
          {currentYear}
          {' '}
          All Rights Reserved
        </p>
      </div>
    </footer>
  )
}
