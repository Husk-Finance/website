import PropTypes from 'prop-types'
import './BusinessPositionCard.scss'
import { GRID_LABELS } from '../../constants'

export default function BusinessPositionCard({ position, onSupplyClick, onBorrowClick }) {
  return (
    <div className="business-position-card">
      <div className="business-image-container">
        <img 
          src={position.businessImage} 
          alt={position.businessName}
          className="business-image"
          loading="lazy"
        />
        <div className="image-overlay" />
      </div>

      <div className="business-info">
        <div className="business-header">
          <div className="business-details">
            <div className="business-name">{position.businessName}</div>
            <div className="business-tags">
              <span className="network-tag">{position.network}</span>
              <span className="rwa-tag">RWA</span>
            </div>
          </div>
          <div className="apy-info">
            <div className="apy-label">{GRID_LABELS.huskAPY}</div>
            <div className="apy-value">{position.huskAPY}</div>
          </div>
        </div>

        <div className="business-grid">
          <div className="grid-item">
            <div className="grid-label">TVL / MCap</div>
            <div className="grid-value">{position.tvlMcap}</div>
          </div>
          <div className="grid-item">
            <div className="grid-label">30d rev.</div>
            <div className="grid-value">{position.revenue30d}</div>
          </div>
          <div className="grid-item">
            <div className="grid-label">Distribution</div>
            <div className="grid-value">{position.distribution}</div>
          </div>
          <div className="grid-item">
            <div className="grid-label">Next Distribution</div>
            <div className="grid-value">{position.nextDistribution}</div>
          </div>
          <div className="grid-item">
            <div className="grid-label">{GRID_LABELS.supplyAPY}</div>
            <div className="grid-value">{position.supplyAPY}</div>
          </div>
          <div className="grid-item">
            <div className="grid-label">{GRID_LABELS.participationRisk}</div>
            <div className="grid-value">{position.participationRisk}</div>
          </div>
          <div className="button-item">
            <button className="action-button" onClick={onSupplyClick}>
              Supply USDC
            </button>
          </div>
          <div className="button-item">
            <button className="action-button borrow-button" onClick={onBorrowClick}>
              Borrow USDC
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

BusinessPositionCard.propTypes = {
  position: PropTypes.shape({
    id: PropTypes.number.isRequired,
    chainId: PropTypes.number.isRequired,
    businessName: PropTypes.string.isRequired,
    businessImage: PropTypes.string.isRequired,
    network: PropTypes.string.isRequired,
    createdAt: PropTypes.number,
    huskAPY: PropTypes.string.isRequired,
    tvlMcap: PropTypes.string.isRequired,
    revenue30d: PropTypes.string.isRequired,
    distribution: PropTypes.string.isRequired,
    nextDistribution: PropTypes.string.isRequired,
    supplyAPY: PropTypes.string.isRequired,
    participationRisk: PropTypes.string.isRequired,
  }).isRequired,
  onSupplyClick: PropTypes.func.isRequired,
  onBorrowClick: PropTypes.func.isRequired,
}
