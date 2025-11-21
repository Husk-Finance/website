import { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useAccount } from 'wagmi'
import './PositionOfferingModal.scss'
import { fetchTokenData } from '../../utils/tokenUtils'
import {
  formatPercent, formatDollar, formatTokenAmount, getTokenDecimals,
} from '../../utils/positionUtils'
import { formatTokenBalance, parseTokenAmount, hasSufficientBalance } from '../../utils/tokenDisplayUtils'

function PositionOfferingModal({
  isOpen, onClose, action, position,
}) {
  // Wagmi hooks for wallet connection
  const { address, isConnected } = useAccount()

  // Token data state for the input form (collateral/deposit asset)
  const [tokenSymbol, setTokenSymbol] = useState('')
  const [tokenDecimals, setTokenDecimals] = useState(18)
  const [tokenBalance, setTokenBalance] = useState('0') // Stored as integer string (wei)
  const [isLoadingToken, setIsLoadingToken] = useState(false)

  // Token data for the action (what you're getting/borrowing)
  const [actionTokenSymbol, setActionTokenSymbol] = useState('')
  const [isLoadingActionToken, setIsLoadingActionToken] = useState(false)

  // Input state
  const [amount, setAmount] = useState('')
  const [percentage, setPercentage] = useState(0)

  // Determine which asset to use for the input form (what you're providing)
  const getCollateralAssetAddress = useCallback(() => {
    if (!position) return null

    if (action === 'supply') {
      // Supply action: user deposits the quote asset (e.g., USDC in WBTC/USDC)
      return position.liquiditySupplierAsset
    }
    // Borrow action: user supplies collateral (base asset, e.g., WBTC in WBTC/USDC)
    return position.liquidityProviderAsset || position.liquiditySupplierAsset
  }, [position, action])

  // Determine which asset represents the action (what you're getting)
  const getActionAssetAddress = useCallback(() => {
    if (!position) return null

    if (action === 'supply') {
      // Supply action: you're supplying the same asset you input
      return position.liquiditySupplierAsset
    }
    // Borrow action: you're borrowing the quote asset (e.g., USDC in WBTC/USDC)
    return position.liquiditySupplierAsset
  }, [position, action])

  // Check if balance is numeric (integer string) or a placeholder message
  const isBalanceNumeric = tokenBalance && tokenBalance !== '0' && !tokenBalance.includes('connect')
  const balanceDisplay = isBalanceNumeric
    ? `${formatTokenBalance(tokenBalance, tokenDecimals)} ${tokenSymbol}`
    : tokenBalance || '0'

  // Fetch collateral token data (for input form - what you're providing)
  useEffect(() => {
    const loadTokenData = async () => {
      if (!isOpen) {
        setIsLoadingToken(false)
        return
      }

      const assetAddress = getCollateralAssetAddress()
      if (!assetAddress) {
        setIsLoadingToken(false)
        return
      }

      setIsLoadingToken(true)
      try {
        // Get chainId from position
        const chainId = position?.chainId || 1

        // Use standard fetchTokenData
        const data = await fetchTokenData(
          assetAddress,
          isConnected ? address : null,
          null, // publicClient
          chainId,
        )
        setTokenSymbol(data.symbol)
        setTokenDecimals(data.decimals)
        setTokenBalance(data.balance)
      } catch (error) {
        console.error('Failed to fetch collateral token data:', error)
        setTokenSymbol('UNKNOWN')
        setTokenBalance(isConnected ? '0' : 'Please connect wallet first')
      } finally {
        setIsLoadingToken(false)
      }
    }

    loadTokenData()
  }, [isOpen, address, isConnected, getCollateralAssetAddress, position?.chainId])

  // Fetch action token symbol (for button - what you're getting)
  useEffect(() => {
    const loadActionTokenData = async () => {
      if (!isOpen) {
        setIsLoadingActionToken(false)
        return
      }

      const assetAddress = getActionAssetAddress()
      if (!assetAddress) {
        setIsLoadingActionToken(false)
        return
      }

      setIsLoadingActionToken(true)
      try {
        // Get chainId from position
        const chainId = position?.chainId || 1

        // Only need symbol, no need for balance - optimized call
        const data = await fetchTokenData(
          assetAddress,
          null, // No user address needed, we only want the symbol
          null, // publicClient
          chainId,
        )
        setActionTokenSymbol(data.symbol)
      } catch (error) {
        console.error('Failed to fetch action token data:', error)
        setActionTokenSymbol('USDC')
      } finally {
        setIsLoadingActionToken(false)
      }
    }

    loadActionTokenData()
  }, [isOpen, getActionAssetAddress, position?.chainId])

  // Reset input when modal opens/closes or action type changes
  useEffect(() => {
    if (isOpen) {
      setAmount('')
      setPercentage(0)
    }
  }, [isOpen, action])

  // Handle amount input change
  const handleAmountChange = (e) => {
    const { value } = e.target

    // Allow empty string or valid numbers (including decimals)
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value)

      // Update slider percentage based on balance
      if (value === '' || parseFloat(value) === 0) {
        setPercentage(0)
      } else if (isBalanceNumeric) {
        const numValue = parseFloat(value)
        const userBalanceFloat = parseFloat(formatTokenBalance(tokenBalance, tokenDecimals))
        const pct = Math.min((numValue / userBalanceFloat) * 100, 100)
        setPercentage(Math.round(pct))
      }
    }
  }

  // Handle slider change
  const handleSliderChange = (e) => {
    const pct = parseInt(e.target.value, 10)
    setPercentage(pct)

    // Update input amount
    if (isBalanceNumeric) {
      const userBalanceFloat = parseFloat(formatTokenBalance(tokenBalance, tokenDecimals))
      const amt = (userBalanceFloat * pct) / 100
      setAmount(amt > 0 ? amt.toFixed(6) : '')
    }
  }

  // Handle percentage input change
  const handlePercentageInputChange = (e) => {
    const { value } = e.target

    if (value === '' || /^\d*$/.test(value)) {
      const pct = value === '' ? 0 : Math.min(parseInt(value, 10), 100)
      setPercentage(pct)

      // Update input amount
      if (isBalanceNumeric) {
        const userBalanceFloat = parseFloat(formatTokenBalance(tokenBalance, tokenDecimals))
        const amt = (userBalanceFloat * pct) / 100
        setAmount(amt > 0 ? amt.toFixed(6) : '')
      }
    }
  }
  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen || !position) return null

  // Handle overlay click (click outside modal)
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // Determine if this is a DEX or DeFi position
  const isDexPosition = position.pair !== undefined
  const displayName = isDexPosition ? position.pair : position.protocol

  return (
    <div
      className="modal-overlay"
      onClick={handleOverlayClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleOverlayClick(e)
        }
      }}
    >
      <div className="modal-container">
        <div className="modal-content">
          {/* Left Column */}
          <div className="modal-left">
            <div className="modal-header">
              <div className="protocol-info">
                <div className="protocol-title">
                  <p className="protocol-name">{displayName}</p>
                </div>
                {isDexPosition && position.version && position.fee && (
                  <div className="pair-meta">
                    <p>
                      {position.version}
                      {' '}
                      {position.fee}
                    </p>
                  </div>
                )}
                {!isDexPosition && position.tags && position.tags.length > 0 && (
                  <div className="tag-row">
                    {position.tags.map((tag) => (
                      <div
                        key={tag.label}
                        className="tag-pill"
                        style={{ backgroundColor: tag.bg, color: tag.color }}
                      >
                        <p>{tag.label}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="husk-apy">
                <p className="label">Husk APY</p>
                <p className="value">{formatPercent(position.huskAPY)}</p>
              </div>
            </div>

            <div className="modal-body">
              <div className="info-grid">
                <div className="info-item">
                  <p className="label">TVL</p>
                  <p className="value">{formatDollar(position.tvl)}</p>
                </div>
                <div className="info-item">
                  <p className="label">24h rev.</p>
                  <p className="value">{formatDollar(position.revenue24h)}</p>
                </div>
                {isDexPosition ? (
                  <>
                    <div className="info-item">
                      <p className="label">Liquidation Low</p>
                      <p className="value">
                        {formatTokenAmount(
                          position.liquidationLow,
                          getTokenDecimals(position.liquiditySupplierAsset),
                          actionTokenSymbol || 'USDC',
                        )}
                      </p>
                    </div>
                    <div className="info-item">
                      <p className="label">Liquidation High</p>
                      <p className="value">
                        {formatTokenAmount(
                          position.liquidationHigh,
                          getTokenDecimals(position.liquiditySupplierAsset),
                          actionTokenSymbol || 'USDC',
                        )}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="info-item">
                      <p className="label">Distribution</p>
                      <p className="value">{position.distribution}</p>
                    </div>
                    <div className="info-item">
                      <p className="label">Next Distribution</p>
                      <p className="value">{position.nextDistribution}</p>
                    </div>
                  </>
                )}
                <div className="info-item">
                  <p className="label">Supply APY</p>
                  <p className="value">{formatPercent(position.supplyAPY)}</p>
                </div>
                <div className="info-item">
                  <p className="label">{isDexPosition ? 'Borrow Risk' : 'Participation Risk'}</p>
                  <p className="value">
                    {isDexPosition
                      ? formatPercent(position.borrowRisk)
                      : formatPercent(position.participationRisk)}
                  </p>
                </div>
              </div>

              {/* Asset Balance and Input Section */}
              <div className="input-section">
                <div className="asset-balance">
                  <span className="asset-name">
                    {isLoadingToken ? 'Loading...' : tokenSymbol || 'UNKNOWN'}
                  </span>
                  <span className="balance-value">
                    Balance:
                    {' '}
                    {balanceDisplay}
                  </span>
                </div>

                <input
                  type="text"
                  className="amount-input"
                  placeholder="0.00"
                  value={amount}
                  onChange={handleAmountChange}
                  disabled={isLoadingToken}
                />

                <div className="percentage-control">
                  <input
                    type="range"
                    className="percentage-slider"
                    min="0"
                    max="100"
                    value={percentage}
                    onChange={handleSliderChange}
                    disabled={isLoadingToken}
                    style={{
                      background: `linear-gradient(to right, #388262 0%, #388262 ${percentage}%, rgba(59, 59, 59, 0.5) ${percentage}%, rgba(59, 59, 59, 0.5) 100%)`,
                    }}
                  />
                  <input
                    type="text"
                    className="percentage-input"
                    placeholder="0"
                    value={percentage}
                    onChange={handlePercentageInputChange}
                    disabled={isLoadingToken}
                  />
                  <span className="percentage-label">%</span>
                </div>
              </div>

              <div className="action-buttons">
                {action === 'supply' ? (
                  <button type="button" className="action-btn supply-btn active">
                    Supply
                    {' '}
                    {isLoadingActionToken ? '...' : (actionTokenSymbol || 'USDC')}
                  </button>
                ) : (
                  <button type="button" className="action-btn borrow-btn active">
                    Borrow
                    {' '}
                    {isLoadingActionToken ? '...' : (actionTokenSymbol || 'USDC')}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Description */}
          <div className="modal-right">
            <div className="description-content">
              <p>
                Dicta dolor dolorum blanditiis sunt error explicabo.
                Aspernatur provident optio iure sapiente.
                Rem quidem consequatur corrupti occaecati velit iure placeat.
                Ab quibusdam dolor id necessitatibus quidem dolores ea ea.
                Quibusdam omnis aut rerum repellendus ut dicta quod similique.
              </p>
              <p>&nbsp;</p>
              <p>
                Qui repudiandae et accusantium cum rerum aliquid debitis quo.
                Molestias voluptatem nisi sapiente doloribus voluptatem.
                Repudiandae nihil et veniam libero sunt ipsam sunt.
                Quas voluptatem est consectetur.
              </p>
              <p>&nbsp;</p>
              <p>
                Quia illum voluptatem odit voluptas et.
                Maiores fugit eum distinctio animi voluptatibus amet.
                Sit quam assumenda nulla molestiae.
                Possimus quo alias modi sit odio.
                Culpa quidem eos itaque culpa et quisquam aut aut.
              </p>
              <p>&nbsp;</p>
              <p>
                Ea quis quaerat est consectetur molestiae quasi.
                Et earum atque omnis atque.
                Accusamus adipisci eveniet nihil neque et.
                Officia deleniti ut eos repudiandae omnis est.
                Voluptas nihil reiciendis amet voluptas fugiat laudantium.
                Tenetur laudantium explicabo dolorum.
              </p>
              <p>&nbsp;</p>
              <p>
                Assumenda nemo cupiditate aperiam aut aliquid porro consectetur.
                Quisquam minima non ad.
                Rerum perspiciatis velit non id perferendis.
                Architecto quia totam corrupti cupiditate dignissimos sunt nobis.
                Deserunt odio dolorum rerum quia adipisci.
                Asperiores asperiores excepturi ut.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

PositionOfferingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  position: PropTypes.shape({
    // DeFi position fields
    protocol: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      bg: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    })),
    distribution: PropTypes.string,
    nextDistribution: PropTypes.string,
    // DEX position fields
    pair: PropTypes.string,
    version: PropTypes.string,
    fee: PropTypes.string,
    liquidationLow: PropTypes.string,
    liquidationHigh: PropTypes.string,
    // Common fields
    huskAPY: PropTypes.string,
    tvl: PropTypes.string,
    revenue24h: PropTypes.string,
    supplyAPY: PropTypes.string,
    borrowRisk: PropTypes.string,
    participationRisk: PropTypes.string,
    chainId: PropTypes.number,
    // Asset fields (token addresses)
    liquidityProviderAsset: PropTypes.string, // ERC20 token address
    liquiditySupplierAsset: PropTypes.string, // ERC20 token address
  }),
  action: PropTypes.oneOf(['supply', 'borrow']),
}

export default PositionOfferingModal
