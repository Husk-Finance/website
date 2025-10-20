import PropTypes from 'prop-types'
import './DexPositionCard.scss'
import uniswapIcon from '../../assets/uniswap-icon.svg'
import { GRID_LABELS, BUTTON_LABELS } from '../../constants'

export default function DexPositionCard({ position }) {
  return (
    <div className="dex-position-card">
      <div className="card-background">
        <img 
          src={uniswapIcon} 
          alt="Uniswap" 
          className="uniswap-icon"
          loading="lazy"
        />
      </div>

      <div className="card-header">
        <div className="pair-info">
          <div className="pair-name">{position.pair}</div>
          <div className="pair-meta">{position.version} {position.fee}</div>
        </div>
        <div className="apy-info">
          <div className="apy-label">{GRID_LABELS.huskAPY}</div>
          <div className="apy-value">{position.huskAPY}</div>
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
          <div className="grid-label">{GRID_LABELS.liquidationLow}</div>
          <div className="grid-value">{position.liquidationLow}</div>
        </div>
        <div className="grid-item">
          <div className="grid-label">{GRID_LABELS.liquidationHigh}</div>
          <div className="grid-value">{position.liquidationHigh}</div>
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

DexPositionCard.propTypes = {
  position: PropTypes.shape({
    id: PropTypes.number.isRequired,
    pair: PropTypes.string.isRequired,
    version: PropTypes.string.isRequired,
    fee: PropTypes.string.isRequired,
    huskAPY: PropTypes.string.isRequired,
    tvl: PropTypes.string.isRequired,
    revenue24h: PropTypes.string.isRequired,
    supplyAPY: PropTypes.string.isRequired,
    liquidationLow: PropTypes.string.isRequired,
    liquidationHigh: PropTypes.string.isRequired,
    borrowRisk: PropTypes.string.isRequired,
  }).isRequired,
}
