import PropTypes from 'prop-types'
import { useReadContracts } from 'wagmi'
import { ERC20_ABI } from '../../constants/contracts'
import { formatTokenSymbol, formatTokenAmount, getTokenDecimals } from '../../utils/positionUtils'

export function TableActionButtons({ position, onSupplyClick, onProvideClick }) {
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

    // Default fallbacks (can be improved with getQuotedTokenSymbol if imported, or passed in)
    // Replicating logic from Cards:
    const rawSupplySymbol = symbols?.[0]?.result || 'USDC'
    const rawProvideSymbol = symbols?.[1]?.result || 'USDC'

    const supplySymbol = formatTokenSymbol(rawSupplySymbol)
    const provideSymbol = formatTokenSymbol(rawProvideSymbol)

    return (
        <div className="action-buttons">
            <button type="button" onClick={() => onSupplyClick(position)}>
                Supply
                {' '}
                {supplySymbol}
            </button>
            <button type="button" className="provide-button" onClick={() => onProvideClick(position)}>
                Provide
                {' '}
                {provideSymbol}
            </button>
        </div>
    )
}

TableActionButtons.propTypes = {
    position: PropTypes.object.isRequired,
    onSupplyClick: PropTypes.func.isRequired,
    onProvideClick: PropTypes.func.isRequired,
}

export function LiquidationValueDisplay({ position, value }) {
    const { data: symbolResult } = useReadContracts({
        contracts: [
            {
                address: position.liquiditySupplierAsset,
                abi: ERC20_ABI,
                functionName: 'symbol',
                chainId: position.chainId,
            },
        ],
        query: {
            enabled: !!position.liquiditySupplierAsset,
            staleTime: Infinity,
        },
    })

    const rawSymbol = symbolResult?.[0]?.result || 'USDC'
    const symbol = formatTokenSymbol(rawSymbol)
    const decimals = getTokenDecimals(position.liquiditySupplierAsset)

    return formatTokenAmount(value, decimals, symbol)
}

LiquidationValueDisplay.propTypes = {
    position: PropTypes.object.isRequired,
    value: PropTypes.string.isRequired,
}
