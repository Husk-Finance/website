import PropTypes from 'prop-types'
import './DeFiPositionCard.scss'
import { GRID_LABELS, BUTTON_LABELS } from '../../constants'

export default function DeFiPositionCard({ position }) {
  return (
    <div className="defi-position-card">
      <div className="card-header">
        <div className="protocol-info">
          <div className="protocol-name">{position.protocol}</div>
          
          {position.tags && position.tags.length > 0 && (
            <div className="tag-row">
              {position.tags.map((t, idx) => (
                <span
                  key={idx}
                  className="tag-pill"
                  style={{ background: t.bg, color: t.color }}
                >
                  {t.label}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="rate-info">
          <div className="rate-label">{GRID_LABELS.huskAPY}</div>
          <div className="rate-value">{position.huskAPY}</div>
        </div>
      </div>

      <div className="card-grid">
        <div className="grid-item">
          <div className="grid-label">{GRID_LABELS.tvl}</div>
          <div className="grid-value">{position.tvl}</div>
        </div>

        <div className="grid-item">
          <div className="grid-label">{GRID_LABELS.revenue24h}</div>
          <div className="grid-value">{position.revenue24h}</div>
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
          <div className="grid-label">{GRID_LABELS.borrowRisk}</div>
          <div className="grid-value">{position.borrowRisk}</div>
        </div>

        <div className="button-item">
          <button className="action-button">{BUTTON_LABELS.supply}</button>
        </div>

        <div className="button-item">
          <button className="action-button borrow-button">{BUTTON_LABELS.borrow}</button>
        </div>
      </div>
    </div>
  )
}

DeFiPositionCard.propTypes = {
  position: PropTypes.shape({
    id: PropTypes.number.isRequired,
    protocol: PropTypes.string.isRequired,
    tags: PropTypes.array,
    huskAPY: PropTypes.string,
    supplyAPY: PropTypes.string.isRequired,
    tvl: PropTypes.string.isRequired,
    revenue24h: PropTypes.string.isRequired,
    distribution: PropTypes.string,
    nextDistribution: PropTypes.string,
    liquidationLow: PropTypes.string,
    borrowRisk: PropTypes.string,
  }).isRequired,
}
