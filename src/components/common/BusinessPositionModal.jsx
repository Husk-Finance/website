import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useAccount, usePublicClient } from 'wagmi'
import './BusinessPositionModal.scss'
import { fetchTokenData } from '../../utils/tokenUtils'
import { formatCompactNumber, formatPercent } from '../../utils/positionUtils'

function BusinessPositionModal({ isOpen, onClose, action, position }) {
  // Wagmi hooks for wallet connection
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
      // Supply action: user deposits USDC (liquiditySupplierAsset)
      return position.liquiditySupplierAsset
    } else {
      // Borrow action: user supplies RWA Business Token as collateral (liquidityProviderAsset)
      return position.liquidityProviderAsset
    }
  }

  // Determine which asset represents the action (what you're getting)
  const getActionAssetAddress = () => {
    if (!position) return null
    
    if (action === 'supply') {
      // Supply action: you're supplying USDC
      return position.liquiditySupplierAsset
    } else {
      // Borrow action: you're borrowing USDC (liquiditySupplierAsset)
      return position.liquiditySupplierAsset
    }
  }

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
  }, [isOpen, address, isConnected, publicClient, action, position])

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
  }, [isOpen, publicClient, action, position])

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

  return (
    <div className="business-modal-overlay" onClick={handleOverlayClick}>
      <div className="business-modal-container">
        <div className="business-modal-content">
          {/* Left Column - Business Image and Info */}
          <div className="business-modal-left">
            <div className="business-modal-image-section">
              <img 
                src={position.businessImage} 
                alt={position.businessName}
                className="business-modal-image"
              />
              <div className="business-modal-overlay-gradient" />
            </div>

            <div className="business-modal-info">
              <div className="business-modal-header">
                <div className="business-details">
                  <h3 className="business-name">{position.businessName}</h3>
                  {position.tags && position.tags.length > 0 && (
                    <div className="business-tags">
                      {position.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="business-tag"
                          style={{ backgroundColor: tag.bg, color: tag.color }}
                        >
                          {tag.label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="husk-apy">
                  <p className="label">Husk APY</p>
                  <p className="value">{formatPercent(position.huskAPY)}</p>
                </div>
              </div>

              <div className="info-grid">
                <div className="info-item">
                  <p className="label">TVL / MCap</p>
                  <p className="value">
                    ${formatCompactNumber(position.tvl)} / ${formatCompactNumber(position.mcap)}
                  </p>
                </div>
                <div className="info-item">
                  <p className="label">30d rev.</p>
                  <p className="value">${formatCompactNumber(position.revenue30d)}</p>
                </div>
                <div className="info-item">
                  <p className="label">Distribution</p>
                  <p className="value">{position.distribution}</p>
                </div>
                <div className="info-item">
                  <p className="label">Next Distribution</p>
                  <p className="value">{position.nextDistribution}</p>
                </div>
                <div className="info-item">
                  <p className="label">Supply APY</p>
                  <p className="value">{formatPercent(position.supplyAPY)}</p>
                </div>
                <div className="info-item">
                  <p className="label">Participation Risk</p>
                  <p className="value">{position.participationRisk}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Action Form */}
          <div className="business-modal-right">
            <div className="action-header">
              <h2 className="action-title">
                {action === 'supply' ? 'Supply Capital' : 'Borrow Capital'}
              </h2>
              <button className="close-button" onClick={onClose}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <div className="business-description">
              <p>
                {action === 'supply' 
                  ? 'Supply USDC to earn yield from real-world business revenue. Your capital will be used to fund operational expenses and growth initiatives.'
                  : 'Borrow USDC using your position as collateral. Interest rates are determined by the business performance and market conditions.'}
              </p>
            </div>

            <div className="input-section">
              <div className="asset-balance">
                <span className="asset-name">
                  {isLoadingToken ? 'Loading...' : tokenSymbol || 'USDC'}
                </span>
                <span className="balance-value">Balance: {balanceDisplay}</span>
              </div>

              <input
                type="text"
                className="amount-input"
                placeholder="0.00"
                value={amount}
                onChange={handleAmountChange}
                disabled={!isConnected || isLoadingToken}
              />

              <div className="percentage-control">
                <input
                  type="range"
                  className="percentage-slider"
                  min="0"
                  max="100"
                  value={percentage}
                  onChange={handleSliderChange}
                  disabled={!isConnected || isLoadingToken}
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
                  disabled={!isConnected || isLoadingToken}
                />
                <span className="percentage-label">%</span>
              </div>
            </div>

            <div className="transaction-summary">
              <h4>Transaction Summary</h4>
              <div className="summary-row">
                <span className="summary-label">Amount</span>
                <span className="summary-value">
                  {amount || '0.00'} {isLoadingToken ? '...' : (tokenSymbol || 'USDC')}
                </span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Expected APY</span>
                <span className="summary-value">{formatPercent(position.huskAPY)}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Distribution</span>
                <span className="summary-value">{position.distribution}</span>
              </div>
              <div className="summary-row highlight">
                <span className="summary-label">Next Distribution</span>
                <span className="summary-value">{position.nextDistribution}</span>
              </div>
            </div>

            <div className="transaction-summary">
              <div className="summary-row liquidation-price">
                <span className="summary-label">Liqd. Low Price</span>
                <span className="summary-value">
                  {action === 'supply' ? 'None' : `$${position.liqdLowPrice}`}
                </span>
              </div>
            </div>

            <div className="action-buttons">
              {!isConnected ? (
                <button className="action-btn connect-btn" disabled>
                  Connect Wallet to Continue
                </button>
              ) : (
                <>
                  {action === 'supply' ? (
                    <button 
                      className="action-btn supply-btn" 
                      disabled={!amount || parseFloat(amount) === 0 || isLoadingToken || isLoadingActionToken}
                    >
                      Supply {isLoadingActionToken ? '...' : (actionTokenSymbol || 'USDC')}
                    </button>
                  ) : (
                    <button 
                      className="action-btn borrow-btn" 
                      disabled={!amount || parseFloat(amount) === 0 || isLoadingToken || isLoadingActionToken}
                    >
                      Borrow {isLoadingActionToken ? '...' : (actionTokenSymbol || 'USDC')}
                    </button>
                  )}
                </>
              )}
            </div>

            <div className="risk-disclaimer">
              <p>⚠️ <strong>Risk Disclaimer:</strong> Investing in real-world asset positions carries unique risks including business performance, market conditions, and regulatory changes. Please review all terms and conditions before proceeding.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

BusinessPositionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  action: PropTypes.oneOf(['supply', 'borrow']).isRequired,
  position: PropTypes.shape({
    chainId: PropTypes.number.isRequired,
    businessName: PropTypes.string.isRequired,
    businessImage: PropTypes.string.isRequired,
    network: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      bg: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    })),
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
  }),
}

export default BusinessPositionModal
