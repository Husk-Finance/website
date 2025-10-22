import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useAccount } from 'wagmi'
import './BusinessPositionModal.scss'

function BusinessPositionModal({ isOpen, onClose, action, position }) {
  // Wagmi hooks for wallet connection
  const { address, isConnected } = useAccount()
  
  // Input state
  const [amount, setAmount] = useState('')
  const [percentage, setPercentage] = useState(0)
  
  // Mock balance for demonstration (replace with actual balance fetching)
  const userBalance = 10000
  const tokenSymbol = 'USDC'

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
    setAmount(amt > 0 ? amt.toFixed(2) : '')
  }

  // Handle percentage input change
  const handlePercentageInputChange = (e) => {
    const value = e.target.value
    
    if (value === '' || /^\d*$/.test(value)) {
      const pct = value === '' ? 0 : Math.min(parseInt(value), 100)
      setPercentage(pct)
      
      // Update input amount
      const amt = (userBalance * pct) / 100
      setAmount(amt > 0 ? amt.toFixed(2) : '')
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

  const balanceDisplay = isConnected 
    ? `${userBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${tokenSymbol}`
    : 'Please connect wallet first'

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
                  <div className="business-tags">
                    <span className="network-tag">{position.network}</span>
                    <span className="rwa-tag">RWA</span>
                  </div>
                </div>
                <div className="husk-apy">
                  <p className="label">Husk APY</p>
                  <p className="value">{position.huskAPY}</p>
                </div>
              </div>

              <div className="info-grid">
                <div className="info-item">
                  <p className="label">TVL / MCap</p>
                  <p className="value">{position.tvlMcap}</p>
                </div>
                <div className="info-item">
                  <p className="label">30d rev.</p>
                  <p className="value">{position.revenue30d}</p>
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
                  <p className="value">{position.supplyAPY}</p>
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
                <span className="asset-name">{tokenSymbol}</span>
                <span className="balance-value">Balance: {balanceDisplay}</span>
              </div>

              <input
                type="text"
                className="amount-input"
                placeholder="0.00"
                value={amount}
                onChange={handleAmountChange}
                disabled={!isConnected}
              />

              <div className="percentage-control">
                <input
                  type="range"
                  className="percentage-slider"
                  min="0"
                  max="100"
                  value={percentage}
                  onChange={handleSliderChange}
                  disabled={!isConnected}
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
                  disabled={!isConnected}
                />
                <span className="percentage-label">%</span>
              </div>
            </div>

            <div className="transaction-summary">
              <h4>Transaction Summary</h4>
              <div className="summary-row">
                <span className="summary-label">Amount</span>
                <span className="summary-value">{amount || '0.00'} {tokenSymbol}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Expected APY</span>
                <span className="summary-value">{position.huskAPY}</span>
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

            <div className="action-buttons">
              {!isConnected ? (
                <button className="action-btn connect-btn" disabled>
                  Connect Wallet to Continue
                </button>
              ) : (
                <>
                  {action === 'supply' ? (
                    <button className="action-btn supply-btn" disabled={!amount || parseFloat(amount) === 0}>
                      Supply {tokenSymbol}
                    </button>
                  ) : (
                    <button className="action-btn borrow-btn" disabled={!amount || parseFloat(amount) === 0}>
                      Borrow {tokenSymbol}
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
    businessName: PropTypes.string.isRequired,
    businessImage: PropTypes.string.isRequired,
    network: PropTypes.string.isRequired,
    huskAPY: PropTypes.string.isRequired,
    tvlMcap: PropTypes.string.isRequired,
    revenue30d: PropTypes.string.isRequired,
    distribution: PropTypes.string.isRequired,
    nextDistribution: PropTypes.string.isRequired,
    supplyAPY: PropTypes.string.isRequired,
    participationRisk: PropTypes.string.isRequired,
  }),
}

export default BusinessPositionModal
