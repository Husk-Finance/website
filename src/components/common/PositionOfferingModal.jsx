import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import './PositionOfferingModal.scss'

export default function PositionOfferingModal({ isOpen, onClose, position, actionType }) {
  // Mock user balances (in a real app, these would come from wallet connection)
  const [userBalances] = useState({
    XAUT: 2.5,
    WBTC: 0.15,
    ETH: 5.2,
    USDC: 15000,
    USDT: 8000,
    DAI: 12000,
    MATIC: 5000,
    LINK: 500,
    UNI: 250,
    AETHIR: 1000,
    COMP: 50,
    MKR: 3,
    EUL: 100,
  })

  // Input state
  const [inputAmount, setInputAmount] = useState('')
  const [percentageSlider, setPercentageSlider] = useState(0)

  // Determine which asset to use based on action type
  const getAssetForAction = () => {
    if (!position) return null
    
    if (actionType === 'supply') {
      return position.liquiditySupplierAsset || 'USDC'
    } else {
      return position.liquidityProviderAsset || position.liquiditySupplierAsset || 'USDC'
    }
  }

  const currentAsset = getAssetForAction()
  const userBalance = currentAsset ? (userBalances[currentAsset] || 0) : 0

  // Reset input when modal opens/closes or action type changes
  useEffect(() => {
    if (isOpen) {
      setInputAmount('')
      setPercentageSlider(0)
    }
  }, [isOpen, actionType])

  // Handle amount input change
  const handleAmountChange = (e) => {
    const value = e.target.value
    
    // Allow empty string or valid numbers (including decimals)
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setInputAmount(value)
      
      // Update slider percentage
      if (value === '' || parseFloat(value) === 0) {
        setPercentageSlider(0)
      } else {
        const numValue = parseFloat(value)
        const percentage = Math.min((numValue / userBalance) * 100, 100)
        setPercentageSlider(Math.round(percentage))
      }
    }
  }

  // Handle slider change
  const handleSliderChange = (e) => {
    const percentage = parseInt(e.target.value)
    setPercentageSlider(percentage)
    
    // Update input amount
    const amount = (userBalance * percentage) / 100
    setInputAmount(amount > 0 ? amount.toFixed(6) : '')
  }

  // Handle percentage input change
  const handlePercentageInputChange = (e) => {
    const value = e.target.value
    
    if (value === '' || /^\d*$/.test(value)) {
      const percentage = value === '' ? 0 : Math.min(parseInt(value), 100)
      setPercentageSlider(percentage)
      
      // Update input amount
      const amount = (userBalance * percentage) / 100
      setInputAmount(amount > 0 ? amount.toFixed(6) : '')
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
                  <p className="value">{position.borrowRisk}</p>
                </div>
              </div>

              {/* Asset Balance and Input Section */}
              <div className="input-section">
                <div className="asset-balance">
                  <span className="asset-name">{currentAsset}</span>
                  <span className="balance-value">
                    Balance: {userBalance.toLocaleString()} {currentAsset}
                  </span>
                </div>

                <input
                  type="text"
                  className="amount-input"
                  placeholder="0.00"
                  value={inputAmount}
                  onChange={handleAmountChange}
                />

                <div className="percentage-control">
                  <input
                    type="range"
                    className="percentage-slider"
                    min="0"
                    max="100"
                    value={percentageSlider}
                    onChange={handleSliderChange}
                    style={{
                      background: `linear-gradient(to right, #388262 0%, #388262 ${percentageSlider}%, rgba(59, 59, 59, 0.5) ${percentageSlider}%, rgba(59, 59, 59, 0.5) 100%)`
                    }}
                  />
                  <input
                    type="text"
                    className="percentage-input"
                    placeholder="0"
                    value={percentageSlider}
                    onChange={handlePercentageInputChange}
                  />
                  <span className="percentage-label">%</span>
                </div>
              </div>

              <div className="action-buttons">
                <button 
                  className={`action-btn supply-btn ${actionType === 'supply' ? 'active' : ''}`}
                >
                  Supply USDC
                </button>
                <button 
                  className={`action-btn borrow-btn ${actionType === 'borrow' ? 'active' : ''}`}
                >
                  Borrow USDC
                </button>
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
    // Asset fields
    liquidityProviderAsset: PropTypes.string,
    liquiditySupplierAsset: PropTypes.string,
  }),
  actionType: PropTypes.oneOf(['supply', 'borrow']),
}
