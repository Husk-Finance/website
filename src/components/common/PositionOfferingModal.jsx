import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useAccount, usePublicClient } from 'wagmi'
import './PositionOfferingModal.scss'
import { fetchTokenData } from '../../utils/tokenUtils'

function PositionOfferingModal({ isOpen, onClose, action, position, positionType }) {
  // Wagmi hooks for wallet connection and blockchain data
  const { address, isConnected } = useAccount()
  const publicClient = usePublicClient()
  
  // Token data state for the input form (collateral/deposit asset)
  const [tokenSymbol, setTokenSymbol] = useState('')
  const [tokenBalance, setTokenBalance] = useState('0')
  const [tokenDecimals, setTokenDecimals] = useState(18)
  const [isLoadingToken, setIsLoadingToken] = useState(false)
  
  // Token data for the action (what you're getting/borrowing)
  const [actionTokenSymbol, setActionTokenSymbol] = useState('')
  const [isLoadingActionToken, setIsLoadingActionToken] = useState(false)
  
  // Input state
  const [amount, setAmount] = useState('')
  const [percentage, setPercentage] = useState(0)

  // Determine which asset to use for the input form (what you're providing)
  const getCollateralAssetAddress = () => {
    if (!position) return null
    
    if (action === 'supply') {
      // Supply action: user deposits the quote asset (e.g., USDC in WBTC/USDC)
      return position.liquiditySupplierAsset
    } else {
      // Borrow action: user supplies collateral (base asset, e.g., WBTC in WBTC/USDC)
      return position.liquidityProviderAsset || position.liquiditySupplierAsset
    }
  }

  // Determine which asset represents the action (what you're getting)
  const getActionAssetAddress = () => {
    if (!position) return null
    
    if (action === 'supply') {
      // Supply action: you're supplying the same asset you input
      return position.liquiditySupplierAsset
    } else {
      // Borrow action: you're borrowing the quote asset (e.g., USDC in WBTC/USDC)
      return position.liquiditySupplierAsset
    }
  }

  const currentAssetAddress = getCollateralAssetAddress()
  const actionAssetAddress = getActionAssetAddress()
  // Check if balance is numeric or a placeholder message
  const isBalanceNumeric = tokenBalance && !isNaN(parseFloat(tokenBalance))
  const userBalance = isBalanceNumeric ? parseFloat(tokenBalance) : 0
  const balanceDisplay = isBalanceNumeric 
    ? `${userBalance.toLocaleString(undefined, { maximumFractionDigits: 6 })} ${tokenSymbol}` 
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
        // Get chainId from position, pass to fetchTokenData for network-aware caching
        const chainId = position?.chainId || 1
        
        // Pass address, publicClient, and chainId
        const data = await fetchTokenData(
          assetAddress, 
          isConnected ? address : null, 
          publicClient,
          chainId
        )
        setTokenSymbol(data.symbol)
        setTokenBalance(data.balance)
        setTokenDecimals(data.decimals)
      } catch (error) {
        console.error('Failed to fetch collateral token data:', error)
        setTokenSymbol('UNKNOWN')
        setTokenBalance(isConnected ? '0' : 'Please connect wallet first')
        setTokenDecimals(18)
      } finally {
        setIsLoadingToken(false)
      }
    }

    loadTokenData()
  }, [isOpen, address, isConnected, publicClient, action, position, positionType])

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
        // Get chainId from position for network-aware caching
        const chainId = position?.chainId || 1
        
        // Only need symbol, no need for balance
        const data = await fetchTokenData(
          assetAddress, 
          null, // No user address needed, we only want the symbol
          publicClient,
          chainId
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
  }, [isOpen, publicClient, action, position, positionType])

  // Reset input when modal opens/closes or action type changes
  useEffect(() => {
    if (isOpen) {
      setAmount('')
      setPercentage(0)
    }
  }, [isOpen, action])

  // Handle amount input change
  const handleAmountChange = (e) => {
    const value = e.target.value
    
    // Allow empty string or valid numbers (including decimals)
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value)
      
      // Update slider percentage
      if (value === '' || parseFloat(value) === 0) {
        setPercentage(0)
      } else {
        const numValue = parseFloat(value)
        const pct = Math.min((numValue / userBalance) * 100, 100)
        setPercentage(Math.round(pct))
      }
    }
  }

  // Handle slider change
  const handleSliderChange = (e) => {
    const pct = parseInt(e.target.value)
    setPercentage(pct)
    
    // Update input amount
    const amt = (userBalance * pct) / 100
    setAmount(amt > 0 ? amt.toFixed(6) : '')
  }

  // Handle percentage input change
  const handlePercentageInputChange = (e) => {
    const value = e.target.value
    
    if (value === '' || /^\d*$/.test(value)) {
      const pct = value === '' ? 0 : Math.min(parseInt(value), 100)
      setPercentage(pct)
      
      // Update input amount
      const amt = (userBalance * pct) / 100
      setAmount(amt > 0 ? amt.toFixed(6) : '')
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
    <div className="modal-overlay" onClick={handleOverlayClick}>
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
                    <p>{position.version} {position.fee}</p>
                  </div>
                )}
                {!isDexPosition && position.tags && position.tags.length > 0 && (
                  <div className="tag-row">
                    {position.tags.map((tag, idx) => (
                      <div
                        key={idx}
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
                <p className="value">{position.huskAPY}</p>
              </div>
            </div>

            <div className="modal-body">
              <div className="info-grid">
                <div className="info-item">
                  <p className="label">TVL</p>
                  <p className="value">{position.tvl}</p>
                </div>
                <div className="info-item">
                  <p className="label">24h rev.</p>
                  <p className="value">{position.revenue24h}</p>
                </div>
                {isDexPosition ? (
                  <>
                    <div className="info-item">
                      <p className="label">Liquidation Low</p>
                      <p className="value">{position.liquidationLow}</p>
                    </div>
                    <div className="info-item">
                      <p className="label">Liquidation High</p>
                      <p className="value">{position.liquidationHigh}</p>
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
                  <p className="value">{position.supplyAPY}</p>
                </div>
                <div className="info-item">
                  <p className="label">{isDexPosition ? 'Borrow Risk' : 'Participation Risk'}</p>
                  <p className="value">{position.borrowRisk ?? position.participationRisk}</p>
                </div>
              </div>

              {/* Asset Balance and Input Section */}
              <div className="input-section">
                <div className="asset-balance">
                  <span className="asset-name">
                    {isLoadingToken ? 'Loading...' : tokenSymbol || 'UNKNOWN'}
                  </span>
                  <span className="balance-value">
                    Balance: {balanceDisplay}
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
                      background: `linear-gradient(to right, #388262 0%, #388262 ${percentage}%, rgba(59, 59, 59, 0.5) ${percentage}%, rgba(59, 59, 59, 0.5) 100%)`
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
                  <button className="action-btn supply-btn active">
                    Supply {isLoadingActionToken ? '...' : (actionTokenSymbol || 'USDC')}
                  </button>
                ) : (
                  <button className="action-btn borrow-btn active">
                    Borrow {isLoadingActionToken ? '...' : (actionTokenSymbol || 'USDC')}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Description */}
          <div className="modal-right">
            <div className="description-content">
              <p>Dicta dolor dolorum blanditiis sunt error explicabo. Aspernatur provident optio iure sapiente. Rem quidem consequatur corrupti occaecati velit iure placeat. Ab quibusdam dolor id necessitatibus quidem dolores ea ea. Quibusdam omnis aut rerum repellendus ut dicta quod similique.</p>
              <p>&nbsp;</p>
              <p>Qui repudiandae et accusantium cum rerum aliquid debitis quo. Molestias voluptatem nisi sapiente doloribus voluptatem. Repudiandae nihil et veniam libero sunt ipsam sunt. Quas voluptatem est consectetur.</p>
              <p>&nbsp;</p>
              <p>Quia illum voluptatem odit voluptas et. Maiores fugit eum distinctio animi voluptatibus amet. Sit quam assumenda nulla molestiae. Possimus quo alias modi sit odio. Culpa quidem eos itaque culpa et quisquam aut aut.</p>
              <p>&nbsp;</p>
              <p>Ea quis quaerat est consectetur molestiae quasi. Et earum atque omnis atque. Accusamus adipisci eveniet nihil neque et. Officia deleniti ut eos repudiandae omnis est. Voluptas nihil reiciendis amet voluptas fugiat laudantium. Tenetur laudantium explicabo dolorum.</p>
              <p>&nbsp;</p>
              <p>Assumenda nemo cupiditate aperiam aut aliquid porro consectetur. Quisquam minima non ad. Rerum perspiciatis velit non id perferendis. Architecto quia totam corrupti cupiditate dignissimos sunt nobis. Deserunt odio dolorum rerum quia adipisci. Asperiores asperiores excepturi ut.</p>
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
    // Asset fields (token addresses)
    liquidityProviderAsset: PropTypes.string, // ERC20 token address
    liquiditySupplierAsset: PropTypes.string, // ERC20 token address
  }),
  action: PropTypes.oneOf(['supply', 'borrow']),
}

export default PositionOfferingModal
