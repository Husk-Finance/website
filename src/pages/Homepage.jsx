import './Homepage.scss'
import Header from '../components/layout/Header'
import { DexPositionCard } from '../components/positions'
import { mockPositions } from '../data/mockPositions'
import { mockDeFiPositions } from '../data/mockDeFiPositions'
import DeFiPositionCard from '../components/positions/DeFiPositionCard'
import { HERO_CONTENT, SECTION_TITLES } from '../constants'
import { processDexPositions, processDeFiPositions } from '../utils/positionUtils'

export default function Homepage() {
  // Process positions: sort by creation time and auto-tag NEW for DeFi positions
  const sortedDexPositions = processDexPositions(mockPositions)
  const sortedDeFiPositions = processDeFiPositions(mockDeFiPositions)

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
            <DexPositionCard key={position.id} position={position} />
          ))}
        </div>
      </section>

      <section className="positions-section">
        <h2>{SECTION_TITLES.defiPositionMarket}</h2>
        <div className="positions-grid">
          {sortedDeFiPositions.map((position) => (
            <DeFiPositionCard key={position.id} position={position} />
          ))}
        </div>
      </section>
    </div>
  )
}
