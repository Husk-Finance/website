import { useState } from 'react'
import { useChainId, useAccount } from 'wagmi'
import './Homepage.scss'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { DexPositionCard, BusinessPositionCard } from '../components/positions'
import DeFiPositionCard from '../components/positions/DeFiPositionCard'
import DexPositionTable from '../components/positions/DexPositionTable'
import DeFiPositionTable from '../components/positions/DeFiPositionTable'
import BusinessPositionTable from '../components/positions/BusinessPositionTable'
import ViewToggle from '../components/common/ViewToggle'
import { HERO_CONTENT, SECTION_TITLES } from '../constants'
import {
  processDexPositions,
  processDeFiPositions,
  processBusinessPositions,
} from '../utils/positionUtils'
import {
  getDexPositionsByChain,
  getDeFiPositionsByChain,
  getBusinessPositionsByChain,
  getAllDexPositions,
  getAllDeFiPositions,
  getAllBusinessPositions,
} from '../utils/networkUtils'
import PositionOfferingModal from '../components/common/PositionOfferingModal'
import BusinessPositionModal from '../components/common/BusinessPositionModal'

export default function Homepage() {
  // Get wallet connection status and chain ID
  const { isConnected } = useAccount()
  const walletChainId = useChainId()

  // If wallet is connected, filter by network; otherwise show all positions
  const networkDexPositions = isConnected && walletChainId
    ? getDexPositionsByChain(walletChainId)
    : getAllDexPositions()

  const networkDeFiPositions = isConnected && walletChainId
    ? getDeFiPositionsByChain(walletChainId)
    : getAllDeFiPositions()

  const networkBusinessPositions = isConnected && walletChainId
    ? getBusinessPositionsByChain(walletChainId)
    : getAllBusinessPositions()

  // Process positions: sort by creation time and auto-tag NEW for DeFi positions
  const sortedDexPositions = processDexPositions(networkDexPositions)
  const sortedDeFiPositions = processDeFiPositions(networkDeFiPositions)
  const sortedBusinessPositions = processBusinessPositions(networkBusinessPositions)

  // Modal state for DEX/DeFi positions
  const [modalState, setModalState] = useState({
    isOpen: false,
    position: null,
    actionType: null, // 'supply' or 'provide'
  })

  // Modal state for Business positions
  const [businessModalState, setBusinessModalState] = useState({
    isOpen: false,
    position: null,
    actionType: null, // 'supply' or 'provide'
  })

  // View mode state for each section
  const [dexView, setDexView] = useState('grid')
  const [defiView, setDefiView] = useState('grid')
  const [businessView, setBusinessView] = useState('grid')

  // Pagination state for grid view
  const [businessShowAll, setBusinessShowAll] = useState(false)
  const [dexShowAll, setDexShowAll] = useState(false)
  const [defiShowAll, setDefiShowAll] = useState(false)

  // Max items to show before "Load More"
  const BUSINESS_INITIAL_LIMIT = 4
  const DEX_INITIAL_LIMIT = 8
  const DEFI_INITIAL_LIMIT = 8

  const openModal = (position, actionType) => {
    setModalState({
      isOpen: true,
      position,
      actionType,
    })
  }

  const closeModal = () => {
    setModalState({
      isOpen: false,
      position: null,
      actionType: null,
    })
  }

  const openBusinessModal = (position, actionType) => {
    setBusinessModalState({
      isOpen: true,
      position,
      actionType,
    })
  }

  const closeBusinessModal = () => {
    setBusinessModalState({
      isOpen: false,
      position: null,
      actionType: null,
    })
  }

  return (
    <div className="homepage">
      <Header />

      <section className="hero-section">
        <h1>{HERO_CONTENT.title}</h1>
        <p>{HERO_CONTENT.subtitle}</p>
      </section>

      <section className="positions-section">
        <div className="section-header">
          <h2>{SECTION_TITLES.businessPositionMarket}</h2>
          <ViewToggle view={businessView} onViewChange={setBusinessView} />
        </div>
        {sortedBusinessPositions.length > 0 ? (
          businessView === 'grid' ? (
            <>
              <div className="business-positions-grid">
                {(businessShowAll 
                  ? sortedBusinessPositions 
                  : sortedBusinessPositions.slice(0, BUSINESS_INITIAL_LIMIT)
                ).map((position) => (
                  <BusinessPositionCard
                    key={position.id}
                    position={position}
                    onSupplyClick={() => openBusinessModal(position, 'supply')}
                    onProvideClick={() => openBusinessModal(position, 'provide')}
                  />
                ))}
              </div>
              {!businessShowAll && sortedBusinessPositions.length > BUSINESS_INITIAL_LIMIT && (
                <div className="load-more-container">
                  <button 
                    className="load-more-btn" 
                    onClick={() => setBusinessShowAll(true)}
                  >
                    Load More ({sortedBusinessPositions.length - BUSINESS_INITIAL_LIMIT} more)
                  </button>
                </div>
              )}
            </>
          ) : (
            <BusinessPositionTable
              positions={sortedBusinessPositions}
              onSupplyClick={(position) => openBusinessModal(position, 'supply')}
              onProvideClick={(position) => openBusinessModal(position, 'provide')}
            />
          )
        ) : (
          <div className="empty-state">
            <p>No business positions available on this network.</p>
            {isConnected && <p className="empty-state-hint">Try switching to a different network or disconnect to see all positions.</p>}
          </div>
        )}
      </section>

      <section className="positions-section">
        <div className="section-header">
          <h2>{SECTION_TITLES.dexPositionMarket}</h2>
          <ViewToggle view={dexView} onViewChange={setDexView} />
        </div>
        {sortedDexPositions.length > 0 ? (
          dexView === 'grid' ? (
            <>
              <div className="positions-grid">
                {(dexShowAll 
                  ? sortedDexPositions 
                  : sortedDexPositions.slice(0, DEX_INITIAL_LIMIT)
                ).map((position) => (
                  <DexPositionCard
                    key={position.id}
                    position={position}
                    onSupplyClick={() => openModal(position, 'supply')}
                    onProvideClick={() => openModal(position, 'provide')}
                  />
                ))}
              </div>
              {!dexShowAll && sortedDexPositions.length > DEX_INITIAL_LIMIT && (
                <div className="load-more-container">
                  <button 
                    className="load-more-btn" 
                    onClick={() => setDexShowAll(true)}
                  >
                    Load More ({sortedDexPositions.length - DEX_INITIAL_LIMIT} more)
                  </button>
                </div>
              )}
            </>
          ) : (
            <DexPositionTable
              positions={sortedDexPositions}
              onSupplyClick={(position) => openModal(position, 'supply')}
              onProvideClick={(position) => openModal(position, 'provide')}
            />
          )
        ) : (
          <div className="empty-state">
            <p>No DEX positions available on this network.</p>
            {isConnected && <p className="empty-state-hint">Try switching to a different network or disconnect to see all positions.</p>}
          </div>
        )}
      </section>

      <section className="positions-section">
        <div className="section-header">
          <h2>{SECTION_TITLES.defiPositionMarket}</h2>
          <ViewToggle view={defiView} onViewChange={setDefiView} />
        </div>
        {sortedDeFiPositions.length > 0 ? (
          defiView === 'grid' ? (
            <>
              <div className="positions-grid">
                {(defiShowAll 
                  ? sortedDeFiPositions 
                  : sortedDeFiPositions.slice(0, DEFI_INITIAL_LIMIT)
                ).map((position) => (
                  <DeFiPositionCard
                    key={position.id}
                    position={position}
                    onSupplyClick={() => openModal(position, 'supply')}
                    onProvideClick={() => openModal(position, 'provide')}
                  />
                ))}
              </div>
              {!defiShowAll && sortedDeFiPositions.length > DEFI_INITIAL_LIMIT && (
                <div className="load-more-container">
                  <button 
                    className="load-more-btn" 
                    onClick={() => setDefiShowAll(true)}
                  >
                    Load More ({sortedDeFiPositions.length - DEFI_INITIAL_LIMIT} more)
                  </button>
                </div>
              )}
            </>
          ) : (
            <DeFiPositionTable
              positions={sortedDeFiPositions}
              onSupplyClick={(position) => openModal(position, 'supply')}
              onProvideClick={(position) => openModal(position, 'provide')}
            />
          )
        ) : (
          <div className="empty-state">
            <p>No DeFi positions available on this network.</p>
            {isConnected && <p className="empty-state-hint">Try switching to a different network or disconnect to see all positions.</p>}
          </div>
        )}
      </section>

      <Footer />

      <PositionOfferingModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        position={modalState.position}
        action={modalState.actionType}
      />

      <BusinessPositionModal
        isOpen={businessModalState.isOpen}
        onClose={closeBusinessModal}
        position={businessModalState.position}
        action={businessModalState.actionType}
      />
    </div>
  )
}
