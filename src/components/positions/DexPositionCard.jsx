import PropTypes from 'prop-types'
import './DexPositionCard.scss'
import uniswapIcon from '../../assets/uniswap-icon.svg'
import aerodromeIcon from '../../assets/aerodrome-icon.svg'
import { GRID_LABELS } from '../../constants'
import { getQuotedTokenSymbol, formatPercent, formatDollar, formatTokenAmount, getTokenDecimals } from '../../utils/positionUtils'

export default function DexPositionCard({ position, onSupplyClick, onBorrowClick }) {
  // Both buttons show the quote asset (what you're getting/depositing)
  const quotedToken = getQuotedTokenSymbol(position, 'supply')
  
  // Get decimals for the quote asset (liquiditySupplierAsset)
  const quoteDecimals = getTokenDecimals(position.liquiditySupplierAsset)
  
  return (
    <div className="dex-position-card">
      <div className="card-background">
        {position.protocol === 'uniswap' && (
          <img 
            src={uniswapIcon} 
            alt="Uniswap" 
            className="protocol-icon"
            loading="lazy"
          />
        )}
        {position.protocol === 'aerodrome' && (
          <img 
            src={aerodromeIcon} 
            alt="Aerodrome" 
            className="protocol-icon aerodrome-icon"
            loading="lazy"
          />
        )}
      </div>

      <div className="card-header">
        <div className="pair-info">
          <div className="pair-name">{position.pair}</div>
          <div className="pair-meta">
            {position.version} {formatPercent(position.fee)}{' '}
            <span className="protocol-name">
              {position.protocol.charAt(0).toUpperCase() + position.protocol.slice(1)}
            </span>
          </div>
        </div>
        <div className="apy-info">
          <div className="apy-label">{GRID_LABELS.huskAPY}</div>
          <div className="apy-value">{formatPercent(position.huskAPY)}</div>
        </div>
      </div>

      <div className="card-grid">
        <div className="grid-item">
          <div className="grid-label">{GRID_LABELS.tvl}</div>
          <div className="grid-value">{formatDollar(position.tvl)}</div>
        </div>
        <div className="grid-item">
          <div className="grid-label">{GRID_LABELS.revenue24h}</div>
          <div className="grid-value">{formatDollar(position.revenue24h)}</div>
        </div>
        <div className="grid-item">
          <div className="grid-label">{GRID_LABELS.liquidationLow}</div>
          <div className="grid-value">{formatTokenAmount(position.liquidationLow, quoteDecimals, quotedToken)}</div>
        </div>
        <div className="grid-item">
          <div className="grid-label">{GRID_LABELS.liquidationHigh}</div>
          <div className="grid-value">{formatTokenAmount(position.liquidationHigh, quoteDecimals, quotedToken)}</div>
        </div>
        <div className="grid-item">
          <div className="grid-label">{GRID_LABELS.supplyAPY}</div>
          <div className="grid-value">{formatPercent(position.supplyAPY)}</div>
        </div>
        <div className="grid-item">
          <div className="grid-label">{GRID_LABELS.borrowRisk}</div>
          <div className="grid-value">{formatPercent(position.borrowRisk)}</div>
        </div>
        <div className="button-item">
          <button className="action-button" onClick={onSupplyClick}>
            Supply {quotedToken}
          </button>
        </div>
        <div className="button-item">
          <button className="action-button borrow-button" onClick={onBorrowClick}>
            Borrow {quotedToken}
          </button>
        </div>
      </div>
    </div>
  )
}

DexPositionCard.propTypes = {
  position: PropTypes.shape({
    id: PropTypes.number.isRequired,
    protocol: PropTypes.string.isRequired, // Protocol identifier (e.g., 'uniswap', 'aerodrome')
    pair: PropTypes.string.isRequired,
    version: PropTypes.string.isRequired,
    fee: PropTypes.string.isRequired,
    createdAt: PropTypes.number,
    huskAPY: PropTypes.string.isRequired,
    tvl: PropTypes.string.isRequired,
    revenue24h: PropTypes.string.isRequired,
    supplyAPY: PropTypes.string.isRequired,
    liquidationLow: PropTypes.string.isRequired,
    liquidationHigh: PropTypes.string.isRequired,
    borrowRisk: PropTypes.string.isRequired,
  }).isRequired,
  onSupplyClick: PropTypes.func,
  onBorrowClick: PropTypes.func,
}
