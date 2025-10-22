import { useState } from 'react'
import './Homepage.scss'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { DexPositionCard } from '../components/positions'
import { mockPositions } from '../data/mockPositions'
import { mockDeFiPositions } from '../data/mockDeFiPositions'
import DeFiPositionCard from '../components/positions/DeFiPositionCard'
import { HERO_CONTENT, SECTION_TITLES } from '../constants'
import { processDexPositions, processDeFiPositions } from '../utils/positionUtils'
import PositionOfferingModal from '../components/common/PositionOfferingModal'

export default function Homepage() {
  // Process positions: sort by creation time and auto-tag NEW for DeFi positions
  const sortedDexPositions = processDexPositions(mockPositions)
  const sortedDeFiPositions = processDeFiPositions(mockDeFiPositions)

  // Modal state
  const [modalState, setModalState] = useState({
    isOpen: false,
    position: null,
    actionType: null, // 'supply' or 'borrow'
  })

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

  return (
    <div className="homepage">
      <Header />

      <section className="hero-section">
        <h1>{HERO_CONTENT.title}</h1>
        <p>{HERO_CONTENT.subtitle}</p>
      </section>

      <section className="positions-section">
        <h2>{SECTION_TITLES.dexPositionMarket}</h2>
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
      </section>

      <section className="positions-section">
        <h2>{SECTION_TITLES.defiPositionMarket}</h2>
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
      </section>

      <Footer />

      <PositionOfferingModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        position={modalState.position}
        actionType={modalState.actionType}
      />
    </div>
  )
}
