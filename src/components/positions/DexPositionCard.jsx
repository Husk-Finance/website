import './DexPositionCard.scss'

import PropTypes from 'prop-types'
import { useReadContracts } from 'wagmi'

import aerodromeIcon from '../../assets/aerodrome-icon.svg'
import agniIcon from '../../assets/agni-icon.svg'
import uniswapIcon from '../../assets/uniswap-icon.svg'
import { GRID_LABELS } from '../../constants'
import { ERC20_ABI } from '../../constants/contracts'
import {
  formatDollar, formatPercent, formatTokenAmount, formatTokenSymbol, getQuotedTokenSymbol, getTokenDecimals,
} from '../../utils/positionUtils'
import {
  CardButtons,
  CardContainer, CardGrid, CardGridItem,
} from '../common/CardBase'

export default function DexPositionCard({ position, onSupplyClick = null, onProvideClick = null }) {
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
  const rawSupplySymbol = symbols?.[0]?.result || getQuotedTokenSymbol(position, 'supply')
  const rawProvideSymbol = symbols?.[1]?.result || getQuotedTokenSymbol(position, 'provide')

  const supplySymbol = formatTokenSymbol(rawSupplySymbol)
  const provideSymbol = formatTokenSymbol(rawProvideSymbol)

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
          value={formatTokenAmount(position.liquidationLow, quoteDecimals, supplySymbol)}
        />
        <CardGridItem
          label={GRID_LABELS.liquidationHigh}
          value={formatTokenAmount(position.liquidationHigh, quoteDecimals, supplySymbol)}
        />
        <CardGridItem label={GRID_LABELS.supplyAPY} value={formatPercent(position.supplyAPY)} />
        <CardGridItem label={GRID_LABELS.provideRisk} value={formatPercent(position.provideRisk)} />
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
    provideRisk: PropTypes.string.isRequired,
    liquiditySupplierAsset: PropTypes.string, // ERC20 token address
    liquidityProviderAsset: PropTypes.string, // ERC20 token address
    chainId: PropTypes.number,
  }).isRequired,
  onSupplyClick: PropTypes.func,
  onProvideClick: PropTypes.func,
}
