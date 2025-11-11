import { useState } from 'react'
import { useChainId, useAccount } from 'wagmi'
import './Homepage.scss'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { DexPositionCard } from '../components/positions'
import DeFiPositionCard from '../components/positions/DeFiPositionCard'
import DexPositionTable from '../components/positions/DexPositionTable'
import DeFiPositionTable from '../components/positions/DeFiPositionTable'
import ViewToggle from '../components/common/ViewToggle'
import { HERO_CONTENT, SECTION_TITLES } from '../constants'
import {
  processDexPositions,
  processDeFiPositions,
} from '../utils/positionUtils'
import {
  getDexPositionsByChain,
  getDeFiPositionsByChain,
  getAllDexPositions,
  getAllDeFiPositions,
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

  // Process positions: sort by creation time and auto-tag NEW for DeFi positions
  const sortedDexPositions = processDexPositions(networkDexPositions)
  const sortedDeFiPositions = processDeFiPositions(networkDeFiPositions)

  // Modal state for DEX/DeFi positions
  const [modalState, setModalState] = useState({
    isOpen: false,
    position: null,
    actionType: null, // 'supply' or 'borrow'
  })

  // Modal state for Business positions
  const [businessModalState, setBusinessModalState] = useState({
    isOpen: false,
    position: null,
    actionType: null, // 'supply' or 'borrow'
  })

  // View mode state for each section
  const [dexView, setDexView] = useState('grid')
  const [defiView, setDefiView] = useState('grid')

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

  /* Disabled for now
  const openBusinessModal = (position, actionType) => {
    setBusinessModalState({
      isOpen: true,
      position,
      actionType,
    })
  }
  */

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

      {/* <section className="positions-section">
        <h2>{SECTION_TITLES.businessPositionMarket}</h2>
        {sortedBusinessPositions.length > 0 ? (
          <div className="business-positions-grid">
            {sortedBusinessPositions.map((position) => (
              <BusinessPositionCard
                key={position.id}
                position={position}
                onSupplyClick={() => openBusinessModal(position, 'supply')}
                onBorrowClick={() => openBusinessModal(position, 'borrow')}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No business positions available on this network.</p>
            {isConnected && <p className="empty-state-hint">Try switching to a different network or disconnect to see all positions.</p>}
          </div>
        )}
      </section> */}

      <section className="positions-section">
        <div className="section-header">
          <h2>{SECTION_TITLES.dexPositionMarket}</h2>
          <ViewToggle view={dexView} onViewChange={setDexView} />
        </div>
        {sortedDexPositions.length > 0 ? (
          dexView === 'grid' ? (
            <div className="positions-grid">
              {sortedDexPositions.map((position) => (
                <DexPositionCard
                  key={position.id}
                  position={position}
                  onSupplyClick={() => openModal(position, 'supply')}
                  onBorrowClick={() => openModal(position, 'borrow')}
                />
              ))}
            </div>
          ) : (
            <DexPositionTable
              positions={sortedDexPositions}
              onSupplyClick={(position) => openModal(position, 'supply')}
              onBorrowClick={(position) => openModal(position, 'borrow')}
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
            <div className="positions-grid">
              {sortedDeFiPositions.map((position) => (
                <DeFiPositionCard
                  key={position.id}
                  position={position}
                  onSupplyClick={() => openModal(position, 'supply')}
                  onBorrowClick={() => openModal(position, 'borrow')}
                />
              ))}
            </div>
          ) : (
            <DeFiPositionTable
              positions={sortedDeFiPositions}
              onSupplyClick={(position) => openModal(position, 'supply')}
              onBorrowClick={(position) => openModal(position, 'borrow')}
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
