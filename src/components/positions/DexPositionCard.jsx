import PropTypes from 'prop-types'
import './DexPositionCard.scss'
import uniswapIcon from '../../assets/uniswap-icon.svg'
import aerodromeIcon from '../../assets/aerodrome-icon.svg'
import agniIcon from '../../assets/agni-icon.svg'
import { GRID_LABELS } from '../../constants'
import {
  getQuotedTokenSymbol, formatPercent, formatDollar, formatTokenAmount, getTokenDecimals,
} from '../../utils/positionUtils'
import {
  CardContainer, CardGrid, CardGridItem, CardButtons,
} from '../common/CardBase'

export default function DexPositionCard({ position, onSupplyClick = null, onBorrowClick = null }) {
  // Both buttons show the quote asset (what you're getting/depositing)
  const quotedToken = getQuotedTokenSymbol(position, 'supply')

  // Get decimals for the quote asset (liquiditySupplierAsset)
  const quoteDecimals = getTokenDecimals(position.liquiditySupplierAsset)

  return (
    <CardContainer className="dex-position-card">
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
        {position.protocol === 'agni' && (
          <img
            src={agniIcon}
            alt="Agni"
            className="protocol-icon agni-icon"
            loading="lazy"
          />
        )}
      </div>

      <div className="card-header">
        <div className="pair-info">
          <div className="pair-name">{position.pair}</div>
          <div className="pair-meta">
            {position.version}
            {' '}
            {formatPercent(position.fee)}
            {' '}
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

      <CardGrid>
        <CardGridItem label={GRID_LABELS.tvl} value={formatDollar(position.tvl)} />
        <CardGridItem label={GRID_LABELS.revenue24h} value={formatDollar(position.revenue24h)} />
        <CardGridItem
          label={GRID_LABELS.liquidationLow}
          value={formatTokenAmount(position.liquidationLow, quoteDecimals, quotedToken)}
        />
        <CardGridItem
          label={GRID_LABELS.liquidationHigh}
          value={formatTokenAmount(position.liquidationHigh, quoteDecimals, quotedToken)}
        />
        <CardGridItem label={GRID_LABELS.supplyAPY} value={formatPercent(position.supplyAPY)} />
        <CardGridItem label={GRID_LABELS.borrowRisk} value={formatPercent(position.borrowRisk)} />
        <CardButtons
          onSupply={onSupplyClick}
          onBorrow={onBorrowClick}
          supplyLabel={`Supply ${quotedToken}`}
          borrowLabel={`Borrow ${quotedToken}`}
        />
      </CardGrid>
    </CardContainer>
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
    liquiditySupplierAsset: PropTypes.string, // ERC20 token address
  }).isRequired,
  onSupplyClick: PropTypes.func,
  onBorrowClick: PropTypes.func,
}
