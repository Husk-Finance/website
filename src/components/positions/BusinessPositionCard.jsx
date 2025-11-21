import PropTypes from 'prop-types'
import './BusinessPositionCard.scss'
import Tag from '../common/Tag'
import { GRID_LABELS } from '../../constants'
import { formatCompactNumber, formatPercent } from '../../utils/positionUtils'
import {
  CardContainer, CardGrid, CardGridItem, CardButtons,
} from '../common/CardBase'

export default function BusinessPositionCard({ position, onSupplyClick, onBorrowClick }) {
  return (
    <CardContainer className="business-position-card">
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
              <div className="business-tags tags-group-horizontal">
                {position.tags.map((tag) => (
                  <Tag key={tag.label} tag={tag} />
                ))}
              </div>
            )}
          </div>
          <div className="apy-info">
            <div className="apy-label">{GRID_LABELS.huskAPY}</div>
            <div className="apy-value">{formatPercent(position.huskAPY)}</div>
          </div>
        </div>

        <CardGrid>
          <CardGridItem
            label="TVL / MCap"
            value={`$${formatCompactNumber(position.tvl)} / $${formatCompactNumber(position.mcap)}`}
          />
          <CardGridItem
            label="30d rev."
            value={`$${formatCompactNumber(position.revenue30d)}`}
          />
          <CardGridItem label="Distribution" value={position.distribution} />
          <CardGridItem label="Next Distribution" value={position.nextDistribution} />
          <CardGridItem label={GRID_LABELS.supplyAPY} value={formatPercent(position.supplyAPY)} />
          <CardGridItem label={GRID_LABELS.participationRisk} value={position.participationRisk} />
          <CardButtons
            onSupply={onSupplyClick}
            onBorrow={onBorrowClick}
            supplyLabel="Supply USDC"
            borrowLabel="Borrow USDC"
          />
        </CardGrid>
      </div>
    </CardContainer>
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
