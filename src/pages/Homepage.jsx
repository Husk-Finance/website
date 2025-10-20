import './Homepage.scss'
import Header from '../components/layout/Header'
import DexPositionCard from '../components/positions/DexPositionCard'
import { mockPositions } from '../data/mockPositions'
import { HERO_CONTENT, SECTION_TITLES } from '../constants'

export default function Homepage() {
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
          {mockPositions.map((position) => (
            <DexPositionCard key={position.id} position={position} />
          ))}
        </div>
      </section>
    </div>
  )
}
