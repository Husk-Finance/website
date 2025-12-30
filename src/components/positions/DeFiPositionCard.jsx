import PropTypes from 'prop-types'
import './DeFiPositionCard.scss'
import { useReadContracts } from 'wagmi'
import Tag from '../common/Tag'
import { GRID_LABELS } from '../../constants'
import { ERC20_ABI } from '../../constants/contracts'
import { getQuotedTokenSymbol, formatPercent, formatDollar } from '../../utils/positionUtils'
import {
  CardContainer, CardGrid, CardGridItem, CardButtons,
} from '../common/CardBase'

export default function DeFiPositionCard({ position, onSupplyClick = null, onProvideClick = null }) {
  // Fetch token symbols for both assets
  const { data: symbols } = useReadContracts({
    contracts: [
      {
        address: position.liquiditySupplierAsset,
        abi: ERC20_ABI,
        functionName: 'symbol',
        chainId: position.chainId,
      },
      {
        address: position.liquidityProviderAsset,
        abi: ERC20_ABI,
        functionName: 'symbol',
        chainId: position.chainId,
      },
    ],
    query: {
      enabled: !!position.liquiditySupplierAsset && !!position.liquidityProviderAsset,
      staleTime: Infinity,
    },
  })

  // Destructure results
  const supplySymbol = symbols?.[0]?.result || getQuotedTokenSymbol(position)
  const provideSymbol = symbols?.[1]?.result || getQuotedTokenSymbol(position)

  return (
    <CardContainer className="defi-position-card">
      <div className="card-header">
        <div className="protocol-info">
          <div className="protocol-name">{position.protocol}</div>

          {position.tags && position.tags.length > 0 && (
            <div className="tag-row tags-group-horizontal">
              {position.tags.map((t) => (
                <Tag key={t.label} tag={t} />
              ))}
            </div>
          )}
        </div>

        <div className="rate-info">
          <div className="rate-label">{GRID_LABELS.huskAPY}</div>
          <div className="rate-value">{formatPercent(position.huskAPY)}</div>
        </div>
      </div>

      <CardGrid>
        <CardGridItem label={GRID_LABELS.tvl} value={formatDollar(position.tvl)} />
        <CardGridItem label={GRID_LABELS.revenue24h} value={formatDollar(position.revenue24h)} />
        <CardGridItem label="Distribution" value={position.distribution} />
        <CardGridItem label="Next Distribution" value={position.nextDistribution} />
        <CardGridItem label={GRID_LABELS.supplyAPY} value={formatPercent(position.supplyAPY)} />
        <CardGridItem label={GRID_LABELS.participationRisk} value={formatPercent(position.participationRisk)} />
        <CardButtons
          onSupply={onSupplyClick}
          onProvide={onProvideClick}
          supplyLabel={`Supply ${supplySymbol}`}
          provideLabel={`Provide ${provideSymbol}`}
        />
      </CardGrid>
    </CardContainer>
  )
}

DeFiPositionCard.propTypes = {
  position: PropTypes.shape({
    id: PropTypes.number.isRequired,
    protocol: PropTypes.string.isRequired,
    createdAt: PropTypes.number,
    tags: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      bg: PropTypes.string,
      color: PropTypes.string,
    })),
    huskAPY: PropTypes.string,
    supplyAPY: PropTypes.string.isRequired,
    tvl: PropTypes.string.isRequired,
    revenue24h: PropTypes.string.isRequired,
    distribution: PropTypes.string,
    nextDistribution: PropTypes.string,
    liquidationLow: PropTypes.string,
    provideRisk: PropTypes.string,
    participationRisk: PropTypes.string,
    quotedAsset: PropTypes.string, // Token symbol for button labels (e.g., "USDC", "WETH", "DAI")
  }).isRequired,
  onSupplyClick: PropTypes.func,
  onProvideClick: PropTypes.func,
}
