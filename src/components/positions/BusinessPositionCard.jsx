import PropTypes from 'prop-types'
import './BusinessPositionCard.scss'
import { GRID_LABELS } from '../../constants'
import { formatCompactNumber, formatPercent } from '../../utils/positionUtils'

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
            {position.tags && position.tags.length > 0 && (
              <div className="business-tags">
                {position.tags.map((tag) => (
                  <span
                    key={tag.label}
                    className="business-tag"
                    style={{ backgroundColor: tag.bg, color: tag.color }}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="apy-info">
            <div className="apy-label">{GRID_LABELS.huskAPY}</div>
            <div className="apy-value">{formatPercent(position.huskAPY)}</div>
          </div>
        </div>

        <div className="business-grid">
          <div className="grid-item">
            <div className="grid-label">TVL / MCap</div>
            <div className="grid-value">
              $
              {formatCompactNumber(position.tvl)}
              {' '}
              / $
              {formatCompactNumber(position.mcap)}
            </div>
          </div>
          <div className="grid-item">
            <div className="grid-label">30d rev.</div>
            <div className="grid-value">
              $
              {formatCompactNumber(position.revenue30d)}
            </div>
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
            <div className="grid-value">{formatPercent(position.supplyAPY)}</div>
          </div>
          <div className="grid-item">
            <div className="grid-label">{GRID_LABELS.participationRisk}</div>
            <div className="grid-value">{position.participationRisk}</div>
          </div>
          <div className="button-item">
            <button type="button" className="action-button" onClick={onSupplyClick}>
              Supply USDC
            </button>
          </div>
          <div className="button-item">
            <button type="button" className="action-button borrow-button" onClick={onBorrowClick}>
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
    tags: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      bg: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    })),
    createdAt: PropTypes.number,
    huskAPY: PropTypes.string.isRequired, // Integer string (e.g., "4325" for 43.25%)
    tvl: PropTypes.string.isRequired, // Integer string (e.g., "10620" for $10.62k)
    mcap: PropTypes.string.isRequired, // Integer string (e.g., "10000000" for $10M)
    revenue30d: PropTypes.string.isRequired, // Integer string (e.g., "850" for $850)
    liqdLowPrice: PropTypes.string.isRequired, // Integer string (e.g., "5000" for $5k)
    distribution: PropTypes.string.isRequired,
    nextDistribution: PropTypes.string.isRequired,
    supplyAPY: PropTypes.string.isRequired, // Integer string (e.g., "2500" for 25%)
    participationRisk: PropTypes.string.isRequired,
    liquidityProviderAsset: PropTypes.string.isRequired, // ERC20 token address (RWA Business Token)
    liquiditySupplierAsset: PropTypes.string.isRequired, // ERC20 token address (typically USDC)
  }).isRequired,
  onSupplyClick: PropTypes.func.isRequired,
  onBorrowClick: PropTypes.func.isRequired,
}
